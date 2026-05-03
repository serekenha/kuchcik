/* Category definitions */

const MakaronIcon   = () => <span className="material-symbols-outlined" style={{ fontSize: 15 }}>dinner_dining</span>;
const RyzIcon       = () => <span className="material-symbols-outlined" style={{ fontSize: 15 }}>rice_bowl</span>;
const ZupaIcon      = () => <span className="material-symbols-outlined" style={{ fontSize: 15 }}>soup_kitchen</span>;
const KaszaIcon     = () => <span className="material-symbols-outlined" style={{ fontSize: 15 }}>grain</span>;
const DeserIcon     = () => <span className="material-symbols-outlined" style={{ fontSize: 15 }}>cake</span>;
const PrzekaskaIcon = () => <span className="material-symbols-outlined" style={{ fontSize: 15 }}>tapas</span>;
const SznadanieIcon = () => <span className="material-symbols-outlined" style={{ fontSize: 15 }}>breakfast_dining</span>;

export const FILTER_CATEGORIES = [
  { id: 'Wszystkie', label: 'Wszystkie', icon: null },
  { id: 'Makaron',   label: 'Makaron',   icon: <MakaronIcon /> },
  { id: 'Ryż',       label: 'Ryż',       icon: <RyzIcon /> },
  { id: 'Zupa',      label: 'Zupa',      icon: <ZupaIcon /> },
  { id: 'Kasza',     label: 'Kasza',     icon: <KaszaIcon /> },
  { id: 'Deser',     label: 'Deser',     icon: <DeserIcon /> },
  { id: 'Przekąska', label: 'Przekąska', icon: <PrzekaskaIcon /> },
  { id: 'Śniadanie', label: 'Śniadanie', icon: <SznadanieIcon /> },
];

export const RECIPE_CATEGORIES = FILTER_CATEGORIES.slice(1);
