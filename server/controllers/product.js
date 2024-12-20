// // server/controllers/product.js
const  cloudinary  = require('../helpers/cloudinary');
const Product = require('../models/Product');
const fs = require("fs");
const { formatDateTime } = require('../utils');
// const Search = require('../utils/libs/search.min');

exports.createProduct = async (req, res) => {
  try {
    // const imagePath = req.file.path;
    let cloudinaryResponse;
    const { name, description, startingBid, minBidAmount } = req.body;
    const imagePath = req.file ? req.file.path : null;
    console.log('request recieved', req.body);

    if(imagePath){
     cloudinaryResponse = await cloudinary.uploader.upload(imagePath);
    }
    const newProduct = new Product({
      name,
      description,
      startingBid,
      minBidAmount,
      imageUrl: cloudinaryResponse.secure_url,
      // userId: req.user.email,
    });
    const savedProduct = await newProduct.save();
    console.log('Product saved successfully'); // Log success

    res.status(201).json(savedProduct);
    fs.unlinkSync(req.file.path);
    console.log(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// New function to handle placing bids
exports.placeBid = async (req, res) => {
  const { productId } = req.params;
  const { bidderName, bidAmount } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.bidHistory.push({ bidderName, bidAmount });

    await product.save();
    console.log('Bid placed successfully:', { bidderName, bidAmount });

    res.status(200).json({ message: 'Bid placed successfully' });
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getBidHistory = async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product.bidHistory);
  } catch (error) {
    console.error('Error fetching bid history:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getInventoryForUser = async (req, res) => {
  try {
    const userEmail = req.user.email; // Assuming you have stored user information in the request object after authentication
    const inventory = await Product.find({ userEmail });

    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory for user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateProduct = async (req, res) => {
  const { productId } = req.params;
  const { name, startingBid, minBidAmount } = req.body;

  try {
    // Find the product by productId
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update product details
    product.name = name;
    product.startingBid = startingBid;
    product.minBidAmount = minBidAmount;

    // Save the updated product
    await product.save();

    res
      .status(200)
      .json({
        message: 'Product updated successfully',
        updatedProduct: product,
      });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
