import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { getRecipeName } from '../../i18n/translations';
import { FILTER_CATEGORIES } from '../../data/categories';
import styles from './RecipeList.module.css';

const CATEGORY_ICONS = {
  'Makaron':   'dinner_dining',
  'Ryż':       'rice_bowl',
  'Zupa':      'soup_kitchen',
  'Kasza':     'grain',
  'Deser':     'cake',
  'Przekąska': 'tapas',
  'Śniadanie': 'breakfast_dining',
};

function CategoryIcon({ category, size = 32 }) {
  const icon = CATEGORY_ICONS[category];
  if (!icon) return null;
  return <span className="material-symbols-outlined" style={{ fontSize: size }}>{icon}</span>;
}

const RECIPE_CATS = FILTER_CATEGORIES.slice(1); // exclude 'Wszystkie'

export default function RecipeList() {
  const { recipes, setNavDirection, settings } = useApp();
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);

  const featured = recipes.length > 0 ? recipes[featuredIdx % recipes.length] : null;

  const searchResults = search.trim()
    ? recipes.filter(r =>
        getRecipeName(r, language).toLowerCase().includes(search.toLowerCase()) ||
        r.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  useEffect(() => {
    function handleOutsideClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  function handleResultClick(recipe) {
    setNavDirection('forward');
    setSearch('');
    navigate(`/recipe/${recipe.id}`);
  }

  function shuffle() {
    if (recipes.length <= 1) return;
    let next;
    do { next = Math.floor(Math.random() * recipes.length); } while (next === featuredIdx);
    setFeaturedIdx(next);
  }

  const userName = settings?.userName || '';

  return (
    <div className={styles.screen}>
      <TopBar isHome />

      <div className={styles.scroll}>

        {/* ── Hero: illustration + greeting (scrolls with content) ── */}
        <div className={styles.hero}>
          <img src="/home.svg" alt="" className={styles.illustration} aria-hidden="true" />
          <div className={styles.greeting}>
            <h1 className={styles.greetingTitle}>
              {t('home.greeting')}{userName ? <><br />{userName}!</> : ''}
            </h1>
            <p className={styles.greetingSubtitle}>{t('home.subtitle')}</p>
          </div>
        </div>

        {/* ── Search ── */}
        <div className={styles.searchWrap} ref={searchRef}>
          <span className={`material-symbols-outlined ${styles.searchIcon}`} style={{ fontSize: 18 }}>search</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={t('home.search')}
            aria-label={t('home.search')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Escape' && setSearch('')}
          />
          {search && (
            <button className={styles.clearBtn} onMouseDown={() => setSearch('')} aria-label="Wyczyść">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
            </button>
          )}
          {search.trim() && (
            <div className={styles.dropdown}>
              {searchResults.length > 0 ? searchResults.map(r => (
                <div
                  key={r.id}
                  className={styles.dropdownItem}
                  onMouseDown={() => handleResultClick(r)}
                >
                  <span className={styles.dropdownName}>{getRecipeName(r, language)}</span>
                  <span className={styles.dropdownCategory}>{t('cat.' + r.category)}</span>
                </div>
              )) : (
                <div className={styles.dropdownEmpty}>{t('home.noResults')}</div>
              )}
            </div>
          )}
        </div>

        {/* ── Moja propozycja ── */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('home.featured')}</h2>
          <button className={styles.shuffleBtn} onClick={shuffle} aria-label={t('home.shuffle')}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>shuffle</span>
            {t('home.shuffle')}
          </button>
        </div>

        {/* ── Featured card ── */}
        {featured && (
          <div className={styles.featuredCard} onClick={() => navigate(`/recipe/${featured.id}`)}>
            <div className={styles.featuredImg}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#C0C7D0' }}>photo_camera</span>
            </div>
            <div className={styles.featuredBody}>
              <h3 className={styles.featuredName}>{getRecipeName(featured, language)}</h3>
              <div className={styles.featuredMeta}>
                <div className={styles.metaItem}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>room_service</span>
                  <span>{featured.portions}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>receipt_long</span>
                  <span>{featured.costPerPortion.toFixed(2).replace('.', ',')} zł</span>
                </div>
                <div className={styles.metaItem}>
                  <CategoryIcon category={featured.category} size={20} />
                  <span>{t('cat.' + featured.category)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Kategorie ── */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('home.categories')}</h2>
          <button className={styles.seeAllBtn} onClick={() => navigate('/przepisy')}>
            {t('home.seeAll')}
          </button>
        </div>

        <div className={styles.categoryScroll}>
          {RECIPE_CATS.map(cat => (
            <button key={cat.id} className={styles.categoryBox} aria-label={t('cat.' + cat.id)}>
              <CategoryIcon category={cat.id} size={32} />
              <span className={styles.categoryLabel}>{t('cat.' + cat.id)}</span>
            </button>
          ))}
        </div>

      </div>

      <BottomNav />
    </div>
  );
}
