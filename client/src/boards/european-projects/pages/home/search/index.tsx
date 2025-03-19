import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Checkbox,
  Col,
  Container,
  Row,
  TextInput,
} from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";

import {
  getDestinations,
  getFiltersValues,
  getPrograms,
  getThematics,
} from "../../../api";

import i18n from "./i18n.json";
import "./styles.scss";

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const [selectedPillars, setSelectedPillars] = useState<string[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedThematics, setSelectedThematics] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    []
  );

  const { data: dataPillars } = useQuery({
    queryKey: ["european-projects/get-filters-values", "pillars"],
    queryFn: () => getFiltersValues("pillars"),
  });

  const { data: dataPrograms } = useQuery({
    queryKey: ["european-projects/get-programs-from-pillars", selectedPillars],
    queryFn: () => getPrograms(selectedPillars),
  });

  const { data: dataThematics } = useQuery({
    queryKey: [
      "european-projects/get-thematics-from-programs",
      selectedPrograms,
    ],
    queryFn: () => getThematics(selectedPrograms),
  });

  const { data: dataDestinations } = useQuery({
    queryKey: [
      "european-projects/get-destinations-from-thematics",
      selectedThematics,
    ],
    queryFn: () => getDestinations(selectedThematics),
  });

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  return (
    <Container as="section" className="fr-mt-2w search">
      <div className="content">
        <Row>
          <Col>
            {getI18nLabel("pillars")}
            <div className="list-box pillars">
              <ul>
                {dataPillars?.map((pillar) => (
                  <li key={pillar.id}>
                    <Checkbox
                      label={pillar[`label_${currentLang}`]}
                      size="sm"
                      checked={selectedPillars.includes(pillar.id)}
                      onChange={() => {
                        setSelectedPillars((prev) =>
                          prev.includes(pillar.id)
                            ? prev.filter((p) => p !== pillar.id)
                            : [...prev, pillar.id]
                        );
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
        <Row className="fr-mt-3w">
          <Col>
            {getI18nLabel("programs")}
            <div className="list-box">
              <ul>
                {dataPrograms?.map((program) => (
                  <li key={program.id}>
                    <Checkbox
                      label={program[`label_${currentLang}`]}
                      size="sm"
                      checked={selectedPrograms.includes(program.id)}
                      onChange={() => {
                        setSelectedPrograms((prev) =>
                          prev.includes(program.id)
                            ? prev.filter((p) => p !== program.id)
                            : [...prev, program.id]
                        );
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col md={1} className="custom-gt">
            <span className="fr-icon-arrow-right-s-fill" aria-hidden="true" />
          </Col>
          <Col>
            {getI18nLabel("topics")}
            <div className="list-box">
              <ul>
                {dataThematics?.map((thematic) => (
                  <li key={thematic.id}>
                    <Checkbox
                      label={thematic[`label_${currentLang}`]}
                      size="sm"
                      checked={selectedThematics.includes(thematic.id)}
                      onChange={() => {
                        setSelectedThematics((prev) =>
                          prev.includes(thematic.id)
                            ? prev.filter((t) => t !== thematic.id)
                            : [...prev, thematic.id]
                        );
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col md={1} className="custom-gt">
            <span className="fr-icon-arrow-right-s-fill" aria-hidden="true" />
          </Col>
          <Col>
            {getI18nLabel("destinations")}
            <div className="list-box">
              <ul>
                {dataDestinations?.map((destination) => (
                  <li key={destination.id}>
                    <Checkbox
                      label={destination[`label_${currentLang}`]}
                      size="sm"
                      checked={selectedDestinations.includes(destination.id)}
                      onChange={() => {
                        setSelectedDestinations((prev) =>
                          prev.includes(destination.id)
                            ? prev.filter((d) => d !== destination.id)
                            : [...prev, destination.id]
                        );
                      }}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="explaination fr-pt-3w">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti
            maxime, at, voluptate mollitia qui eius quis inventore eveniet,
            rerum est temporibus ipsa!
          </Col>
          <Col md={3} className="text-right fr-pt-3w">
            <Button
              icon="delete-line"
              onClick={() => {
                setSelectedPillars([]);
                setSelectedPrograms([]);
                setSelectedThematics([]);
                setSelectedDestinations([]);
              }}
              variant="secondary"
            >
              {getI18nLabel("reset")}
            </Button>
            <Button
              icon="search-line"
              onClick={() => {
                const destinationsParam = selectedDestinations.length
                  ? `?destinations=${selectedDestinations.join(",")}`
                  : "";
                navigate(`/european-projects/synthese${destinationsParam}`);
              }}
            >
              {getI18nLabel("search")}
            </Button>
          </Col>
        </Row>

        <Row>
          <hr />
        </Row>

        <Row>
          <Col>
            {getI18nLabel("find-entity")}
            <TextInput placeholder={getI18nLabel("find-entity-placeholder")} />
          </Col>
          <Col md={3} className="text-right fr-mt-4w">
            <Button icon="delete-line" variant="secondary">
              {getI18nLabel("reset")}
            </Button>
            <Button icon="search-line">{getI18nLabel("search")}</Button>
          </Col>
        </Row>
      </div>
    </Container>
  );
}
