import { useUserStore } from '../store/userStore';
import { getTranslations } from '../constants/translations';

export function useTranslation() {
  const language = useUserStore((s) => s.coachLanguage);
  return getTranslations(language);
}
