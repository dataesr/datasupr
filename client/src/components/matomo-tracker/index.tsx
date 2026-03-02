import Cookies from "js-cookie";
import { useMatomo } from "../../hooks/useMatomo";

/**
 * Lit le consentement analytics depuis le cookie et active le tracking Matomo.
 * À placer dans l'arbre React à l'intérieur de <BrowserRouter>.
 */
export default function MatomoTracker() {
  const analyticsConsented = (() => {
    try {
      const raw = Cookies.get("datasupr-cookie-consent");
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return parsed?.preferences?.analytics === true;
    } catch {
      return false;
    }
  })();

  useMatomo(analyticsConsented);
  return null;
}
