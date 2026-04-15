<?php
// API Router
declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

$requestURI = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove base path from URI
$basePath = '/CinemaManager/api';
$route = str_replace($basePath, '', $requestURI);
$route = trim($route, '/');

// Parse route
$parts = explode('/', $route);
$resource = $parts[0] ?? '';
$action = $parts[1] ?? '';

// Route film requests
if ($resource === 'auth') {
    if ($action === 'login' || $method === 'POST') {
        require_once __DIR__ . '/auth/login.php';
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Auth endpoint not found']);
    }
}
// Route film requests
elseif ($resource === 'films') {
    if ($action === 'get' || $method === 'GET') {
        require_once __DIR__ . '/film/get-films.php';
    } else {
        require_once __DIR__ . '/film/film.php';
    }
}
// Route seance requests
elseif ($resource === 'seances') {
    require_once __DIR__ . '/seance/seance.php';
}
// Route reservation requests
elseif ($resource === 'reservations') {
    require_once __DIR__ . '/reservation/reservation.php';
}
// Route salle requests
elseif ($resource === 'salles') {
    require_once __DIR__ . '/salle/salle.php';
}
else {
    http_response_code(404);
    echo json_encode(['error' => 'Route not found']);
}
?>
