// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import * as admin from 'firebase-admin';
import { pool } from '../db';

export interface AuthRequest extends Request {
  user: { id: number; role: string; uid: string };
  tenant_id: number;
}

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = (req.header('Authorization') || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    // supondo que você busque user.id e user.role do seu DB aqui:
    const userRecord = await getUserRecord(decoded.uid);

    req.user = { id: userRecord.id, role: userRecord.role, uid: decoded.uid };
    req.tenant_id = decoded.tenant_id;

    // injeta no próximo connect do pool
    // @ts-ignore
    (pool as any).tenantId = req.tenant_id;
    // @ts-ignore
    (pool as any).userId   = req.user.id;
    // @ts-ignore
    (pool as any).userRole = req.user.role;

    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}


