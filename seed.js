import 'dotenv/config';
import { connectDatabase } from './config/database.js';
import Product from './models/Product.js';

const samples = [
  { name: 'Everyday Backpack', description: 'A lightweight carry-all with room for work, class, and weekend plans.', price: 48, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80', stock: 20 },
  { name: 'Studio Headphones', description: 'Comfortable over-ear sound for focused study sessions and commutes.', price: 79, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80', stock: 14 },
  { name: 'Ceramic Desk Set', description: 'A simple desk organizer to keep small essentials close at hand.', price: 26, imageUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80', stock: 30 }
];
await connectDatabase();
for (const product of samples) await Product.updateOne({ name: product.name }, { $setOnInsert: product }, { upsert: true });
console.log('Sample products are ready.');
process.exit(0);
