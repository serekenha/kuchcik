import { useState } from 'react';
import TopBar from '../../components/TopBar/TopBar';
import BottomNav from '../../components/BottomNav/BottomNav';
import { useTranslation } from '../../i18n/useTranslation';
import styles from './Dictionary.module.css';

const DICT_KEY = 'dishie_dictionary';

function loadDict() {
  try { return JSON.parse(localStorage.getItem(DICT_KEY) || '[]'); } catch { return []; }
}
function saveDict(d) { localStorage.setItem(DICT_KEY, JSON.stringify(d)); }

const DEMO_DICT = [
  {
    id: 1,
    name: 'Makaron penne',
    aliases: ['MAKARON PENNE 500G', 'PENNE RIGATE'],
    prices: [{ qty: '500 g', price: 3.49 }, { qty: '500 g', price: 3.29 }],
  },
  {
    id: 2,
    name: 'Pierś z kurczaka',
    aliases: ['KURCZAK PIERS KG'],
    prices: [{ qty: '1 kg', price: 16.99 }],
  },
  {
    id: 3,
    name: 'Parmezan',
    aliases: ['PARMIGIANO REGGIANO 100G'],
    prices: [{ qty: '100 g', price: 8.99 }],
  },
];

export default function Dictionary() {
  const { t } = useTranslation();
  const [dict, setDict] = useState(() => {
    const stored = loadDict();
    if (stored.length === 0) {
      saveDict(DEMO_DICT);
      return DEMO_DICT;
    }
    return stored;
  });
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);

  const filtered = search.trim()
    ? dict.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.aliases.some(a => a.toLowerCase().includes(search.toLowerCase()))
      )
    : dict;

  function del(id) {
    const updated = dict.filter(e => e.id !== id);
    saveDict(updated);
    setDict(updated);
  }

  function upd(id, changes) {
    const updated = dict.map(e => e.id === id ? { ...e, ...changes } : e);
    saveDict(updated);
    setDict(updated);
  }

  function rmAlias(id, alias) {
    const entry = dict.find(e => e.id === id);
    upd(id, { aliases: entry.aliases.filter(a => a !== alias) });
  }

  function rmPrice(id, idx) {
    const entry = dict.find(e => e.id === id);
    upd(id, { prices: entry.prices.filter((_, i) => i !== idx) });
  }

  return (
    <div className={styles.screen}>
      <TopBar
        showBack
        title={t('dict.title')}
        rightContent={<span>{dict.length} {t('dict.count')}</span>}
      />
      <div className={styles.content}>

        {/* ── Search ── */}
        <div className={styles.header}>
          <div className={styles.searchWrap}>
            <span className={`material-symbols-outlined ${styles.searchIcon}`} style={{ fontSize: 16 }}>search</span>
            <input
              className={styles.searchInput}
              type="text"
              placeholder={t('dict.search')}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Empty state ── */}
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: 28, color: 'var(--text-muted)' }}>book</span>
            </div>
            <p className={styles.emptyTitle}>{t('dict.empty')}</p>
            <p className={styles.emptyDesc}>{t('dict.emptyDesc')}</p>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map(entry => (
              <div key={entry.id} className={styles.entry}>

                <div className={styles.entryHead}>
                  <input
                    className={styles.entryName}
                    value={entry.name}
                    readOnly={editId !== entry.id}
                    onChange={e => upd(entry.id, { name: e.target.value })}
                    style={{ cursor: editId === entry.id ? 'text' : 'default' }}
                  />
                  <div className={styles.entryActions}>
                    <button
                      className={styles.iconBtn}
                      style={{ background: editId === entry.id ? 'var(--yellow)' : 'var(--off-white)' }}
                      onClick={() => setEditId(editId === entry.id ? null : entry.id)}
                      aria-label={editId === entry.id ? 'Save' : 'Edit'}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                        {editId === entry.id ? 'check' : 'edit'}
                      </span>
                    </button>
                    <button
                      className={styles.iconBtn}
                      style={{ background: 'var(--off-white)' }}
                      onClick={() => del(entry.id)}
                      aria-label="Delete"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 14, color: '#BBBDCA' }}>delete</span>
                    </button>
                  </div>
                </div>

                {/* ── Aliases ── */}
                {entry.aliases.length > 0 && (
                  <div className={styles.section}>
                    <div className={styles.sectionLabel}>{t('dict.aliases')}</div>
                    <div className={styles.chips}>
                      {entry.aliases.map((alias, i) => (
                        <div key={i} className={styles.aliasChip}>
                          <span className={styles.aliasText}>{alias}</span>
                          {editId === entry.id && (
                            <button className={styles.chipRemove} onClick={() => rmAlias(entry.id, alias)}>
                              <span className="material-symbols-outlined" style={{ fontSize: 10 }}>close</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Price history ── */}
                {entry.prices.length > 0 && (
                  <div className={styles.section}>
                    <div className={styles.sectionLabel}>{t('dict.prices')}</div>
                    <div className={styles.chips}>
                      {entry.prices.map((p, i) => (
                        <div key={i} className={styles.priceChip}>
                          <span className={styles.priceQty}>{p.qty}</span>
                          <span className={styles.priceArrow}>→</span>
                          <span className={styles.priceVal}>{typeof p.price === 'number' ? p.price.toFixed(2) : p.price} zł</span>
                          {editId === entry.id && (
                            <button className={styles.chipRemove} onClick={() => rmPrice(entry.id, i)}>
                              <span className="material-symbols-outlined" style={{ fontSize: 10 }}>close</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {entry.aliases.length === 0 && entry.prices.length === 0 && (
                  <p className={styles.entryEmpty}>{t('dict.noData')}</p>
                )}
              </div>
            ))}
            <div style={{ height: 8 }} />
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
