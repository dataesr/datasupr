import { Title, Text } from "@dataesr/dsfr-plus";

interface PositionningSectionWrapperProps {
  children: React.ReactNode;
  structureName: string;
}

export function PositionningSectionWrapper({
  children,
  structureName,
}: PositionningSectionWrapperProps) {
  return (
    <section
      id="section-positionnement"
      aria-labelledby="section-positionnement-title"
      className="section-container"
    >
      <div className="section-header fr-mb-4w">
        <Title
          as="h2"
          look="h5"
          id="section-positionnement-title"
          className="section-header__title"
        >
          Positionnement de {structureName}
        </Title>
        <Text className="fr-text--sm fr-text-mention--grey">
          Comparez {structureName} avec d'autres établissements.
        </Text>
      </div>
      {children}
    </section>
  );
}
