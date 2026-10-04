import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Card,
    CardContent,
    CardMedia
} from '@mui/material';
import { LocationOn, Phone, Email, Star, Event, AccessTime, ArrowBack } from '@mui/icons-material';
import { theaterApi, showApi } from '../services/apiService';

const TheaterDetails = () => {
    const { theaterId } = useParams();
    const [theater, setTheater] = useState(null);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch theater details
                const theaterResponse = await theaterApi.getTheater(theaterId);
                if (theaterResponse.data.success) {
                    setTheater(theaterResponse.data.data);
                } else {
                    setError('Theater not found');
                    return;
                }

                // Fetch shows for this theater
                const showsResponse = await showApi.getShowsByTheater(theaterId);
                if (showsResponse.data.success) {
                    setShows(showsResponse.data.data);
                }
            } catch (err) {
                console.error('Error fetching details:', err);
                setError('Failed to load theater details');
            } finally {
                setLoading(false);
            }
        };

        if (theaterId) {
            fetchData();
        }
    }, [theaterId]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !theater) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">{error || 'Theater not found'}</Alert>
                <Button startIcon={<ArrowBack />} component={Link} to="/theaters" sx={{ mt: 2 }}>
                    Back to Theaters
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                component={Link}
                to="/theaters"
                sx={{ mb: 3 }}
            >
                Back to Theaters
            </Button>

            {/* Theater Header Info */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                            {theater.name}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                            <Chip
                                icon={<LocationOn />}
                                label={theater.city}
                                color="primary"
                            />
                            <Chip
                                icon={<Star />}
                                label={theater.rating ? `${parseFloat(theater.rating).toFixed(1)} / 5.0` : 'No ratings'}
                                variant="outlined"
                                color="warning"
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <LocationOn sx={{ mr: 2, color: 'text.secondary' }} />
                                <Typography variant="body1">{theater.address}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                                <Typography variant="body1">{theater.contact_phone || theater.contact}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Email sx={{ mr: 2, color: 'text.secondary' }} />
                                <Typography variant="body1">{theater.contact_email || 'info@cinema.com'}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Shows Section */}
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
                Now Showing
            </Typography>

            {shows.length > 0 ? (
                <Grid container spacing={3}>
                    {shows.map((show) => (
                        <Grid item xs={12} sm={6} md={4} key={show.show_id}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                                <CardMedia
                                    component="img"
                                    height="300"
                                    image={show.poster_url || 'https://via.placeholder.com/300x450?text=No+Poster'}
                                    alt={show.title}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" gutterBottom fontWeight="bold">
                                        {show.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                                        <Chip label={show.genre} size="small" />
                                        <Chip label={show.language} size="small" variant="outlined" />
                                        <Chip label={`${show.duration} min`} size="small" variant="outlined" />
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Event sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                {new Date(show.date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <AccessTime sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                                            <Typography variant="body2">
                                                {show.time.substring(0, 5)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Button
                                        component={Link}
                                        to={`/booking/${show.show_id}`}
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                    >
                                        Book Tickets
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Event sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No shows scheduled at this theater currently.
                    </Typography>
                </Paper>
            )}
        </Container>
    );
};

export default TheaterDetails;


