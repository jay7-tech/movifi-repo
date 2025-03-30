import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
  Chip,
  Rating,
  Skeleton,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { PlayArrow, Star, Person, Logout } from '@mui/icons-material';
import movieService from '../services/movieService';
import LoginDialog from '../components/auth/LoginDialog';
import SignupDialog from '../components/auth/SignupDialog';
import authService from '../services/authService';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  release_date: string;
}

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRegion, setSelectedRegion] = useState('IN');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const topRated = await movieService.getTopRatedMovies(selectedRegion);
        setTopRatedMovies(topRated.slice(0, 6));
        setFeaturedMovies(topRated.slice(0, 1));
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedRegion]);

  const handleAuthSuccess = () => {
    setLoginOpen(false);
    setSignupOpen(false);
  };

  const handleBookNow = (movieId: number) => {
    if (!authService.isAuthenticated()) {
      setLoginOpen(true);
    } else {
      navigate(`/booking/${movieId}`);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    handleMenuClose();
  };

  return (
    <Box>
      {/* Navbar */}
      <AppBar position="fixed" color="default" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Movifi
          </Typography>
          {authService.isAuthenticated() ? (
            <>
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar sx={{ width: 32, height: 32 }}>
                  <Person />
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  <Person sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/bookings'); handleMenuClose(); }}>
                  <PlayArrow sx={{ mr: 1 }} /> My Bookings
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setLoginOpen(true)}
              startIcon={<Person />}
            >
              Sign In
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: isMobile ? '60vh' : '80vh',
          overflow: 'hidden',
          bgcolor: 'black',
          mt: 8,
        }}
      >
        {!loading && featuredMovies[0] && (
          <>
            <Box
              component="img"
              src={`https://image.tmdb.org/t/p/original${featuredMovies[0].backdrop_path}`}
              alt={featuredMovies[0].title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.4,
              }}
            />
            <Container
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                color: 'white',
              }}
            >
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                {featuredMovies[0].title}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                <Rating value={featuredMovies[0].vote_average / 2} precision={0.5} readOnly sx={{ color: 'white' }} />
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {featuredMovies[0].vote_average.toFixed(1)}
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ mb: 4, maxWidth: '800px', mx: 'auto' }}>
                {featuredMovies[0].overview.slice(0, 150)}...
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={() => handleBookNow(featuredMovies[0].id)}
                sx={{
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                  },
                }}
              >
                Book Now
              </Button>
            </Container>
          </>
        )}
        {loading && (
          <Box sx={{ width: '100%', height: '100%', bgcolor: 'grey.900' }}>
            <Skeleton variant="rectangular" width="100%" height="100%" />
          </Box>
        )}
      </Box>

      {/* Top Rated Movies Section */}
      <Container sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Highest Rated Movies
          </Typography>
          <Chip
            label={`Region: ${selectedRegion}`}
            color="primary"
            variant="outlined"
            sx={{ ml: 2 }}
          />
        </Box>
        <Grid container spacing={4}>
          {loading
            ? Array.from(new Array(6)).map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Skeleton variant="rectangular" height={400} />
                </Grid>
              ))
            : topRatedMovies.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.03)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="400"
                      image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {movie.title}
                      </Typography>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Rating
                          value={movie.vote_average / 2}
                          precision={0.5}
                          readOnly
                          size="small"
                        />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleBookNow(movie.id)}
                        >
                          Book Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
        </Grid>
      </Container>

      {/* Auth Dialogs */}
      <LoginDialog
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleAuthSuccess}
        onSignupClick={() => {
          setLoginOpen(false);
          setSignupOpen(true);
        }}
      />
      <SignupDialog
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        onSuccess={handleAuthSuccess}
        onLoginClick={() => {
          setSignupOpen(false);
          setLoginOpen(true);
        }}
      />
    </Box>
  );
};

export default Home; 