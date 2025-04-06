import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import prisma from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-not-for-production';

export interface UserSession {
  id: string;
  email: string;
  name: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function createSession(userId: string): Promise<string> {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  
  const expires = new Date();
  expires.setDate(expires.getDate() + 7);
  
  await prisma.session.create({
    data: {
      userId,
      expires,
      sessionToken: token,
    },
  });
  
  return token;
}

export async function getUserFromToken(token: string): Promise<UserSession | null> {
  try {
    const session = await prisma.session.findFirst({
      where: { sessionToken: token },
      include: { user: true },
    });
    
    if (!session || session.expires < new Date()) {
      return null;
    }
    
    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
  } catch (_) {
    return null;
  }
}

export async function getSessionFromRequest(req: NextRequest): Promise<UserSession | null> {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  
  const token = cookies['auth-token'];
  if (!token) return null;
  
  return getUserFromToken(token);
}

export async function removeSession(token: string): Promise<boolean> {
  try {
    await prisma.session.deleteMany({
      where: { sessionToken: token },
    });
    return true;
  } catch (_) {
    return false;
  }
}