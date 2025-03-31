import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button, Paper, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  LocalMovies as MovieIcon,
  ConfirmationNumber as TicketIcon,
  EventSeat as SeatIcon,
  Payment as PaymentIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import movieService from '../services/movieService';
import authService from '../services/authService';
import LoginDialog from '../components/auth/LoginDialog';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

// Features data
const features = [
  {
    icon: <MovieIcon sx={{ fontSize: 30, color: '#1a237e' }} />,
    title: 'Wide Movie Selection',
    description: 'Access to the latest blockbusters and classic films from around the world.',
  },
  {
    icon: <TicketIcon sx={{ fontSize: 30, color: '#1a237e' }} />,
    title: 'Easy Booking',
    description: 'Simple and quick ticket booking process with instant confirmation.',
  },
  {
    icon: <SeatIcon sx={{ fontSize: 30, color: '#1a237e' }} />,
    title: 'Seat Selection',
    description: 'Choose your preferred seats with our interactive seating map.',
  },
  {
    icon: <PaymentIcon sx={{ fontSize: 30, color: '#1a237e' }} />,
    title: 'Secure Payment',
    description: 'Multiple payment options with secure transaction processing.',
  },
  {
    icon: <SpeedIcon sx={{ fontSize: 30, color: '#1a237e' }} />,
    title: 'Fast Checkout',
    description: 'Streamlined checkout process for a hassle-free experience.',
  },
  {
    icon: <SecurityIcon sx={{ fontSize: 30, color: '#1a237e' }} />,
    title: 'Safe & Secure',
    description: 'Your data is protected with industry-standard security measures.',
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const movies = await movieService.getNewestMovies('IN');
        setFeaturedMovies(movies.slice(0, 4)); // Get first 4 movies as featured
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };
    fetchMovies();
  }, []);

  const handleBookNow = (movieId: number) => {
    if (!authService.isAuthenticated()) {
      setSelectedMovieId(movieId);
      setIsLoginOpen(true);
      return;
    }
    navigate(`/booking/${movieId}`);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    if (selectedMovieId) {
      navigate(`/booking/${selectedMovieId}`);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        }}
      >
        {/* Animated Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'url("/images/pattern.svg")',
            opacity: 0.05,
            animation: 'patternMove 20s linear infinite',
            '@keyframes patternMove': {
              '0%': { backgroundPosition: '0 0' },
              '100%': { backgroundPosition: '100% 100%' },
            },
          }}
        />

        {/* Content Container */}
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 700,
                    mb: 2,
                    background: 'linear-gradient(45deg, #ff0000 30%, #ff6b6b 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome to MoviFi
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    color: '#e0e0e0',
                    fontWeight: 400,
                  }}
                >
                  Your Ultimate Movie Ticket Booking Experience
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/movies')}
                    sx={{
                      bgcolor: 'red',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      padding: '12px 32px',
                      '&:hover': {
                        bgcolor: 'darkred',
                      },
                    }}
                  >
                    Browse Movies
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/about')}
                    sx={{
                      borderColor: 'red',
                      color: 'red',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      padding: '12px 32px',
                      '&:hover': {
                        borderColor: 'darkred',
                        bgcolor: 'rgba(255, 0, 0, 0.1)',
                      },
                    }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: 400,
                    height: 500,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      right: -20,
                      bottom: -20,
                      background: 'linear-gradient(45deg, #ff0000, #ff6b6b)',
                      opacity: 0.2,
                      borderRadius: 2,
                      zIndex: -1,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src="https://image.tmdb.org/t/p/original/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg"
                      alt="Movie Experience"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        borderRadius: 8,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: '#121212' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              mb: 6,
              color: 'white',
              fontWeight: 700,
            }}
          >
            Why Choose MoviFi?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    transition: 'transform 0.3s ease-in-out',
                    bgcolor: '#1a1a1a',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 0, 0, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    {React.cloneElement(feature.icon, { sx: { color: 'red' } })}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: 'white',
                      fontWeight: 600,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: '#e0e0e0',
                      lineHeight: 1.6,
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Latest Movies Section */}
      <Box sx={{ py: 8, bgcolor: '#000000' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              sx={{
                color: 'white',
                fontWeight: 700,
              }}
            >
              Latest Movies
            </Typography>
            <Button
              variant="outlined"
              onClick={() => navigate('/movies')}
              sx={{
                borderColor: 'red',
                color: 'red',
                '&:hover': {
                  borderColor: 'darkred',
                  bgcolor: 'rgba(255, 0, 0, 0.1)',
                },
              }}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={3}>
            {featuredMovies.map((movie) => (
              <Grid item key={movie.id} xs={6} sm={4} md={3}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    bgcolor: '#1a1a1a',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                >
                  <CardMedia
                    component="img"
                    height="400"
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    sx={{
                      objectFit: 'cover',
                      borderBottom: '2px solid #333',
                      aspectRatio: '2/3',
                      width: '100%',
                      height: 'auto',
                    }}
                  />
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '200px',
                  }}>
                    <Box>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="div"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          mb: 1,
                          height: '2.5rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {movie.title}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#e0e0e0',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                          }}
                        >
                          ⭐ {movie.vote_average.toFixed(1)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#e0e0e0',
                            fontWeight: 500,
                          }}
                        >
                          {new Date(movie.release_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        mt: 1,
                        bgcolor: 'red',
                        '&:hover': {
                          bgcolor: 'darkred',
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookNow(movie.id);
                      }}
                    >
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box sx={{ py: 8, bgcolor: '#121212' }}>
        <Container maxWidth="md">
          <Paper
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
              color: 'white',
              border: '1px solid #333',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                mb: 2,
                fontWeight: 700,
                color: 'white',
              }}
            >
              Stay Updated
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mb: 4,
                color: '#e0e0e0',
              }}
            >
              Subscribe to our newsletter for the latest movies and exclusive offers
            </Typography>
            <Box
              component="form"
              sx={{
                display: 'flex',
                gap: 2,
                maxWidth: 500,
                mx: 'auto',
              }}
            >
              <TextField
                fullWidth
                placeholder="Enter your email"
                variant="outlined"
                sx={{
                  bgcolor: '#1a1a1a',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#333',
                    },
                    '&:hover fieldset': {
                      borderColor: '#666',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'red',
                    },
                    '& input': {
                      color: 'white',
                    },
                    '& input::placeholder': {
                      color: '#999',
                    },
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'red',
                  '&:hover': {
                    bgcolor: 'darkred',
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      <LoginDialog
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
        onSignupClick={() => {
          // TODO: Handle signup click
          setIsLoginOpen(false);
        }}
      />
    </>
  );
};

export default Index; 