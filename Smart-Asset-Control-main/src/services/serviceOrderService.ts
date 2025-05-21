import { ServiceOrderRepository, ServiceOrderRecord } from '../repositories/serviceOrderRepository';

export class ServiceOrderService {
  constructor(private repo = new ServiceOrderRepository()) {}

  async list(opts: { tenantId: number; status?: string; page?: number; limit?: number }) {
    // ... mantém implementação anterior
  }

  async getById(tenantId: number, id: number) {
    const os = await this.repo.findById(id);
    if (!os || os.tenant_id !== tenantId) return null;
    return os;
  }

  async create(tenantId: number, data: Partial<ServiceOrderRecord>) {
    // ... mantém criação anterior
  }

  async update(tenantId: number, id: number, payload: Partial<ServiceOrderRecord>) {
    const os = await this.getById(tenantId, id);
    if (!os) throw new Error('OS not found');
    return this.repo.update(id, payload);
  }

  async remove(tenantId: number, id: number) {
    const os = await this.getById(tenantId, id);
    if (!os) throw new Error('OS not found');
    await this.repo.delete(id);
  }
}

