import { Link } from "@dataesr/dsfr-plus";

export type NavigationInfoProps = {
  urlPath: string;
  plural: string;
  className?: string;
};

export default function NavigationInfo({
  urlPath,
  plural,
  className,
}: NavigationInfoProps) {
  return (
    <div
      className={
        "fr-alert fr-alert--info fr-mb-4w fr-mt-2w" +
        (className ? ` ${className}` : "")
      }
    >
      <div className="fr-alert__title">Navigation</div>
      <div>
        <Link href={`/personnel-enseignant/${urlPath}/vue-d'ensemble`}>
          ← Retour à la vue d'ensemble des {plural}
        </Link>
      </div>
    </div>
  );
}
