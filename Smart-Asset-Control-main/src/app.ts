import express from 'express';
import serviceOrderRoutes from './routes/serviceOrderRoutes';

const app = express();
app.use(express.json());

// Health-check rápido
app.get('/api/health', (_req, res) => {
  res.send('OK');
});

// Rotas de ServiceOrder
app.use('/api', serviceOrderRoutes);

export default app;



