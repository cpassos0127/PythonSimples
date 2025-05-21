import { pool } from '../db';
import { ServiceOrderRecord } from './serviceOrderRepository';

export class ServiceOrderRepository {
  async findAllByTenant(
    tenantId: number,
    status?: string,
    limit = 20,
    offset = 0
  ): Promise<{ rows: ServiceOrderRecord[]; total: number }> {
    const client = await pool.connect();
    try {
      await client.query(`SET app.tenant_id = $1`, [tenantId]);
      const filter = status ? `AND status = $2` : '';
      const params = status
        ? [tenantId, status, limit, offset]
        : [tenantId, limit, offset];
      const sql = `
        WITH filt AS (
          SELECT * FROM ordens_servico WHERE tenant_id = $1 ${filter}
        ), cnt AS (
          SELECT COUNT(*) AS total FROM filt
        )
        SELECT f.*, c.total
        FROM filt f, cnt c
        ORDER BY data_criacao DESC
        LIMIT $${params.length - 1} OFFSET $${params.length}
      `;
      const result = await client.query(sql, params);
      return {
        rows: result.rows,
        total: parseInt(result.rows[0]?.total) || 0
      };
    } finally {
      client.release();
    }
  }

  async findById(id: number): Promise<ServiceOrderRecord | null> {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(
        'SELECT * FROM ordens_servico WHERE id = $1',
        [id]
      );
      return rows[0] ?? null;
    } finally {
      client.release();
    }
  }

  async create(
    tenantId: number,
    data: Partial<ServiceOrderRecord>
  ): Promise<ServiceOrderRecord> {
    const client = await pool.connect();
    try {
      await client.query(`SET app.tenant_id = $1`, [tenantId]);
      const insert = `
        INSERT INTO ordens_servico
          (tenant_id, equipamento_id, componente_id, ponto_medicao_id,
           data_criacao, data_execucao, responsavel_id, checklist_id,
           prioridade, status, data_fechamento, descricao)
        VALUES
          ($1, $2, $3, $4, NOW(), $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;
      const params = [
        tenantId,
        data.equipamento_id ?? null,
        data.componente_id ?? null,
        data.ponto_medicao_id ?? null,
        data.data_execucao ?? null,
        data.responsavel_id ?? null,
        data.checklist_id ?? null,
        data.prioridade ?? 0,
        data.status ?? 'aberta',
        data.data_fechamento ?? null,
        data.descricao ?? ''
      ];
      const { rows } = await client.query(insert, params);
      return rows[0];
    } finally {
      client.release();
    }
  }

  async update(
    id: number,
    data: Partial<ServiceOrderRecord>
  ): Promise<ServiceOrderRecord> {
    const client = await pool.connect();
    try {
      const sets: string[] = [];
      const params: any[] = [];
      let idx = 1;
      for (const [key, val] of Object.entries(data)) {
        sets.push(`${key} = $${idx}`);
        params.push(val);
        idx++;
      }
      params.push(id);
      const sql = `
        UPDATE ordens_servico
        SET ${sets.join(', ')}, atualizado_em = NOW()
        WHERE id = $${idx}
        RETURNING *;
      `;
      const { rows } = await client.query(sql, params);
      return rows[0];
    } finally {
      client.release();
    }
  }

  async delete(id: number): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query(`DELETE FROM ordens_servico WHERE id = $1`, [id]);
    } finally {
      client.release();
    }
  }
}

