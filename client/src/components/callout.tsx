import React from "react";

type CalloutProps = {
  children: React.ReactNode;
  colorFamily?: "green-tilleul-verveine" | "green-bourgeon" | "green-emeraude" | "green-archipel" | "blue-ecume" | "blue-cumulus" | "purple-glycine" | "pink-macaron" | "pink-tuile" | "yellow-tournesol" | "yellow-moutarde" | "orange-terre-battue" | "brown-cafe-creme" | "brown-caramel" | "brown-opera" | "beige-gris-galet";
  icon?: string;
  title?: React.ReactNode;
};

export default function Callout({ children, colorFamily, icon, title }: CalloutProps) {
  return (
    <div className={`fr-callout ${icon} ${colorFamily ? 'fr-callout--' + colorFamily : ''}`}>
      <h3 className="fr-callout__title">{title}</h3>
      <p className="fr-callout__text">{children}</p>
    </div>
  );
}

