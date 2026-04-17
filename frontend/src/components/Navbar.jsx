import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const cartCount = cartItems?.reduce((acc, item) => acc + item.qty, 0) || 0;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-primary flex items-center">
          <span className="mr-2">🥑</span> FreshGrocer
        </Link>
        <div className="flex space-x-6 items-center">
          {user?.role !== 'admin' && (
            <>
              <Link to="/products" className="text-gray-600 hover:text-primary transition-colors">Products</Link>
              <Link to="/cart" className="relative text-gray-600 hover:text-primary transition-colors">
                <FiShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center text-gray-700 font-medium hover:text-primary transition gap-1">
                <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="ml-1 hidden md:block">Hi, {user.name}</span>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">Admin</Link>
              )}
              <button onClick={handleLogout} className="text-red-500 hover:text-red-700 transition" title="Logout">
                <FiLogOut size={22} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center text-gray-600 hover:text-primary transition-colors">
              <FiUser size={24} />
              <span className="ml-1">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
