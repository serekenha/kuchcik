import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { RECIPE_CATEGORIES } from '../../data/categories';
import { decodeRecipe } from '../../utils/recipeCodec';
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

export default function AddRecipe() {
  const { addRecipe, showToast } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [portions, setPortions] = useState('');
  const [photo, setPhoto] = useState(null);
  const [rawPhoto, setRawPhoto] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);
  const lastIngredientRef = useRef(null);
  const lastStepRef = useRef(null);
  const [focusIngredient, setFocusIngredient] = useState(false);
  const [focusStep, setFocusStep] = useState(false);

  const [ingredients, setIngredients] = useState([
    { id: 1, name: '', qty: '' },
  ]);
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState([{ id: 1, text: '' }]);
  const [showYoutube, setShowYoutube] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const [showImportModal, setShowImportModal] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [importError, setImportError] = useState(false);

  function handleImport() {
    const recipe = decodeRecipe(importCode);
    if (!recipe) { setImportError(true); return; }
    addRecipe(recipe);
    showToast('toast.recipeAdded');
    navigate('/');
  }

  function handleCloseImport() {
    setShowImportModal(false);
    setImportCode('');
    setImportError(false);
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

  const pricePerPortion = (() => {
    const tp = parseFloat(totalPrice);
    const p = parseFloat(portions);
    return !isNaN(tp) && !isNaN(p) && p > 0 ? (tp / p).toFixed(2) : null;
  })();

  const canSave = name.trim() && category && ingredients.some(i => i.name.trim()) && totalPrice && portions;

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

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

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleCropConfirm() {
    const cropped = await getCroppedImg(rawPhoto, croppedAreaPixels);
    setPhoto(cropped);
    setRawPhoto(null);
  }

  function handleCropCancel() {
    setRawPhoto(null);
  }

  function addIngredient() {
    setIngredients(prev => [...prev, { id: Date.now(), name: '', qty: '' }]);
    setFocusIngredient(true);
  }
  function removeIngredient(id) {
    setIngredients(prev => prev.length > 1 ? prev.filter(i => i.id !== id) : prev);
  }
  function updateIngredient(id, field, value) {
    setIngredients(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  }

  function addStep() {
    setSteps(prev => [...prev, { id: Date.now(), text: '' }]);
    setFocusStep(true);
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
      <TopBar
        showBack
        title={t('addRecipe.title')}
        rightContent={
          <button
            onClick={() => setShowImportModal(true)}
            aria-label="Importuj przepis"
            style={{ display:'flex', alignItems:'center', justifyContent:'center', width:36, height:36, flexShrink:0, background:'none', border:'1.5px solid var(--border)', borderRadius:14, cursor:'pointer', color:'var(--navy)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>content_paste</span>
          </button>
        }
      />
      <div className={styles.content}>

        {/* ── Photo zone ── */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={styles.hiddenInput}
          onChange={handleFileChange}
        />
        <div
          className={`${styles.photoZone} ${photo ? styles.hasPhoto : ''}`}
          onClick={handlePhotoClick}
        >
          {photo ? (
            <>
              <img src={photo} className={styles.photoThumb} alt="Zdjęcie przepisu" />
              <button
                className={styles.photoRemoveBtn}
                onClick={e => { e.stopPropagation(); setPhoto(null); }}
                aria-label="Usuń zdjęcie"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined" style={{ fontSize: 26, color: 'var(--text-muted)' }}>photo_camera</span>
              <div className={styles.photoLabelWrap}>
                <span className={styles.photoLabel}>{t('addRecipe.photo')}</span>
                <span className={styles.optionalBadge}>{t('addRecipe.optional')}</span>
              </div>
            </>
          )}
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
          <div className={styles.sectionLabel}>{t('addRecipe.category')} <span className={styles.requiredDot} /></div>
          <div className={styles.categoryChips}>
            {RECIPE_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`${styles.catChip} ${category === cat.id ? styles.catChipActive : ''}`}
                onClick={() => setCategory(cat.id)}
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
          {ingredients.map((ing, i) => (
            <div key={ing.id} className={styles.ingRow}>
              <input
                ref={i === ingredients.length - 1 ? lastIngredientRef : null}
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
                    ref={i === steps.length - 1 ? lastStepRef : null}
                    className={`${styles.input} ${styles.stepTextarea}`}
                    placeholder={`${t('addRecipe.stepPlaceholder')} ${i + 1}…`}
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
            disabled={!canSave}
            onClick={handleSave}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
            {t('addRecipe.save')}
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
            <Cropper
              image={rawPhoto}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={false}
            />
          </div>
          <div className={styles.cropHint}>
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>pinch</span>
            Szczypnij, aby powiększyć · Przeciągnij, aby ustawić
          </div>
        </div>
      )}

      <BottomNav />

      {/* ── Import modal ── */}
      {showImportModal && (
        <div className={styles.importOverlay} onClick={handleCloseImport}>
          <div className={styles.importModal} onClick={e => e.stopPropagation()}>
            <button className={styles.importCloseBtn} onClick={handleCloseImport}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
            <div className={styles.importIconWrap}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--navy)' }}>content_paste</span>
            </div>
            <p className={styles.importTitle}>Importuj przepis</p>
            <p className={styles.importDesc}>Wklej kod przepisu skopiowany z innego urządzenia.</p>
            <textarea
              className={`${styles.importTextarea} ${importError ? styles.importTextareaError : ''}`}
              placeholder="Wklej kod tutaj…"
              value={importCode}
              onChange={e => { setImportCode(e.target.value); setImportError(false); }}
              autoFocus
            />
            {importError && (
              <p className={styles.importErrorMsg}>Nieprawidłowy kod. Sprawdź czy wklejono go w całości.</p>
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
