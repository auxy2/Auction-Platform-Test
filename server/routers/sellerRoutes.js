const express = require('express');
const sellerController = require('../controllers/seller');
const authenticateToken = require('../middleware/auth');



const router = express.Router();

// Define the route to get the seller's inventory
router.get('/inventory', sellerController.getSellerInventory);

module.exports = router;
