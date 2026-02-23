import { useMemo } from "react";
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
}

export default function ItemFilter({
  title,
  items,
  availableKeys,
  selectedKey,
  selectedCategory,
  onSelectItem,
  onSelectCategory,
}: ItemFilterProps) {
  const availableItems = useMemo(() => {
    return items.filter((item) => availableKeys.has(item.key));
  }, [items, availableKeys]);

  const categories = useMemo(() => {
    return [...new Set(availableItems.map((item) => item.category))];
  }, [availableItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return availableItems;
    return availableItems.filter((item) => item.category === selectedCategory);
  }, [availableItems, selectedCategory]);

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
    </aside>
  );
}
