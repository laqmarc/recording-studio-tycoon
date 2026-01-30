import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import config from './config.js';

export async function hashPassword(password) {
  return argon2.hash(password, { type: argon2.argon2id });
}

export async function verifyPassword(hash, password) {
  return argon2.verify(hash, password);
}

export function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
}

export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret);
}
