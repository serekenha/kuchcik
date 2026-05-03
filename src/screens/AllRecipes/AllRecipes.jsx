import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { getRecipeName } from '../../i18n/translations';
import { FILTER_CATEGORIES } from '../../data/categories';
import { decodeRecipe } from '../../utils/recipeCodec';
import styles from './AllRecipes.module.css';

export default function AllRecipes() {
  const { recipes, addRecipe, showToast } = useApp();
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(location.state?.category ?? 'Wszystkie');

  const [showImportModal, setShowImportModal] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState(false);

  const filtered = recipes.filter(r => {
    const matchesCat = activeCategory === 'Wszystkie' || r.category === activeCategory;
    const name = getRecipeName(r, language);
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  function handleImport() {
    const recipe = decodeRecipe(importCode);
    if (!recipe) {
      setImportError(true);
      return;
    }
    addRecipe(recipe);
    showToast('toast.recipeAdded');
    setShowImportModal(false);
    setImportCode('');
    setImportError(false);
  }

  function handleCloseImport() {
    setShowImportModal(false);
    setImportCode('');
    setImportError(false);
  }

  return (
    <div className={styles.screen}>
      <TopBar
        showBack
        title={t('recipes.title')}
        rightContent={
          <button
            className={styles.addBtn}
            onClick={() => navigate('/dodaj')}
            aria-label={t('recipes.add')}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>add</span>
          </button>
        }
      />

      <div className={styles.content}>

        {/* ── Search ── */}
        <div className={styles.searchWrap}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`} style={{ fontSize: 18 }}>search</span>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={t('recipes.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && setSearch('')}
          />
          {search && (
            <button className={styles.clearBtn} onMouseDown={() => setSearch('')} aria-label="Clear">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
            </button>
          )}
        </div>

        {/* ── Category chips ── */}
        <div className={styles.chips}>
          {FILTER_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${styles.chip} ${activeCategory === cat.id ? styles.chipActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon && <span className={styles.chipIcon}>{cat.icon}</span>}
              {t('cat.' + cat.id)}
            </button>
          ))}
        </div>

        {/* ── Recipe list ── */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className="material-symbols-outlined" style={{ fontSize: 40, color: 'var(--text-muted)' }}>search_off</span>
            <p className={styles.emptyTitle}>{t('recipes.empty')}</p>
            <p className={styles.emptyDesc}>{t('recipes.emptyDesc')}</p>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} animIndex={i} />
            ))}
            <div style={{ height: 8 }} />
          </div>
        )}
      </div>

      <BottomNav />

      {/* ── Import modal ── */}
      {showImportModal && (
        <div className={styles.modalOverlay} onClick={handleCloseImport}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={handleCloseImport}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
            <div className={styles.modalIconWrap}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--navy)' }}>content_paste</span>
            </div>
            <p className={styles.modalTitle}>Importuj przepis</p>
            <p className={styles.modalDesc}>Wklej kod przepisu skopiowany z innego urządzenia.</p>
            <textarea
              className={`${styles.importTextarea} ${importError ? styles.importTextareaError : ''}`}
              placeholder="Wklej kod tutaj…"
              value={importCode}
              onChange={e => { setImportCode(e.target.value); setImportError(false); }}
              autoFocus
            />
            {importError && (
              <p className={styles.importError}>Nieprawidłowy kod. Sprawdź czy wklejono go w całości.</p>
            )}
            <button
              className={styles.importBtn}
              disabled={!importCode.trim()}
              onClick={handleImport}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>download</span>
              Importuj przepis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
