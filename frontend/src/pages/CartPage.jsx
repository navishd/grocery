import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { cartItems, getCartTotal, addToCart, removeFromCart, clearCart } = useCart();

  const handleUpdateQty = (productId, newQty) => {
    if (newQty < 1) return;
    addToCart(productId, newQty);
  };

  const handleRemove = (productId) => {
    if (window.confirm('Are you sure you want to remove this item?')) {
      removeFromCart(productId);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 flex flex-col items-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added any groceries yet.</p>
        <Link to="/products" className="bg-primary hover:bg-secondary text-white px-8 py-3 rounded-full font-semibold transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="w-full lg:w-2/3">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button onClick={clearCart} className="text-red-500 hover:text-red-700 text-sm font-semibold">Clear Cart</button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y overflow-hidden">
          {cartItems.map((item) => (
            <div key={item.product?._id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
              <img 
                src={item.product?.image || 'https://via.placeholder.com/150'} 
                alt={item.product?.name} 
                className="w-24 h-24 object-contain"
              />
              <div className="flex-grow text-center sm:text-left">
                <Link to={`/products/${item.product?._id}`} className="text-lg font-bold text-gray-800 hover:text-primary">
                  {item.product?.name}
                </Link>
                <div className="text-gray-500 text-sm">{item.product?.category}</div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded-lg">
                  <button onClick={() => handleUpdateQty(item.product?._id, item.qty - 1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                  <span className="px-3 font-semibold">{item.qty}</span>
                  <button onClick={() => handleUpdateQty(item.product?._id, item.qty + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                </div>
                <div className="text-lg font-bold w-24 text-right">
                  ${(item.product?.price * item.qty).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full lg:w-1/3">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)} items)</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>${(getCartTotal() + 5).toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="block text-center w-full bg-primary hover:bg-secondary text-white py-3 rounded-xl font-semibold transition text-lg mt-4">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
