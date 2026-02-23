import { Text, Title } from "@dataesr/dsfr-plus";

interface AnalysesSectionWrapperProps {
  children: React.ReactNode;
}

export function AnalysesSectionWrapper({
  children,
}: AnalysesSectionWrapperProps) {
  return (
    <section
      id="section-analyses"
      aria-labelledby="section-analyses-title"
      className="section-container"
    >
      <div className="section-header fr-mb-4w">
        <Title
          as="h2"
          look="h5"
          id="section-analyses-title"
          className="section-header__title"
        >
          Analyses et évolutions
        </Title>
      </div>
      {children}
    </section>
  );
}

interface EmptyStateProps {
  icon?: string;
  message: string;
}

export function EmptyState({
  icon = "fr-icon-bar-chart-box-line",
  message,
}: EmptyStateProps) {
  return (
    <div className="fr-p-4w fr-background-alt--grey fr-grid-row fr-grid-row--center fr-grid-row--middle fr-py-10w">
      <div className="fr-text--center">
        <span
          className={`${icon} fr-icon--lg fr-text-mention--grey fr-mb-2w fr-displayed`}
          aria-hidden="true"
        />
        <Text className="fr-text-mention--grey fr-mb-0">{message}</Text>
      </div>
    </div>
  );
}
