import { useMemo } from "react";
import SecondaryNavigation from "../../../components/secondary-navigation";
import Select from "../../../components/select";
import { ViewType } from "../api";

interface SectionNavigationProps {
    activeSection: string;
    viewType: ViewType;
    years: string[];
    selectedYear: string;
    onSectionChange: (section: string) => void;
    onYearChange: (year: string) => void;
}

const ALL_NAV_ITEMS = [
    { id: "enseignants-chercheurs", label: "Enseignants-chercheurs" },
    { id: "enseignants-2nd-degre-arts-metiers", label: "Enseignants 2nd degré & Arts et Métiers" },
    { id: "enseignants-non-permanents", label: "Enseignants non permanents" },
    { id: "groupes-cnu", label: "Groupes CNU" },
    { id: "comparaison", label: "Positionnement" },
    { id: "evolutions", label: "Évolutions" },
];

const HIDDEN_SECTIONS: Partial<Record<ViewType, string[]>> = {
    discipline: ["typologie", "comparaison"],
};

export default function SectionNavigation({
    activeSection,
    viewType,
    years,
    selectedYear,
    onSectionChange,
    onYearChange,
}: SectionNavigationProps) {
    const navItems = useMemo(() => {
        const hidden = HIDDEN_SECTIONS[viewType] || [];
        return ALL_NAV_ITEMS.filter((item) => !hidden.includes(item.id));
    }, [viewType]);
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
                            value={year}
                            selected={selectedYear === year}
                            onClick={() => onYearChange(year)}
                        >
                            {year}
                        </Select.Option>
                    ))}
                </Select>
            }
        />
    );
}
