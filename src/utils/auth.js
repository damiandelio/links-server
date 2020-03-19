import { sign } from "jsonwebtoken";

// returns an access token
export const createAccessToken = user => {
  return sign({ user: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "6h",
    algorithm: "HS512"
  });
};

// returns an acces token for cookies
/*
export const createRefreshToken = user => {
  return sign({ user: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
    algorithm: "HS512"
  });
};
*/
