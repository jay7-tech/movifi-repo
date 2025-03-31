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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import movieService, { regions } from '../services/movieService';
import backendMovieService, { BackendMovie } from '../services/backendMovieService';
import RefreshIcon from '@mui/icons-material/Refresh';

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
        boxShadow: 1,
        '&:hover': {
          transform: 'scale(1.03)',
          transition: 'transform 0.2s ease-in-out',
          boxShadow: 3,
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
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="div" 
          noWrap
          sx={{ color: '#1a237e' }}
        >
          {title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Rating
            value={rating / 2}
            precision={0.5}
            readOnly
            size="small"
          />
          <Chip
            label="BOOK"
            color="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onBook(movie.id);
            }}
          />
        </Box>
        <Typography 
          variant="body2" 
          sx={{ color: '#455a64' }}
        >
          Release: {new Date(releaseDate).toLocaleDateString()}
        </Typography>
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
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', pt: 8 }}>
      <Container sx={{ py: 4 }}>
        {/* Tabs Section */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider', 
          mb: 4,
          bgcolor: 'white',
          borderRadius: '16px',
          p: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <Tabs 
            value={selectedTab} 
            onChange={handleTabChange} 
            aria-label="movie categories"
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                color: '#546e7a',
                fontWeight: 500,
                fontSize: '1rem',
                textTransform: 'none',
                '&.Mui-selected': {
                  color: '#e53935',
                  fontWeight: 600
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#e53935'
              }
            }}
          >
            <Tab label="IN CINEMAS" />
            <Tab label="MY MOVIES" />
          </Tabs>
        </Box>

        {/* Search and Filter Section */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: '16px',
            bgcolor: 'white',
            transition: 'all 0.3s ease'
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search movies by title..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#9e9e9e' }} />
                    </InputAdornment>
                  ),
                  endAdornment: searchQuery && (
                    <InputAdornment position="end">
                      <IconButton 
                        size="small" 
                        onClick={clearSearch}
                        sx={{ 
                          '&:hover': { 
                            color: '#e53935' 
                          } 
                        }}
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { 
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e53935'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e53935'
                    },
                    '& .MuiInputBase-input': {
                      color: '#37474f',
                      '&::placeholder': {
                        color: '#9e9e9e',
                        opacity: 1
                      }
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    color: '#9e9e9e',
                    '&.Mui-focused': {
                      color: '#e53935'
                    }
                  }}
                >
                  Language
                </InputLabel>
                <Select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  sx={{ 
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e53935'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e53935'
                    },
                    color: '#37474f'
                  }}
                >
                  <MenuItem value="">All Languages</MenuItem>
                  {languages.map((lang) => (
                    <MenuItem 
                      key={lang.code} 
                      value={lang.code}
                      sx={{
                        '&:hover': {
                          bgcolor: '#ffebee'
                        },
                        '&.Mui-selected': {
                          bgcolor: '#ffebee',
                          '&:hover': {
                            bgcolor: '#ffcdd2'
                          }
                        }
                      }}
                    >
                      {lang.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    color: '#9e9e9e',
                    '&.Mui-focused': {
                      color: '#e53935'
                    }
                  }}
                >
                  Region
                </InputLabel>
                <Select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  sx={{ 
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e0e0e0'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e53935'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#e53935'
                    },
                    color: '#37474f'
                  }}
                >
                  {regions.map((region) => (
                    <MenuItem 
                      key={region.code} 
                      value={region.code}
                      sx={{
                        '&:hover': {
                          bgcolor: '#ffebee'
                        },
                        '&.Mui-selected': {
                          bgcolor: '#ffebee',
                          '&:hover': {
                            bgcolor: '#ffcdd2'
                          }
                        }
                      }}
                    >
                      {region.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Count */}
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 3,
            bgcolor: 'white',
            p: 2,
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            color: '#37474f',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Box 
            component="span" 
            sx={{ 
              color: '#e53935',
              fontWeight: 600 
            }}
          >
            {filteredMovies.length}
          </Box>
          {filteredMovies.length === 1 ? 'movie' : 'movies'} found
        </Typography>

        {/* Empty State */}
        {filteredMovies.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4, 
            bgcolor: 'white', 
            borderRadius: 2,
            boxShadow: 1
          }}>
            <Typography 
              variant="h6" 
              sx={{ color: '#455a64' }}
            >
              No movies found matching your search.
            </Typography>
          </Box>
        )}

        {/* Movies Grid */}
        <Grid container spacing={3}>
          {loading ? (
            Array.from(new Array(8)).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Paper sx={{ p: 2, height: '100%', borderRadius: 2, boxShadow: 1 }}>
                  <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
                  <Skeleton variant="text" width="80%" sx={{ mt: 1 }} />
                  <Skeleton variant="text" width="40%" />
                </Paper>
              </Grid>
            ))
          ) : filteredMovies.length === 0 ? (
            <Grid item xs={12}>
              <Box sx={{ 
                textAlign: 'center', 
                py: 4, 
                bgcolor: 'white', 
                borderRadius: 2,
                boxShadow: 1
              }}>
                <Typography variant="h6" color="text.secondary">
                  No movies found matching your search.
                </Typography>
              </Box>
            </Grid>
          ) : (
            filteredMovies.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard 
                  movie={movie} 
                  onBook={(id) => navigate(`/booking/${id}`)}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Container>

      {/* Add Movie Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle sx={{ color: '#1a237e' }}>Add New Movie</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={newMovie.title}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Overview"
              name="overview"
              value={newMovie.overview}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Poster Path (URL)"
              name="posterPath"
              value={newMovie.posterPath}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Release Date"
              name="releaseDate"
              type="date"
              value={newMovie.releaseDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Rating"
              name="rating"
              type="number"
              value={newMovie.rating}
              onChange={handleInputChange}
              inputProps={{ min: 0, max: 10, step: 0.1 }}
            />
            <DialogActions>
              <Button onClick={handleDialogClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Add Movie
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{
            '& .MuiAlert-message': {
              color: snackbar.severity === 'success' ? '#1b5e20' : '#b71c1c'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Movies; 