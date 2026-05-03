import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { RECIPE_CATEGORIES } from '../../data/categories';
import styles from '../AddRecipe/AddRecipe.module.css';
import modalStyles from './EditRecipe.module.css';

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

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSrc;
  });
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return canvas.toDataURL('image/jpeg', 0.85);
}

export default function EditRecipe() {
  const { id } = useParams();
  const { recipes, updateRecipe, deleteRecipe, showToast } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const recipe = recipes.find(r => r.id === Number(id));

  const [name, setName] = useState(recipe?.name ?? '');
  const [category, setCategory] = useState(recipe?.category ?? '');
  const [totalPrice, setTotalPrice] = useState(recipe ? String(recipe.totalCost) : '');
  const [portions, setPortions] = useState(recipe ? String(recipe.portions) : '');
  const [photo, setPhoto] = useState(recipe?.photo ?? null);
  const [rawPhoto, setRawPhoto] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);
  const lastIngredientRef = useRef(null);
  const lastStepRef = useRef(null);
  const [focusIngredient, setFocusIngredient] = useState(false);
  const [focusStep, setFocusStep] = useState(false);

  const [ingredients, setIngredients] = useState(
    recipe?.ingredients.length > 0
      ? recipe.ingredients.map(ing => ({
          id: ing.id,
          name: ing.name,
          qty: ing.amount && ing.unit ? `${ing.amount} ${ing.unit}`.trim() : '',
        }))
      : [{ id: 1, name: '', qty: '' }]
  );

  const recipeSteps = recipe?.steps ?? [];
  const [showSteps, setShowSteps] = useState(recipeSteps.length > 0);
  const [steps, setSteps] = useState(
    recipeSteps.length > 0
      ? recipeSteps.map((text, i) => ({ id: i + 1, text }))
      : [{ id: 1, text: '' }]
  );

  const [showYoutube, setShowYoutube] = useState(!!recipe?.youtubeId);
  const [youtubeUrl, setYoutubeUrl] = useState(
    recipe?.youtubeId ? `https://youtube.com/watch?v=${recipe.youtubeId}` : ''
  );

  // ── Unsaved changes tracking ──
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const initialSnapshotRef = useRef(null);
  const currentSnapshot = JSON.stringify({
    name, category, totalPrice, portions, photo,
    ingredients: ingredients.map(i => ({ name: i.name, qty: i.qty })),
    steps: steps.map(s => s.text),
    youtubeUrl,
  });
  if (initialSnapshotRef.current === null) {
    initialSnapshotRef.current = currentSnapshot;
  }
  const isDirty = currentSnapshot !== initialSnapshotRef.current;

  function handleBack() {
    if (isDirty) {
      setShowUnsavedModal(true);
    } else {
      navigate(-1);
    }
  }

  function handleUnsavedLeave() {
    setShowUnsavedModal(false);
    navigate(-1);
  }

  function handleUnsavedSave() {
    setShowUnsavedModal(false);
    handleSave();
  }

  useEffect(() => {
    if (focusIngredient) {
      lastIngredientRef.current?.focus();
      setFocusIngredient(false);
    }
  }, [ingredients, focusIngredient]);

  useEffect(() => {
    if (focusStep) {
      lastStepRef.current?.focus();
      setFocusStep(false);
    }
  }, [steps, focusStep]);

  if (!recipe) {
    return (
      <div className={styles.screen}>
        <TopBar showBack title={t('editRecipe.title')} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          Przepis nie znaleziony
        </div>
        <BottomNav />
      </div>
    );
  }

  const pricePerPortion = (() => {
    const tp = parseFloat(totalPrice);
    const p = parseFloat(portions);
    return !isNaN(tp) && !isNaN(p) && p > 0 ? (tp / p).toFixed(2) : null;
  })();

  const canSave = name.trim() && category && ingredients.some(i => i.name.trim()) && totalPrice && portions;

  function handlePhotoClick() { fileInputRef.current?.click(); }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setRawPhoto(ev.target.result);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const onCropComplete = useCallback((_, pixels) => { setCroppedAreaPixels(pixels); }, []);

  async function handleCropConfirm() {
    const cropped = await getCroppedImg(rawPhoto, croppedAreaPixels);
    setPhoto(cropped);
    setRawPhoto(null);
  }

  function handleCropCancel() { setRawPhoto(null); }

  function addIngredient() {
    setIngredients(prev => [...prev, { id: Date.now(), name: '', qty: '' }]);
    setFocusIngredient(true);
  }
  function removeIngredient(ingId) {
    setIngredients(prev => prev.length > 1 ? prev.filter(i => i.id !== ingId) : prev);
  }
  function updateIngredient(ingId, field, value) {
    setIngredients(prev => prev.map(i => i.id === ingId ? { ...i, [field]: value } : i));
  }

  function addStep() {
    setSteps(prev => [...prev, { id: Date.now(), text: '' }]);
    setFocusStep(true);
  }
  function removeStep(stepId) {
    setSteps(prev => prev.length > 1 ? prev.filter(s => s.id !== stepId) : prev);
  }
  function updateStep(stepId, value) {
    setSteps(prev => prev.map(s => s.id === stepId ? { ...s, text: value } : s));
  }

  function extractYoutubeId(url) {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  }

  function handleSave() {
    if (!canSave) return;
    const updated = {
      ...recipe,
      name: name.trim(),
      category,
      photo: photo || null,
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
    updateRecipe(updated);
    showToast('toast.recipeUpdated');
    navigate(`/recipe/${recipe.id}`);
  }

  function handleConfirmDelete() {
    deleteRecipe(recipe.id);
    navigate('/', { replace: true });
  }

  const iconBtnStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 36, height: 36, flexShrink: 0,
    background: 'none', border: '1.5px solid var(--border)',
    borderRadius: 14, cursor: 'pointer', color: 'var(--navy)',
    transition: 'background 150ms ease',
  };

  return (
    <div className={styles.screen}>
      <TopBar
        showBack
        title={t('editRecipe.title')}
        onBack={handleBack}
        rightContent={
          <button
            style={{ ...iconBtnStyle, borderColor: 'rgba(220,38,38,0.3)', color: '#DC2626' }}
            onClick={() => setShowDeleteModal(true)}
            aria-label="Usuń przepis"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>delete</span>
          </button>
        }
      />
      <div className={styles.content}>

        {/* ── Photo zone ── */}
        <input ref={fileInputRef} type="file" accept="image/*" className={styles.hiddenInput} onChange={handleFileChange} />
        <div className={`${styles.photoZone} ${photo ? styles.hasPhoto : ''}`} onClick={handlePhotoClick}>
          {photo ? (
            <>
              <img src={photo} className={styles.photoThumb} alt="Zdjęcie przepisu" />
              <div className={styles.photoActions}>
                <button
                  className={styles.photoActionBtn}
                  onClick={e => { e.stopPropagation(); setRawPhoto(photo); setCrop({ x: 0, y: 0 }); setZoom(1); }}
                  aria-label="Przytnij zdjęcie"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>crop</span>
                </button>
                <button
                  className={styles.photoActionBtn}
                  onClick={e => { e.stopPropagation(); setPhoto(null); }}
                  aria-label="Usuń zdjęcie"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 26, color: 'var(--text-muted)' }}>photo_camera</span>
              <div className={styles.photoLabelWrap}>
                <span className={styles.photoLabel}>{t('editRecipe.photo')}</span>
                <span className={styles.optionalBadge}>{t('addRecipe.optional')}</span>
              </div>
            </>
          )}
        </div>

        {/* ── Dish name ── */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t('addRecipe.name')} <span className={styles.requiredDot} /></div>
          <input className={styles.input} type="text" placeholder={t('addRecipe.namePlaceholder')} value={name} onChange={e => setName(e.target.value)} />
        </div>

        {/* ── Category ── */}
        <div className={styles.section}>
          <div className={styles.sectionLabel}>{t('addRecipe.category')} <span className={styles.requiredDot} /></div>
          <div className={styles.categoryChips}>
            {RECIPE_CATEGORIES.map(cat => (
              <button key={cat.id} className={`${styles.catChip} ${category === cat.id ? styles.catChipActive : ''}`} onClick={() => setCategory(cat.id)}>
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
              <input className={`${styles.input} ${styles.inputCenter}`} type="number" inputMode="decimal" placeholder="0,00" value={totalPrice} onChange={e => setTotalPrice(e.target.value)} />
            </div>
            <div className={styles.costField}>
              <div className={styles.fieldLabel}>{t('addRecipe.portions')}</div>
              <input className={`${styles.input} ${styles.inputCenter}`} type="number" inputMode="numeric" placeholder="0" value={portions} onChange={e => setPortions(e.target.value)} />
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
          {ingredients.map((ing, i) => (
            <div key={ing.id} className={styles.ingRow}>
              <input ref={i === ingredients.length - 1 ? lastIngredientRef : null} className={`${styles.input} ${styles.ingName}`} type="text" placeholder="np. Makaron" value={ing.name} onChange={e => updateIngredient(ing.id, 'name', e.target.value)} />
              <input className={`${styles.input} ${styles.ingQty}`} type="text" placeholder="400 g" value={ing.qty} onChange={e => updateIngredient(ing.id, 'qty', e.target.value)} />
              <button className={styles.delBtn} onClick={() => removeIngredient(ing.id)}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span>
              </button>
            </div>
          ))}
          <button className={styles.addRowBtn} onClick={addIngredient}>
            <span className={styles.addRowIcon}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span></span>
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
                  <textarea ref={i === steps.length - 1 ? lastStepRef : null} className={`${styles.input} ${styles.stepTextarea}`} placeholder={`${t('addRecipe.stepPlaceholder')} ${i + 1}…`} value={step.text} onChange={e => updateStep(step.id, e.target.value)} rows={2} />
                  <button className={styles.delBtn} style={{ marginTop: 10 }} onClick={() => removeStep(step.id)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span>
                  </button>
                </div>
              ))}
              <button className={styles.addRowBtn} onClick={addStep}>
                <span className={styles.addRowIcon}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>add</span></span>
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
            <input className={styles.input} type="url" placeholder="https://youtube.com/watch?v=…" value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} style={{ marginTop: 10 }} />
          )}
        </div>

        {/* ── Save button ── */}
        <div className={styles.saveWrap}>
          <button className={styles.saveBtn} disabled={!canSave} onClick={handleSave}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
            {t('editRecipe.save')}
          </button>
        </div>
      </div>

      {/* ── Crop overlay ── */}
      {rawPhoto && (
        <div className={styles.cropOverlay}>
          <div className={styles.cropHeader}>
            <button className={styles.cropCancelBtn} onClick={handleCropCancel}>Anuluj</button>
            <span className={styles.cropTitle}>Przytnij zdjęcie</span>
            <button className={styles.cropConfirmBtn} onClick={handleCropConfirm}>Gotowe</button>
          </div>
          <div className={styles.cropArea}>
            <Cropper image={rawPhoto} crop={crop} zoom={zoom} aspect={4 / 3} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} showGrid={false} />
          </div>
          <div className={styles.cropHint}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>pinch</span>
            Szczypnij, aby powiększyć · Przeciągnij, aby ustawić
          </div>
        </div>
      )}

      <BottomNav />

      {/* ── Unsaved changes modal ── */}
      {showUnsavedModal && (
        <div className={modalStyles.modalOverlay}>
          <div className={modalStyles.modal}>
            <button className={modalStyles.modalCloseBtn} onClick={() => setShowUnsavedModal(false)}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
            <p className={modalStyles.modalTitle}>{t('settings.unsavedTitle')}</p>
            <p className={modalStyles.modalDesc}>Masz niezapisane zmiany. Czy chcesz je zapisać przed wyjściem?</p>
            <div className={modalStyles.modalActions}>
              <button className={modalStyles.modalSaveBtn} onClick={handleUnsavedSave}>{t('settings.saveAndLeave')}</button>
              <button className={modalStyles.modalLeaveBtn} onClick={handleUnsavedLeave}>{t('settings.leaveWithout')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {showDeleteModal && (
        <div className={modalStyles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={modalStyles.modal} onClick={e => e.stopPropagation()}>
            <button className={modalStyles.modalCloseBtn} onClick={() => setShowDeleteModal(false)}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
            <div className={modalStyles.modalIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#DC2626' }}>delete</span>
            </div>
            <p className={modalStyles.modalTitle}>Usuń przepis</p>
            <p className={modalStyles.modalDesc}>Czy na pewno chcesz usunąć „{recipe.name}"? Tej operacji nie można cofnąć.</p>
            <div className={modalStyles.modalActions}>
              <button className={modalStyles.modalDeleteBtn} onClick={handleConfirmDelete}>Usuń</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
