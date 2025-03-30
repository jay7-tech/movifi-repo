import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';

interface LocationState {
  selectedSeats: Array<{ id: string }>;
  totalAmount: number;
}

const Payment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { selectedSeats, totalAmount } = location.state as LocationState;

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    upiId: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardName) newErrors.cardName = 'Card holder name is required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
    } else if (paymentMethod === 'upi') {
      if (!formData.upiId) newErrors.upiId = 'UPI ID is required';
    } else if (paymentMethod === 'netbanking') {
      if (!formData.bankName) newErrors.bankName = 'Bank name is required';
      if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
      if (!formData.ifscCode) newErrors.ifscCode = 'IFSC code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      navigate(`/confirmation/${id}`, {
        state: {
          selectedSeats,
          totalAmount,
          paymentMethod,
        },
      });
    } catch (error) {
      setErrors({ submit: 'Payment failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Payment Details
      </Typography>

      {/* Order Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          <Typography>
            Selected Seats: {selectedSeats.map(seat => seat.id).join(', ')}
          </Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Total Amount: ₹{totalAmount}
          </Typography>
        </CardContent>
      </Card>

      {/* Payment Method Selection */}
      <FormControl component="fieldset" sx={{ mb: 4 }}>
        <FormLabel component="legend">Select Payment Method</FormLabel>
        <RadioGroup
          row
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel
            value="card"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCardIcon sx={{ mr: 1 }} /> Credit/Debit Card
              </Box>
            }
          />
          <FormControlLabel
            value="upi"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PaymentsIcon sx={{ mr: 1 }} /> UPI
              </Box>
            }
          />
          <FormControlLabel
            value="netbanking"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalanceIcon sx={{ mr: 1 }} /> Net Banking
              </Box>
            }
          />
        </RadioGroup>
      </FormControl>

      {/* Payment Form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {paymentMethod === 'card' && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Holder Name"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  error={!!errors.cardName}
                  helperText={errors.cardName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  error={!!errors.expiryDate}
                  helperText={errors.expiryDate}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  name="cvv"
                  type="password"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                />
              </Grid>
            </>
          )}

          {paymentMethod === 'upi' && (
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="UPI ID"
                name="upiId"
                placeholder="example@upi"
                value={formData.upiId}
                onChange={handleInputChange}
                error={!!errors.upiId}
                helperText={errors.upiId}
              />
            </Grid>
          )}

          {paymentMethod === 'netbanking' && (
            <>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  error={!!errors.bankName}
                  helperText={errors.bankName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Account Number"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  error={!!errors.accountNumber}
                  helperText={errors.accountNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="IFSC Code"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  error={!!errors.ifscCode}
                  helperText={errors.ifscCode}
                />
              </Grid>
            </>
          )}
        </Grid>

        {errors.submit && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.submit}
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/booking/${id}`)}
            disabled={loading}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              `Pay ₹${totalAmount}`
            )}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Payment; 