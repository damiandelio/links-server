import { verify } from "jsonwebtoken";
import { decryptStr } from "./encryption";

const getUser = encryptedToken => {
  let payload, user;
  const key = process.env.ACCESS_TOKEN_SECRET; // secret key

  // if a token is defined in the header
  if (encryptedToken) {
    // decrypt token
    const token = decryptStr(encryptedToken);
    // try to retrieve the payload from the token
    payload = verify(token, key);
    // get user id
    user = payload.user;
  }

  return user;
};

export default getUser;
