<?php
/**
 * Mystery Quest Email Opt-Out Handler
 * Processes email opt-out requests and maintains opt-out list
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
    exit;
}

// Validate email
$email = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL);
if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit;
}

// Path to opt-out JSON file
$optOutFile = '../scripts/email_opt_outs.json';

try {
    // Load existing opt-outs
    $optOuts = [];
    if (file_exists($optOutFile)) {
        $jsonContent = file_get_contents($optOutFile);
        $optOuts = json_decode($jsonContent, true) ?? [];
    }
    
    // Check if already opted out
    $emailExists = false;
    foreach ($optOuts as $record) {
        if (strtolower($record['email']) === strtolower($email)) {
            $emailExists = true;
            break;
        }
    }
    
    // Add to opt-out list if not already present
    if (!$emailExists) {
        $optOuts[] = [
            'email' => strtolower($email),
            'timestamp' => $input['timestamp'] ?? date('c'),
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            'token' => $input['token'] ?? null
        ];
        
        // Save updated opt-out list
        $jsonContent = json_encode($optOuts, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if (file_put_contents($optOutFile, $jsonContent) === false) {
            throw new Exception('Failed to save opt-out record');
        }
        
        // Log the opt-out
        $logEntry = sprintf(
            "[%s] OPT-OUT: %s from IP %s\n",
            date('Y-m-d H:i:s'),
            $email,
            $_SERVER['REMOTE_ADDR'] ?? 'unknown'
        );
        file_put_contents('../scripts/opt_out.log', $logEntry, FILE_APPEND | LOCK_EX);
    }
    
    // Always return success to prevent email harvesting
    echo json_encode([
        'success' => true,
        'message' => 'Successfully opted out',
        'email' => $email,
        'already_opted_out' => $emailExists
    ]);
    
} catch (Exception $e) {
    error_log('Opt-out error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Server error - please try again or contact support'
    ]);
}
?>
