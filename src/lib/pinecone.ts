import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "@/lib/config";

let pineconeClient: Pinecone | null = null;

export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({ apiKey: config.pinecone.apiKey });
  }
  return pineconeClient;
}

export function getPineconeIndex() {
  return getPineconeClient().index(config.pinecone.indexName);
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
