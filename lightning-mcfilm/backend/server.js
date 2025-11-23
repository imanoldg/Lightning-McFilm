import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movies.js';
import { syncDB } from './models/index.js';
import authRoutes from './routes/auth.js';
import swaggerUi from 'swagger-ui-express';

dotenv.config();
syncDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/movies', movieRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
import swaggerDocument from './swagger.js';
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('Lightning McFilm API⚡');
});
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});