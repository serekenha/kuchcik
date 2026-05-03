import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { getRecipeName } from '../../i18n/translations';
import styles from './RecipeCard.module.css';

const CATEGORY_ICONS = {
  'Makaron':   'dinner_dining',
  'Ryż':       'rice_bowl',
  'Zupa':      'soup_kitchen',
  'Kasza':     'grain',
  'Deser':     'cake',
  'Przekąska': 'tapas',
  'Śniadanie': 'breakfast_dining',
};

export default function RecipeCard({ recipe, animIndex = 0 }) {
  const navigate = useNavigate();
  const { setNavDirection } = useApp();
  const { t, language } = useTranslation();

  function handleCardClick() {
    setNavDirection('forward');
    navigate(`/recipe/${recipe.id}`);
  }

  const catIcon = CATEGORY_ICONS[recipe.category];
  const displayName = getRecipeName(recipe, language);

  return (
    <article
      className={styles.card}
      style={{ animationDelay: `${animIndex * 60}ms` }}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleCardClick()}
      aria-label={displayName}
    >
      <div className={styles.photo}>
        <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#C0C7D0' }}>photo_camera</span>
      </div>

      <div className={styles.body}>
        <h2 className={styles.name}>{displayName}</h2>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>room_service</span>
            <span>{recipe.portions}</span>
          </div>
          <div className={styles.metaItem}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>receipt_long</span>
            <span>{recipe.costPerPortion.toFixed(2).replace('.', ',')} zł</span>
          </div>
          {catIcon && (
            <div className={styles.metaItem}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{catIcon}</span>
              <span>{t('cat.' + recipe.category)}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
