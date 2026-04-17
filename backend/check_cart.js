import mongoose from 'mongoose';
import Cart from './models/Cart.js';
import Product from './models/Product.js'; // Need to register Product model
import dotenv from 'dotenv';

dotenv.config();

const checkCart = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const carts = await Cart.find({}).populate('items.product');
    console.log(JSON.stringify(carts, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkCart();
