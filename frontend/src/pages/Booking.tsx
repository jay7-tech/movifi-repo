import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  useTheme,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { EventSeat, AccessTime, LocalMovies, Payment } from '@mui/icons-material';
import movieService from '../services/movieService';
import authService from '../services/authService';
import WeekendIcon from '@mui/icons-material/Weekend';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  release_date: string;
}

type SeatStatus = 'available' | 'selected' | 'booked';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
}

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  
  rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status: Math.random() > 0.3 ? 'available' : 'booked',
        price: row <= 'C' ? 300 : row <= 'F' ? 250 : 200,
      });
    }
  });
  
  return seats;
};

const SeatLegend = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 3, 
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 2,
        p: 2,
        mb: 4
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#4CAF50', // Bright green for available
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WeekendIcon sx={{ color: 'white' }} />
        </Box>
        <Typography sx={{ color: 'white' }}>Available</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#2196F3', // Bright blue for selected
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WeekendIcon sx={{ color: 'white' }} />
        </Box>
        <Typography sx={{ color: 'white' }}>Selected</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#f44336', // Bright red for booked
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <WeekendIcon sx={{ color: 'white' }} />
        </Box>
        <Typography sx={{ color: 'white' }}>Booked</Typography>
      </Box>
    </Box>
  );
};

const Seat = ({ status, onClick }: { status: 'available' | 'selected' | 'booked', onClick?: () => void }) => {
  const getColor = () => {
    switch (status) {
      case 'available':
        return '#4CAF50'; // Bright green
      case 'selected':
        return '#2196F3'; // Bright blue
      case 'booked':
        return '#f44336'; // Bright red
      default:
        return '#4CAF50';
    }
  };

  return (
    <Box
      onClick={status !== 'booked' ? onClick : undefined}
      sx={{
        width: 32,
        height: 32,
        bgcolor: getColor(),
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: status === 'booked' ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: status !== 'booked' ? 'scale(1.1)' : 'none',
          filter: status !== 'booked' ? 'brightness(1.1)' : 'none',
        },
      }}
    >
      <WeekendIcon sx={{ color: 'white' }} />
    </Box>
  );
};

