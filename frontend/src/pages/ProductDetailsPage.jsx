import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import Loader from '../components/Loader';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product._id, qty);
  };

  if (loading) return <Loader />;

  return (
    <div className="flex flex-col md:flex-row gap-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-50 rounded-2xl p-8">
        <img 
          src={product.image || 'https://via.placeholder.com/300'} 
          alt={product.name} 
          className="max-h-96 object-contain hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        <Link to="/products" className="text-gray-500 hover:text-primary mb-4 font-medium transition text-sm">
          ← Back to Products
        </Link>
        <span className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{product.category}</span>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
        <p className="text-2xl font-bold text-gray-800 mb-6">${product.price?.toFixed(2)}</p>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {product.description}
        </p>

        <div className="flex items-center gap-6 mb-8">
          <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden h-12">
            <button 
              onClick={() => setQty(qty > 1 ? qty - 1 : 1)} 
              className="px-4 h-full bg-gray-50 hover:bg-gray-100 font-bold text-gray-600 transition"
            >
              -
            </button>
            <span className="px-6 h-full flex items-center justify-center font-bold text-lg">{qty}</span>
            <button 
              onClick={() => setQty(qty + 1)} 
              className="px-4 h-full bg-gray-50 hover:bg-gray-100 font-bold text-gray-600 transition"
            >
              +
            </button>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="flex-grow bg-primary hover:bg-secondary text-white font-bold h-12 rounded-xl transition duration-300 shadow-md hover:shadow-lg flex justify-center items-center gap-2"
          >
            <span className="text-xl">🛒</span> Add to Cart
          </button>
        </div>

        <div className="text-sm text-gray-500 flex flex-col gap-2 border-t pt-6">
          <p>Status: <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
