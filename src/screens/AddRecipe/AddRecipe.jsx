import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { RECIPE_CATEGORIES } from '../../data/categories';
import styles from './AddRecipe.module.css';

function ChevronIcon({ open }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{ fontSize: 20, transition: 'transform 200ms ease', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}
    >
      expand_more
    </span>
  );
}

export default function AddRecipe() {
  const { addRecipe, showToast } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [portions, setPortions] = useState('');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [ingredients, setIngredients] = useState([
    { id: 1, name: '', qty: '' },
    { id: 2, name: '', qty: '' },
  ]);
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState([{ id: 1, text: '' }]);
  const [showYoutube, setShowYoutube] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

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

  function addStep() {
    setSteps(prev => [...prev, { id: Date.now(), text: '' }]);
  }
  function removeStep(id) {
    setSteps(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
  }
  function updateStep(id, value) {
    setSteps(prev => prev.map(s => s.id === id ? { ...s, text: value } : s));
  }

  function handleSave() {
    if (!canSave) return;
    const recipe = {
      id: Date.now(),
      name: name.trim(),
      category: category || 'Przekąska',
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
      steps: steps.filter(s => s.text.trim()).map(s => s.text.trim()),
      youtubeId: extractYoutubeId(youtubeUrl),
    };
    addRecipe(recipe);
    showToast('toast.recipeAdded');
    navigate('/');
  }

  function extractYoutubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    return match ? match[1] : null;
  }

  return (
    <div className={styles.screen}>
      <TopBar showBack title={t('addRecipe.title')} />
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
              : <>{t('addRecipe.photo')} <span className={styles.optionalBadge}>{t('addRecipe.optional')}</span></>
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

        {/* ── Category ── */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t('addRecipe.category')}</div>
          <div className={styles.categoryChips}>
            {RECIPE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.catChip} ${category === cat.id ? styles.catChipActive : ''}`}
                onClick={() => setCategory(c => c === cat.id ? '' : cat.id)}
              >
                {cat.icon && <span className={styles.catChipIcon}>{cat.icon}</span>}
                {cat.label}
              </button>
            ))}
          </div>
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

        {/* ── Recipe steps (optional) ── */}
        <div className={styles.section}>
          <div className={styles.optToggle} onClick={() => setShowSteps(s => !s)}>
            <div className={styles.optToggleLabel}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--text-muted)' }}>format_list_bulleted</span>
              {t('addRecipe.steps')}
              <span className={styles.optionalBadge}>{t('addRecipe.optional')}</span>
            </div>
            <ChevronIcon open={showSteps} />
          </div>
          {showSteps && (
            <div className={styles.stepsWrap}>
              {steps.map((step, i) => (
                <div key={step.id} className={styles.stepRow}>
                  <div className={styles.stepNum}>{i + 1}</div>
                  <textarea
                    className={`${styles.input} ${styles.stepTextarea}`}
                    placeholder={`Step ${i + 1}…`}
                    value={step.text}
                    onChange={e => updateStep(step.id, e.target.value)}
                    rows={2}
                  />
                  <button className={styles.delBtn} style={{ marginTop: 10 }} onClick={() => removeStep(step.id)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span>
                  </button>
                </div>
              ))}
              <button className={styles.addRowBtn} onClick={addStep}>
                <span className={styles.addRowIcon}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span>
                </span>
                {t('addRecipe.addStep')}
              </button>
            </div>
          )}
        </div>

        {/* ── YouTube link (optional) ── */}
        <div className={styles.section}>
          <div className={styles.optToggle} onClick={() => setShowYoutube(s => !s)}>
            <div className={styles.optToggleLabel}>
              <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--text-muted)' }}>play_circle</span>
              {t('addRecipe.youtube')}
              <span className={styles.optionalBadge}>{t('addRecipe.optional')}</span>
            </div>
            <ChevronIcon open={showYoutube} />
          </div>
          {showYoutube && (
            <input
              className={styles.input}
              type="url"
              placeholder="https://youtube.com/watch?v=…"
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              style={{ marginTop: 10 }}
            />
          )}
        </div>

        {/* ── Save button ── */}
        <div className={styles.saveWrap}>
          <button
            className={styles.saveBtn}
            style={{ opacity: canSave ? 1 : 0.4 }}
            onClick={handleSave}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
            {t('addRecipe.save')}
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
