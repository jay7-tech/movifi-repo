import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface LocationState {
  selectedSeats: Array<{ id: string }>;
  totalAmount: number;
  paymentMethod: string;
}

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSeats, totalAmount, paymentMethod } = location.state as LocationState;

  const bookingId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const bookingDate = new Date().toLocaleDateString();
  const bookingTime = new Date().toLocaleTimeString();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 64, color: 'success.main' }} />
        <Typography variant="h4" gutterBottom>
          Booking Confirmed!
        </Typography>
        <Typography color="text.secondary">
          Your tickets have been booked successfully.
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Booking Details
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'grid', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Booking ID</Typography>
              <Typography>{bookingId}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Date</Typography>
              <Typography>{bookingDate}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Time</Typography>
              <Typography>{bookingTime}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Seats</Typography>
              <Typography>{selectedSeats.map(seat => seat.id).join(', ')}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Payment Method</Typography>
              <Typography sx={{ textTransform: 'capitalize' }}>{paymentMethod}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography color="text.secondary">Amount Paid</Typography>
              <Typography>₹{totalAmount}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" paragraph>
          A confirmation email has been sent to your registered email address.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Please arrive at least 30 minutes before the show time.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default Confirmation; 