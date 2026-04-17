import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FiPlus } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product._id, 1);
  };

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden bg-gray-50 p-4 shrink-0 flex items-center justify-center">
          <img
            src={product.image || 'https://via.placeholder.com/150?text=Groceries'}
            alt={product.name}
            className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{product.category}</span>
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
          <div className="mt-auto flex items-center justify-between">
            <span className="text-xl font-extrabold text-gray-900">${product.price.toFixed(2)}</span>
            <button
              onClick={handleAddToCart}
              className="bg-primary/10 text-primary hover:bg-primary hover:text-white p-2 rounded-full transition-colors duration-200"
              title="Add to Cart"
            >
              <FiPlus size={20} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
