import { Button } from "@dataesr/dsfr-plus";
import axios from "axios";
import { ChangeEvent, useState } from "react";

const { VITE_APP_SERVER_URL } = import.meta.env;

export default function UploadVersion({
  dashboardId,
  collectionId,
  invalidateDashboardQueries,
}: {
  dashboardId: string;
  collectionId: string;
  invalidateDashboardQueries: () => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const reset = () => {
    setSelectedFile(undefined);
    setStatus("");
    setProgress(0);
  };

  const upload = () => {
    const formData = new FormData();
    if (selectedFile) {
      formData.append("file", selectedFile);
    } else {
      setStatus("Aucun fichier sélectionné");
      return;
    }
    formData.append("dashboardId", dashboardId);
    formData.append("collectionId", collectionId);

    axios
      .post(`${VITE_APP_SERVER_URL}/admin/upload-version`, formData, {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const pct = total ? Math.floor((loaded * 100) / total) : 0;
          setProgress(pct);
        },
      })
      .then(() => {
        setStatus("Upload terminé");
        invalidateDashboardQueries();
      })
      .catch((e) => {
        setStatus("Erreur lors de l'upload");
        console.error(e);
      });
  };

  function ProgressBar({ progress }) {
    return (
      <div
        style={{
          width: "100%",
          height: "10px",
          backgroundColor: "#b3b3b3",
          borderRadius: "5px",
          overflow: "hidden",
          marginTop: "10px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            backgroundColor: "#000091",
            borderRadius: "5px",
            textAlign: "center",
            lineHeight: "30px",
            color: "white",
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
          } else {
            setSelectedFile(undefined);
          }
        }}
      />
      <Button
        className="fr-mr-1w"
        icon="arrow-go-back-fill"
        onClick={reset}
        size="sm"
      >
        Reset
      </Button>
      <Button onClick={upload} size="sm" icon="upload-line">
        Envoi
      </Button>
      {progress > 0 && <ProgressBar progress={progress} />}
      {status && <div>{status}</div>}
    </div>
  );
}
