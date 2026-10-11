import { Router } from 'express';
import Todo from '../models/Todo.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
router.use(requireAuth);
router.get('/', async (req, res, next) => {
  try {
    const filter = { user: req.userId };
    if (req.query.status === 'active') filter.completed = false;
    if (req.query.status === 'completed') filter.completed = true;
    res.json(await Todo.find(filter).sort({ createdAt: -1 }));
  } catch (error) { next(error); }
});
router.post('/', async (req, res, next) => {
  try {
    const title = String(req.body.title || '').trim();
    if (!title) return res.status(400).json({ message: 'Task title is required.' });
    res.status(201).json(await Todo.create({ user: req.userId, title }));
  } catch (error) { next(error); }
});
router.patch('/:id', async (req, res, next) => {
  try {
    const changes = {};
    if (typeof req.body.title === 'string' && req.body.title.trim()) changes.title = req.body.title.trim();
    if (typeof req.body.completed === 'boolean') changes.completed = req.body.completed;
    const todo = await Todo.findOneAndUpdate({ _id: req.params.id, user: req.userId }, changes, { new: true, runValidators: true });
    if (!todo) return res.status(404).json({ message: 'Task not found.' });
    res.json(todo);
  } catch (error) { next(error); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!todo) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted.' });
  } catch (error) { next(error); }
});
export default router;
