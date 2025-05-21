import { Request, Response } from 'express';
import { ServiceOrderService } from '../services/serviceOrderService';

const service = new ServiceOrderService();

export async function listServiceOrders(req: Request, res: Response) { /* ... */ }
export async function createServiceOrder(req: Request, res: Response) { /* ... */ }

export async function getServiceOrderById(req: Request, res: Response) {
  try {
    const tenantId = (req as any).tenant_id as number;
    const id = Number(req.params.id);
    const os = await service.getById(tenantId, id);
    if (!os) return res.status(404).json({ error: 'OS not found' });
    res.json(os);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateServiceOrder(req: Request, res: Response) {
  try {
    const tenantId = (req as any).tenant_id as number;
    const id = Number(req.params.id);
    const updated = await service.update(tenantId, id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteServiceOrder(req: Request, res: Response) {
  try {
    const tenantId = (req as any).tenant_id as number;
    const id = Number(req.params.id);
    await service.remove(tenantId, id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

