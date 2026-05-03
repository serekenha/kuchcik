import styles from './IngredientRow.module.css';

export default function IngredientRow({ ingredient, scaledAmount }) {
  const display = Number.isInteger(scaledAmount)
    ? scaledAmount
    : parseFloat(scaledAmount.toFixed(1));

  return (
    <div className={styles.row}>
      <span className={styles.name}>{ingredient.name}</span>
      <span className={styles.amount}>{display} {ingredient.unit}</span>
    </div>
  );
}
