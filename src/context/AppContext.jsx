import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { sampleRecipes } from '../data/sampleRecipes';

function loadRecipes() {
  try {
    const stored = localStorage.getItem('dishie_recipes');
    return stored ? JSON.parse(stored) : sampleRecipes;
  } catch {
    return sampleRecipes;
  }
}

function loadShoppingList() {
  try {
    const stored = localStorage.getItem('dishie_shopping');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const AppContext = createContext(null);

const DEFAULT_SETTINGS = { userName: 'Rafał', theme: 'light', language: 'pl' };

function loadSettings() {
  try {
    const stored = localStorage.getItem('dishie_settings');
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function AppProvider({ children }) {
  const [recipes, setRecipes] = useState(loadRecipes);
  const [shoppingList, setShoppingList] = useState(loadShoppingList);
  const [toastMsg, setToastMsg] = useState(null);
  const [navDirection, setNavDirection] = useState('forward');
  const [settings, setSettings] = useState(loadSettings);
  const toastTimer = useRef(null);
  const navGuardRef = useRef(null); // fn(path) => void — set by screens with unsaved changes

  useEffect(() => {
    localStorage.setItem('dishie_recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('dishie_shopping', JSON.stringify(shoppingList));
  }, [shoppingList]);

  const showToast = useCallback((msg) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2500);
  }, []);

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => {
      const merged = { ...prev, ...newSettings };
      localStorage.setItem('dishie_settings', JSON.stringify(merged));
      return merged;
    });
  }, []);

  const addToShoppingList = useCallback((recipe, currentPortions) => {
    const ratio = currentPortions / recipe.portions;
    const items = recipe.ingredients.map(ing => ({
      recipeId: recipe.id,
      recipeName: recipe.name,
      ingredientId: ing.id,
      name: ing.name,
      amount: Math.round(ing.amount * ratio * 10) / 10,
      unit: ing.unit,
      checked: false
    }));
    setShoppingList(prev => {
      const filtered = prev.filter(i => i.recipeId !== recipe.id);
      return [...filtered, ...items];
    });
    showToast('toast.addedToCart');
  }, [showToast]);

  const toggleShoppingItem = useCallback((recipeId, ingredientId) => {
    setShoppingList(prev =>
      prev.map(item =>
        item.recipeId === recipeId && item.ingredientId === ingredientId
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  }, []);

  const clearShoppingList = useCallback(() => {
    setShoppingList([]);
  }, []);

  const removeShoppingItem = useCallback((recipeId, ingredientId) => {
    setShoppingList(prev =>
      prev.filter(item => !(item.recipeId === recipeId && item.ingredientId === ingredientId))
    );
  }, []);

  const addRecipe = useCallback((recipe) => {
    setRecipes(prev => [recipe, ...prev]);
  }, []);

  const updateRecipe = useCallback((updatedRecipe) => {
    setRecipes(prev => prev.map(r => r.id === updatedRecipe.id ? updatedRecipe : r));
  }, []);

  const deleteRecipe = useCallback((recipeId) => {
    setRecipes(prev => prev.filter(r => r.id !== recipeId));
  }, []);

  return (
    <AppContext.Provider value={{
      recipes,
      shoppingList,
      toastMsg,
      navDirection,
      setNavDirection,
      settings,
      updateSettings,
      addToShoppingList,
      toggleShoppingItem,
      clearShoppingList,
      removeShoppingItem,
      addRecipe,
      updateRecipe,
      deleteRecipe,
      showToast,
      navGuardRef,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
