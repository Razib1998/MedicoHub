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
  try {
    const decoded = jwt.verify(token, secret);
    return decoded as JwtPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
