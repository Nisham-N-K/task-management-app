import type { NextApiRequest, NextApiResponse } from "next";
import { deleteTask } from "../../../controllers/taskController";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    return deleteTask(req, res);
  }
  res.status(405).json({ error: "Method not allowed" });
}
