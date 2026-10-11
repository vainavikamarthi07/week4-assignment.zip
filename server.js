import 'dotenv/config';
import app from './app.js';
import { connectDatabase } from './config/database.js';

const port = Number(process.env.PORT) || 5000;
if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing. Copy .env.example to .env and set a secret.');
await connectDatabase();
app.listen(port, '0.0.0.0', () => console.log(`API ready on port ${port}`));
