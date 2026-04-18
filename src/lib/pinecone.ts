import { Pinecone } from "@pinecone-database/pinecone";

let pineconeClient: Pinecone | null = null;

export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pineconeClient;
}

export function getPineconeIndex() {
  const client = getPineconeClient();
  return client.index(process.env.PINECONE_INDEX_NAME || "portfolio-knowledge");
}

export async function upsertVectors(
  vectors: Array<{
    id: string;
    values: number[];
    metadata: Record<string, string>;
  }>
) {
  const index = getPineconeIndex();
  await index.upsert({ records: vectors });
}

export async function queryVectors(
  embedding: number[],
  topK = 5
): Promise<Array<{ id: string; score: number; metadata: Record<string, string> }>> {
  const index = getPineconeIndex();
  const result = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });

  return (result.matches || []).map((match) => ({
    id: match.id,
    score: match.score ?? 0,
    metadata: (match.metadata as Record<string, string>) || {},
  }));
}
