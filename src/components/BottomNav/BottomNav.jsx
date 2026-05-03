import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import styles from './BottomNav.module.css';

const NAV_ITEMS = [
  { id: 'home',        path: '/',           label: 'Strona główna', icon: 'home' },
  { id: 'recipes',    path: '/przepisy',    label: 'Przepisy',      icon: 'menu_book' },
  { id: 'shopping',   path: '/zakupy',      label: 'Zakupy',        icon: 'shopping_cart' },
  { id: 'dictionary', path: '/slownik',     label: 'Słownik',       icon: 'book_6' },
  { id: 'settings',   path: '/ustawienia',  label: 'Ustawienia',    icon: 'settings' },
];

function getActiveId(pathname) {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/recipe')) return 'home';
  if (pathname === '/przepisy') return 'recipes';
  if (pathname === '/dodaj') return 'recipes';
  if (pathname === '/zakupy') return 'shopping';
  if (pathname === '/slownik') return 'dictionary';
  if (pathname === '/ustawienia') return 'settings';
  return null;
}

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setNavDirection, shoppingList, navGuardRef } = useApp();

  const activeId = getActiveId(location.pathname);
  const pendingCount = shoppingList.filter(i => !i.checked).length;

  function handleNav(item) {
    if (item.path === location.pathname) return;

    // Check if there's a navigation guard (e.g. unsaved settings changes)
    if (navGuardRef.current) {
      navGuardRef.current(item.path);
      return;
    }

    const isBack = item.path === '/' && location.pathname !== '/';
    setNavDirection(isBack ? 'back' : 'forward');
    navigate(item.path);
  }

  return (
    <nav className={styles.nav} aria-label="Nawigacja główna">
      {NAV_ITEMS.map(({ id, path, label, icon }) => {
        const active = activeId === id;
        return (
          <button
            key={id}
            className={`${styles.navBtn} ${active ? styles.navBtnActive : ''}`}
            onClick={() => handleNav({ id, path })}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{icon}</span>
            {id === 'shopping' && pendingCount > 0 && (
              <span className={styles.badge}>{pendingCount > 9 ? '9+' : pendingCount}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
