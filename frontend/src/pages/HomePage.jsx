import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data.slice(0, 4)); // Get top 4 for home page
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (user && user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-green-100 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between border border-green-200 shadow-sm overflow-hidden relative">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary opacity-20 rounded-full blur-3xl"></div>
        <div className="md:w-1/2 z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Fresh Groceries,<br/><span className="text-primary">Delivered Fast.</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            Get your daily needs delivered right to your doorstep. Organic, fresh, and handpicked just for you.
          </p>
          <Link to="/products" className="inline-block bg-primary hover:bg-secondary text-white font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Shop Now
          </Link>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 relative z-10 flex justify-center">
          <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80" alt="Groceries Basket" className="rounded-2xl shadow-2xl object-cover h-64 md:h-80 border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500" />
        </div>
      </section>

      {/* Featured Categories */}
      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['Fruits', 'Vegetables', 'Dairy', 'Bakery'].map((cat, i) => (
             <div key={i} onClick={() => navigate(`/products?category=${cat}`)} className="bg-white p-6 rounded-2xl text-center shadow-sm hover:shadow-md border border-gray-100 transition-shadow cursor-pointer group">
               <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <span className="text-2xl text-primary">{i === 0 ? '🍎' : i === 1 ? '🥦' : i === 2 ? '🧀' : '🥖'}</span>
               </div>
               <h3 className="font-semibold text-gray-800">{cat}</h3>
             </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
          <Link to="/products" className="text-primary font-semibold hover:underline">View All →</Link>
        </div>
        
        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
