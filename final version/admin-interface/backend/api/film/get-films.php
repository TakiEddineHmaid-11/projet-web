<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

// Get all active films
$sql = "SELECT id, title FROM films WHERE is_active = 1 ORDER BY title";
$result = mysqli_query($conn, $sql);

$films = [];
while ($film = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    $films[] = $film;
}

echo json_encode(['data' => $films]);
?>
