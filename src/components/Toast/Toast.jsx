import { useTranslation } from '../../i18n/useTranslation';
import styles from './Toast.module.css';

export default function Toast({ message }) {
  const { t } = useTranslation();
  if (!message) return null;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span>
      {t(message)}
    </div>
  );
}
