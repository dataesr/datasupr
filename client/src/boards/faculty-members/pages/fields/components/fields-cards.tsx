import { Link } from "@dataesr/dsfr-plus";

export default function FieldCardsGrid({ fields }) {
  const colors = [
    "#f5f5fe",
    "#e3f2fd",
    "#ede7f6",
    "#e8f5e9",
    "#fff3e0",
    "#fce4ec",
  ];

  return (
    <div
      className="fr-container"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "1rem",
      }}
    >
      {fields.map((field, idx) => {
        const color = colors[idx % colors.length];
        const initial = field.fieldLabel.charAt(0).toUpperCase();

        return (
          <Link
            key={field.field_id}
            href={`/personnel-enseignant/discipline/vue-d'ensemble/${field.field_id}`}
            title={`Voir les détails de ${field.fieldLabel}`}
            style={{
              backgroundColor: color,
              borderRadius: "12px",
              padding: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            }}
          >
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                color: "#000091",
                marginBottom: "0.5rem",
              }}
            >
              {initial}
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#1e1e1e",
              }}
            >
              {field.fieldLabel}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