const Booking = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeStep, setActiveStep] = useState(0);
  const [showTimeSelected, setShowTimeSelected] = useState<string>('');
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const showTimes = [
    '10:00 AM', '12:30 PM', '3:00 PM', '6:30 PM', '9:00 PM'
  ];

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/', { 
        state: { 
          message: 'Please login to book tickets',
          redirectTo: `/booking/${movieId}`
        }
      });
      return;
    }
  }, [movieId, navigate]);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!movieId) return;
      try {
        const data = await movieService.getMovieDetails(movieId);
        setMovie(data);
      } catch (error) {
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked') return;

    const updatedSeats = seats.map(s => {
      if (s.id === seat.id) {
        const newStatus: SeatStatus = s.status === 'available' ? 'selected' : 'available';
        return { ...s, status: newStatus };
      }
      return s;
    });

    setSeats(updatedSeats);
    setSelectedSeats(updatedSeats.filter(s => s.status === 'selected'));
  };

  const handleShowTimeSelect = (time: string) => {
    setShowTimeSelected(time);
    setActiveStep(1);
  };

  const handleConfirmBooking = () => {
    setConfirmationOpen(true);
  };

  const handleBookingComplete = () => {
    // Here you would typically make an API call to save the booking
    navigate('/confirmation', {
      state: {
        movie,
        seats: selectedSeats,
        showTime: showTimeSelected,
        total: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
      },
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !movie) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Movie not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, pt: 12 }}>
      {/* Movie Info Banner */}
      {movie && (
        <Paper 
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 2,
            boxShadow: 1,
            bgcolor: 'white',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://image.tmdb.org/t/p/original${movie.poster_path})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <Box
                component="img"
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  boxShadow: 3,
                  border: '2px solid white',
                }}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                {movie.title}
              </Typography>
              <Typography variant="subtitle1">
                Release Date: {new Date(movie.release_date).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Booking Steps */}
      <Stepper 
        activeStep={activeStep} 
        sx={{ 
          mb: 4,
          bgcolor: 'white',
          p: 3,
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        <Step>
          <StepLabel>Select Show Time</StepLabel>
        </Step>
        <Step>
          <StepLabel>Choose Seats</StepLabel>
        </Step>
        <Step>
          <StepLabel>Payment</StepLabel>
        </Step>
      </Stepper>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          {activeStep === 0 && (
            <Paper 
              sx={{ 
                p: 3,
                borderRadius: 2,
                boxShadow: 1,
                bgcolor: 'white'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Select Show Time
              </Typography>
              <Grid container spacing={2}>
                {showTimes.map((time) => (
                  <Grid item key={time}>
                    <Chip
                      label={time}
                      onClick={() => handleShowTimeSelect(time)}
                      color={showTimeSelected === time ? 'primary' : 'default'}
                      sx={{ 
                        fontSize: '1rem', 
                        py: 2,
                        px: 3,
                        borderRadius: 2,
                        '&:hover': {
                          transform: 'scale(1.05)',
                          transition: 'transform 0.2s ease-in-out',
                        }
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}

          {activeStep === 1 && (
            <Box>
              <Paper 
                sx={{ 
                  p: 3, 
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: 1,
                  bgcolor: 'white'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Screen
                </Typography>
                <Box
                  sx={{
                    width: '100%',
                    height: 8,
                    background: 'linear-gradient(to right, #f5f5f5, #e0e0e0, #f5f5f5)',
                    borderRadius: 1,
                    mb: 4,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
                <Grid container spacing={1} justifyContent="center">
                  {seats.map((seat) => (
                    <Grid item key={seat.id}>
                      <Seat
                        status={seat.status}
                        onClick={() => handleSeatClick(seat)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              <SeatLegend />
            </Box>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              position: 'sticky', 
              top: 100,
              borderRadius: 2,
              boxShadow: 1,
              bgcolor: 'white'
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Booking Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                {movie?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Release Date: {movie && new Date(movie.release_date).toLocaleDateString()}
              </Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            {showTimeSelected && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Show Time
                </Typography>
                <Chip
                  icon={<AccessTime />}
                  label={showTimeSelected}
                  sx={{ mt: 1, borderRadius: 1 }}
                />
              </Box>
            )}
            {selectedSeats.length > 0 && (
              <>
                <Typography variant="subtitle2" color="text.secondary">
                  Selected Seats
                </Typography>
                <Box sx={{ mt: 1, mb: 2 }}>
                  {selectedSeats.map((seat) => (
                    <Chip
                      key={seat.id}
                      label={seat.id}
                      sx={{ m: 0.5, borderRadius: 1 }}
                      onDelete={() => handleSeatClick(seat)}
                    />
                  ))}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Price Details
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {selectedSeats.map((seat) => (
                      <Box
                        key={seat.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                          p: 1,
                          borderRadius: 1,
                          bgcolor: 'grey.50',
                        }}
                      >
                        <Typography variant="body2">Seat {seat.id}</Typography>
                        <Typography variant="body2">₹{seat.price}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mb: 2,
                    p: 2,
                    borderRadius: 1,
                    bgcolor: 'primary.light',
                    color: 'white',
                  }}
                >
                  <Typography variant="subtitle1">Total Amount</Typography>
                  <Typography variant="subtitle1">
                    ₹{selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
                  </Typography>
                </Box>
              </>
            )}
            <Button
              variant="contained"
              fullWidth
              disabled={!showTimeSelected || selectedSeats.length === 0}
              onClick={handleConfirmBooking}
              startIcon={<Payment />}
              sx={{ borderRadius: 2 }}
            >
              Proceed to Payment
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Dialog 
        open={confirmationOpen} 
        onClose={() => setConfirmationOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 2,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to proceed with the booking?
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2">
              Movie: {movie?.title}
            </Typography>
            <Typography variant="body2">
              Show Time: {showTimeSelected}
            </Typography>
            <Typography variant="body2">
              Seats: {selectedSeats.map(seat => seat.id).join(', ')}
            </Typography>
            <Typography variant="body2">
              Total Amount: ₹{selectedSeats.reduce((sum, seat) => sum + seat.price, 0)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmationOpen(false)}>Cancel</Button>
          <Button onClick={handleBookingComplete} variant="contained" autoFocus>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Booking; 