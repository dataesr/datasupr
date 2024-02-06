// import { useState } from "react";
import { Button } from "@dataesr/dsfr-plus";

export default function QueriesCreator() {
  // const [queries, setQueries] = useState({});


  const addQuery = () => {
    console.log('addQuery() click');

  }

  return (
    <>
      <Button onClick={() => addQuery()}>Add query bloc</Button>
    </>
  );
}