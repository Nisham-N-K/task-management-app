import type { NextApiRequest, NextApiResponse } from "next";
import { createTask } from "../../../controllers/taskController";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return createTask(req, res);
  }
  res.status(405).json({ error: "Method not allowed" });
}
