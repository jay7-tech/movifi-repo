import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Box,
  Button,
  Paper,
  Rating,
  Divider,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';
import {
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import movieService from '../services/movieService';
import authService from '../services/authService';
import LoginDialog from '../components/auth/LoginDialog';

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime: number;
  genres: Array<{ id: number; name: string }>;
  original_language: string;
}

interface Credits {
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job: string;
    profile_path: string;
  }>;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        const [movieData, creditsData] = await Promise.all([
          movieService.getMovieDetails(id!),
          movieService.getMovieCredits(id!),
        ]);
        setMovie(movieData);
        setCredits(creditsData);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setError('Failed to load movie details');
        navigate('/movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, navigate]);

  const handleBookNow = () => {
    if (!authService.isAuthenticated()) {
      setIsLoginOpen(true);
      return;
    }
    navigate(`/booking/${id}`);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    navigate(`/booking/${id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
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
    <>
      {/* Hero Section with Backdrop */}
      <Box
        sx={{
          height: '60vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: movie.backdrop_path 
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'url("/images/cinema-background.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 1,
          }}
        />
      </Box>

      {/* Movie Content */}
      <Container sx={{ mt: -8, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          {/* Movie Poster */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={3}
              sx={{
                height: '90%',
                overflow: 'hidden',
                borderRadius: 6,
                bgcolor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '2/3',
                  objectFit: 'cover',
                }}
              />
            </Paper>
          </Grid>

          {/* Movie Info */}
          <Grid item xs={12} md={8}>
            <Paper 
              sx={{ 
                height: '100%', 
                p: 4, 
                bgcolor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  color: '#1a237e', 
                  fontWeight: 700,
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  mb: 2,
                }}
              >
                {movie.title}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Rating 
                  value={movie.vote_average / 2} 
                  precision={0.1} 
                  readOnly 
                  sx={{ 
                    '& .MuiRating-iconFilled': {
                      color: '#ffd700',
                    },
                    '& .MuiRating-iconEmpty': {
                      color: '#e0e0e0',
                    },
                  }}
                />
                <Typography 
                  variant="body1" 
                  sx={{ 
                    ml: 1, 
                    color: '#455a64',
                    fontWeight: 500,
                    fontSize: '1.1rem',
                  }}
                >
                  ({movie.vote_average.toFixed(1)}/10)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={new Date(movie.release_date).toLocaleDateString()}
                  sx={{ 
                    bgcolor: '#f5f5f5',
                    '& .MuiChip-label': {
                      fontWeight: 500,
                      color: '#1a237e',
                    },
                    '& .MuiChip-icon': {
                      color: '#1a237e',
                    },
                  }}
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${movie.runtime} minutes`}
                  sx={{ 
                    bgcolor: '#f5f5f5',
                    '& .MuiChip-label': {
                      fontWeight: 500,
                      color: '#1a237e',
                    },
                    '& .MuiChip-icon': {
                      color: '#1a237e',
                    },
                  }}
                />
                <Chip
                  icon={<LanguageIcon />}
                  label={movie.original_language.toUpperCase()}
                  sx={{ 
                    bgcolor: '#f5f5f5',
                    '& .MuiChip-label': {
                      fontWeight: 500,
                      color: '#1a237e',
                    },
                    '& .MuiChip-icon': {
                      color: '#1a237e',
                    },
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
                {movie.genres.map((genre) => (
                  <Chip 
                    key={genre.id} 
                    label={genre.name}
                    sx={{ 
                      bgcolor: '#e3f2fd', 
                      color: '#1a237e',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: '#bbdefb',
                      },
                    }}
                  />
                ))}
              </Box>

              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  color: '#1a237e', 
                  fontWeight: 600,
                  fontSize: '1.4rem',
                  mb: 2,
                }}
              >
                Overview
              </Typography>
              <Typography 
                variant="body1" 
                paragraph 
                sx={{ 
                  color: '#455a64', 
                  lineHeight: 1.8,
                  fontSize: '1.1rem',
                  mb: 3,
                }}
              >
                {movie.overview}
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={handleBookNow}
                startIcon={<AccessTimeIcon />}
                sx={{
                  bgcolor: 'red',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  padding: '12px 24px',
                  '&:hover': {
                    bgcolor: 'darkred',
                  },
                }}
              >
                Book Tickets
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Cast Section */}
        <Box sx={{ mt: 8, mb: 6 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              color: 'white', 
              fontWeight: 600,
              fontSize: '1.8rem',
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Cast
          </Typography>
          <Grid container spacing={3}>
            {credits?.cast.slice(0, 6).map((actor) => (
              <Grid item key={actor.id} xs={6} sm={4} md={2}>
                <Paper
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    bgcolor: 'white',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                    },
                  }}
                >
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                        : '/images/default-avatar.png'
                    }
                    alt={actor.name}
                    style={{
                      width: '100%',
                      height: 'auto',
                      aspectRatio: '2/3',
                      objectFit: 'cover',
                    }}
                  />
                  <Box sx={{ p: 2 }}>
                    <Typography 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#1a237e',
                        mb: 0.5,
                        textAlign: 'center',
                        fontSize: '1rem',
                      }}
                    >
                      {actor.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#455a64',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 500,
                      }}
                    >
                      {actor.character}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
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
    </>
  );
};

export default MovieDetails; 