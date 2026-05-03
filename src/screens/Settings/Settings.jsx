import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './Settings.module.css';

export default function Settings() {
  const { settings, updateSettings, showToast, navGuardRef } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState(settings.userName);
  const [theme, setTheme] = useState(settings.theme);
  const [language, setLanguage] = useState(settings.language);
  const [showModal, setShowModal] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

  const hasChanges =
    name !== settings.userName ||
    theme !== settings.theme ||
    language !== settings.language;

  // Register / clear the navigation guard
  useEffect(() => {
    if (hasChanges) {
      navGuardRef.current = (path) => {
        setPendingPath(path);
        setShowModal(true);
      };
    } else {
      navGuardRef.current = null;
    }
    return () => { navGuardRef.current = null; };
  }, [hasChanges, navGuardRef]);

  function handleSave() {
    updateSettings({ userName: name, theme, language });
    showToast('toast.settingsSaved');
  }

  function doNavigate() {
    if (pendingPath === -1) navigate(-1);
    else if (pendingPath) navigate(pendingPath);
  }

  function handleSaveAndLeave() {
    updateSettings({ userName: name, theme, language });
    navGuardRef.current = null;
    setShowModal(false);
    doNavigate();
  }

  function handleLeaveWithout() {
    navGuardRef.current = null;
    setShowModal(false);
    doNavigate();
  }

  function handleCancel() {
    setShowModal(false);
    setPendingPath(null);
  }

  function handleBack() {
    if (hasChanges) {
      setPendingPath(-1);
      setShowModal(true);
    } else {
      navigate(-1);
    }
  }

  return (
    <div className={styles.screen}>
      <TopBar showBack onBack={handleBack} title={t('settings.title')} />

      <div className={styles.content}>

        {/* ── Name ── */}
        <div className={styles.section}>
          <div className={styles.label}>{t('settings.name')}</div>
          <input
            className={styles.input}
            type="text"
            placeholder={t('settings.namePlaceholder')}
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* ── Theme ── */}
        <div className={styles.section}>
          <div className={styles.label}>{t('settings.theme')}</div>
          <div className={styles.toggleRow}>
            <button
              className={`${styles.toggleBtn} ${theme === 'light' ? styles.toggleActive : ''}`}
              onClick={() => setTheme('light')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>light_mode</span>
              {t('settings.light')}
            </button>
            <button
              className={`${styles.toggleBtn} ${theme === 'dark' ? styles.toggleActive : ''}`}
              onClick={() => setTheme('dark')}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>dark_mode</span>
              {t('settings.dark')}
            </button>
          </div>
        </div>

        {/* ── Language ── */}
        <div className={styles.section}>
          <div className={styles.label}>{t('settings.language')}</div>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="language"
                value="pl"
                checked={language === 'pl'}
                onChange={() => setLanguage('pl')}
                className={styles.radioInput}
              />
              <span className={styles.radioCustom} />
              Polski
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={() => setLanguage('en')}
                className={styles.radioInput}
              />
              <span className={styles.radioCustom} />
              English
            </label>
          </div>
        </div>

        {/* ── Save ── */}
        <div className={styles.saveWrap}>
          <button
            className={styles.saveBtn}
            disabled={!hasChanges}
            onClick={handleSave}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span>
            {t('settings.save')}
          </button>
        </div>
      </div>

      {/* ── Unsaved changes modal ── */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.modalCloseBtn} onClick={handleCancel}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
            </button>
            <h3 className={styles.modalTitle}>{t('settings.unsavedTitle')}</h3>
            <p className={styles.modalDesc}>{t('settings.unsavedDesc')}</p>
            <div className={styles.modalActions}>
              <button className={styles.modalSaveBtn} onClick={handleSaveAndLeave}>
                {t('settings.saveAndLeave')}
              </button>
              <button className={styles.modalLeaveBtn} onClick={handleLeaveWithout}>
                {t('settings.leaveWithout')}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
