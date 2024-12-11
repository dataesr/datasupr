import { Route, Routes, useParams } from "react-router-dom";

import AdminRoutes from "./pages/admin/routes.tsx";
import AtlasRoutes from "./pages/atlas/routes.tsx";
import EuropeanProjectsRoutes from "./pages/european-projects/routes.tsx";
import HomePage from "./pages/home-page.tsx";
import Integration from "./pages/integration/index.tsx";
import OpenAlexRoutes from "./pages/open-alex/routes.tsx";
import TedsRoutes from "./pages/teds/routes.tsx";
import FinanceUniversityRoutes from "./pages/finance-university/routes.tsx";
import { Button } from "@dataesr/dsfr-plus";
import { useState } from "react";

const { VITE_APP_TICKET_OFFICE_API_URL, VITE_APP_TICKET_OFFICE_BASIC_AUTH } =
  import.meta.env;

function Contact() {
  const { from } = useParams();

  const fromApp = "datasupr";
  const fromSubApp = from || "";
  const [name, setName] = useState("");
  const collectionName = "contact";
  const [message, setMessage] = useState("");

  const [email, setEmail] = useState("");

  const Sender = () => {
    const mesEntetes = new Headers();
    mesEntetes.append("Content-Type", "application/json");
    mesEntetes.append("Authorization", VITE_APP_TICKET_OFFICE_BASIC_AUTH);

    const body = {
      message,
      email,
      name,
      fromApp,
      fromSubApp,
      collectionName,
    };

    const monInit = {
      method: "POST",
      headers: mesEntetes,
      body: JSON.stringify(body),
    };

    const maRequete = new Request(VITE_APP_TICKET_OFFICE_API_URL);

    fetch(maRequete, monInit);
  };

  return (
    <div>
      <h1>Contact</h1>
      <p>Vous avez été redirigé depuis {from}</p>
      <form>
        <textarea
          className="fr-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          className="fr-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="fr-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button onClick={() => Sender()}>Envoyer</Button>
      </form>
    </div>
  );
}

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/atlas/*" element={<AtlasRoutes />} />
      <Route path="/european-projects/*" element={<EuropeanProjectsRoutes />} />
      <Route
        path="/finance-universite/*"
        element={<FinanceUniversityRoutes />}
      />
      <Route path="/integration" element={<Integration />} />
      <Route path="/open-alex/*" element={<OpenAlexRoutes />} />
      <Route path="/teds/*" element={<TedsRoutes />} />
      <Route path="*" element={<div>404 atlas</div>} />
      <Route path="/contact/:from" element={<Contact />} />
    </Routes>
  );
}
