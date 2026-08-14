import { MongoClient } from "mongodb";

// Pass a non-connected client — the adapter connects lazily as needed.
// Use a cached global in dev to survive HMR reloads.
function getClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Please add MONGODB_URI to .env.local");

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClient) {
      global._mongoClient = new MongoClient(uri);
    }
    return global._mongoClient;
  }
  return new MongoClient(uri);
}

export { getClient };
