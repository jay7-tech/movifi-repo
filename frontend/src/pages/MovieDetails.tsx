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
          background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  height: '400px',
                  overflow: 'hidden',
                  borderRadius: 2,
                }}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h2" gutterBottom>
                {movie.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={movie.vote_average / 2} precision={0.1} readOnly />
                <Typography variant="body1" sx={{ ml: 1 }}>
                  ({movie.vote_average.toFixed(1)}/10)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip
                  icon={<CalendarTodayIcon />}
                  label={new Date(movie.release_date).toLocaleDateString()}
                />
                <Chip
                  icon={<AccessTimeIcon />}
                  label={`${movie.runtime} minutes`}
                />
                <Chip
                  icon={<LanguageIcon />}
                  label={movie.original_language.toUpperCase()}
                />
              </Box>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                {movie.genres.map((genre) => (
                  <Chip key={genre.id} label={genre.name} />
                ))}
              </Box>

              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <Typography variant="body1" paragraph>
                {movie.overview}
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={handleBookNow}
                startIcon={<AccessTimeIcon />}
                sx={{
                  bgcolor: 'red',
                  '&:hover': {
                    bgcolor: 'darkred',
                  },
                }}
              >
                Book Tickets
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Cast Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Cast
        </Typography>
        <Grid container spacing={2}>
          {credits?.cast.slice(0, 6).map((actor) => (
            <Grid item key={actor.id} xs={6} sm={4} md={2}>
              <Paper
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                      : 'https://via.placeholder.com/200x300'
                  }
                  alt={actor.name}
                  style={{
                    width: '100%',
                    height: '300px',
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" noWrap>
                    {actor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {actor.character}
                  </Typography>
                </Box>
              </Paper>
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
    </>
  );
};

export default MovieDetails; 