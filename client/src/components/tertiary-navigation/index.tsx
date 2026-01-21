import "./styles.scss";

export function TertiaryNavigation({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <nav className={`fr-nav fr-nav--horizontal ${className}`} role="navigation">
      <ul className="fr-nav__list">{children}</ul>
    </nav>
  );
}

export function TertiaryNavigationItem({
  href,
  label,
  isActive = false,
  className = "",
  onClick,
}: {
  href?: string;
  label: string;
  isActive?: boolean;
  className?: string;
  onClick?: (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
  ) => void;
}) {
  const props = {
    className: "fr-nav__link",
    "aria-current": isActive ? ("page" as const) : undefined,
    onClick,
  };

  return (
    <li className={`fr-nav__item ${className}`}>
      {href && !onClick ? (
        <a href={href} {...props}>
          {label}
        </a>
      ) : (
        <button type="button" {...props}>
          {label}
        </button>
      )}
    </li>
  );
}

export default TertiaryNavigation;
