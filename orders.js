import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { requireAdmin, requireAuth } from '../middleware/requireAuth.js';

const router = Router();
router.use(requireAuth);
router.post('/', async (req, res, next) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    if (!items.length) return res.status(400).json({ message: 'Your cart is empty.' });
    const normalized = new Map();
    for (const item of items) {
      const productId = String(item.productId || '');
      const quantity = Number(item.quantity);
      if (!mongoose.isValidObjectId(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 50) return res.status(400).json({ message: 'Cart has an invalid item or quantity.' });
      normalized.set(productId, (normalized.get(productId) || 0) + quantity);
    }
    const products = await Product.find({ _id: { $in: [...normalized.keys()] } });
    if (products.length !== normalized.size) return res.status(400).json({ message: 'One or more products are unavailable.' });
    const orderItems = [];
    let total = 0;
    for (const product of products) {
      const quantity = normalized.get(product.id);
      if (product.stock < quantity) return res.status(409).json({ message: `${product.name} does not have enough stock.` });
      orderItems.push({ product: product.id, name: product.name, price: product.price, quantity });
      total += product.price * quantity;
    }
    for (const item of orderItems) {
      const updated = await Product.findOneAndUpdate({ _id: item.product, stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } }, { new: true });
      if (!updated) return res.status(409).json({ message: `${item.name} stock changed. Please refresh your cart.` });
    }
    const order = await Order.create({ user: req.userId, items: orderItems, total: Number(total.toFixed(2)) });
    res.status(201).json(order);
  } catch (error) { next(error); }
});
router.get('/mine', async (req, res, next) => {
  try { res.json(await Order.find({ user: req.userId }).sort({ createdAt: -1 })); }
  catch (error) { next(error); }
});
router.get('/', requireAdmin, async (_req, res, next) => {
  try { res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 })); }
  catch (error) { next(error); }
});
router.patch('/:id/status', requireAdmin, async (req, res, next) => {
  try {
    const allowed = ['pending', 'processing', 'shipped', 'cancelled'];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: 'Choose a valid order status.' });
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json(order);
  } catch (error) { next(error); }
});
export default router;
