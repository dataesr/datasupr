import { getThemeFromHtmlNode } from "../../../utils";

export default function Callout({ children }) {
  const theme = getThemeFromHtmlNode();

  return (
    <div
      className="callout"
      style={{
        backgroundColor: getComputedStyle(
          document.documentElement
        ).getPropertyValue(`--bg-${theme}`),
      }}
    >
      {children}
    </div>
  );
}
