import { Box, Container, Grid, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your one-stop destination for booking movie tickets online. We provide a seamless experience for movie enthusiasts.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box>
              <Link href="/movies" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Movies
              </Link>
              <Link href="/about" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                About Us
              </Link>
              <Link href="/contact" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Info
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: XXXXXXXXXXXXXXXX
              <br />
              Phone: XXXXXXXXXXXXXXXX
              <br />
              Address: XXXXXXXXXXXXXXXX
            </Typography>
          </Grid>
        </Grid>
        <Box mt={4}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} MoviFi. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 