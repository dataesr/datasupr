import { useCookieConsent } from "../../../hooks/useCookieConsent";

export function CookieConsentDebug() {
  const { consent, hasConsented, showBanner, resetConsent } = useCookieConsent();

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "black",
        color: "white",
        padding: "10px",
        zIndex: 9999,
        fontSize: "12px",
      }}
    >
      <div>showBanner: {showBanner.toString()}</div>
      <div>hasConsented: {hasConsented.toString()}</div>
      <div>consent: {JSON.stringify(consent)}</div>
      <button onClick={resetConsent} style={{ marginTop: "5px" }}>
        Reset
      </button>
    </div>
  );
}
