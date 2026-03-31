import type { ReactNode } from "react";
import { Title } from "@dataesr/dsfr-plus";
import Select from "../select";
import "./styles.scss";

export interface FilterItem {
    key: string;
    label: string;
    category: string;
    hint?: string;
}

interface ItemFilterProps {
    title: string;
    items: FilterItem[];
    availableKeys: Set<string>;
    selectedKey: string | null;
    selectedCategory: string;
    onSelectItem: (key: string) => void;
    onSelectCategory: (category: string) => void;
    footer?: ReactNode;
}

export default function ItemFilter({
    title,
    items,
    availableKeys,
    selectedKey,
    selectedCategory,
    onSelectItem,
    onSelectCategory,
    footer,
}: ItemFilterProps) {
    const availableItems = items.filter((item) => availableKeys.has(item.key));
    const categories = [...new Set(availableItems.map((item) => item.category))];
    const filteredItems =
        selectedCategory === "all"
            ? availableItems
            : availableItems.filter((item) => item.category === selectedCategory);

    return (
        <aside className="item-filter" aria-label={title}>
            <Title as="h3" look="h6" className="fr-mb-1w">
                {title}
                <span className="item-filter__count">({availableKeys.size})</span>
            </Title>

            <Select label={selectedCategory} size="sm" fullWidth className="fr-mb-2w">
                {categories.map((cat) => (
                    <Select.Checkbox
                        key={cat}
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={() => onSelectCategory(cat)}
                    >
                        {cat}
                    </Select.Checkbox>
                ))}
            </Select>

            <fieldset className="item-filter__list-container">
                <legend className="fr-sr-only">Sélectionner un élément</legend>
                <div className="item-filter__list">
                    {filteredItems.map((item) => (
                        <button
                            key={item.key}
                            type="button"
                            aria-pressed={selectedKey === item.key}
                            onClick={() => onSelectItem(item.key)}
                            className={`item-filter__item ${selectedKey === item.key ? "item-filter__item--selected" : ""}`}
                        >
                            <span className="item-filter__item-label">{item.label}</span>
                            {item.hint && (
                                <span className="item-filter__item-hint">{item.hint}</span>
                            )}
                        </button>
                    ))}
                </div>
            </fieldset>

            {footer && (
                <div className="item-filter__footer">
                    {footer}
                </div>
            )}
        </aside>
    );
}
