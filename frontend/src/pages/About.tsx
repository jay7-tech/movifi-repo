import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const About = () => {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" gutterBottom align="center">
        About Movifi
      </Typography>
      <Typography variant="h5" color="text.secondary" paragraph align="center" sx={{ mb: 8 }}>
        Your Ultimate Movie Booking Experience
      </Typography>

      <Grid container spacing={4}>
        {/* Mission Statement */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              At Movifi, we're dedicated to providing movie enthusiasts with a seamless and enjoyable
              movie booking experience. Our platform combines cutting-edge technology with
              user-friendly design to make booking your favorite movies as easy as possible.
            </Typography>
          </Paper>
        </Grid>

        {/* Features */}
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <MovieIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Wide Selection
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access to the latest movies and timeless classics
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <LocalMoviesIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Easy Booking
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Simple and quick ticket booking process
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <TheaterComedyIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Premium Experience
            </Typography>
            <Typography variant="body2" color="text.secondary">
              High-quality theaters and comfortable seating
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <EmojiEventsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Rewards Program
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Earn points and get exclusive benefits
            </Typography>
          </Box>
        </Grid>

        {/* History */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" gutterBottom>
              Our History
            </Typography>
            <Typography variant="body1" paragraph>
              Founded in 2025, Movifi has quickly become a leading name in the movie booking industry.
              We started with a simple idea: to make movie booking accessible, convenient, and
              enjoyable for everyone. Today, we continue to innovate and improve our services to
              provide the best possible experience for our users.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default About; 