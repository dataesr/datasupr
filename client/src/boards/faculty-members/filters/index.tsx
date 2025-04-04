import React from "react";

interface YearFilterProps {
  years: string[];
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const YearFilter: React.FC<YearFilterProps> = ({
  years,
  selectedYear,
  onYearChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onYearChange(event.target.value);
  };

  return (
    <div>
      <label htmlFor="year">Année :</label>
      <select id="year" value={selectedYear} onChange={handleChange}>
        <option value="">Toutes les années</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearFilter;
