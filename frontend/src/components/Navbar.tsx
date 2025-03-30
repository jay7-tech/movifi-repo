import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import MovieIcon from '@mui/icons-material/Movie';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import LoginDialog from './auth/LoginDialog';
import SignupDialog from './auth/SignupDialog';

const Navbar = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    // TODO: Update auth state and show user menu
  };

  const handleSignupSuccess = () => {
    setIsSignupOpen(false);
    // TODO: Update auth state and show user menu
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleSignupClick = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleLoginDialogClose = () => {
    setIsLoginOpen(false);
  };

  const handleSignupDialogClose = () => {
    setIsSignupOpen(false);
  };

  const switchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <MovieIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
            }}
          >
            Movifi
          </Typography>
          <Box>
            <Button
              color="inherit"
              component={RouterLink}
              to="/movies"
              sx={{ mx: 1 }}
            >
              Movies
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/about"
              sx={{ mx: 1 }}
            >
              About
            </Button>
            <Button
              color="inherit"
              component={RouterLink}
              to="/contact"
              sx={{ mx: 1 }}
            >
              Contact
            </Button>
            <IconButton
              color="inherit"
              onClick={handleLoginClick}
              sx={{
                ml: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <LoginDialog
        open={isLoginOpen}
        onClose={handleLoginDialogClose}
        onSuccess={handleLoginSuccess}
        onSignupClick={handleSignupClick}
      />

      <SignupDialog
        open={isSignupOpen}
        onClose={handleSignupDialogClose}
        onSuccess={handleSignupSuccess}
        onLoginClick={switchToLogin}
      />
    </>
  );
};

export default Navbar; 