import { SegmentedControl as SegmentedControlDSFR, SegmentedElement } from "@dataesr/dsfr-plus";
import { isInProduction } from "../../../../utils";

import { useId } from 'react';

export default function SegmentedControl({ selectedControl, setSelectedControl }: { selectedControl: string, setSelectedControl: Function }) {
  const controls = [
    { field: 'projects', label: 'Nombre de projets financés' },
    { field: 'amount_global', label: 'Montant global (présence)' },
  ];
  const id = useId();

  if (!isInProduction()) {
    controls.push({ field: 'amount_by_structure', label: 'Montant alloué (implication)' });
  }

  return (
    <SegmentedControlDSFR name={`fundings-segmented-${id}`}>
      {controls.map((control) => (
        <SegmentedElement
          checked={selectedControl === control.field}
          label={control.label}
          onClick={() => setSelectedControl(control.field)}
          value={control.field}
        />
      ))}
    </SegmentedControlDSFR>
  )
}
