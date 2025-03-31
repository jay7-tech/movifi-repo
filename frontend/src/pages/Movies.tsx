import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Tabs,
  Tab,
  Chip,
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Stack,
  Rating,
  Paper,
  Skeleton,
  InputLabel,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import movieService, { regions } from '../services/movieService';
import backendMovieService, { BackendMovie } from '../services/backendMovieService';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoginDialog from '../components/auth/LoginDialog';
import authService from '../services/authService';

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  overview: string;
  genre_ids: number[];
}

interface MovieFormData {
  id: number;
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  rating: number;
}

interface MovieCardProps {
  movie: Movie | BackendMovie;
  onBook: (id: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onBook }) => {
  const navigate = useNavigate();
  const isTMDBMovie = 'poster_path' in movie;
  const title = isTMDBMovie ? movie.title : movie.title;
  const posterPath = isTMDBMovie ? movie.poster_path : movie.posterPath;
  const rating = isTMDBMovie ? movie.vote_average : movie.rating;
  const releaseDate = isTMDBMovie ? movie.release_date : movie.releaseDate;

  return (
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
        image={
          isTMDBMovie
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : posterPath
        }
        alt={title}
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
            {title}
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
              ⭐ {rating.toFixed(1)}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#e0e0e0',
                fontWeight: 500,
              }}
            >
              {new Date(releaseDate).toLocaleDateString('en-US', {
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
            onBook(movie.id);
          }}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
};

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
];

