import { sign } from "jsonwebtoken";
import crypto from "crypto";

const key = "u㢉s80y㢓8A౨&h౨Ñ6gŸ㒔Ÿ"; // mas by 32 bytes
const iv = "uŸ౨♥Ñs8㒔"; // mast by 16 bytes

// returns an access token
export const generateAccessToken = userId => {
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

// encrypt a string
export const encryptToken = text => {
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};

// decrypt a string
export const decryptToken = text => {
  let encryptedText = Buffer.from(text, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
