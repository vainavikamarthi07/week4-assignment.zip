import { Router } from 'express';
import Note from '../models/Note.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
router.use(requireAuth);
router.get('/', async (req, res, next) => {
  try { res.json(await Note.find({ user: req.userId }).sort({ updatedAt: -1 })); }
  catch (error) { next(error); }
});
router.post('/', async (req, res, next) => {
  try {
    const title = String(req.body.title || '').trim();
    if (!title) return res.status(400).json({ message: 'Note title is required.' });
    res.status(201).json(await Note.create({ user: req.userId, title, body: String(req.body.body || '') }));
  } catch (error) { next(error); }
});
router.patch('/:id', async (req, res, next) => {
  try {
    const changes = {};
    if (typeof req.body.title === 'string' && req.body.title.trim()) changes.title = req.body.title.trim();
    if (typeof req.body.body === 'string') changes.body = req.body.body;
    const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.userId }, changes, { new: true, runValidators: true });
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    res.json(note);
  } catch (error) { next(error); }
});
router.delete('/:id', async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found.' });
    res.json({ message: 'Note deleted.' });
  } catch (error) { next(error); }
});
export default router;
