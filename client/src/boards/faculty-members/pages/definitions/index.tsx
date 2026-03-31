import { Container, Row, Col, Title } from "@dataesr/dsfr-plus";
import Breadcrumb from "../../components/breadcrumb";

const definitions = [
    {
        title: "Personnel enseignant",
        definition:
            "Ensemble des personnes exerçant des fonctions d'enseignement dans l'enseignement supérieur, qu'elles soient titulaires ou non, et quel que soit leur statut (enseignant-chercheur, enseignant du second degré, etc.).",
    },
    {
        title: "Enseignant-chercheur (EC)",
        definition:
            "Catégorie de personnel qui assure à la fois des missions d'enseignement et de recherche. Elle regroupe principalement les professeurs des universités (PR) et les maîtres de conférences (MCF). Les enseignants-chercheurs sont des fonctionnaires titulaires.",
    },
    {
        title: "Professeurs des universités (PR)",
        definition:
            "Corps le plus élevé des enseignants-chercheurs, titulaires de l'Habilitation à diriger des recherches (HDR). Ils exercent des missions d'enseignement et de recherche.",
    },
    {
        title: "Maîtres de conférences (MCF)",
        definition:
            "Corps d'enseignants-chercheurs titulaires d'un doctorat, qui assurent des missions d'enseignement et de recherche.",
    },
    {
        title: "Enseignant du second degré affecté dans le supérieur",
        definition:
            "Personnel enseignant du second degré (agrégés, certifiés, professeurs de lycée professionnel, etc.) affecté dans un établissement d'enseignement supérieur. Ils sont titulaires mais ne sont pas enseignants-chercheurs.",
    },
    {
        title: "Permanent / Non permanent",
        definition:
            "Un personnel permanent est titulaire de son poste (fonctionnaire ou CDI). Cela inclut les enseignants-chercheurs (PR, MCF) et les enseignants du second degré affectés dans le supérieur. Un personnel non permanent occupe un poste temporaire (contractuel, ATER, vacataire, etc.).",
    },
    {
        title: "Statut : 3 catégories mutuellement exclusives",
        definition:
            "Le tableau de bord répartit les personnels enseignants en trois catégories exclusives : (1) Enseignants-chercheurs (PR + MCF), (2) Autres titulaires non enseignants-chercheurs (2nd degré, Arts et métiers), (3) Non permanents (contractuels, ATER, vacataires). Un enseignant-chercheur est par définition permanent, mais il n'est compté qu'une seule fois dans la catégorie « Enseignants-chercheurs ».",
    },
    {
        title: "Groupe CNU",
        definition:
            "Regroupement de sections du Conseil National des Universités (CNU) par grandes disciplines. Chaque groupe rassemble plusieurs sections CNU proches thématiquement.",
    },
    {
        title: "Section CNU",
        definition:
            "Instance disciplinaire du Conseil National des Universités correspondant à une spécialité scientifique ou disciplinaire. Chaque enseignant-chercheur est rattaché à une section CNU.",
    },
    {
        title: "Grande discipline",
        definition:
            "Catégorie large regroupant plusieurs groupes CNU et couvrant un champ disciplinaire étendu (Sciences, Droit-économie-gestion, Lettres et sciences humaines, Médecine, Pharmacie, Odontologie, Autres santé, Personnel des grands établissements, Non spécifiée).",
    },
    {
        title: "Établissement d'enseignement supérieur",
        definition:
            "Institution qui dispense un enseignement post-secondaire. Cela inclut les universités, les grandes écoles, les écoles d'ingénieurs, les écoles de commerce, etc.",
    },
    {
        title: "Habilitation à diriger des recherches (HDR)",
        definition:
            "Diplôme requis pour encadrer des doctorants et être candidat à un poste de professeur des universités. Il reconnaît un haut niveau scientifique.",
    },
    {
        title: "Doctorat",
        definition:
            "Le plus haut diplôme universitaire, obtenu après la soutenance d'une thèse. Il est généralement requis pour devenir maître de conférences.",
    },
    {
        title: "Corps d'enseignant-chercheur",
        definition:
            "Ensemble de fonctionnaires soumis à un même statut particulier. Les principaux corps sont ceux des professeurs des universités et des maîtres de conférences.",
    },
];

export default function DefinitionsPage() {
    return (
        <main role="main">
            <Container fluid className="fm-etablissement-selector__wrapper">
                <Container as="section">
                    <Row>
                        <Col>
                            <Breadcrumb
                                items={[
                                    { label: "Accueil", href: "/personnel-enseignant/accueil" },
                                    { label: "Définitions" },
                                ]}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Title as="h1" look="h3">
                                Définitions
                            </Title>
                            <p className="fr-text--lead fr-mb-4w">
                                Retrouvez les définitions des termes clés utilisés dans le
                                tableau de bord du personnel enseignant de l'enseignement
                                supérieur.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </Container>
            <Container className="fr-my-6w">
                <Row gutters>
                    {definitions.map(({ title, definition }) => (
                        <Col xs="12" md="6" key={title}>
                            <div className="fr-card fr-card--no-arrow fr-p-3w fr-mb-2w">
                                <Title as="h2" look="h5" className="fr-mb-1w">
                                    {title}
                                </Title>
                                <p className="fr-text--sm fr-mb-0">{definition}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </main>
    );
}
