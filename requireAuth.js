import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ message: 'Sign in to access this resource.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.userRole = payload.role || 'user';
    next();
  } catch {
    return res.status(401).json({ message: 'Your token is invalid or expired. Please sign in again.' });
  }
}
export function requireAdmin(req, res, next) {
  if (req.userRole !== 'admin') return res.status(403).json({ message: 'Admin access is required.' });
  next();
}
