import { Router } from 'express';
import {
  listServiceOrders,
  createServiceOrder,
  getServiceOrderById,
  updateServiceOrder,
  deleteServiceOrder
} from '../controllers/serviceOrderController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();
router.use('/os', authMiddleware);
router.get('/os', listServiceOrders);
router.post('/os', createServiceOrder);
router.get('/os/:id', getServiceOrderById);
router.put('/os/:id', updateServiceOrder);
router.delete('/os/:id', deleteServiceOrder);
export default router;
```"""

with open('/mnt/data/alteracoes_completas_backend.md', 'w', encoding='utf-8') as f:
    f.write(content)

'/mnt/data/alteracoes_completas_backend.md'

