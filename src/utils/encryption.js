import crypto from "crypto";

const key = process.env.ENCRYPTION_KEY; // mast by 32 bytes
const iv = process.env.ENCRYPTION_IV; // mast by 16 bytes

// encrypt a string
export const encryptStr = text => {
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};

// decrypt a string
export const decryptStr = text => {
  let encryptedText = Buffer.from(text, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
