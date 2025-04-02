import { Request, Response, NextFunction } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const { cookie } = req.headers;

  if (!cookie) throw res.status(401).json({ message: "token is required" });

  const splitCookieToken = cookie.split("=");

  if (splitCookieToken[0] != "token" || splitCookieToken.length != 2) {
    throw res.status(401).json({ message: "badly formatted token" });
  }

  console.log(splitCookieToken[1]);

  verify(splitCookieToken[1], process.env.SECRET_TOKEN, (error, decoded) => {
    if (error) throw res.status(401).json({ message: error.message || "invalid token" });

    const { id } = decoded as JwtPayload;
    req.userID = id;

    return next();
  });
}
