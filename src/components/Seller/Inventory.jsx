import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  Button,
  CardActions,
} from '@mui/material';
import UpdateProductForm from './UpdateProductForm';

const Inventory = () => {
  useEffect(() => {
    // Set the data-route attribute to 'auction' on component mount
    document.body.setAttribute('data-route', 'inventory');

    // Clean up on component unmount
    return () => {
      document.body.removeAttribute('data-route');
    };
  }, []);

  const [product, setProducts] = useState([]);
  const [isUpdateFormOpen, setUpdateFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Fetch product data from the server
    const fetchData = async () => {
      try {
        const response = await fetch(
          'http://localhost:9000/api/products/getAll'
        ); // Replace with your API endpoint
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch product data');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, []);

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setUpdateFormOpen(true);
  };

  const handleCloseUpdateForm = () => {
    setUpdateFormOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdateProduct = async (productId, updatedProductDetails) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/products/update/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedProductDetails),
        }
      );

      if (response.ok) {
        // If the update is successful, fetch the updated product list
        const updatedProducts = await fetch(
          'http://localhost:9000/api/products/getAll'
        ).then((res) => res.json());
        setProducts(updatedProducts);
      } else {
        console.error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <Container sx={{ mt: 11, mb: 2 }}>
      <Grid container spacing={2}>
        {product.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={product._id}>
            <Card>
              <CardMedia
                component="img"
                // Check if the image URL is an external link (Cloudinary URL)
                image={product.imageUrl.startsWith('http') ? product.imageUrl : `http://localhost:9000/${product.imageUrl}`}
                alt={product.title}
                sx={{
                  height: 200, // Set a fixed height for the image
                  objectFit: 'cover', // Ensure the image covers the box without stretching
                }}
              />
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2">
                  Starting Price of Product: ${product.startingBid}{' '}
                </Typography>
                <Typography variant="body2">
                  Minimum Bid you can offer: ${product.minBidAmount}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="outlined"
                  onClick={() => handleUpdateClick(product)}
                >
                  Modify Product
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedProduct && (
        <UpdateProductForm
          open={isUpdateFormOpen}
          handleClose={handleCloseUpdateForm}
          product={selectedProduct}
          updateProduct={handleUpdateProduct}
        />
      )}
    </Container>
  );
};

export default Inventory;
