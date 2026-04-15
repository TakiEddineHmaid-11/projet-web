<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');

// Load helper functions
require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$host = getenv('DB_HOST') ?: '127.0.0.1';
$port = getenv('DB_PORT') ?: '3306';
$dbName = getenv('DB_NAME') ?: 'cinemamanager';
$dbUser = getenv('DB_USER') ?: 'root';
$dbPass = getenv('DB_PASS') ?: '';

// MySQLi connection
$conn = mysqli_connect($host, $dbUser, $dbPass, $dbName, (int)$port);

if (!$conn) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database connection failed',
        'details' => mysqli_connect_error(),
    ]);
    exit;
}

// Set charset
mysqli_set_charset($conn, 'utf8mb4');
