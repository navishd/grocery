const Footer = () => {
  return (
    <footer className="bg-dark text-white py-8 mt-12 w-full">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-xl font-bold mb-4 text-primary">🥑 FreshGrocer</h3>
        <p className="text-gray-400 mb-6">Your daily fresh groceries delivered to your doorstep.</p>
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} FreshGrocer. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
