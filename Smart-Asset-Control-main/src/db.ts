// src/db.ts
import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Quando um cliente conectar, já sete as variáveis RLS
pool.on('connect', async (client: PoolClient) => {
  // Esses valores você deve atribuir no seu middleware de auth, por ex:
  // client.tenantId = req.tenant_id;
  // client.userId   = req.user.id;
  // client.userRole = req.user.role;
  //
  // Aqui usamos 0 ou string vazia como default caso não tenha sido setado.
  const tenantId = (client as any).tenantId ?? 0;
  const userId   = (client as any).userId   ?? 0;
  const userRole = (client as any).userRole ?? '';

  try {
    await client.query(`SET app.tenant_id = $1`, [tenantId]);
    await client.query(`SET app.user_id    = $1`, [userId]);
    await client.query(`SET app.user_role  = $1`, [userRole]);
  } catch {
    // ignore se a setting ainda não existir
  }
});

