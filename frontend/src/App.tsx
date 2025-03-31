import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// Pages
import Index from './pages/Index';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatBooking from './pages/SeatBooking';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import About from './pages/About';
import Contact from './pages/Contact';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect !== location.href) {
      const path = redirect.replace(location.origin, '');
      navigate(path);
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
      <Route path="/booking/:id" element={<SeatBooking />} />
      <Route path="/payment/:id" element={<Payment />} />
      <Route path="/confirmation/:id" element={<Confirmation />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App; 