import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Grid,
    Paper,
    TextField,
    Button,
    Alert,
    Card,
    CardContent
} from '@mui/material';
import {
    LocationOn,
    Phone,
    Email,
    AccessTime,
    Send
} from '@mui/icons-material';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would normally send the data to your backend
        console.log('Contact form submitted:', formData);
        setSubmitted(true);

        // Reset form after 3 seconds
        setTimeout(() => {
            setFormData({ name: '', email: '', subject: '', message: '' });
            setSubmitted(false);
        }, 3000);
    };

    const contactInfo = [
        {
            icon: <LocationOn sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'Address',
            content: 'Cinema Booking, Kigali, Rwanda'
        },
        {
            icon: <Phone sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'Phone',
            content: '+250 786 123 456'
        },
        {
            icon: <Email sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'Email',
            content: 'info@cinemahub.rw'
        },
        {
            icon: <AccessTime sx={{ fontSize: 40, color: 'primary.main' }} />,
            title: 'Working Hours',
            content: 'Mon-Sun: 9AM-11PM'
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Contact Us
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Contact Information Cards */}
                <Grid item xs={12} md={5}>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Get In Touch
                    </Typography>

                    <Grid container spacing={2}>
                        {contactInfo.map((info, index) => (
                            <Grid item xs={12} key={index}>
                                <Card
                                    sx={{
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 6
                                        }
                                    }}
                                >
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            {info.icon}
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                    {info.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {info.content}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Map Placeholder */}
                    <Paper
                        sx={{
                            mt: 3,
                            height: 250,
                            background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 2
                        }}
                    >
                        <Typography variant="h6" color="text.secondary">
                            📍 Map Location
                        </Typography>
                    </Paper>
                </Grid>

                {/* Contact Form */}
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                            Send us a Message
                        </Typography>

                        {submitted && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                Thank you for your message! We'll get back to you soon.
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Your Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Your Email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        multiline
                                        rows={6}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        endIcon={<Send />}
                                        fullWidth
                                        sx={{
                                            py: 1.5,
                                            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
                                            }
                                        }}
                                    >
                                        Send Message
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>
            </Grid>

            {/* FAQ Section */}
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
                    Frequently Asked Questions
                </Typography>
                <Grid container spacing={3}>
                    {[
                        {
                            q: 'How do I book tickets online?',
                            a: 'Simply browse our movies, select your preferred showtime, choose your seats, and complete the payment process.'
                        },
                        {
                            q: 'Can I cancel or reschedule my booking?',
                            a: 'Yes, you can cancel or reschedule your booking from the My Bookings page up to 2 hours before the showtime.'
                        },
                        {
                            q: 'What payment methods do you accept?',
                            a: 'We accept credit/debit cards, mobile money, and wallet payments.'
                        },
                        {
                            q: 'How do I get my tickets?',
                            a: 'After successful payment, you will receive a QR code via email and in your My Bookings page. Show this at the theater entrance.'
                        }
                    ].map((faq, index) => (
                        <Grid item xs={12} md={6} key={index}>
                            <Paper sx={{ p: 3, height: '100%' }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                    {faq.q}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {faq.a}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Contact;
