import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import graphRouter from './routes/graph'; 


dotenv.config(); 

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use('/api/graph', graphRouter); 
app.use((err: any, req: any, res: any, next: any) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur http://localhost:${PORT}`));
