import { sign } from "jsonwebtoken";

const generateAccessToken = (userId, userEmail) => {
  // PAYLOAD
  const payload = {
    user: userId
  };

  // SIGNING OPTIONS
  const signOptions = {
    issuer: "MyLinks",
    subject: process.env.PUBLIC_URL,
    audience: userEmail,
    expiresIn: "6h",
    algorithm: "HS512"
  };

  return sign(payload, process.env.TOKEN_KEY, signOptions);
};

export default generateAccessToken;
