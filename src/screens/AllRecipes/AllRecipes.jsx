import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { getRecipeName } from '../../i18n/translations';
import { FILTER_CATEGORIES } from '../../data/categories';
import styles from './AllRecipes.module.css';

export default function AllRecipes() {
  const { recipes } = useApp();
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Wszystkie');

  const filtered = recipes.filter(r => {
    const matchesCat = activeCategory === 'Wszystkie' || r.category === activeCategory;
    const name = getRecipeName(r, language);
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

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
    </div>
  );
}
