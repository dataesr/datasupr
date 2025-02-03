import {
  Button,
  Col,
  Container,
  Row,
  Text,
  TextArea,
  TextInput,
  Title,
} from "@dataesr/dsfr-plus";
import { useState, useRef } from "react";
import { FormData } from "../../../../types/atlas";

const { VITE_APP_SERVER_URL } = import.meta.env;

export default function Contact() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [fonction, setFonction] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);

  const isFormValid =
    name.trim() !== "" && email.trim() !== "" && message.trim() !== "";

  const validate = (data: FormData) => {
    const newErrors: Partial<FormData> = {};
    if (!data.name.trim()) {
      newErrors.name = "Ce champ est obligatoire";
    }
    if (!data.email.trim()) {
      newErrors.email = "Ce champ est obligatoire";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Email invalide";
    }
    if (!data.message.trim()) {
      newErrors.message = "Ce champ est obligatoire";
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMessage("");

    const formData: FormData = {
      message,
      email,
      name,
      fromApplication: "datasupr",
      extra: {
        subApplication: "atlas",
        fonction,
        organisation,
      },
    };

    const validationErrors = validate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      if (validationErrors.name && nameRef.current) {
        nameRef.current.focus();
      }
      return;
    }

    const response = await fetch(`${VITE_APP_SERVER_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setName("");
      setMessage("");
      setEmail("");
      setFonction("");
      setOrganisation("");
      setSuccess(true);

      if (nameRef.current) {
        nameRef.current.focus();
      }

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } else {
      setErrorMessage("Une erreur est survenue lors de l'envoi du message.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  return (
    <Container className="fr-mt-2w">
      <Title as="h1" look="h2">
        Envoyer un formulaire de contact
      </Title>

      {success && (
        <p role="alert" className="fr-alert fr-alert--success fr-mb-3w">
          Votre message a bien été envoyé !
        </p>
      )}

      {errorMessage && (
        <p role="alert" className="fr-alert fr-alert--error fr-mb-3w">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <Row gutters>
          <Col md="6">
            <TextInput
              ref={nameRef}
              className="fr-mt-3w"
              placeholder="Votre nom (obligatoire)"
              type="text"
              value={name}
              required
              label="Nom"
              disableAutoValidation
              onChange={(e) => setName(e.target.value)}
              message={errors.name}
              messageType={errors.name ? "error" : undefined}
            />
            <TextInput
              className="fr-mt-3w"
              placeholder="Votre fonction"
              label="Fonction"
              type="text"
              value={fonction}
              disableAutoValidation
              onChange={(e) => setFonction(e.target.value)}
            />
            <TextInput
              className="fr-mt-3w"
              placeholder="Votre organisation"
              label="Organisation"
              type="text"
              value={organisation}
              disableAutoValidation
              onChange={(e) => setOrganisation(e.target.value)}
            />
          </Col>
          <Col md="6">
            <TextInput
              className="fr-mt-3w"
              placeholder="Votre email (obligatoire)"
              label="Email"
              type="email"
              required
              value={email}
              disableAutoValidation
              onChange={(e) => setEmail(e.target.value)}
              message={errors.email}
              messageType={errors.email ? "error" : undefined}
            />
            <TextArea
              placeholder="Votre message (obligatoire)"
              value={message}
              required
              rows={5}
              label="Message"
              disableAutoValidation
              onChange={(e) => setMessage(e.target.value)}
              message={errors.message}
              messageType={errors.message ? "error" : undefined}
            />
          </Col>
        </Row>
        <Col style={{ textAlign: "right" }}>
          <Button className="fr-mt-3w" type="submit" disabled={!isFormValid}>
            Envoyer le message
          </Button>
          {!isFormValid && (
            <Text className="fr-mt-1w">
              Veuillez remplir tous les champs requis pour envoyer votre
              formulaire.
            </Text>
          )}
        </Col>
      </form>
    </Container>
  );
}
