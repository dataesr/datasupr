import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

export async function getEmbeddings(inputs) {
  const embeddingsBatchResponse = await client.embeddings.create({
    model: "mistral-embed",
    inputs,
  });

  console.log("Embeddings:", embeddingsBatchResponse.data);
}

// Call the async function
// getEmbeddings().catch(console.error);
