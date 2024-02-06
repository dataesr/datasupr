import { useState } from "react";
import { Button, TextInput } from "../../../../musical-octo-waddle/dist/index.js";

export default function QueriesCreator({ }) {
  const [queries, setQueries] = useState({});


  const addQuery = () => {
    console.log('addQuery() click');

  }

  return (
    <>
      <Button onClick={() => addQuery()}>Add query bloc</Button>
    </>
  );
}