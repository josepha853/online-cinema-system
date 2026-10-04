import React, { useEffect, useRef } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ 
  data, 
  size = 200, 
  title = "Ticket QR Code",
  showData = true 
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (data && canvasRef.current) {
      generateQRCode();
    }
  }, [data, size]);

  const generateQRCode = async () => {
    try {
      const canvas = canvasRef.current;
      await QRCode.toCanvas(canvas, data, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  if (!data) {
    return (
      <Paper sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          No data provided for QR code generation
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Box display="flex" justifyContent="center" mb={2}>
        <canvas 
          ref={canvasRef}
          style={{ 
            border: '1px solid #ddd',
            borderRadius: '8px'
          }}
        />
      </Box>
      
      {showData && (
        <Typography 
          variant="caption" 
          color="text.secondary"
          sx={{ 
            wordBreak: 'break-all',
            display: 'block',
            maxWidth: size,
            mx: 'auto'
          }}
        >
          {data}
        </Typography>
      )}
    </Paper>
  );
};

export default QRCodeGenerator;
