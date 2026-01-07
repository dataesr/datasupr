import { Row, Col, Title, Badge } from "@dataesr/dsfr-plus";
import Callout from "../../../../../../components/callout";
import CopyButton from "../../../../../../components/copy-button";
import CountrySelector from "../../../../../../components/country-selector/selector";
import FieldsMainCard from "../../../../../../components/cards/fields-main-card";

export default function Id4Components() {
  return (
    <Row gutters>
      <Col>
        <div id="id4">
          <Title as="h2" look="h4">
            Liste des composants communs
          </Title>
          <Callout>
            Voici la liste des composants réutilisables disponibles dans la bibliothèque de composants Datasupr&nbsp;:
            <ul className="components-list">
              <li>
                <Badge color="purple-glycine">BoardSuggestComponent</Badge>&nbsp;: composant de suggestion de tableaux de bord.
                <code>{`<BoardsSuggestComponent />`}</code>
              </li>
              <li>
                <Badge color="purple-glycine">Callout</Badge>&nbsp;: encadré d'information avec style visuel distinct.
                <Callout className="fr-mt-1w" colorFamily="blue-cumulus">
                  Exemple de Callout imbriqué pour démontrer la réutilisabilité du composant Callout à l'intérieur d'un autre Callout.
                </Callout>
                <code>
                  {`<Callout>
  Exemple de Callout imbriqué pour démontrer la réutilisabilité du composant Callout à l'intérieur d'un autre Callout.
</Callout>`}
                </code>
              </li>
              <li>
                <Badge color="purple-glycine">ChartFooter</Badge>&nbsp;: pied de page des graphiques avec informations de source et date.
                <code>
                  {`<ChartFooter
  comment={{ fr: <>Commentaire en français</>, en: <>Commentaire en anglais</> }}
  readingKey={{ fr: <>Clé de lecture en français</>, en: <>Clé de lecture en anglais</> }}
  source=Source des données
  updateDate=Date de mise à jour
/>`}
                </code>
              </li>
              <li>
                <Badge color="purple-glycine">ChartWrapper</Badge>&nbsp;: composant d'encapsulation des graphiques avec gestion des options, de la
                légende et du rendu tableau.
                <br />
                <code>
                  {`<ChartWrapper
  config={config}
  legend={null}
  options={options(data, currentLang)}
  renderData={() => renderDataTable(data, currentLang)}
/>`}
                </code>
              </li>
              <li>
                <Badge color="purple-glycine">Cookies</Badge>&nbsp;: composant de gestion des cookies et consentement.
              </li>
              <li>
                <Badge color="purple-glycine">CopyButton</Badge>&nbsp;: bouton de copie dans le presse-papier.
                <br />
                <CopyButton text="Texte à copier" />
                <br />
                <code>{`<CopyButton textToCopy="Texte à copier" />`}</code>
              </li>
              <li>
                <Badge color="purple-glycine">CountrySelector</Badge>&nbsp;: sélecteur de pays avec recherche.
                <br />
                <CountrySelector />
                <br />
                <code>{`<CountrySelector />`}</code>
              </li>
              <li>
                <Badge color="purple-glycine">CustomBreadcrumb</Badge>&nbsp;: fil d'Ariane personnalisé pour la navigation.
              </li>
              <li>
                <Badge color="purple-glycine">FieldsMainCard</Badge>&nbsp;: carte d'affichage des filières principales.
                <br />
                <FieldsMainCard
                  descriptionNode={<Badge color="yellow-tournesol">description ...</Badge>}
                  number={12}
                  label="Nombre de filières représentées sur le territoire"
                  to={`/atlas/effectifs-par-filiere}`}
                />
                <br />
                <code>
                  {`<FieldsMainCard
  descriptionNode={<Badge color="yellow-tournesol">description ...</Badge>}
  number={12}
  label="Nombre de filières représentées sur le territoire"
  to={/atlas/effectifs-par-filiere}
/>`}
                </code>
              </li>
              <li>
                <Badge color="purple-glycine">FilieresList</Badge>&nbsp;: liste des filières avec recherche et filtrage.
              </li>
              <li>
                <Badge color="purple-glycine">Filters</Badge>&nbsp;: composant de filtrage des données.
              </li>
              <li>
                <Badge color="purple-glycine">GendersCard</Badge>&nbsp;: carte d'affichage des statistiques par genre.
              </li>
              <li>
                <Badge color="purple-glycine">GenericCard</Badge>&nbsp;: carte générique réutilisable.
              </li>
              <li>
                <Badge color="purple-glycine">Map</Badge>&nbsp;: composant de carte géographique interactive.
              </li>
              <li>
                <Badge color="purple-glycine">NotFoundPage</Badge>&nbsp;: page 404 personnalisée.
              </li>
              <li>
                <Badge color="purple-glycine">QueriesCreator</Badge>&nbsp;: créateur de requêtes personnalisées.
              </li>
              <li>
                <Badge color="purple-glycine">RouterLink</Badge>&nbsp;: composant de lien de navigation.
              </li>
              <li>
                <Badge color="purple-glycine">ScrollToTop</Badge>&nbsp;: composant de remontée automatique en haut de page.
              </li>
              <li>
                <Badge color="purple-glycine">SectorsCard</Badge>&nbsp;: carte d'affichage des statistiques par secteur.
              </li>
              <li>
                <Badge color="purple-glycine">StudentsCard</Badge>&nbsp;: carte d'affichage des statistiques étudiantes.
              </li>
              <li>
                <Badge color="purple-glycine">StudentsCardWithTrend</Badge>&nbsp;: carte d'affichage des statistiques étudiantes avec tendance.
              </li>
              <li>
                <Badge color="purple-glycine">SwitchTheme</Badge>&nbsp;: composant de changement de thème (clair/sombre).
              </li>
              <li>
                <Badge color="purple-glycine">Template</Badge>&nbsp;: composant template de base.
              </li>
            </ul>
          </Callout>
        </div>
      </Col>
    </Row>
  );
}
