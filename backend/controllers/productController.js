import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const products = await Product.find({ ...keyword });
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, category, description, image, stock } = req.body;

  const product = new Product({
    name,
    price,
    category,
    description,
    image: image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
    stock,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

export const updateProduct = async (req, res) => {
  const { name, price, description, image, category, stock } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.category = category;
    product.stock = stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};
