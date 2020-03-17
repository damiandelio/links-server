import { sign } from "jsonwebtoken";

// returns an access token
const generateAccessToken = userId => {
  // PAYLOAD
  const payload = {
    user: userId
  };

  // SIGNING OPTIONS
  const signOptions = {
    expiresIn: "6h",
    algorithm: "HS512"
  };

  return sign(payload, process.env.SECRET_KEY, signOptions);
};

export default generateAccessToken;
