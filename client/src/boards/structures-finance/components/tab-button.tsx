interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  tabPanelId: string;
  onClick: () => void;
}

export function TabButton({
  id,
  label,
  isActive,
  tabPanelId,
  onClick,
}: TabButtonProps) {
  return (
    <li role="presentation">
      <button
        id={id}
        className={`fr-tabs__tab ${isActive ? "fr-tabs__tab--selected" : ""}`}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={tabPanelId}
        onClick={onClick}
      >
        {label}
      </button>
    </li>
  );
}
