<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    echo json_encode(['error' => 'Invalid ID']);
    exit;
}

$sql = "SELECT id, title, genre, duration_minutes, classification, synopsis, poster_url FROM films WHERE id = $id AND is_active = 1";
$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode(['error' => 'Query error']);
    exit;
}

$film = mysqli_fetch_array($result, MYSQLI_ASSOC);

if (!$film) {
    echo json_encode(['error' => 'Film not found']);
    exit;
}

echo json_encode(['data' => $film]);
?>
