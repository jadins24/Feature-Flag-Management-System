import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-prod';
const JWT_EXPIRY = process.env.JWT_EXPIRATION || '24h';

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn: JWT_EXPIRY } as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & JwtPayload;
  return {
    userId: decoded.userId,
    role: decoded.role,
    orgId: decoded.orgId,
  };
}
