import { Badge } from "@dataesr/dsfr-plus";

interface InfoCardProps {
  data: any;
  onClose: () => void;
}

export default function InfoCard({ data, onClose }: InfoCardProps) {
  const hasCursus =
    data.has_effectif_l || data.has_effectif_m || data.has_effectif_d;
  const hasFilieres =
    data.has_effectif_iut || data.has_effectif_sante || data.has_effectif_ing;
  const hasDisciplines =
    data.has_effectif_dsa ||
    data.has_effectif_llsh ||
    data.has_effectif_theo ||
    data.has_effectif_si ||
    data.has_effectif_staps ||
    data.has_effectif_veto ||
    data.has_effectif_interd;

  return (
    <div className="info-card">
      <div className="info-card__content">
        <div className="info-card__header">
          <h3 className="info-card__title">
            {data.etablissement_actuel_lib || data.etablissement_lib}
          </h3>
          <button
            className="fr-btn fr-btn--tertiary-no-outline fr-btn--sm fr-icon-close-line"
            onClick={onClose}
            title="Changer d'établissement"
            aria-label="Fermer la carte et changer d'établissement"
          />
        </div>

        <dl className="info-card__details">
          {data.etablissement_actuel_categorie && (
            <div>
              <dt>Type</dt>
              <dd>{data.etablissement_actuel_categorie}</dd>
            </div>
          )}

          <div>
            <dt>Localisation</dt>
            <dd>
              {data.region} — {data.commune}
            </dd>
          </div>

          <div>
            <dt>RCE</dt>
            <dd>
              {data.is_rce ? (
                <>
                  Oui
                  {data.rce && (
                    <span className="info-card__rce-date">
                      {" "}
                      (depuis {data.rce})
                    </span>
                  )}
                </>
              ) : (
                "Non"
              )}
            </dd>
          </div>

          {data.effectif_sans_cpge && (
            <div>
              <dt>Étudiants</dt>
              <dd>{data.effectif_sans_cpge.toLocaleString("fr-FR")}</dd>
            </div>
          )}
        </dl>

        <div className="info-card__formations">
          <p className="info-card__formations-title">Formations proposées</p>
          <div className="info-card__badges">
            {data.has_effectif_l && (
              <Badge color="blue-cumulus" size="sm">
                Licence
              </Badge>
            )}
            {data.has_effectif_m && (
              <Badge color="green-archipel" size="sm">
                Master
              </Badge>
            )}
            {data.has_effectif_d && (
              <Badge color="pink-tuile" size="sm">
                Doctorat
              </Badge>
            )}

            {hasCursus && hasFilieres && (
              <span className="info-card__separator">•</span>
            )}

            {data.has_effectif_iut && (
              <Badge color="blue-cumulus" size="sm">
                IUT
              </Badge>
            )}
            {data.has_effectif_sante && (
              <Badge color="brown-caramel" size="sm">
                Santé
              </Badge>
            )}
            {data.has_effectif_ing && (
              <Badge color="yellow-tournesol" size="sm">
                Ingénieur
              </Badge>
            )}

            {hasFilieres && hasDisciplines && (
              <span className="info-card__separator">•</span>
            )}
            {!hasFilieres && hasCursus && hasDisciplines && (
              <span className="info-card__separator">•</span>
            )}

            {data.has_effectif_dsa && (
              <Badge color="green-emeraude" size="sm">
                Droit Sciences Éco AES
              </Badge>
            )}
            {data.has_effectif_llsh && (
              <Badge color="pink-tuile" size="sm">
                Lettres Langues SHS
              </Badge>
            )}
            {data.has_effectif_theo && (
              <Badge color="purple-glycine" size="sm">
                Théologie
              </Badge>
            )}
            {data.has_effectif_si && (
              <Badge color="orange-terre-battue" size="sm">
                Sciences et Ingénierie
              </Badge>
            )}
            {data.has_effectif_staps && (
              <Badge color="green-menthe" size="sm">
                STAPS
              </Badge>
            )}
            {data.has_effectif_veto && (
              <Badge color="green-archipel" size="sm">
                Vétérinaire
              </Badge>
            )}
            {data.has_effectif_interd && (
              <Badge color="pink-macaron" size="sm">
                Interdisciplinaire
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
