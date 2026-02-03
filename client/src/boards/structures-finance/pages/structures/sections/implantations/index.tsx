import { Title } from "@dataesr/dsfr-plus";
import CardSimple from "../../../../../../components/card-simple";
import "../styles.scss";

interface ImplantationsSectionProps {
  data: any;
}

export function ImplantationsSection({ data }: ImplantationsSectionProps) {
  if (
    !data?.implantations ||
    !Array.isArray(data.implantations) ||
    data.implantations.length === 0
  ) {
    return null;
  }

  return (
    <section
      id="section-implantations"
      aria-labelledby="section-implantations-title"
      className="section-container"
    >
      <div className="section-header fr-mb-4w">
        <Title
          as="h2"
          look="h5"
          id="section-implantations-title"
          className="section-header__title"
        >
          Implantations géographiques
        </Title>
      </div>

      <ul className="fr-grid-row fr-grid-row--gutters" role="list">
        {data.implantations.map((implantation: any, index: number) => {
          const partEffectif = implantation.part_effectif_sans_cpge;
          const description = implantation.siege ? "Site principal" : "";
          const bottomText = partEffectif
            ? `${partEffectif.toFixed(1)} % de l'ensemble des étudiants inscrits`
            : undefined;

          return (
            <li
              key={implantation.implantation_id || index}
              className="fr-col-12 fr-col-md-6 fr-col-lg-4"
            >
              <CardSimple
                bottomText={bottomText}
                description={description}
                stat={implantation.effectif_sans_cpge}
                title={implantation.implantation}
                year={data.anuniv}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
