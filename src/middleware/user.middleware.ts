import { tokenUtils } from "../utils/token.util";

export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"].split("Bearer ")[1];
  const verifyToken = tokenUtils.verify(token);
  if (!verifyToken.success) {
    return res.status(401).send(verifyToken);
  }
  return next();
};
