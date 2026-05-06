import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import styles from './TopBar.module.css';

export default function TopBar({
  isHome = false,   // logo + theme toggle (RecipeList only)
  showBack = false, // back button
  title,            // page title — big, left-aligned next to back btn
  rightContent,     // optional node on the right (e.g. item count)
  onBack,           // optional override for back button behaviour
}) {
  const navigate = useNavigate();
  const { setNavDirection } = useApp();
  const [theme, setTheme] = useState('light');
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef(null);

  useEffect(() => {
    // Watch the next sibling element (the scrollable content area)
    const container = barRef.current?.nextElementSibling;
    if (!container) return;
    function onScroll() { setScrolled(container.scrollTop > 4); }
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  function handleBack() {
    if (onBack) { onBack(); return; }
    setNavDirection('back');
    navigate(-1);
  }

  const barClass = `${styles.topbar} ${scrolled ? styles.topbarScrolled : ''}`;

  /* ── Home screen ────────────────────────────────────────── */
  if (isHome) {
    return (
      <header ref={barRef} className={barClass}>
        <img src="/dishie-logo-02.svg" alt="kuchcik" className={styles.logo} />
      </header>
    );
  }

  /* ── All other screens ──────────────────────────────────── */
  return (
    <header ref={barRef} className={barClass}>
      <div className={styles.left}>
        {showBack && (
          <button className={styles.backBtn} onClick={handleBack} aria-label="Wróć">
            <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_back</span>
          </button>
        )}
        {title && <span className={styles.pageTitle}>{title}</span>}
      </div>
      {rightContent && <div className={styles.rightContent}>{rightContent}</div>}
    </header>
  );
}
