import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SectionNavigation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const activeSection = searchParams.get("section") || "produits-vs-etudiants";

  const handleSectionChange = (section: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("section", section);
    setSearchParams(next);
    setIsOpen(false);
  };

  const navItems = [
    { id: "produits-vs-etudiants", label: "Produits vs Effectifs" },
    { id: "scsp-vs-encadrement", label: "SCSP vs Encadrement" },
    { id: "scsp-vs-ressources-propres", label: "SCSP vs Ressources propres" },
    { id: "comparison", label: "Comparaison de métriques" },
  ];

  return (
    <nav
      className="fr-nav"
      id="section-navigation-national"
      role="navigation"
      aria-label="Navigation secondaire"
      style={{ borderBottom: "1px solid var(--border-default-grey)" }}
    >
      <button
        className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-menu-fill"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="section-nav-list-national"
        data-mobile-burger-national
      >
        Menu
      </button>

      <ul
        id="section-nav-list-national"
        className="fr-nav__list"
        data-nav-list-national
        data-open={isOpen}
      >
        {navItems.map((item) => (
          <li key={item.id} className="fr-nav__item">
            <a
              className="fr-nav__link"
              href={`#${item.id}`}
              aria-current={activeSection === item.id ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                handleSectionChange(item.id);
              }}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <style>{`
        [data-mobile-burger-national] { display: none; }
        @media (max-width: 61.99em) {
          [data-mobile-burger-national] { 
            display: flex !important; 
            margin: 0.5rem 1rem;
          }
          [data-nav-list-national] { 
            display: none !important;
            flex-direction: column;
            background: var(--background-default-grey);
          }
          [data-nav-list-national][data-open="true"] { display: flex !important; }
          [data-nav-list-national] .fr-nav__item { width: 100%; }
          [data-nav-list-national] .fr-nav__link { width: 100%; }
        }
      `}</style>
    </nav>
  );
}
