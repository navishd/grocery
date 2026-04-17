import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '', city: '', postalCode: '', country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [loading, setLoading] = useState(false);

  // If no user or empty cart, redirect back
  if (!user) return <Navigate to="/login" />;
  if (cartItems.length === 0) return <Navigate to="/cart" />;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    const orderItems = cartItems
      .filter(item => item.product) // Only process items that still have valid product data
      .map(item => ({
        name: item.product?.name || 'Unknown Product',
        qty: item.qty,
        image: item.product?.image || '',
        price: item.product?.price || 0,
        product: item.product?._id,
      }));

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/orders', {
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice: getCartTotal() + 5, // including fixed $5 shipping
      }, config);
      
      await clearCart();
      setLoading(false);
      navigate('/profile'); // Redirect straight to profile to see the order
    } catch (error) {
      console.error(error);
      alert('Failed to place order.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-2/3">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h2>
        <form onSubmit={handlePlaceOrder} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <h3 className="text-xl font-bold text-gray-700">Shipping Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Street Address" required className="border p-3 rounded col-span-1 md:col-span-2 outline-none focus:ring-2 focus:ring-primary" value={shippingAddress.address} onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})} />
            <input type="text" placeholder="City" required className="border p-3 rounded outline-none focus:ring-2 focus:ring-primary" value={shippingAddress.city} onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} />
            <input type="text" placeholder="Postal Code" required className="border p-3 rounded outline-none focus:ring-2 focus:ring-primary" value={shippingAddress.postalCode} onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})} />
            <input type="text" placeholder="Country" required className="border p-3 rounded outline-none focus:ring-2 focus:ring-primary md:col-span-2" value={shippingAddress.country} onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})} />
          </div>

          <h3 className="text-xl font-bold text-gray-700 mt-4">Payment Method</h3>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer border p-4 rounded flex-1 hover:bg-gray-50">
              <input type="radio" value="PayPal" checked={paymentMethod === 'PayPal'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span className="font-semibold text-gray-800">PayPal / Cash on Delivery</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer border p-4 rounded flex-1 hover:bg-gray-50 text-gray-400">
              <input type="radio" value="Stripe" disabled />
              <span className="font-semibold">Credit Card (Coming Soon)</span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="mt-4 bg-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-secondary transition disabled:bg-gray-400 w-full">
            {loading ? 'Processing...' : 'Place Order Now'}
          </button>
        </form>
      </div>

      <div className="w-full md:w-1/3">
         <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-inner sticky top-24">
           <h3 className="text-xl font-bold mb-4">Final Summary</h3>
           <div className="divide-y text-sm mb-4">
             {cartItems.map(i => (
               <div key={i.product?._id} className="py-3 flex justify-between">
                 <span className="text-gray-600 truncate mr-2">{i.qty} x {i.product?.name}</span>
                 <span className="font-semibold">${(i.qty * i.product?.price).toFixed(2)}</span>
               </div>
             ))}
           </div>
           <div className="border-t border-gray-300 pt-4 flex flex-col gap-2 font-medium text-gray-600">
             <div className="flex justify-between"><span>Items</span> <span>${getCartTotal().toFixed(2)}</span></div>
             <div className="flex justify-between"><span>Shipping</span> <span>$5.00</span></div>
             <div className="flex justify-between font-bold text-2xl text-gray-900 mt-2"><span>Total</span> <span>${(getCartTotal() + 5).toFixed(2)}</span></div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
