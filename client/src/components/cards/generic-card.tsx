import { ReactNode } from "react";
import { Link } from '@dataesr/dsfr-plus';

export default function GenericCard({ description, image, title, to }: { description?: ReactNode, image?: ReactNode, title: string, to: string }) {
  return (

    <div className="fr-card fr-enlarge-link">
      <div className="fr-card__body">
        <div className="fr-card__content">
          <h3 className="fr-card__title">
            <Link href={to}>
              {title}
            </Link>
          </h3>
          {
            description && <p className="fr-card__desc">{description}</p>
          }
        </div>
      </div>
      {
        image && (
          <div className="fr-card__header">
            <div className="fr-card__img">
              {/* <img className="fr-responsive-img" src={image} alt="[À MODIFIER - vide ou texte alternatif de l’image]" /> */}
              {image}
            </div>
          </div>
        )
      }
    </div>

  )
}