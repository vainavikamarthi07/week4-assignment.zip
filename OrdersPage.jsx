import { useEffect, useState } from 'react';
import { api } from '../api.js';
export default function OrdersPage() {
  const [orders, setOrders] = useState([]); const [message, setMessage] = useState('Loading your orders…');
  useEffect(() => { api('/api/orders/mine').then(rows => { setOrders(rows); setMessage(rows.length ? '' : 'You have not placed an order yet.'); }).catch(error => setMessage(error.message)); }, []);
  return <section className="panel"><p className="eyebrow">ORDER HISTORY</p><h1>Your orders</h1><p role="status" className="status">{message}</p><div className="orders-list">{orders.map(order => <article className="order-card" key={order._id}><div className="product-heading"><strong>Order {order._id.slice(-7)}</strong><span className={`order-status ${order.status}`}>{order.status}</span></div><p>{new Date(order.createdAt).toLocaleDateString()} · ${order.total.toFixed(2)}</p><ul>{order.items.map(item => <li key={item.product}>{item.name} × {item.quantity}</li>)}</ul></article>)}</div></section>;
}
