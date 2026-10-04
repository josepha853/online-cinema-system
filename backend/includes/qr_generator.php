<?php
/**
 * QR Code Generator for Cinema Tickets
 * This file provides QR code generation functionality using PHP GD library
 */

class QRCodeGenerator {
    private $uploadDir = '../uploads/qrcodes/';
    
    public function __construct() {
        // Create directory if it doesn't exist
        if (!file_exists($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }
    
    /**
     * Generate QR code for a ticket
     * @param int $ticketId - The ticket ID
     * @param string $data - Data to encode in QR code
     * @return string - Path to generated QR code image
     */
    public function generateTicketQR($ticketId, $data) {
        // For now, we'll create a simple barcode-style image
        // In production, use a library like phpqrcode or endroid/qr-code
        
        $filename = "ticket_{$ticketId}_" . time() . ".png";
        $filepath = $this->uploadDir . $filename;
        
        // Create a simple image with ticket data
        $width = 300;
        $height = 300;
        $image = imagecreate($width, $height);
        
        // Colors
        $white = imagecolorallocate($image, 255, 255, 255);
        $black = imagecolorallocate($image, 0, 0, 0);
        $blue = imagecolorallocate($image, 0, 102, 204);
        
        // Fill background
        imagefill($image, 0, 0, $white);
        
        // Draw border
        imagerectangle($image, 10, 10, $width-10, $height-10, $blue);
        imagerectangle($image, 12, 12, $width-12, $height-12, $blue);
        
        // Add text
        $font = 3;
        $text1 = "CINEMA TICKET";
        $text2 = "ID: " . substr($data, 0, 20);
        $text3 = "Scan at entrance";
        
        imagestring($image, 5, 50, 50, $text1, $black);
        imagestring($image, $font, 30, 130, $text2, $black);
        imagestring($image, $font, 40, 160, $text3, $blue);
        
        // Draw a simple pattern (simulating QR code)
        for ($i = 0; $i < 10; $i++) {
            for ($j = 0; $j < 10; $j++) {
                if (($i + $j) % 2 == 0) {
                    imagefilledrectangle(
                        $image,
                        50 + ($i * 20),
                        190 + ($j * 10),
                        65 + ($i * 20),
                        198 + ($j * 10),
                        $black
                    );
                }
            }
        }
        
        // Save image
        imagepng($image, $filepath);
        imagedestroy($image);
        
        return 'uploads/qrcodes/' . $filename;
    }
    
    /**
     * Generate QR code data string
     * @param array $ticketInfo - Ticket information
     * @return string - Encoded data
     */
    public function generateQRData($ticketInfo) {
        return json_encode([
            'ticket_id' => $ticketInfo['ticket_id'],
            'order_id' => $ticketInfo['order_id'],
            'show_id' => $ticketInfo['show_id'],
            'seat' => $ticketInfo['seat_number'],
            'timestamp' => time(),
            'hash' => hash('sha256', $ticketInfo['ticket_id'] . $ticketInfo['order_id'] . time())
        ]);
    }
}

/**
 * Helper function to generate QR code
 * Can be called from other controllers
 */
function generate_ticket_qr($ticketId, $ticketInfo) {
    $qrGen = new QRCodeGenerator();
    $qrData = $qrGen->generateQRData($ticketInfo);
    return $qrGen->generateTicketQR($ticketId, $qrData);
}
?>
