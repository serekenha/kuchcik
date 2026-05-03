import styles from './PortionSlider.module.css';

export default function PortionSlider({ value, onChange, min = 1, max = 12 }) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <label className={styles.label} htmlFor="portionSlider">
          Liczba porcji
        </label>
        <span className={styles.value}>{value}</span>
      </div>
      <input
        id="portionSlider"
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className={styles.input}
        style={{
          background: `linear-gradient(to right, var(--yellow) ${pct}%, var(--border) ${pct}%)`
        }}
        aria-label="Liczba porcji"
      />
    </div>
  );
}
