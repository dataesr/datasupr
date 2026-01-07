import { Row, Col, Title, Badge } from "@dataesr/dsfr-plus";
import Callout from "../../../../../../components/callout";

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
            <ul>
              <li>
                <Badge color="purple-glycine">BoardSuggestComponent</Badge>&nbsp;: composant de suggestion de tableaux de bord.
              </li>
              <li>
                <Badge color="purple-glycine">Callout</Badge>&nbsp;: encadré d'information avec style visuel distinct.
              </li>
              <li>
                <Badge color="purple-glycine">ChartFooter</Badge>&nbsp;: pied de page des graphiques avec informations de source et date.
              </li>
              <li>
                <Badge color="purple-glycine">ChartWrapper</Badge>&nbsp;: composant d'encapsulation des graphiques avec gestion des options, de la
                légende et du rendu tableau.
              </li>
              <li>
                <Badge color="purple-glycine">ChartsSkeleton</Badge>&nbsp;: squelettes de chargement pour les graphiques.
              </li>
              <li>
                <Badge color="purple-glycine">Cookies</Badge>&nbsp;: composant de gestion des cookies et consentement.
              </li>
              <li>
                <Badge color="purple-glycine">CopyButton</Badge>&nbsp;: bouton de copie dans le presse-papier.
              </li>
              <li>
                <Badge color="purple-glycine">CountrySelector</Badge>&nbsp;: sélecteur de pays avec recherche.
              </li>
              <li>
                <Badge color="purple-glycine">CustomBreadcrumb</Badge>&nbsp;: fil d'Ariane personnalisé pour la navigation.
              </li>
              <li>
                <Badge color="purple-glycine">FieldsMainCard</Badge>&nbsp;: carte d'affichage des filières principales.
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
