export const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    isConfigured:
      !!process.env.OPENAI_API_KEY &&
      !process.env.OPENAI_API_KEY.startsWith("sk-YOUR") &&
      process.env.OPENAI_API_KEY !== "your_openai_api_key_here",
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY ?? "",
    indexName: process.env.PINECONE_INDEX_NAME ?? "portfolio-knowledge",
  },
  google: {
    placesApiKey: process.env.GOOGLE_PLACES_API_KEY ?? "",
    placeId: process.env.GOOGLE_PLACE_ID ?? "",
  },
  admin: {
    secret: process.env.ADMIN_SECRET ?? "dev-secret",
  },
} as const;
