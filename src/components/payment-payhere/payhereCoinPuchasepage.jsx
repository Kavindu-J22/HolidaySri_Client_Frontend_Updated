import React, { useState, useEffect } from 'react';
import md5 from 'crypto-js/md5';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Grid, Box, Button, Typography, Container, Card, CardContent } from '@mui/material';
import CustomTextField from '../../hotel/Login/Customtextfield';

const PayHereCoinPurchase = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [orderId, setOrderId] = useState('');
  const [userCurrentHsc, setUserCurrentHsc] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get data from previous page
  const { HSCamount, Amount, currency, items } = location.state || {};

  const merchantId = '234525'; // Replace with your PayHere Merchant ID
  const returnUrl = 'https://holidaysri.com/subscribe'; // Updated return URL
  const cancelUrl = 'https://holidaysri.com/cancel'; // Updated cancel URL
  const notifyUrl = 'https://holidaysri.com/notify'; // Updated notify URL
  const merchantSecret = 'Mzg0NzkxNDMzMDM0OTIxODQyMzA1NDAyNzUzMzMyNDg1NTEwNzY='; // Replace with your merchant secret

  useEffect(() => {
    // Generate unique order ID
    const generateOrderId = () => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `HSC_${timestamp}_${randomString}`;
    };
    setOrderId(generateOrderId());

    // Fetch user's current HSC balance
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      axios
        .get(`https://holidaysri-backend.onrender.com/coin/coins/${userEmail}`)
        .then((response) => {
          setUserCurrentHsc(response.data.coins || 0);
          setEmail(userEmail); // Pre-fill email from localStorage
        })
        .catch((error) => {
          console.error('Error fetching HSC balance:', error);
        });
    }

    // Load PayHere script
    const script = document.createElement('script');
    script.src = 'https://www.payhere.lk/lib/payhere.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.payhere.onCompleted = async function onCompleted(orderId) {
        console.log('Payment completed. OrderID:', orderId);
        setLoading(true);

        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) {
          console.error('User email not found in localStorage');
          setLoading(false);
          return;
        }

        // Update user's coin balance
        const newBalance = userCurrentHsc + HSCamount;
        try {
          const coinResponse = await axios.put(
            `https://holidaysri-backend.onrender.com/coin/updateCoins/${userEmail}`,
            { coins: newBalance }
          );
          if (coinResponse.data.success) {
            console.log('Coin balance updated successfully.');
          } else {
            console.error('Error updating coin balance.');
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error updating coin balance:', error);
          setLoading(false);
          return;
        }

        // Add payment activity
        try {
          await axios.post('https://holidaysri-backend.onrender.com/paymentAct/payment-activities', {
            itemID: items,
            quantity: HSCamount,
            item: 'HSC Coins',
            category: 'Coin Purchase',
            buyeremail: userEmail,
            amount: Amount,
            discountedAmount: 0,
            promoCode: 'Not Used',
            promoCodeOwner: 'Promo Code Not Allowed',
            forEarns: 0,
            currency: 'LKR',
          });
          console.log('Payment activity added successfully.');
        } catch (error) {
          console.error('Error adding payment activity:', error);
          setLoading(false);
          return;
        }

        setLoading(false);
        navigate('/coins', { state: { status: 'PaymentSuccess', orderId } });
      };

      window.payhere.onDismissed = function onDismissed() {
        console.log('Payment dismissed');
      };

      window.payhere.onError = function onError(error) {
        console.error('Error:', error);
      };
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [HSCamount, Amount, items, userCurrentHsc, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const paymentData = {
      merchant_id: merchantId,
      return_url: returnUrl,
      cancel_url: cancelUrl,
      notify_url: notifyUrl,
      order_id: orderId,
      items: items,
      amount: Amount,
      currency: currency,
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone: phone,
      address: address,
      city: city,
      country: 'Sri Lanka',
    };

    const amountFormatted = parseFloat(paymentData.amount).toLocaleString('en-US', { minimumFractionDigits: 2 }).replace(/,/g, '');
    const hashedSecret = md5(merchantSecret).toString().toUpperCase();
    const hash = md5(paymentData.merchant_id + paymentData.order_id + amountFormatted + paymentData.currency + hashedSecret).toString().toUpperCase();

    paymentData.hash = hash;

    window.payhere.startPayment(paymentData);
  };

  return (
<Grid
  container
  sx={{
    position: 'relative',
    minHeight: '100vh',
    padding: { xs: '20px', md: '40px 20px' },
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    marginTop: 6,
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // Overlay for better contrast
      backdropFilter: 'blur(4px)',
      zIndex: 0,
    },
  }}
>
  <Container
    maxWidth="md"
    sx={{
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}
  >
    <Card
      elevation={8}
      sx={{
        width: '100%',
        maxWidth: 600,
        p: { xs: 2, sm: 3, md: 4 },
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
      }}
    >
      <CardContent>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: '#1A1A1A',
            mb: 1,
            fontSize: { xs: '1.5rem', sm: '2rem' },
            textAlign: 'center',
          }}
        >
          HSC Coin Purchase
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: '#666',
            mb: 3,
            textAlign: 'center',
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
          }}
        >
          Purchasing {HSCamount} HSC for {Amount} {currency}
        </Typography>

        <form onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <CustomTextField
            id="firstName"
            label="First Name"
            type="text"
            variant="outlined"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            sx={{
              width: '90%', // Explicitly set width instead of fullWidth prop
              '& .MuiOutlinedInput-root': {
                height: '405x', // Consistent height
                padding: '0 14px', // Standard padding
              },
              '& .MuiInputLabel-root': {
                top: '50%', // Center label vertically when not focused
                transform: 'translate(14px, -50%) scale(1)', // Adjust label position
                '&.Mui-focused, &.MuiFormLabel-filled': {
                  transform: 'translate(14px, -9px) scale(0.75)', // Shrink when focused
                },
              },
            }}
          />
        </Grid>
        <Grid item xs={12} >
          <CustomTextField
            id="lastName"
            label="Last Name"
            type="text"
            variant="outlined"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            sx={{
              width: '90%', // Explicitly set width instead of fullWidth prop
              '& .MuiOutlinedInput-root': {
                height: '45px', // Consistent height
                padding: '0 14px', // Standard padding
              },
              '& .MuiInputLabel-root': {
                top: '50%',
                transform: 'translate(14px, -50%) scale(1)',
                '&.Mui-focused, &.MuiFormLabel-filled': {
                  transform: 'translate(14px, -9px) scale(0.75)',
                },
              },
            }}
          />
        </Grid>

            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                id="email"
                label="Email"
                type="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                id="phone"
                label="Phone"
                type="tel"
                variant="outlined"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                id="address"
                label="Address"
                variant="outlined"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                id="city"
                label="City"
                variant="outlined"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: 8,
                  backgroundColor: '#6259F5',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(98, 89, 245, 0.3)',
                  '&:hover': {
                    backgroundColor: '#7F73F5',
                    boxShadow: '0 6px 16px rgba(98, 89, 245, 0.4)',
                  },
                  '&:disabled': {
                    backgroundColor: '#e0e0e0',
                    color: '#999',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Pay Now'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  </Container>
</Grid>
  );
};

export default PayHereCoinPurchase;