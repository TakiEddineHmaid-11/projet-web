<?php
// User Login Endpoint
declare(strict_types=1);

// Get JSON input
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Validate input
if (!isset($data['username']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Missing username or password'
    ]);
    exit;
}

$username = trim($data['username']);
$password = trim($data['password']);

// Validate credentials (demo mode - using hardcoded credentials)
// In production, you should query a database with secure password hashing
if ($username === 'admin' && $password === 'admin') {
    // Set session or JWT token
    session_start();
    $_SESSION['user'] = [
        'id' => 1,
        'username' => $username,
        'role' => 'admin',
        'login_time' => time()
    ];
    
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => $_SESSION['user'],
        'token' => bin2hex(random_bytes(32)) // Generate a simple token for client-side use
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid credentials'
    ]);
}
?>
