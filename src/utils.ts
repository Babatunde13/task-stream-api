import { compare, genSalt, hash } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';

export const comparePasswordHash = (password: string, hash: string) =>
  compare(password, hash);

export const generatePasswordhash = async function (password: string) {
  const salt = await genSalt(10);
  return await hash(password, salt);
};

export const getJwtToken = function (data: object, expiry = '12h') {
  return sign({ ...data }, process.env.JWT_SECRET, { expiresIn: expiry });
};

export const verifyToken = function (token: string) {
  return verify(token, process.env.JWT_SECRET);
};
