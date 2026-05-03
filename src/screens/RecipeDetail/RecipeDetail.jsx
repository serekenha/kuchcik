import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import TabBar from '../../components/TabBar/TabBar';
import IngredientRow from '../../components/IngredientRow/IngredientRow';
import PortionSlider from '../../components/PortionSlider/PortionSlider';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import { getCategoryStyle } from '../../data/sampleRecipes';
import { getRecipeName } from '../../i18n/translations';
import { encodeRecipe } from '../../utils/recipeCodec';
import styles from './RecipeDetail.module.css';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { recipes, addToShoppingList, deleteRecipe } = useApp();
  const { t, language } = useTranslation();
  const recipe = recipes.find(r => r.id === Number(id));

  const contentRef = useRef(null);
  const menuRef = useRef(null);
  const [portions, setPortions] = useState(recipe?.portions ?? 4);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const TABS = [
    { id: 'ingredients', label: t('detail.ingredients') },
    { id: 'video', label: t('detail.video') },
    { id: 'steps', label: t('detail.steps') },
  ];

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!showMenu) return;
    function handleOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [showMenu]);

  const [youtubeInput, setYoutubeInput] = useState('');
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState(
    recipe?.youtubeId ? `https://www.youtube.com/embed/${recipe.youtubeId}` : ''
  );
  const [completedSteps, setCompletedSteps] = useState({});

  if (!recipe) {
    return (
      <div className={styles.screen}>
        <TopBar showBack />
        <div className={styles.notFound}>Przepis nie znaleziony</div>
        <BottomNav />
      </div>
    );
  }

  const ratio = portions / recipe.portions;
  const catStyle = getCategoryStyle(recipe.category);

  const scaledIngredients = useMemo(() =>
    recipe.ingredients.map(ing => ({
      ...ing,
      scaledAmount: ing.amount * ratio
    })),
    [recipe.ingredients, ratio]
  );

  const scaledTotalCost = recipe.totalCost * ratio;
  const scaledCostPerPortion = scaledTotalCost / portions;

  function extractYoutubeId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  }

  function handleAddVideo() {
    const ytId = extractYoutubeId(youtubeInput);
    if (ytId) setYoutubeEmbedUrl(`https://www.youtube.com/embed/${ytId}`);
  }

  function toggleStep(i) {
    setCompletedSteps(prev => ({ ...prev, [i]: !prev[i] }));
  }

  function handleAddToCart() {
    addToShoppingList(recipe, portions);
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
    transition: 'background 150ms ease, border-color 150ms ease',
  };

  return (
    <div className={styles.screen}>
      <TopBar
        showBack
        rightContent={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Edit */}
            <button onClick={() => navigate(`/recipe/${id}/edit`)} style={iconBtnStyle} aria-label="Edytuj">
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit</span>
            </button>

            {/* More options */}
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setShowMenu(s => !s)}
                style={iconBtnStyle}
                aria-label="Więcej opcji"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>more_vert</span>
              </button>

              {showMenu && (
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => { setShowMenu(false); setShowDeleteModal(true); }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#DC2626' }}>delete</span>
                    <span style={{ color: '#DC2626' }}>Usuń przepis</span>
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => { setShowMenu(false); setShowShareModal(true); }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>content_copy</span>
                    <span>Udostępnij kod</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      />

      <main className={styles.content} ref={contentRef}>
        {/* Hero photo */}
        <div className={styles.heroWrap}>
          <div className={styles.hero}>
            {recipe.photo
              ? <img src={recipe.photo} alt={recipe.name} className={styles.heroImg} />
              : <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#C0C7D0' }}>photo_camera</span>
            }
          </div>
        </div>

        {/* Meta */}
        <div className={styles.meta}>
          <h1 className={styles.recipeName}>{getRecipeName(recipe, language)}</h1>

          <div className={styles.kpiCards}>
            <div className={styles.kpiCard}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--text-muted)' }}>room_service</span>
              <span className={styles.kpiValue}>{portions}</span>
              <span className={styles.kpiLabel}>{t('detail.portions')}</span>
            </div>
            <div className={styles.kpiCard}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--text-muted)' }}>receipt_long</span>
              <span className={styles.kpiValue}>{scaledTotalCost.toFixed(2).replace('.', ',')} zł</span>
              <span className={styles.kpiLabel}>{t('detail.totalCost')}</span>
            </div>
            <div className={styles.kpiCard}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--text-muted)' }}>payments</span>
              <span className={styles.kpiValue}>{scaledCostPerPortion.toFixed(2).replace('.', ',')} zł</span>
              <span className={styles.kpiLabel}>{t('detail.perPortion')}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabSection}>
          <TabBar tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />

          <div className={styles.tabContent}>

            {/* ── Ingredients tab ── */}
            {activeTab === 'ingredients' && (
              <>
                <PortionSlider value={portions} onChange={setPortions} min={1} max={12} />
                <div className={styles.ingredientList}>
                  {scaledIngredients.map(ing => (
                    <IngredientRow key={ing.id} ingredient={ing} scaledAmount={ing.scaledAmount} />
                  ))}
                </div>
                <div className={styles.costSummary}>
                  <div className={styles.costRow}>
                    <span className={styles.costLabel}>{t('detail.costTotal')}</span>
                    <span className={styles.costValueNavy}>{scaledTotalCost.toFixed(2).replace('.', ',')} zł</span>
                  </div>
                  <div className={styles.costRow}>
                    <span className={styles.costLabel}>{t('detail.costPer')}</span>
                    <span className={styles.costValueGreen}>{scaledCostPerPortion.toFixed(2).replace('.', ',')} zł</span>
                  </div>
                </div>
              </>
            )}

            {/* ── Video tab ── */}
            {activeTab === 'video' && (
              <div className={styles.videoTab}>
                {youtubeEmbedUrl ? (
                  <div className={styles.videoWrapper}>
                    <iframe
                      src={youtubeEmbedUrl}
                      title="Recipe video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className={styles.videoIframe}
                    />
                  </div>
                ) : (
                  <div className={styles.videoPlaceholder}>
                    <span className="material-symbols-outlined" style={{ fontSize: 52, color: '#FF0000' }}>play_circle</span>
                    <p className={styles.videoPlaceholderTitle}>{t('detail.noVideo')}</p>
                    <p className={styles.videoPlaceholderDesc}>{t('detail.noVideoDesc')}</p>
                  </div>
                )}
                <div className={styles.videoInputRow}>
                  <input
                    type="url"
                    className={styles.videoInput}
                    placeholder={t('detail.youtubePlaceholder')}
                    value={youtubeInput}
                    onChange={e => setYoutubeInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddVideo()}
                  />
                  <button className={styles.videoBtn} onClick={handleAddVideo}>{t('detail.add')}</button>
                </div>
              </div>
            )}

            {/* ── Steps tab ── */}
            {activeTab === 'steps' && (
              <div className={styles.steps}>
                {recipe.steps && recipe.steps.length > 0 ? (
                  recipe.steps.map((step, i) => (
                    <div key={i} className={styles.stepRow} onClick={() => toggleStep(i)}>
                      <div className={`${styles.stepNum} ${completedSteps[i] ? styles.stepNumDone : ''}`}>
                        {completedSteps[i]
                          ? <span className="material-symbols-outlined" style={{ fontSize: 14, color: 'var(--navy)' }}>check</span>
                          : <span>{i + 1}</span>
                        }
                      </div>
                      <p className={`${styles.stepText} ${completedSteps[i] ? styles.stepTextDone : ''}`}>{step}</p>
                    </div>
                  ))
                ) : (
                  <p className={styles.videoPlaceholderDesc} style={{ textAlign: 'center', padding: '32px 0' }}>
                    Brak kroków przepisu
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className={styles.ctaBar}>
          <button className={styles.ctaBtn} onClick={handleAddToCart}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>shopping_cart</span>
            {t('detail.addToCart')}
          </button>
        </div>
      </main>

      <BottomNav />

      {/* ── Share modal ── */}
      {showShareModal && (
        <div className={styles.modalOverlay} onClick={() => { setShowShareModal(false); setCopied(false); }}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => { setShowShareModal(false); setCopied(false); }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
            <div className={styles.shareIconWrap}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--navy)' }}>content_copy</span>
            </div>
            <p className={styles.modalTitle}>Kod przepisu</p>
            <p className={styles.modalDesc}>Skopiuj kod i wklej go w aplikacji kuchcik na innym urządzeniu, żeby zaimportować przepis.</p>
            <textarea
              className={styles.shareCode}
              readOnly
              value={encodeRecipe(recipe)}
              onFocus={e => e.target.select()}
            />
            <button
              className={copied ? styles.shareCopiedBtn : styles.shareCopyBtn}
              onClick={() => {
                navigator.clipboard.writeText(encodeRecipe(recipe));
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'Skopiowano!' : 'Kopiuj kod'}
            </button>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ── */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setShowDeleteModal(false)}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
            <div className={styles.modalIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#DC2626' }}>delete</span>
            </div>
            <p className={styles.modalTitle}>Usuń przepis</p>
            <p className={styles.modalDesc}>Czy na pewno chcesz usunąć „{recipe.name}"? Tej operacji nie można cofnąć.</p>
            <div className={styles.modalActions}>
              <button className={styles.modalDeleteBtn} onClick={handleConfirmDelete}>Usuń</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
