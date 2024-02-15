import dotenv from "dotenv";
import { app } from './server.ts';
import { createDefaultDb } from "./helpers.ts";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`This server is running at http://localhost:${PORT}`);
  createDefaultDb();
});