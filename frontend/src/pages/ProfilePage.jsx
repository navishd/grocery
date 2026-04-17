import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  if (authLoading) return <Loader />;
  if (!user) return <Navigate to="/login" />;

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get('/api/orders/mine', config);
        setOrders(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, [user]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Profile Sidebar */}
      <div className="w-full md:w-1/4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-4xl mb-4">
            👤
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500 mb-2">{user.email}</p>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mt-2">{user.role}</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="w-full md:w-3/4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">My Order History</h2>
        
        {loading ? (
          <Loader />
        ) : orders.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
             <div className="text-5xl mb-4">📦</div>
             <p className="text-gray-500 text-lg">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-bold font-mono">{order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Placed On</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                   <div className="text-lg">
                      <span className="font-bold text-gray-800">Total: </span>
                      <span className="font-bold text-primary">${order.totalPrice.toFixed(2)}</span>
                   </div>
                   <div>
                      {order.status === 'Delivered' ? (
                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold text-sm tracking-wide">{order.status}</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-bold text-sm tracking-wide">{order.status}</span>
                      )}
                   </div>
                </div>

                {/* Items Summary */}
                <div className="bg-gray-50 rounded-xl p-4 gap-4 flex flex-col md:flex-row divide-x overflow-x-auto">
                   {order.orderItems.map((item, i) => (
                     <div key={i} className="flex items-center gap-3 px-4 first:pl-0 shrink-0">
                       <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-white rounded-lg p-1 border" />
                       <div className="text-sm">
                         <p className="font-bold text-gray-700">{item.name}</p>
                         <p className="text-gray-500">Qty: {item.qty} | ${(item.price * item.qty).toFixed(2)}</p>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
