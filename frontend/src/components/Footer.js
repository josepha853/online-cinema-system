import React from 'react';
import { Box, Container, Typography, Grid, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn, Phone, Email, LocationOn, AccessTime } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #0a0e27 0%, #1a237e 50%, #000051 100%)',
        color: 'white',
        py: 6,
        mt: 'auto',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🎬 online Cinema boooking
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your premier destination for cinema ticket booking and entertainment management in Rwanda.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton color="inherit" size="small">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" size="small">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" size="small">
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/" color="inherit" underline="hover" sx={{ '&:hover': { color: 'secondary.light' } }}>
                  Home
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/movies" color="inherit" underline="hover" sx={{ '&:hover': { color: 'secondary.light' } }}>
                  Movies
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/theaters" color="inherit" underline="hover" sx={{ '&:hover': { color: 'secondary.light' } }}>
                  Theaters
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="/contact" color="inherit" underline="hover" sx={{ '&:hover': { color: 'secondary.light' } }}>
                  Contact
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Services */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Services
            </Typography>
            <Box component="ul" sx={{ pl: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#" color="inherit" underline="hover" sx={{ '&:hover': { color: 'secondary.light' } }}>
                  Online Booking
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#" color="inherit" underline="hover" sx={{ '&:hover': { color: 'secondary.light' } }}>
                  Group Bookings
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link href="#" color="inherit" underline="hover" sx={{ '&:hover': { color: 'secondary.light' } }}>
                  Gift Cards
                </Link>
              </Box>

            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" gutterBottom>
              Contact Info
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                cinema booking, Kigali, Rwanda
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Phone sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                +250 786 123 456
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                info@cinemahub.rw
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">
                Mon-Sun: 9AM-11PM
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                © {new Date().getFullYear()} Online Cinema. All rights reserved.
              </Typography>
            </Grid>

          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;


