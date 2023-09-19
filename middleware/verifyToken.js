import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

export const verifyToken = (req, res, next) => {

  const token = req.headers.authorization || req.headers.Authorization;

  if (!token) res.status(404).json("No token found");
  else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json("You are unauthorized");
        return;
      } else req.decoded = decoded;
      next();
    });
  }
};
