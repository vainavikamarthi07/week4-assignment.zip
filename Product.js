import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 1000 },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, default: '' },
  stock: { type: Number, required: true, default: 0, min: 0 }
}, { timestamps: true });
export default mongoose.model('Product', productSchema);
