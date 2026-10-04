<?php
/**
 * QR Code Generator for Cinema Tickets
 * Uses PHP GD library to generate QR codes
 */

class QRCodeGenerator {
    
    /**
     * Generate QR code for ticket
     * @param string $data - Data to encode (ticket ID, booking info)
     * @param string $filename - Output filename
     * @return string - Path to generated QR code
     */
    public static function generateQRCode($data, $filename = null) {
        // If filename not provided, generate one
        if (!$filename) {
            $filename = 'qr_' . md5($data . time()) . '.png';
        }
        
        // Ensure uploads/qrcodes directory exists
        $upload_dir = __DIR__ . '/../uploads/qrcodes/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $filepath = $upload_dir . $filename;
        
        // Use simple QR code generation with GD
        // For production, consider using a library like phpqrcode
        // This is a simplified version for demonstration
        
        // Create image
        $size = 300;
        $image = imagecreate($size, $size);
        
        // Allocate colors
        $white = imagecolorallocate($image, 255, 255, 255);
        $black = imagecolorallocate($image, 0, 0, 0);
        
        // Fill background
        imagefill($image, 0, 0, $white);
        
        // Simple pattern generation (for demo - use real QR library in production)
        // This creates a basic pattern, not a real QR code
        $hash = md5($data);
        $binary = '';
        for ($i = 0; $i < strlen($hash); $i++) {
            $binary .= str_pad(decbin(hexdec($hash[$i])), 4, '0', STR_PAD_LEFT);
        }
        
        $cell_size = 6;
        $grid_size = floor($size / $cell_size);
        
        for ($y = 0; $y < $grid_size; $y++) {
            for ($x = 0; $x < $grid_size; $x++) {
                $index = ($y * $grid_size + $x) % strlen($binary);
                if ($binary[$index] == '1') {
                    imagefilledrectangle(
                        $image,
                        $x * $cell_size,
                        $y * $cell_size,
                        ($x + 1) * $cell_size - 1,
                        ($y + 1) * $cell_size - 1,
                        $black
                    );
                }
            }
        }
        
        // Add text at bottom
        $text = substr($data, 0, 20);
        imagestring($image, 3, 10, $size - 20, $text, $black);
        
        // Save image
        imagepng($image, $filepath);
        imagedestroy($image);
        
        // Return relative path
        return 'uploads/qrcodes/' . $filename;
    }
    
    /**
     * Generate QR code for ticket with booking details
     * @param array $booking_data - Booking information
     * @return string - Path to QR code
     */
    public static function generateTicketQR($booking_data) {
        // Create unique ticket data string
        $ticket_string = sprintf(
            "TICKET-%s|SHOW-%s|SEAT-%s|USER-%s",
            $booking_data['ticket_id'] ?? 'UNKNOWN',
            $booking_data['show_id'] ?? 'UNKNOWN',
            $booking_data['seat_number'] ?? 'UNKNOWN',
            $booking_data['user_id'] ?? 'UNKNOWN'
        );
        
        $filename = 'ticket_' . ($booking_data['ticket_id'] ?? uniqid()) . '.png';
        
        return self::generateQRCode($ticket_string, $filename);
    }
    
    /**
     * Verify QR code data
     * @param string $qr_data - Scanned QR code data
     * @return array|false - Decoded ticket info or false
     */
    public static function verifyQRCode($qr_data) {
        // Parse QR code data
        $parts = explode('|', $qr_data);
        
        if (count($parts) < 4) {
            return false;
        }
        
        $ticket_info = [];
        foreach ($parts as $part) {
            list($key, $value) = explode('-', $part, 2);
            $ticket_info[strtolower($key)] = $value;
        }
        
        return $ticket_info;
    }
}

// Note: For production use, install phpqrcode library:
// composer require phpqrcode/phpqrcode
// Then use: QRcode::png($data, $filepath);
?>