const Movies = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [backendMovies, setBackendMovies] = useState<BackendMovie[]>([]);
  const [displayedMovies, setDisplayedMovies] = useState<(Movie | BackendMovie)[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedRegion, setSelectedRegion] = useState('IN');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newMovie, setNewMovie] = useState<MovieFormData>({
    id: 0,
    title: '',
    overview: '',
    posterPath: '',
    releaseDate: '',
    rating: 0,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const genres = [
    { id: 'all', name: 'All Genres' },
    { id: '28', name: 'Action' },
    { id: '35', name: 'Comedy' },
    { id: '18', name: 'Drama' },
    { id: '27', name: 'Horror' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Sci-Fi' },
    { id: '53', name: 'Thriller' },
  ];

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        setBackendError(null);
        let fetchedMovies;
        
        if (selectedLanguage) {
          fetchedMovies = await movieService.getMoviesByLanguage(selectedLanguage, selectedRegion);
        } else {
          fetchedMovies = await movieService.getNewestMovies(selectedRegion);
        }
        
        setMovies(fetchedMovies);

        // Only fetch backend movies if we're on the MY MOVIES tab
        if (selectedTab === 1) {
          try {
            const backendData = await backendMovieService.getMovies();
            setBackendMovies(backendData);
            setDisplayedMovies(backendData);
          } catch (backendErr: any) {
            console.error('Error fetching backend movies:', backendErr);
            setBackendError(
              backendErr.message === 'No response from backend API. Is the server running?' 
                ? 'Unable to connect to the movie server. Please make sure the server is running and try again.'
                : 'Failed to load your movies. Please try again later.'
            );
            setBackendMovies([]);
            setDisplayedMovies([]);
          }
        } else {
          setDisplayedMovies(fetchedMovies);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to fetch movies. Please try again later.');
        setMovies([]);
        setBackendMovies([]);
        setDisplayedMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedRegion, selectedLanguage, selectedTab]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    if (!query.trim()) {
      setDisplayedMovies(selectedTab === 0 ? movies : backendMovies);
      return;
    }

    const searchTerms = query.toLowerCase().trim().split(' ');
    const filtered = (selectedTab === 0 ? movies : backendMovies).filter((movie) => {
      const movieTitle = (isTMDBMovie(movie) ? movie.title : movie.title).toLowerCase();
      return searchTerms.every(term => movieTitle.includes(term));
    });
    
    setDisplayedMovies(filtered);
  };

  const isTMDBMovie = (movie: Movie | BackendMovie): movie is Movie => {
    return 'poster_path' in movie;
  };

  const clearSearch = () => {
    setSearchQuery('');
    setDisplayedMovies(selectedTab === 0 ? movies : backendMovies);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setDisplayedMovies(newValue === 0 ? movies : backendMovies);
  };

  const handleRegionChange = (event: any) => {
    setSelectedRegion(event.target.value);
  };

  const handleLanguageChange = (event: any) => {
    setSelectedLanguage(event.target.value);
  };

  const handleGenreChange = (event: SelectChangeEvent) => {
    setSelectedGenre(event.target.value);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewMovie({
      id: 0,
      title: '',
      overview: '',
      posterPath: '',
      releaseDate: '',
      rating: 0,
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewMovie(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await backendMovieService.createMovie(newMovie);
      const updatedMovies = await backendMovieService.getMovies();
      setBackendMovies(updatedMovies);
      setDisplayedMovies(selectedTab === 0 ? movies : updatedMovies);
      handleDialogClose();
      setSnackbar({
        open: true,
        message: 'Movie added successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error creating movie:', error);
      setError('Failed to create movie. Please try again.');
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Filter movies based on all criteria
  const getFilteredMovies = () => {
    const allMovies = selectedTab === 0 ? movies : backendMovies;
    return allMovies.filter((movie) => {
      // Search query filter
      if (searchQuery.trim()) {
        const searchTerms = searchQuery.toLowerCase().trim().split(' ');
        const movieTitle = isTMDBMovie(movie) 
          ? movie.title.toLowerCase()
          : movie.title.toLowerCase();
        if (!searchTerms.every((term) => movieTitle.includes(term))) {
          return false;
        }
      }

      // Genre filter (only for TMDB movies)
      if (selectedTab === 0 && selectedGenre !== 'all' && isTMDBMovie(movie)) {
        if (!movie.genre_ids.includes(parseInt(selectedGenre))) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredMovies = getFilteredMovies();

  const handleBookNow = (movieId: number) => {
    if (!authService.isAuthenticated()) {
      setIsLoginOpen(true);
      return;
    }
    navigate(`/booking/${movieId}`);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
  };

  if (selectedTab === 1 && backendError) {
    return (
      <Box 
        sx={{ 
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          pt: 8 
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'white'
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              Connection Error
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {backendError}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={() => {
                  setBackendError(null);
                  setSelectedTab(0);
                }}
                sx={{ bgcolor: '#e53935', '&:hover': { bgcolor: '#c62828' } }}
              >
                View In Cinemas
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setBackendError(null);
                  const fetchMovies = async () => {
                    try {
                      setLoading(true);
                      const backendData = await backendMovieService.getMovies();
                      setBackendMovies(backendData);
                      setDisplayedMovies(backendData);
                    } catch (err) {
                      console.error('Error retrying backend fetch:', err);
                      setBackendError('Still unable to connect. Please try again later.');
                    } finally {
                      setLoading(false);
                    }
                  };
                  fetchMovies();
                }}
                sx={{ 
                  borderColor: '#e53935', 
                  color: '#e53935',
                  '&:hover': { 
                    borderColor: '#c62828',
                    bgcolor: '#ffebee'
                  }
                }}
              >
                Retry Connection
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          pt: 8 
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'white'
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {error}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={() => {
                  setError(null);
                  setSelectedTab(0);
                }}
                sx={{ bgcolor: '#e53935', '&:hover': { bgcolor: '#c62828' } }}
              >
                View In Cinemas
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
              >
                Go to Homepage
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pt: 8 }}>
        <Container sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {Array.from(new Array(8)).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Paper 
                  sx={{ 
                    p: 2, 
                    height: '100%', 
                    borderRadius: 2,
                    boxShadow: 1,
                    bgcolor: 'white'
                  }}
                >
                  <Skeleton 
                    variant="rectangular" 
                    height={400} 
                    sx={{ 
                      borderRadius: 2,
                      animation: 'pulse 1.5s ease-in-out infinite'
                    }} 
                  />
                  <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="40%" />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    );
  }

  if (filteredMovies.length === 0) {
    return (
      <Box 
        sx={{ 
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#f5f5f5',
          pt: 8 
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'white'
            }}
          >
            <Typography variant="h5" gutterBottom>
              No Movies Found
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {searchQuery 
                ? `No results found for "${searchQuery}". Try different keywords or filters.`
                : "No movies available at the moment."}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={clearSearch}
                startIcon={<ClearIcon />}
              >
                Clear Search
              </Button>
              <Button
                variant="outlined"
                onClick={() => {
                  setSelectedRegion('IN');
                  setSelectedLanguage('');
                  setSelectedGenre('all');
                }}
              >
                Reset Filters
              </Button>
            </Stack>
            {searchQuery && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Popular Searches
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center">
                  {['Action', 'Comedy', 'Drama', 'Thriller'].map((genre) => (
                    <Chip
                      key={genre}
                      label={genre}
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedGenre(genres.find(g => g.name === genre)?.id || 'all');
                      }}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#000000', pt: 8 }}>
      <Container maxWidth="lg">
        {/* Search and Filter Section */}
        <Paper
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            bgcolor: '#1a1a1a',
            border: '1px solid #333',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#121212',
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel sx={{ color: '#666' }}>Genre</InputLabel>
                  <Select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                    label="Genre"
                    sx={{
                      bgcolor: '#121212',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#666',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'red',
                      },
                    }}
                  >
                    <MenuItem value="">All Genres</MenuItem>
                    {genres.map((genre) => (
                      <MenuItem key={genre.id} value={genre.id}>
                        {genre.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel sx={{ color: '#666' }}>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    label="Sort By"
                    sx={{
                      bgcolor: '#121212',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#333',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#666',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'red',
                      },
                    }}
                  >
                    <MenuItem value="popularity.desc">Most Popular</MenuItem>
                    <MenuItem value="vote_average.desc">Highest Rated</MenuItem>
                    <MenuItem value="release_date.desc">Newest First</MenuItem>
                    <MenuItem value="release_date.asc">Oldest First</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Movies Grid */}
        <Grid container spacing={3}>
          {movies.map((movie) => (
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

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, value) => setCurrentPage(value)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#e0e0e0',
                '&.Mui-selected': {
                  bgcolor: 'red',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'darkred',
                  },
                },
              },
            }}
          />
        </Box>
      </Container>

      <LoginDialog
        open={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
        onSignupClick={() => {
          setIsLoginOpen(false);
        }}
      />
    </Box>
  );
};

export default Movies; 