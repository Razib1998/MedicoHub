import jwt, { JwtPayload, Secret } from "jsonwebtoken";
export const tokenGenerator = (
  tokenData: any,
  tokenSecret: string,
  expiresIn: string
) => {
  const token = jwt.sign(tokenData, tokenSecret, {
    algorithm: "HS256",
    expiresIn,
  });
  return token;
};
export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
