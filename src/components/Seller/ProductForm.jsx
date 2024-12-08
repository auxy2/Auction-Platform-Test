import React, { useEffect, useRef, useState } from 'react';
import { Box, Container, InputAdornment, Button, TextField, FormControl, InputLabel, Input } from '@mui/material';
import { styled } from '@mui/system';
import { useSpring, animated } from 'react-spring';

const AnimatedCardContent = styled(animated.div)({
  overflow: 'hidden',
});

function ProductForm() {
  useEffect(() => {
    document.body.setAttribute('data-route', 'product-form');
    return () => {
      document.body.removeAttribute('data-route');
    };
  }, []);

  const [productData, setProductData] = useState({
    image: '',
    name: '',
    description: '',
    startingBid: '',
    paymentMethod: '',
    minBidAmount: '',
  });

  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);
  const imagePreviewRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');

    if (file && !['image/jpeg', 'image/png'].includes(file.type)) {
      setFileError('Invalid file type. Please upload a JPEG or PNG image.');
      fileInputRef.current.value = '';
      return;
    }

    if (file && file.size > 2 * 1024 * 1024) {
      setFileError('File size exceeds the 2MB limit.');
      fileInputRef.current.value = '';
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviewRef.current.src = e.target.result;
      };
      reader.readAsDataURL(file);
      setProductData((prevData) => ({ ...prevData, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productData.name || !productData.description || !productData.startingBid) {
      alert('Please fill in all required fields.');
      return;
    }

    if (isNaN(productData.startingBid) || productData.startingBid <= 0) {
      alert('Starting bid must be a positive number.');
      return;
    }

    if (productData.minBidAmount && (isNaN(productData.minBidAmount) || productData.minBidAmount <= 0)) {
      alert('Minimum bid amount must be a positive number.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', productData.image);
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('startingBid', productData.startingBid);
      formData.append('paymentMethod', productData.paymentMethod);
      formData.append('minBidAmount', productData.minBidAmount);

      

      const response = await fetch('http://localhost:9000/api/products/create', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        mode: 'cors',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        alert('Failed to create product. Please check your inputs.');
        return;
      }

      const data = await response.json();
      console.log('Product created:', data);

      setProductData({
        image: '',
        name: '',
        description: '',
        startingBid: '',
        paymentMethod: '',
        minBidAmount: '',
      });

      if (fileInputRef.current) fileInputRef.current.value = '';
      if (imagePreviewRef.current) imagePreviewRef.current.src = '';
    } catch (error) {
      console.error('Error creating product:', error);
      if (error instanceof TypeError && error.message.includes('JSON')) {
        alert(
          'The server did not return a valid JSON response. Please check the backend server.'
        );
      } else if (error.message) {
        alert(`An error occurred: ${error.message}`);
      } else {
        alert('An error occurred. Please try again.');
      }
    }
    
  };

  const props = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { duration: 500 },
  });

  const isFormValid =
    productData.name &&
    productData.description &&
    productData.startingBid &&
    !isNaN(productData.startingBid);

  return (
    <Container
      fixed
      maxWidth="xl"
      sx={{
        backgroundColor: 'rgba(255,255,255,0.7)',
        height: '90vh',
        mt: 5,
        border: '2px purple solid',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflowY: 'auto',
      }}
    >
      <animated.div style={props}>
        <AnimatedCardContent>
          <FormControl
            encType="multipart/form-data"
            variant="standard"
            onSubmit={handleSubmit}
          >
            <Box
              mb={2}
              sx={{
                marginX: 5,
                border: '1px grey solid',
                height: '200px',
                textAlign: 'center',
              }}
            >
              <img
                ref={imagePreviewRef}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            </Box>
            <InputLabel htmlFor="image">Upload Product Image</InputLabel>
            <Input
              id="image"
              type="file"
              accept=".jpg, .png"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {fileError && <p style={{ color: 'red' }}>{fileError}</p>}
            <TextField
              sx={{ marginTop: 2 }}
              variant="filled"
              label="Name of Product"
              name="name"
              value={productData.name}
              onChange={handleChange}
            />
            <TextField
              sx={{ marginTop: 2 }}
              variant="filled"
              label="Description"
              name="description"
              value={productData.description}
              onChange={handleChange}
              multiline
            />
            <TextField
              sx={{ marginTop: 2 }}
              variant="filled"
              label="Starting Bid Amount"
              name="startingBid"
              value={productData.startingBid}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
            <TextField
              sx={{ marginTop: 2 }}
              variant="filled"
              label="Minimum Bid Amount"
              name="minBidAmount"
              value={productData.minBidAmount}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
            <Button
              onClick={handleSubmit}
              type="submit"
              variant="contained"
              sx={{ marginTop: 5 }}
              disabled={!isFormValid}
            >
              Submit
            </Button>
          </FormControl>
        </AnimatedCardContent>
      </animated.div>
    </Container>
  );
}

export default ProductForm;
