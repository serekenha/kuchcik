import { useApp } from '../context/AppContext';
import { translations } from './translations';

export function useTranslation() {
  const { settings } = useApp();
  const lang = settings?.language || 'pl';
  const dict = translations[lang] || translations.pl;

  function t(key) {
    return dict[key] ?? key;
  }

  return { t, language: lang };
}
