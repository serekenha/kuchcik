import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './EditRecipe.module.css';

export default function EditRecipe() {
  const { id } = useParams();
  const { recipes, updateRecipe, showToast } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const recipe = recipes.find(r => r.id === Number(id));

  const [hasPhoto, setHasPhoto] = useState(recipe?.hasPhoto ?? false);
  const [name, setName] = useState(recipe?.name ?? '');
  const [totalPrice, setTotalPrice] = useState(recipe ? String(recipe.totalCost) : '');
  const [portions, setPortions] = useState(recipe ? String(recipe.portions) : '');
  const [ingredients, setIngredients] = useState(
    recipe?.ingredients.map(ing => ({
      id: ing.id,
      name: ing.name,
      qty: `${ing.amount} ${ing.unit}`.trim(),
    })) ?? [{ id: 1, name: '', qty: '' }]
  );

  if (!recipe) {
    return (
      <div className={styles.screen}>
        <TopBar showBack title={t('editRecipe.title')} />
        <div className={styles.notFound}>Przepis nie znaleziony</div>
        <BottomNav />
      </div>
    );
  }

  const pricePerPortion = (() => {
    const tp = parseFloat(totalPrice);
    const p = parseFloat(portions);
    return !isNaN(tp) && !isNaN(p) && p > 0 ? (tp / p).toFixed(2) : null;
  })();

  const canSave = name.trim() && ingredients.some(i => i.name.trim()) && totalPrice && portions;

  function addIngredient() {
    setIngredients(prev => [...prev, { id: Date.now(), name: '', qty: '' }]);
  }
  function removeIngredient(id) {
    setIngredients(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);
  }
  function updateIngredient(id, field, value) {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  }

  function handleSave() {
    if (!canSave) return;
    const updated = {
      ...recipe,
      name: name.trim(),
      hasPhoto,
      portions: parseFloat(portions),
      totalCost: parseFloat(totalPrice),
      costPerPortion: parseFloat(pricePerPortion),
      ingredients: ingredients
        .filter(i => i.name.trim())
        .map((i, idx) => {
          const parts = i.qty.trim().split(' ');
          const amount = parseFloat(parts[0]) || 1;
          const unit = parts.slice(1).join(' ') || 'szt.';
          return { id: idx + 1, name: i.name.trim(), amount, unit, priceTotal: 0 };
        }),
    };
    updateRecipe(updated);
    showToast('toast.recipeUpdated');
    navigate(`/recipe/${recipe.id}`);
  }

  return (
    <div className={styles.screen}>
      <TopBar showBack title={t('editRecipe.title')} />
      <div className={styles.content}>

        {/* ── Photo zone ── */}
        <div
          className={`${styles.photoZone} ${hasPhoto ? styles.hasPhoto : ''}`}
          onClick={() => setHasPhoto(p => !p)}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 26, color: hasPhoto ? 'var(--navy)' : 'var(--text-muted)' }}>photo_camera</span>
          <span className={styles.photoLabel} style={{ color: hasPhoto ? 'var(--navy)' : undefined, fontWeight: hasPhoto ? 500 : undefined }}>
            {hasPhoto
              ? t('addRecipe.photoAdded')
              : <>{t('editRecipe.photo')} <span className={styles.optionalBadge}>opcjonalne</span></>
            }
          </span>
        </div>

        {/* ── Dish name ── */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t('addRecipe.name')} <span className={styles.requiredDot} /></div>
          <input
            className={styles.input}
            type="text"
            placeholder={t('addRecipe.namePlaceholder')}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* ── Cost & portions ── */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t('addRecipe.costPortions')} <span className={styles.requiredDot} /></div>
          <div className={styles.costRow}>
            <div className={styles.costField}>
              <div className={styles.fieldLabel}>{t('addRecipe.totalPrice')}</div>
              <input
                className={`${styles.input} ${styles.inputCenter}`}
                type="number"
                inputMode="decimal"
                placeholder="0,00"
                value={totalPrice}
                onChange={e => setTotalPrice(e.target.value)}
              />
            </div>
            <div className={styles.costField}>
              <div className={styles.fieldLabel}>{t('addRecipe.portions')}</div>
              <input
                className={`${styles.input} ${styles.inputCenter}`}
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={portions}
                onChange={e => setPortions(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.calcPill}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'rgba(25,31,53,0.45)', flexShrink: 0 }}>calculate</span>
            <div>
              <div className={styles.calcLabel}>{t('addRecipe.pricePerPortion')}</div>
              <div className={styles.calcValue}>{pricePerPortion ? `${pricePerPortion} zł` : '—'}</div>
            </div>
          </div>
        </div>

        {/* ── Ingredients ── */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t('addRecipe.ingredients')} <span className={styles.requiredDot} /></div>
          <div className={styles.ingHeader}>
            <span className={styles.ingColLabel} style={{ flex: 2 }}>{t('addRecipe.ingredientCol')}</span>
            <span className={styles.ingColLabel} style={{ flex: 1 }}>{t('addRecipe.qtyCol')}</span>
            <span style={{ width: 38 }} />
          </div>
          {ingredients.map(ing => (
            <div key={ing.id} className={styles.ingRow}>
              <input
                className={`${styles.input} ${styles.ingName}`}
                type="text"
                placeholder="np. Makaron"
                value={ing.name}
                onChange={e => updateIngredient(ing.id, 'name', e.target.value)}
              />
              <input
                className={`${styles.input} ${styles.ingQty}`}
                type="text"
                placeholder="400 g"
                value={ing.qty}
                onChange={e => updateIngredient(ing.id, 'qty', e.target.value)}
              />
              <button className={styles.delBtn} onClick={() => removeIngredient(ing.id)}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span>
              </button>
            </div>
          ))}
          <button className={styles.addRowBtn} onClick={addIngredient}>
            <span className={styles.addRowIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
            </span>
            {t('addRecipe.addIngredient')}
          </button>
        </div>

        {/* ── Save button ── */}
        <div className={styles.saveWrap}>
          <button
            className={styles.saveBtn}
            style={{ opacity: canSave ? 1 : 0.4 }}
            onClick={handleSave}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
            {t('editRecipe.save')}
          </button>
        </div>

      </div>
      <BottomNav />
    </div>
  );
}
