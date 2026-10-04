import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Alert,
  Chip,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  QrCode,
  QrCodeScanner,
  Download,
  Print,
  Share,
  CheckCircle,
  Error,
  Refresh,
  Close
} from '@mui/icons-material';

const QRCodeSystem = ({ 
  bookingData, 
  onScanResult, 
  mode = 'generate' // 'generate' or 'scan'
}) => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [qrCodeImage, setQrCodeImage] = useState('');
  const [scanDialog, setScanDialog] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (mode === 'generate' && bookingData) {
      generateQRCode();
    }
  }, [bookingData, mode]);

  const generateQRCode = async () => {
    try {
      // Create comprehensive QR code data
      const qrData = {
        bookingId: bookingData.bookingId,
        movieTitle: bookingData.movieTitle,
        theater: bookingData.theater,
        showtime: bookingData.showtime,
        date: bookingData.date,
        seats: bookingData.seats,
        customerName: bookingData.customerName,
        totalAmount: bookingData.totalAmount,
        timestamp: new Date().toISOString(),
        verificationCode: generateVerificationCode()
      };

      const qrString = JSON.stringify(qrData);
      setQrCodeData(qrString);

      // Generate QR code image using a mock implementation
      // In a real app, you'd use a library like qrcode.js
      const qrImageUrl = await generateQRCodeImage(qrString);
      setQrCodeImage(qrImageUrl);

    } catch (err) {
      setError('Failed to generate QR code');
      console.error('QR generation error:', err);
    }
  };

  const generateQRCodeImage = async (data) => {
    // Mock QR code generation - in real app use qrcode library
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    
    // Create a simple pattern as mock QR code
    ctx.fillStyle = '#000000';
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * 10, j * 10, 10, 10);
        }
      }
    }
    
    // Add booking ID in center
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(60, 90, 80, 20);
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(bookingData?.bookingId || 'MOCK', 100, 105);
    
    return canvas.toDataURL();
  };

  const generateVerificationCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const startScanning = async () => {
    try {
      setScanning(true);
      setError('');
      setScanResult(null);

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start scanning process
        scanQRCode();
      }
    } catch (err) {
      setError('Failed to access camera. Please check permissions.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const scanQRCode = () => {
    // Mock QR code scanning - in real app use jsQR library
    setTimeout(() => {
      // Simulate successful scan
      const mockScanResult = {
        bookingId: 'BK123456',
        movieTitle: 'Avengers: Endgame',
        theater: 'CineMax Kigali City',
        showtime: '20:30',
        date: '2024-12-20',
        seats: ['H8', 'H9'],
        customerName: 'John Doe',
        totalAmount: 7000,
        timestamp: new Date().toISOString(),
        verificationCode: 'ABC123',
        status: 'valid'
      };

      setScanResult(mockScanResult);
      setScanning(false);
      stopScanning();

      if (onScanResult) {
        onScanResult(mockScanResult);
      }
    }, 3000);
  };

  const downloadQRCode = () => {
    if (qrCodeImage) {
      const link = document.createElement('a');
      link.download = `ticket-${bookingData?.bookingId || 'qr'}.png`;
      link.href = qrCodeImage;
      link.click();
    }
  };

  const printQRCode = () => {
    if (qrCodeImage) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>Movie Ticket - ${bookingData?.bookingId}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .ticket { border: 2px dashed #333; padding: 20px; margin: 20px auto; max-width: 400px; }
              .qr-code { margin: 20px 0; }
              .details { text-align: left; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="ticket">
              <h2>🎬 CinemaHub Rwanda</h2>
              <div class="qr-code">
                <img src="${qrCodeImage}" alt="QR Code" style="width: 200px; height: 200px;" />
              </div>
              <div class="details">
                <p><strong>Booking ID:</strong> ${bookingData?.bookingId}</p>
                <p><strong>Movie:</strong> ${bookingData?.movieTitle}</p>
                <p><strong>Theater:</strong> ${bookingData?.theater}</p>
                <p><strong>Date & Time:</strong> ${bookingData?.date} at ${bookingData?.showtime}</p>
                <p><strong>Seats:</strong> ${bookingData?.seats?.join(', ')}</p>
                <p><strong>Customer:</strong> ${bookingData?.customerName}</p>
                <p><strong>Total:</strong> ${formatCurrency(bookingData?.totalAmount)}</p>
              </div>
              <p style="font-size: 12px; color: #666;">
                Present this QR code at the cinema entrance for verification
              </p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const shareQRCode = async () => {
    if (navigator.share && qrCodeImage) {
      try {
        // Convert data URL to blob
        const response = await fetch(qrCodeImage);
        const blob = await response.blob();
        const file = new File([blob], `ticket-${bookingData?.bookingId}.png`, { type: 'image/png' });

        await navigator.share({
          title: `Movie Ticket - ${bookingData?.movieTitle}`,
          text: `My movie ticket for ${bookingData?.movieTitle} at ${bookingData?.theater}`,
          files: [file]
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(qrCodeData);
      alert('QR code data copied to clipboard');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('rw-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const validateTicket = (scanData) => {
    // Mock validation logic
    const now = new Date();
    const showDate = new Date(scanData.date + ' ' + scanData.showtime);
    const timeDiff = showDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff < -2) {
      return { valid: false, reason: 'Ticket expired (show ended more than 2 hours ago)' };
    }

    if (hoursDiff > 24) {
      return { valid: false, reason: 'Ticket not yet valid (show is more than 24 hours away)' };
    }

    return { valid: true, reason: 'Ticket is valid' };
  };

  if (mode === 'generate') {
    return (
      <Box>
        {qrCodeImage ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              <QrCode sx={{ mr: 1 }} />
              Your Digital Ticket
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <img 
                src={qrCodeImage} 
                alt="QR Code" 
                style={{ width: 200, height: 200, border: '1px solid #ddd' }}
              />
            </Box>

            <Alert severity="info" sx={{ mb: 3 }}>
              Present this QR code at the cinema entrance for verification
            </Alert>

            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Download />}
                  onClick={downloadQRCode}
                >
                  Download
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  onClick={printQRCode}
                >
                  Print
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={shareQRCode}
                >
                  Share
                </Button>
              </Grid>
            </Grid>

            {/* Ticket Details */}
            <Card sx={{ mt: 3, textAlign: 'left' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Ticket Details</Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Booking ID</Typography>
                    <Typography variant="body1" fontWeight="bold">{bookingData?.bookingId}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Movie</Typography>
                    <Typography variant="body1">{bookingData?.movieTitle}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Theater</Typography>
                    <Typography variant="body1">{bookingData?.theater}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                    <Typography variant="body1">{bookingData?.date} at {bookingData?.showtime}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Seats</Typography>
                    <Typography variant="body1">{bookingData?.seats?.join(', ')}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">Total Amount</Typography>
                    <Typography variant="body1" fontWeight="bold">{formatCurrency(bookingData?.totalAmount)}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Paper>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Generating your digital ticket...
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // Scanner mode
  return (
    <Box>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          <QrCodeScanner sx={{ mr: 1 }} />
          QR Code Scanner
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<QrCodeScanner />}
          onClick={() => setScanDialog(true)}
          sx={{ mb: 3 }}
        >
          Start Scanning
        </Button>

        {scanResult && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircle color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Scan Result</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Booking ID</Typography>
                  <Typography variant="body1" fontWeight="bold">{scanResult.bookingId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Customer</Typography>
                  <Typography variant="body1">{scanResult.customerName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Movie</Typography>
                  <Typography variant="body1">{scanResult.movieTitle}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Seats</Typography>
                  <Typography variant="body1">{scanResult.seats?.join(', ')}</Typography>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                {validateTicket(scanResult).valid ? (
                  <Chip label="Valid Ticket" color="success" icon={<CheckCircle />} />
                ) : (
                  <Chip label="Invalid Ticket" color="error" icon={<Error />} />
                )}
              </Box>
            </CardContent>
          </Card>
        )}
      </Paper>

      {/* Scanner Dialog */}
      <Dialog open={scanDialog} onClose={() => setScanDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Scan QR Code
          <IconButton
            onClick={() => setScanDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            {scanning ? (
              <Box>
                <video
                  ref={videoRef}
                  style={{ width: '100%', maxWidth: 300, height: 200 }}
                  autoPlay
                  playsInline
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Position the QR code within the camera view
                </Typography>
                <CircularProgress sx={{ mt: 2 }} />
              </Box>
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<QrCodeScanner />}
                onClick={startScanning}
              >
                Start Camera
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScanDialog(false)}>Close</Button>
          {scanning && (
            <Button onClick={stopScanning} color="error">
              Stop Scanning
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QRCodeSystem;


