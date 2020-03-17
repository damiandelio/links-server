import { verify } from "jsonwebtoken";
import { decryptToken } from "./generateAccessToken";

const getUser = encryptedToken => {
  let user;
  // secret key
  const key = process.env.SECRET_KEY || "";

  // if a token is defined in the header
  if (encryptedToken) {
    // decrypt token
    const token = decryptToken(encryptedToken);
    // try to retrieve a user id with the token
    user = verify(token, key).user;
  }

  return user;
};

export default getUser;
