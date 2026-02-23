import { useState, ReactNode } from "react";
import "./styles.scss";

export interface NavigationItem {
  id: string;
  label: string;
}

interface SecondaryNavigationProps {
  items: NavigationItem[];
  activeItem: string;
  onItemChange: (id: string) => void;
  rightContent?: ReactNode;
  ariaLabel?: string;
}

export default function SecondaryNavigation({
  items,
  activeItem,
  onItemChange,
  rightContent,
  ariaLabel = "Navigation secondaire",
}: SecondaryNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onItemChange(id);
    setIsOpen(false);
  };

  return (
    <nav
      aria-label={ariaLabel}
      className="fr-nav fr-mb-1w secondary-navigation"
      role="navigation"
    >
      <button
        aria-controls="secondary-nav-list"
        aria-expanded={isOpen}
        className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-menu-fill secondary-navigation__burger"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
      </button>
      <ul
        id="secondary-nav-list"
        className={`fr-nav__list ${isOpen ? "fr-nav__list-open" : ""}`}
      >
        {items.map((item) => (
          <li key={item.id} className="fr-nav__item">
            <button
              aria-current={activeItem === item.id ? "page" : undefined}
              className="fr-nav__link"
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
      {rightContent && (
        <div className="secondary-navigation__right">{rightContent}</div>
      )}
    </nav>
  );
}
