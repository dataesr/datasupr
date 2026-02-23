import SecondaryNavigation from "../../../components/secondary-navigation";
import Select from "../../../components/select";

interface SectionNavigationProps {
  activeSection: string;
  years: number[];
  selectedYear: string;
  onSectionChange: (section: string) => void;
  onYearChange: (year: string) => void;
  data?: any;
}

export default function SectionNavigation({
  activeSection,
  years,
  selectedYear,
  onSectionChange,
  onYearChange,
  data,
}: SectionNavigationProps) {
  const showImplantations = data?.nb_sites > 1;
  const showErc = data?.is_erc === true;

  const navItems = [
    { id: "ressources", label: "Ressources" },
    { id: "sante-financiere", label: "Santé financière" },
    { id: "moyens-humains", label: "Moyens humains" },
    ...(showErc ? [{ id: "erc", label: "ERC" }] : []),
    { id: "diplomes-formations", label: "Diplômes et formations" },
    ...(showImplantations
      ? [{ id: "implantations", label: "Implantations" }]
      : []),
    { id: "positionnement", label: "Positionnement" },
    { id: "analyses", label: "Analyses et évolutions" },
  ];

  return (
    <SecondaryNavigation
      items={navItems}
      activeItem={activeSection}
      onItemChange={onSectionChange}
      rightContent={
        <Select
          label={selectedYear}
          icon="calendar-line"
          align="end"
          outline={false}
          size="sm"
          aria-label="Sélectionner une année"
        >
          {years.map((year) => (
            <Select.Option
              key={year}
              value={year.toString()}
              selected={selectedYear === year.toString()}
              onClick={() => onYearChange(year.toString())}
            >
              {year}
            </Select.Option>
          ))}
        </Select>
      }
    />
  );
}
