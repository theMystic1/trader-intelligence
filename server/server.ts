import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URL!;
const DB_NAME = process.env.MONGODB_DB;

if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");

type Cached = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const cached: Cached = (global as any)._mongooseCached ?? {
  conn: null,
  promise: null,
};
(global as any)._mongooseCached = cached;

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }
  cached.conn = await cached.promise;

  return cached.conn;
}
