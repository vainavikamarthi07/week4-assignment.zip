import { useState } from 'react';
import styles from './ProductCard.module.css';

export default function ProductCard({ name, description, price, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  return <article className={styles.card}><p className={styles.label}>FEATURED PRODUCT</p><h2>{name}</h2><p>{description}</p><div className={styles.bottom}><strong>${price.toFixed(2)}</strong><button type="button" onClick={() => setLikes(count => count + 1)} aria-label={`Like ${name}`}>♡ {likes}</button></div></article>;
}
