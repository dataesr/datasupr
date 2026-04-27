import Select from "../../../structures-finance/components/select";

interface FilterOption {
    count: number;
    key: string;
    label: string;
}

interface OutcomesFilterSelectProps {
    emptyLabel?: string;
    hint?: string;
    id?: string;
    label: string;
    onSelect: (value: string | null) => void;
    options: FilterOption[];
    selectedKey: string | null;
}

export default function OutcomesFilterSelect({
    emptyLabel = "Ensemble",
    hint,
    id,
    label,
    onSelect,
    options,
    selectedKey,
}: OutcomesFilterSelectProps) {
    const selectedOption = options.find((o) => o.key === selectedKey);
    const triggerLabel = selectedOption?.label ?? emptyLabel;
    const groupId = id ?? `outcomes-filter-${label.replace(/\s+/g, "-").toLowerCase()}`;

    return (
        <div className="fr-select-group fr-mb-2w">
            <label className="fr-label" htmlFor={groupId}>
                {label}
                {hint ? <span className="fr-hint-text">{hint}</span> : null}
            </label>
            <Select
                aria-label={label}
                fullWidth
                label={triggerLabel}
                size="sm"
                title={label}
            >
                <Select.Option
                    value=""
                    selected={!selectedKey}
                    onClick={() => onSelect(null)}
                >
                    {emptyLabel}
                </Select.Option>
                {options.map((opt) => (
                    <Select.Option
                        key={opt.key}
                        value={opt.key}
                        selected={selectedKey === opt.key}
                        onClick={() => onSelect(opt.key)}
                    >
                        {opt.label} ({opt.count})
                    </Select.Option>
                ))}
            </Select>
        </div>
    );
}
