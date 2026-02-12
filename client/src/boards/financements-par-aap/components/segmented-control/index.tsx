import { SegmentedControl as SegmentedControlDSFR, SegmentedElement } from "@dataesr/dsfr-plus";

export default function SegmentedControl({ selectedControl, setSelectedControl }: { selectedControl: string, setSelectedControl: Function }) {
  const controls = [
    { field: 'budget', label: 'Montant global' },
    { field: 'projects', label: 'Nombre de projets financés' },
  ]

  return (
    <SegmentedControlDSFR name="financements-par-aap-segmented">
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
