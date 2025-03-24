import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Badge,
  Button,
  Checkbox,
  Col,
  Container,
  Row,
  TextInput,
} from "@dataesr/dsfr-plus";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";

import {
  getAll,
  getDestinations,
  getFiltersValues,
  getPrograms,
  getThematics,
} from "../../api";

import i18n from "./i18n.json";
import "./styles.scss";

export default function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentLang = searchParams.get("language") || "fr";
  const selectedCountry = searchParams.get("country_code") || "FRA";
  const [selectedPillars, setSelectedPillars] = useState<string[]>([]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [selectedThematics, setSelectedThematics] = useState<string[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    []
  );

  const { data: dataPillars } = useQuery({
    queryKey: ["ep/get-filters-values", "pillars"],
    queryFn: () => getFiltersValues("pillars"),
  });

  const { data: allPrograms } = useQuery({
    queryKey: ["ep/get-all-programs"],
    queryFn: () => getAll("programs"),
  });

  const { data: allThematics } = useQuery({
    queryKey: ["ep/get-all-thematics"],
    queryFn: () => getAll("thematics"),
  });

  const { data: allDestinations } = useQuery({
    queryKey: ["ep/get-all-destinations"],
    queryFn: () => getAll("destinations"),
  });

  const { data: dataPrograms } = useQuery({
    queryKey: ["ep/get-programs-from-pillars", selectedPillars],
    queryFn: () => getPrograms(selectedPillars),
  });

  const { data: dataThematics } = useQuery({
    queryKey: ["ep/get-thematics-from-programs", selectedPrograms],
    queryFn: () => getThematics(selectedPrograms),
  });

  const { data: dataDestinations } = useQuery({
    queryKey: ["ep/get-destinations-from-thematics", selectedThematics],
    queryFn: () => getDestinations(selectedThematics),
  });

  useEffect(() => {
    if (dataPrograms) {
      setSelectedPrograms(dataPrograms.map((el) => el.id));
    }
  }, [dataPrograms]);

  useEffect(() => {
    if (dataThematics) {
      setSelectedThematics(dataThematics.map((el) => el.id));
    }
  }, [dataThematics]);

  useEffect(() => {
    if (dataDestinations) {
      setSelectedDestinations(dataDestinations.map((el) => el.id));
    }
  }, [dataDestinations]);

  function getI18nLabel(key) {
    return i18n[key][currentLang];
  }

  function CustomTitle({ target }) {
    if (target === "pillars") {
      return (
        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            {getI18nLabel("pillars")}
            <Badge className="fr-ml-1w fr-mb-1w" color="blue-cumulus" size="sm">
              {selectedPillars?.length} / {dataPillars?.length}
            </Badge>
          </span>
          <Button
            variant="text"
            size="sm"
            onClick={() =>
              setSelectedPillars(
                selectedPillars?.length === dataPillars?.length
                  ? []
                  : dataPillars?.map((p) => p.id)
              )
            }
          >
            {selectedPillars?.length === dataPillars?.length
              ? getI18nLabel("unselect")
              : getI18nLabel("select")}
          </Button>
        </span>
      );
    }

    if (target === "programs") {
      return (
        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            {getI18nLabel("programs")}
            <Badge className="fr-ml-1w fr-mb-1w" color="blue-cumulus" size="sm">
              {selectedPrograms?.length} / {allPrograms?.length}
            </Badge>
          </span>
          <Button
            variant="text"
            size="sm"
            onClick={() =>
              setSelectedPrograms(
                selectedPrograms?.length === allPrograms?.length
                  ? []
                  : allPrograms?.map((p) => p.id)
              )
            }
          >
            {selectedPrograms?.length === allPrograms?.length
              ? getI18nLabel("unselect")
              : getI18nLabel("select")}
          </Button>
        </span>
      );
    }

    if (target === "thematics") {
      return (
        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            {getI18nLabel("topics")}
            <Badge className="fr-ml-1w fr-mb-1w" color="blue-cumulus" size="sm">
              {selectedThematics?.length} / {allThematics?.length}
            </Badge>
          </span>
          <Button
            variant="text"
            size="sm"
            onClick={() =>
              setSelectedThematics(
                selectedThematics?.length === allThematics?.length
                  ? []
                  : allThematics?.map((t) => t.id)
              )
            }
          >
            {selectedThematics?.length === allThematics?.length
              ? getI18nLabel("unselect")
              : getI18nLabel("select")}
          </Button>
        </span>
      );
    }

    if (target === "destinations") {
      return (
        <span style={{ display: "flex", justifyContent: "space-between" }}>
          <span>
            {getI18nLabel("destinations")}
            <Badge className="fr-ml-1w fr-mb-1w" color="blue-cumulus" size="sm">
              {selectedDestinations?.length} / {allDestinations?.length}
            </Badge>
          </span>
          <Button
            variant="text"
            size="sm"
            onClick={() =>
              setSelectedDestinations(
                selectedDestinations?.length === allDestinations?.length
                  ? []
                  : allDestinations?.map((d) => d.id)
              )
            }
          >
            {selectedDestinations?.length === allDestinations?.length
              ? getI18nLabel("unselect")
              : getI18nLabel("select")}
          </Button>
        </span>
      );
    }
  }

  // Cookies.set('favoriteIds', newCookie);
  // Cookies.get("favoriteIds") || '';
  // Cookies.remove('favoriteIds');

  const searchFunction = () => {
    // Sauvegarde des selections dans les cookies
    Cookies.set("selectedPillars", selectedPillars.join("|"));
    Cookies.set("numberOfPillars", dataPillars.length);
    Cookies.set("selectedPrograms", selectedPrograms.join("|"));
    Cookies.set("numberOfPrograms", allPrograms.length);
    Cookies.set("selectedThematics", selectedThematics.join("|"));
    Cookies.set("numberOfThematics", allThematics.length);
    Cookies.set("selectedDestinations", selectedDestinations.join("|"));
    Cookies.set("numberOfDestinations", allDestinations.length);

    // Redirection vers la page de synthèse
    navigate(
      `/european-projects/synthese?country_code=${selectedCountry}&language=${currentLang}`
    );
  };

  return (
    <Container as="section" className="fr-mt-2w search">
      <div className="content">
        <Row>
          <Col>
            <CustomTitle target="pillars" />
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
            <CustomTitle target="programs" />
            <div className="list-box">
              <ul>
                {allPrograms?.map((program) => (
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
            <CustomTitle target="thematics" />
            <div className="list-box">
              <ul>
                {allThematics?.map((thematic) => (
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
            <CustomTitle target="destinations" />
            <div className="list-box">
              <ul>
                {allDestinations?.map((destination) => (
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
                searchFunction();
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
