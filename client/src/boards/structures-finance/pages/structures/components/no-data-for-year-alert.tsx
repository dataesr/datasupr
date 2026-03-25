import { Container, Row, Col, Button } from "@dataesr/dsfr-plus";
import Breadcrumb from "../../../components/breadcrumb";
import Select from "../../../components/select";

interface NoDataForYearAlertProps {
    etablissementLib: string;
    selectedYear: string;
    availableYears: number[];
    onYearChange: (year: string) => void;
    onClearSelection: () => void;
}

export default function NoDataForYearAlert({
    etablissementLib,
    selectedYear,
    availableYears,
    onYearChange,
    onClearSelection,
}: NoDataForYearAlertProps) {
    return (
        <main>
            <Container fluid className="etablissement-selector__wrapper">
                <Container as="section">
                    <Row>
                        <Col>
                            <Breadcrumb
                                items={[
                                    { label: "Accueil", href: "/structures-finance/accueil" },
                                    { label: etablissementLib || "Établissement" },
                                ]}
                            />
                        </Col>
                    </Row>
                </Container>
                <Container className="fr-py-4w">
                    <Row gutters className="fr-grid-row--middle fr-mb-3w">
                        <Col xs="12" md="8">
                            <div className="fr-alert fr-alert--info">
                                <p>
                                    Aucune donnée disponible pour <strong>{etablissementLib}</strong> en <strong>{selectedYear}</strong>.
                                </p>
                            </div>
                        </Col>

                        <Col xs="12" md="4" className="text-right">
                            <div className="fr-mb-1w">
                                <Select
                                    label={selectedYear}
                                    icon="calendar-line"
                                    aria-label="Sélectionner une année disponible"
                                >
                                    <Select.Content>
                                        {availableYears.map((year) => (
                                            <Select.Option
                                                key={year}
                                                value={year.toString()}
                                                selected={selectedYear === year.toString()}
                                                onClick={() => onYearChange(year.toString())}
                                            >
                                                {year}
                                            </Select.Option>
                                        ))}
                                    </Select.Content>
                                </Select>
                            </div>
                            <Button
                                variant="tertiary"
                                icon="arrow-go-back-line"
                                iconPosition="left"
                                onClick={onClearSelection}
                            >
                                Changer d'établissement
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </main>
    );
}
