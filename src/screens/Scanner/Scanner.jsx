import { useState, useRef } from 'react';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './Scanner.module.css';

const DICT_KEY = 'dishie_dictionary';
function loadDict() {
  try { return JSON.parse(localStorage.getItem(DICT_KEY) || '[]'); } catch { return []; }
}
function saveDict(d) { localStorage.setItem(DICT_KEY, JSON.stringify(d)); }

const MOCK_RESULTS = [
  { id: 1, name: 'Makaron penne', raw: 'MAKARON PENNE 500G', qty: '500 g', price: '3.49', selected: true },
  { id: 2, name: 'Pierś z kurczaka', raw: 'KURCZAK PIERS 1KG', qty: '1 kg', price: '16.99', selected: true },
  { id: 3, name: 'Pomidory koktajlowe', raw: 'POMIDORY CHERRY 250G', qty: '250 g', price: '4.99', selected: true },
  { id: 4, name: 'Śmietana 18%', raw: 'SMIETANA 18% 400ML', qty: '400 ml', price: '3.29', selected: false },
  { id: 5, name: 'Parmezan', raw: 'PARMIGIANO REGGIANO 100G', qty: '100 g', price: '8.99', selected: true },
];

export default function Scanner() {
  const { showToast } = useApp();
  const { t, language } = useTranslation();
  const fileRef = useRef(null);
  const [phase, setPhase] = useState('idle');
  const [imageUrl, setImageUrl] = useState(null);
  const [hasImage, setHasImage] = useState(false);
  const [results, setResults] = useState([]);

  function handleFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setHasImage(true);
  }

  function doScan() {
    if (!hasImage) return;
    setPhase('processing');
    setTimeout(() => {
      setResults(MOCK_RESULTS.map(r => ({ ...r })));
      setPhase('results');
    }, 2000);
  }

  function toggleItem(id) {
    setResults(prev => prev.map(r => r.id === id ? { ...r, selected: !r.selected } : r));
  }

  function updateItem(id, field, value) {
    setResults(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  }

  function handleConfirm() {
    const selected = results.filter(r => r.selected);
    const dict = loadDict();
    selected.forEach(item => {
      const existing = dict.find(d => d.name.toLowerCase() === item.name.toLowerCase());
      if (existing) {
        if (item.price && !isNaN(parseFloat(item.price))) {
          existing.prices = [...(existing.prices || []), { qty: item.qty, price: parseFloat(item.price) }];
        }
        if (item.raw && !existing.aliases.includes(item.raw)) {
          existing.aliases.push(item.raw);
        }
      } else {
        dict.push({
          id: Date.now() + Math.random(),
          name: item.name,
          aliases: item.raw ? [item.raw] : [],
          prices: (item.price && !isNaN(parseFloat(item.price))) ? [{ qty: item.qty, price: parseFloat(item.price) }] : [],
        });
      }
    });
    saveDict(dict);
    const n = selected.length;
    const msg = language === 'pl'
      ? `${n} składnik${n === 1 ? '' : n < 5 ? 'i' : 'ów'} zapisano do Słownika`
      : `${n} ingredient${n !== 1 ? 's' : ''} saved to Dictionary`;
    showToast(msg);
    reset();
  }

  function reset() {
    setPhase('idle');
    setImageUrl(null);
    setHasImage(false);
    setResults([]);
  }

  const selectedCount = results.filter(r => r.selected).length;

  const saveBtnLabel = language === 'pl'
    ? `Zapisz ${selectedCount} składnik${selectedCount === 1 ? '' : selectedCount < 5 ? 'i' : 'ów'} do Słownika`
    : `Save ${selectedCount} ingredient${selectedCount !== 1 ? 's' : ''} to Dictionary`;

  return (
    <div className={styles.screen}>
      <TopBar showBack title={t('scanner.title')} />
      <div className={styles.content}>

        {/* ── Idle ── */}
        {phase === 'idle' && (
          <div className={styles.idle}>
            <div
              className={`${styles.uploadZone} ${hasImage ? styles.hasImage : ''}`}
              onClick={() => fileRef.current?.click()}
            >
              {imageUrl ? (
                <>
                  <img src={imageUrl} alt="paragon" className={styles.uploadImg} />
                  <div className={styles.uploadOverlay}>
                    <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'white' }}>photo_camera</span>
                    <span>{t('scanner.changePhoto')}</span>
                  </div>
                </>
              ) : (
                <>
                  <span className={`material-symbols-outlined ${styles.uploadIcon}`} style={{ fontSize: 40 }}>upload_file</span>
                  <span className={styles.uploadLabel}>{t('scanner.upload')}</span>
                  <span className={styles.uploadSub}>{t('scanner.uploadSub')}</span>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              onChange={e => handleFile(e.target.files[0])}
            />
            <p className={styles.hint}>{t('scanner.hint')}</p>
            <button className={styles.scanBtn} disabled={!hasImage} onClick={doScan}>
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>document_scanner</span>
              {t('scanner.scan')}
            </button>
          </div>
        )}

        {/* ── Processing ── */}
        {phase === 'processing' && (
          <div className={styles.processing}>
            <div className={styles.spinner} />
            <span className={styles.processingLabel}>{t('scanner.processing')}</span>
            <span className={styles.processingDesc}>{t('scanner.processingDesc')}</span>
          </div>
        )}

        {/* ── Results ── */}
        {phase === 'results' && (
          <div className={styles.resultsWrap}>
            <button className={styles.rescanBtn} onClick={reset}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>refresh</span>
              {t('scanner.rescan')}
            </button>

            <div className={styles.resultCard}>
              {results.map(item => (
                <div key={item.id} className={styles.resultItem}>
                  <div
                    className={`${styles.resultCheck} ${item.selected ? styles.resultCheckOn : ''}`}
                    onClick={() => toggleItem(item.id)}
                  >
                    {item.selected && (
                      <span className="material-symbols-outlined" style={{ fontSize: 11 }}>check</span>
                    )}
                  </div>
                  <div className={styles.resultInfo}>
                    <input
                      className={styles.resultInput}
                      value={item.name}
                      onChange={e => updateItem(item.id, 'name', e.target.value)}
                    />
                    <span className={styles.resultRaw}>{item.raw}</span>
                  </div>
                  <input
                    className={styles.resultQty}
                    value={item.qty}
                    onChange={e => updateItem(item.id, 'qty', e.target.value)}
                    placeholder="qty"
                  />
                  <input
                    className={styles.resultPrice}
                    value={item.price}
                    onChange={e => updateItem(item.id, 'price', e.target.value)}
                    placeholder="price"
                  />
                </div>
              ))}
            </div>

            <button
              className={styles.confirmBtn}
              onClick={handleConfirm}
              disabled={selectedCount === 0}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
              {saveBtnLabel}
            </button>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
