import Cart from '../models/Cart.js';

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
};

export const addToCart = async (req, res) => {
  const { productId, qty } = req.body;
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].qty = qty;
    } else {
      cart.items.push({ product: productId, qty });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart', error: err.message });
  }
};

export const removeItemFromCart = async (req, res) => {
  const { productId } = req.params;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = cart.items.filter((item) => item.product.toString() !== productId);
      await cart.save();
      const updatedCart = await Cart.findOne({ user: req.user._id }).populate('items.product');
      res.json(updatedCart);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove item', error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to clear cart', error: err.message });
  }
};
