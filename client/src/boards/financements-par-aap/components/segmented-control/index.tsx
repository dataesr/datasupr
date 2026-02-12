import { SegmentedControl as SegmentedControlDSFR, SegmentedElement } from "@dataesr/dsfr-plus";
import { isInProduction } from "../../../../utils";

export default function SegmentedControl({ selectedControl, setSelectedControl }: { selectedControl: string, setSelectedControl: Function }) {
  const controls = [
    { field: 'projects', label: 'Nombre de projets financés' },
    { field: 'amount_global', label: 'Montant global' },
  ];

  if (!isInProduction()) {
    controls.push({ field: 'amount_by_structure', label: 'Montant par établissement' });
  }

  return (
    <SegmentedControlDSFR name='financements-par-aap-segmented'>
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
