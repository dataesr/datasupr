import { useCookieConsent } from "../../../hooks/useCookieConsent";

export default function CookieDebugPanel() {
  const { consent, hasConsented, showBanner, resetConsent } = useCookieConsent();

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "white",
        border: "2px solid red",
        padding: "10px",
        zIndex: 10001,
        fontSize: "12px",
      }}
    >
      <h4>🍪 Cookie Debug</h4>
      <p>
        <strong>showBanner:</strong> {showBanner ? "true" : "false"}
      </p>
      <p>
        <strong>hasConsented:</strong> {hasConsented ? "true" : "false"}
      </p>
      <p>
        <strong>consent:</strong>
      </p>
      <ul>
        <li>necessary: {consent.necessary ? "true" : "false"}</li>
        <li>functional: {consent.functional ? "true" : "false"}</li>
        <li>analytics: {consent.analytics ? "true" : "false"}</li>
      </ul>
      <button onClick={resetConsent} style={{ marginRight: "5px" }}>
        Reset Consent
      </button>
      {/* <button onClick={forceShowBanner}>Force Banner</button> */}
    </div>
  );
}
