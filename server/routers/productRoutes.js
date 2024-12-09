// server/routes/productRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// const authMiddleware = require('../middleware/auth');
const productController = require('../controllers/product');
const authController = require("../controllers/auth")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });


const router = express.Router();

// router.use(authController.protect);
router.post('/create', upload.single('image'), productController.createProduct);

router.get('/getAll', productController.getAllProducts);

router.post('/:productId/place-bid', productController.placeBid);
router.get('/:productId/bid-history', productController.getBidHistory);

router.get('/inventory', productController.getAllProducts);
router.put('/update/:productId', productController.updateProduct);

module.exports = router;
