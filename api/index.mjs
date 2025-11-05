import serverless from "serverless-http";
import app from "../server/server.js";  // your Express app (ESM export default)

export default serverless(app);         // <-- Vercel expects a default function
