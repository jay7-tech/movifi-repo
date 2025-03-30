import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import WeekendIcon from '@mui/icons-material/Weekend';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'selected' | 'booked';
}

const SeatBooking = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Generate seats data
  const generateSeats = (): Seat[] => {
    const seats: Seat[] = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    rows.forEach(row => {
      for (let i = 1; i <= 10; i++) {
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          status: Math.random() > 0.8 ? 'booked' : 'available',
        });
      }
    });
    return seats;
  };

  const [seats] = useState<Seat[]>(generateSeats());

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;

    const isSelected = selectedSeats.find(s => s.id === seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length < 8) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const getSeatColor = (seat: Seat): string => {
    if (seat.status === 'booked') return '#f44336';
    if (selectedSeats.find(s => s.id === seat.id)) return '#4caf50';
    return '#2196f3';
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length > 0) {
      navigate(`/payment/${id}`, { 
        state: { 
          selectedSeats,
          totalAmount: selectedSeats.length * 200 // Assuming ₹200 per ticket
        } 
      });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Select Your Seats
      </Typography>

      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
        <Chip
          icon={<WeekendIcon sx={{ color: '#2196f3' }} />}
          label="Available"
          variant="outlined"
        />
        <Chip
          icon={<WeekendIcon sx={{ color: '#4caf50' }} />}
          label="Selected"
          variant="outlined"
        />
        <Chip
          icon={<WeekendIcon sx={{ color: '#f44336' }} />}
          label="Booked"
          variant="outlined"
        />
      </Box>

      {/* Screen */}
      <Box sx={{ mb: 4 }}>
        <Paper
          sx={{
            height: '30px',
            background: 'linear-gradient(180deg, #555 0%, #333 100%)',
            transform: 'perspective(300px) rotateX(-30deg)',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Typography variant="caption">SCREEN</Typography>
        </Paper>
      </Box>

      {/* Seats Grid */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={1} justifyContent="center">
          {seats.map((seat) => (
            <Grid item key={seat.id}>
              <WeekendIcon
                sx={{
                  fontSize: 40,
                  color: getSeatColor(seat),
                  cursor: seat.status === 'booked' ? 'not-allowed' : 'pointer',
                  '&:hover': {
                    opacity: seat.status === 'booked' ? 1 : 0.8,
                  },
                }}
                onClick={() => handleSeatClick(seat)}
              />
              <Typography variant="caption" display="block" textAlign="center">
                {seat.id}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Summary */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Selected Seats: {selectedSeats.map(seat => seat.id).join(', ')}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Total Amount: ₹{selectedSeats.length * 200}
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(`/movie/${id}`)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={selectedSeats.length === 0}
          onClick={() => setShowConfirmDialog(true)}
        >
          Proceed to Payment
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onClose={() => setShowConfirmDialog(false)}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Selected Seats: {selectedSeats.map(seat => seat.id).join(', ')}
          </Typography>
          <Typography>
            Total Amount: ₹{selectedSeats.length * 200}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleProceedToPayment} variant="contained" color="primary">
            Confirm & Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SeatBooking; 