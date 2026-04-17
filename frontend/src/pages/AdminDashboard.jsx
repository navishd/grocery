import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const [loadingStats, setLoadingStats] = useState(true);

  // New product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', price: 0, category: '', description: '', image: '', stock: 0
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchAllData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Fetch stats
        const usersReq = axios.get('/api/users', config).catch(() => ({ data: [] }));
        const productsReq = axios.get('/api/products');
        const ordersReq = axios.get('/api/orders', config);

        const [usersRes, productsRes, ordersRes] = await Promise.all([usersReq, productsReq, ordersReq]);
        
        setStats({
          users: usersRes.data.length,
          products: productsRes.data.length,
          orders: ordersRes.data.length,
        });
        
        setUsers(usersRes.data);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
        
        setLoadingStats(false);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
        setLoadingStats(false);
      }
    };
    fetchAllData();
  }, [user]);

  if (authLoading) return <Loader />;
  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  const handleDeleteProduct = async (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`/api/products/${id}`, config);
        setProducts(products.filter(p => p._id !== id));
        setStats({...stats, products: stats.products - 1});
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/orders/${id}/status`, { status }, config);
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/products', newProduct, config);
      setProducts([...products, data]);
      setStats({ ...stats, products: stats.products + 1 });
      setShowProductForm(false);
      setNewProduct({ name: '', price: 0, category: '', description: '', image: '', stock: 0 });
    } catch (err) {
      alert('Failed to create product');
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/upload', formData, config);
      setNewProduct({ ...newProduct, image: data.image });
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const renderContent = () => {
    if (loadingStats) return <Loader />;

    if (activeTab === 'dashboard') {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
              <h3 className="text-blue-800 font-bold mb-2">Total Users</h3>
              <p className="text-4xl font-extrabold text-blue-600">{stats.users}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
              <h3 className="text-green-800 font-bold mb-2">Total Products</h3>
              <p className="text-4xl font-extrabold text-green-600">{stats.products}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
              <h3 className="text-purple-800 font-bold mb-2">Total Orders</h3>
              <p className="text-4xl font-extrabold text-purple-600">{stats.orders}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Activity</h3>
            <p className="text-gray-500">Activity logs and charts will go here in future updates.</p>
          </div>
        </div>
      );
    }

    if (activeTab === 'products') {
      return (
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Manage Products</h2>
            <button 
              onClick={() => setShowProductForm(!showProductForm)}
              className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg font-bold transition"
            >
              {showProductForm ? 'Cancel' : '+ Add Product'}
            </button>
          </div>

          {showProductForm && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <h3 className="text-xl font-bold mb-4">Add New Item</h3>
              <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                  <input type="text" required className="border p-2 rounded focus:ring-2 focus:ring-primary outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
                  <input type="number" min="0" step="0.01" required className="border p-2 rounded focus:ring-2 focus:ring-primary outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Category (e.g. Fruits)</label>
                  <input type="text" required className="border p-2 rounded focus:ring-2 focus:ring-primary outline-none" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
                  <input type="number" min="0" step="1" required className="border p-2 rounded focus:ring-2 focus:ring-primary outline-none" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} />
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Product Photo</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" 
                      onChange={uploadFileHandler} 
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-secondary cursor-pointer"
                    />
                    {uploading && <span className="text-sm text-primary animate-pulse font-bold">Uploading...</span>}
                    {newProduct.image && !uploading && <span className="text-sm text-green-600 font-bold">✓ Uploaded Successfully</span>}
                  </div>
                  {newProduct.image && (
                    <div className="mt-2">
                      <img src={newProduct.image} alt="Preview" className="h-20 w-20 object-cover rounded-lg border shadow-sm" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1">Description</label>
                  <textarea required className="border p-2 rounded focus:ring-2 focus:ring-primary outline-none" rows="3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
                </div>
                <button type="submit" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-secondary transition md:col-span-2 mt-2">Save Product</button>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600">
                  <th className="p-4">ID</th>
                  <th className="p-4">NAME</th>
                  <th className="p-4">PRICE</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-500">{product._id.substring(0, 8)}...</td>
                    <td className="p-4 font-semibold text-gray-800">{product.name}</td>
                    <td className="p-4 text-gray-600">${product.price.toFixed(2)}</td>
                    <td className="p-4 text-gray-600">{product.category}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {products.length === 0 && <div className="p-6 text-center text-gray-500">No products found.</div>}
          </div>
        </div>
      );
    }

    if (activeTab === 'orders') {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Manage Orders</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600">
                   <th className="p-4">ID</th>
                   <th className="p-4">USER</th>
                   <th className="p-4">TOTAL</th>
                   <th className="p-4">STATUS</th>
                   <th className="p-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-500">{order._id.substring(0, 8)}...</td>
                    <td className="p-4 font-semibold text-gray-800">{order.user ? order.user.name : 'Unknown'}</td>
                    <td className="p-4 text-gray-600">${order.totalPrice.toFixed(2)}</td>
                    <td className="p-4">
                      {order.status === 'Delivered' ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">{order.status}</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">{order.status}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                       <select 
                         className="border border-gray-300 rounded p-1 text-sm mr-2"
                         value={order.status}
                         onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                       >
                         <option value="Pending">Pending</option>
                         <option value="Processing">Processing</option>
                         <option value="Shipped">Shipped</option>
                         <option value="Delivered">Delivered</option>
                         <option value="Cancelled">Cancelled</option>
                       </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orders.length === 0 && <div className="p-6 text-center text-gray-500">No orders found.</div>}
          </div>
        </div>
      );
    }

    if (activeTab === 'users') {
      return (
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gray-800">Manage Users</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600">
                  <th className="p-4">ID</th>
                  <th className="p-4">NAME</th>
                  <th className="p-4">EMAIL</th>
                  <th className="p-4">ROLE</th>
                  <th className="p-4 text-right">JOINED</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-500">{u._id.substring(0, 8)}...</td>
                    <td className="p-4 font-semibold text-gray-800">{u.name}</td>
                    <td className="p-4 text-gray-600">
                      <a href={`mailto:${u.email}`} className="text-primary hover:underline">{u.email}</a>
                    </td>
                    <td className="p-4">
                      {u.role === 'admin' ? (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Admin</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">User</span>
                      )}
                    </td>
                    <td className="p-4 text-right text-gray-500 text-sm">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && <div className="p-6 text-center text-gray-500">No users found.</div>}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-1/4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Panel</h2>
        <ul className="space-y-4 text-gray-600 font-medium">
          <li 
            onClick={() => setActiveTab('dashboard')} 
            className={`cursor-pointer transition px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50'}`}
          >
            Dashboard
          </li>
          <li 
            onClick={() => setActiveTab('products')} 
            className={`cursor-pointer transition px-4 py-2 rounded-lg ${activeTab === 'products' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50'}`}
          >
            Manage Products
          </li>
          <li 
            onClick={() => setActiveTab('orders')} 
            className={`cursor-pointer transition px-4 py-2 rounded-lg ${activeTab === 'orders' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50'}`}
          >
            Manage Orders
          </li>
          <li 
            onClick={() => setActiveTab('users')} 
            className={`cursor-pointer transition px-4 py-2 rounded-lg ${activeTab === 'users' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-gray-50'}`}
          >
            Manage Users
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="w-full md:w-3/4">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
