import type { NextApiRequest, NextApiResponse } from "next";
import { updateTask } from "../../../controllers/taskController";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    return updateTask(req, res);
  }
  res.status(405).json({ error: "Method not allowed" });
}
