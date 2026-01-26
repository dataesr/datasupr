import { Link } from "@dataesr/dsfr-plus";
import { ReactNode } from "react";

import "./styles.scss";


export default function GenericCard({
  description,
  image,
  title,
  to,
}: {
  description?: ReactNode;
  image?: ReactNode;
  title: string;
  to: string;
}) {
  return (
    <div
      className="fr-card  fr-card--horizontal generic-card"
      style={{ height: "initial" }}
    >
      <div className="fr-card__body fr-p-1w">
        <div className="fr-card__content fr-py-0">
          <h3 className="fr-card__title title">
            <Link href={to}>{title}</Link>
          </h3>
          {description && <p className="fr-card__desc">{description}</p>}
        </div>
      </div>
      {image && (
        <div className="fr-card__header">
          <div className="fr-card__img">{image}</div>
        </div>
      )}
    </div>
  );
}
