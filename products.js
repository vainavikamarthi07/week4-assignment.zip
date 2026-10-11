import { Router } from 'express';
import Product from '../models/Product.js';
import { requireAdmin, requireAuth } from '../middleware/requireAuth.js';

const router = Router();
router.get('/', async (_req, res, next) => {
  try { res.json(await Product.find().sort({ createdAt: -1 })); }
  catch (error) { next(error); }
});
router.post('/', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const { name, description, price, imageUrl = '', stock = 0 } = req.body;
    if (!String(name || '').trim() || !String(description || '').trim()) return res.status(400).json({ message: 'Name and description are required.' });
    if (!Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(stock)) || Number(stock) < 0) return res.status(400).json({ message: 'Price and stock must be valid non-negative numbers.' });
    res.status(201).json(await Product.create({ name, description, price: Number(price), imageUrl, stock: Number(stock) }));
  } catch (error) { next(error); }
});
router.patch('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const changes = {};
    for (const key of ['name', 'description', 'imageUrl']) if (typeof req.body[key] === 'string') changes[key] = req.body[key].trim();
    if (req.body.price !== undefined) changes.price = Number(req.body.price);
    if (req.body.stock !== undefined) changes.stock = Number(req.body.stock);
    const product = await Product.findByIdAndUpdate(req.params.id, changes, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) { next(error); }
});
router.delete('/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (error) { next(error); }
});
export default router;
