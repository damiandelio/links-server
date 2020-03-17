import { verify } from "jsonwebtoken";
import { decryptStr } from "./encryption";

const getUser = encryptedToken => {
  let user;
  // secret key
  const key = process.env.ACCESS_TOKEN_SECRET;

  // if a token is defined in the header
  if (encryptedToken) {
    // decrypt token
    const token = decryptStr(encryptedToken);
    // try to retrieve a user id with the token
    user = verify(token, key).user;
  }

  return user;
};

export default getUser;
