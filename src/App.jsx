import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import RecipeList from './screens/RecipeList/RecipeList';
import RecipeDetail from './screens/RecipeDetail/RecipeDetail';
import ShoppingList from './screens/ShoppingList/ShoppingList';
import Scanner from './screens/Scanner/Scanner';
import AddRecipe from './screens/AddRecipe/AddRecipe';
import AllRecipes from './screens/AllRecipes/AllRecipes';
import Dictionary from './screens/Dictionary/Dictionary';
import EditRecipe from './screens/EditRecipe/EditRecipe';
import Settings from './screens/Settings/Settings';
import Toast from './components/Toast/Toast';
import { useApp } from './context/AppContext';
import './styles/global.css';
import './App.css';


function AnimatedRoutes() {
  const location = useLocation();
  const { navDirection } = useApp();
  const wrapperRef = useRef(null);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const cls = navDirection === 'back' ? 'enter-from-left' : 'enter-from-right';
    el.classList.remove('enter-from-right', 'enter-from-left');
    void el.offsetWidth;
    el.classList.add(cls);
  }, [location.key, navDirection]);

  return (
    <div className="screen-anim-wrapper" ref={wrapperRef}>
      <Routes location={location} key={location.key}>
        <Route path="/" element={<RecipeList />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/zakupy" element={<ShoppingList />} />
        <Route path="/skaner" element={<Scanner />} />
        <Route path="/przepisy" element={<AllRecipes />} />
        <Route path="/dodaj" element={<AddRecipe />} />
        <Route path="/slownik" element={<Dictionary />} />
        <Route path="/recipe/:id/edit" element={<EditRecipe />} />
        <Route path="/ustawienia" element={<Settings />} />
        <Route path="*" element={<RecipeList />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const { toastMsg, settings } = useApp();

  return (
    <div className={`app-frame${settings?.theme === 'dark' ? ' dark' : ''}`}>
      <div className="screen-content">
        <AnimatedRoutes />
        <Toast message={toastMsg} />
      </div>
    </div>
  );
}
