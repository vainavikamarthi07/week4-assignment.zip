import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AuthPage from './AuthPage.jsx';
import ShopPage from './ShopPage.jsx';
import CartPage from './CartPage.jsx';
import OrdersPage from './OrdersPage.jsx';
import AdminPage from './AdminPage.jsx';

function ProtectedRoute({ user, admin = false, children }) {
  if (!user) return <Navigate to="/account" replace/>;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace/>;
  return children;
}
export default function App() {
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem('week4-user') || 'null'); } catch { return null; } });
  const [cart, setCart] = useState(() => { try { return JSON.parse(localStorage.getItem('week4-cart') || '[]'); } catch { return []; } });
  const navigate = useNavigate();
  useEffect(() => { localStorage.setItem('week4-cart', JSON.stringify(cart)); }, [cart]);
  function addToCart(product) { setCart(current => { const found = current.find(item => item.productId === product._id); if (found?.quantity >= product.stock) return current; if (found) return current.map(item => item.productId === product._id ? {...item,quantity:item.quantity+1} : item); return [...current,{productId:product._id,name:product.name,price:product.price,imageUrl:product.imageUrl,stock:product.stock,quantity:1}]; }); }
  function onSignedIn(nextUser) { localStorage.setItem('week4-user', JSON.stringify(nextUser)); setUser(nextUser); }
  function signOut() { localStorage.removeItem('week4-token'); localStorage.removeItem('week4-user'); setUser(null); navigate('/'); }
  function onOrderPlaced() { navigate('/orders'); }
  return <div className="app-shell"><header className="topbar"><Link to="/" className="brand">good<span>things</span><small> everyday essentials</small></Link><nav><NavLink to="/">Shop</NavLink><NavLink to="/orders">Orders</NavLink>{user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}<NavLink to="/account">{user ? user.name : 'Sign in'}</NavLink><Link to="/cart" className="cart-link">Bag <span>{cart.reduce((total,item)=>total+item.quantity,0)}</span></Link></nav></header><main><Routes><Route path="/" element={<ShopPage onAdd={addToCart}/>}/><Route path="/account" element={<AuthPage onSignedIn={onSignedIn}/>}/><Route path="/cart" element={<CartPage cart={cart} setCart={setCart} user={user} onOrderPlaced={onOrderPlaced}/>}/><Route path="/orders" element={<ProtectedRoute user={user}><OrdersPage/></ProtectedRoute>}/><Route path="/admin" element={<ProtectedRoute user={user} admin><AdminPage/></ProtectedRoute>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes></main><footer><span>goodthings</span><span>Thoughtful essentials, simply chosen.</span><button className="text-button" onClick={signOut}>{user ? 'Sign out' : ''}</button></footer></div>;
}
