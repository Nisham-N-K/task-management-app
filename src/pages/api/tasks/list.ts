import type { NextApiRequest, NextApiResponse } from "next";
import { getTasks } from "../../../controllers/taskController";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return getTasks(req, res);
  }
  res.status(405).json({ error: "Method not allowed" });
}
