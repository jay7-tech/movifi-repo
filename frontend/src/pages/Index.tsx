import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
    <Box>
      {/* Hero Section with Video Background */}
      <Box
        sx={{
          height: '70vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
        >
          <source src="/videos/Background.mp4" type="video/mp4" />
        </video>
        
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Container sx={{ position: 'relative', zIndex: 2, textAlign: 'center', color: 'white' }}>
          <Typography variant="h1" gutterBottom>
            Welcome to MoviFi
          </Typography>
          <Typography variant="h5" gutterBottom>
            Book your favorite movies with ease
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/movies')}
            sx={{ mt: 2 }}
          >
            Browse Movies
          </Button>
        </Container>
      </Box>

      {/* Featured Movies Section */}
      <Container sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          gutterBottom
          sx={{
            color: 'white',
            fontWeight: 600,
            textAlign: 'center',
            mb: 4
          }}
        >
          Featured Movies
        </Typography>
        <Grid container spacing={4}>
          {featuredMovies.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={3}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  borderRadius: 2,
                  boxShadow: 2,
                  bgcolor: 'white',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease-in-out',
                    boxShadow: 6,
                  },
                }}
                onClick={() => navigate(`/movie/${movie.id}`)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  sx={{ 
                    objectFit: 'cover',
                    borderBottom: '2px solid #f5f5f5'
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="div"
                    sx={{
                      color: '#1a237e',
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
                    mb: 1
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#455a64',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      ⭐ {movie.vote_average.toFixed(1)}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#455a64',
                        fontWeight: 500
                      }}
                    >
                      {new Date(movie.release_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 1,
                      bgcolor: 'red',
                      '&:hover': {
                        bgcolor: 'darkred'
                      }
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

      <LoginDialog
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
        onSignupClick={() => {
          // TODO: Handle signup click
          setIsLoginOpen(false);
        }}
      />
    </Box>
  );
};

export default Index; 