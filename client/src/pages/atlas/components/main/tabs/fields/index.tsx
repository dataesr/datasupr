import { useParams } from "react-router-dom";

import OneField from './one';
import AllFields from "./all";

export function FieldsRouter() {
  const { idFiliere } = useParams();

  if (idFiliere) {
    return <OneField />
  }

  return <AllFields />
}