import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function authMiddleware(handler: Function) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
      (req as any).user = decoded;
      return handler(req, res);
    } catch (err) {
      return res.status(401).json({ message: "Invalid Token" });
    }
  };
}
