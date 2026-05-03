import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './ShoppingList.module.css';

export default function ShoppingList() {
  const { shoppingList, toggleShoppingItem, clearShoppingList, removeShoppingItem } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [confirmClear, setConfirmClear] = useState(false);

  const groups = shoppingList.reduce((acc, item) => {
    if (!acc[item.recipeId]) {
      acc[item.recipeId] = { recipeName: item.recipeName, items: [] };
    }
    acc[item.recipeId].items.push(item);
    return acc;
  }, {});

  const groupList = Object.entries(groups);
  const totalCount = shoppingList.length;
  const pendingCount = shoppingList.filter(i => !i.checked).length;

  function handleClear() {
    if (confirmClear) {
      clearShoppingList();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  }

  return (
    <div className={styles.screen}>
      <TopBar showBack title={t('shopping.title')} />

      <main className={`${styles.content} ${totalCount === 0 ? styles.contentEmpty : ''}`}>
        {totalCount === 0 ? (
          <div className={styles.empty}>
            <img src="/shopping.svg" alt="" className={styles.emptyIllustration} />
            <p className={styles.emptyTitle}>{t('shopping.empty')}</p>
            <p className={styles.emptyDesc}>{t('shopping.emptyDesc')}</p>
            <button className={styles.emptyBtn} onClick={() => navigate('/przepisy')}>
              {t('shopping.goToRecipes')}
            </button>
          </div>
        ) : (
          <>
            <div className={styles.statusRow}>
              <span className={styles.statusText}>
                {pendingCount} {t('shopping.of')} {totalCount} {t('shopping.toBuy')}
              </span>
              <button
                className={`${styles.clearBtn} ${confirmClear ? styles.clearBtnConfirm : ''}`}
                onClick={handleClear}
              >
                {confirmClear ? t('shopping.confirm') : t('shopping.clear')}
              </button>
            </div>

            <div className={styles.list}>
              {groupList.map(([recipeId, group]) => (
                <div key={recipeId} className={styles.group}>
                  <p className={styles.groupLabel}>{group.recipeName}</p>

                  <div className={styles.groupCard}>
                    {group.items.map(item => (
                      <div
                        key={`${item.recipeId}-${item.ingredientId}`}
                        className={styles.itemRow}
                        onClick={() => toggleShoppingItem(item.recipeId, item.ingredientId)}
                        role="checkbox"
                        aria-checked={item.checked}
                        tabIndex={0}
                        onKeyDown={e => e.key === 'Enter' && toggleShoppingItem(item.recipeId, item.ingredientId)}
                      >
                        <div className={`${styles.checkbox} ${item.checked ? styles.checkboxChecked : ''}`}>
                          {item.checked && (
                            <span className="material-symbols-outlined" style={{ fontSize: 11, color: 'var(--navy)' }}>check</span>
                          )}
                        </div>
                        <span className={`${styles.itemName} ${item.checked ? styles.itemNameDone : ''}`}>
                          {item.name}
                        </span>
                        <span className={`${styles.itemAmount} ${item.checked ? styles.itemAmountDone : ''}`}>
                          {item.amount} {item.unit}
                        </span>
                        <button
                          className={styles.deleteBtn}
                          onClick={e => { e.stopPropagation(); removeShoppingItem(item.recipeId, item.ingredientId); }}
                          aria-label="Remove"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
