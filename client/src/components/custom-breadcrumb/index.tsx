import { useSearchParams, useLocation } from "react-router-dom";
import { Breadcrumb, Link } from "@dataesr/dsfr-plus";

export default function CustomBreadcrumb({ config }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const currentLang = searchParams.get("language") || "fr";
  const params = [...searchParams].map(([key, value]) => `${key}=${value}`).join("&");

  // Extraire la dernière partie de l'URL comme currentPage
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPage = pathSegments[pathSegments.length - 1] || "";
  const parent = pathSegments[pathSegments.length - 2] || "";

  return (
    <Breadcrumb className="fr-m-0 fr-mt-1w">
      <Link href="/">Accueil</Link>
      <Link href={`${config[parent].link}?${params}`}>{config[parent].label[currentLang]}</Link>
      <Link href={`${config[parent].link}?${params}`}>
        <strong>{config[currentPage].label[currentLang]}</strong>
      </Link>
    </Breadcrumb>
  );
}
