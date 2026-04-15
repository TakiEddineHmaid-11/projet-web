<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../helpers.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $genre = isset($_GET['genre']) ? trim($_GET['genre']) : '';

    $sql = 'SELECT id, title, genre, duration_minutes, classification, synopsis, poster_url FROM films WHERE is_active = 1';

    if ($search != '') {
        $search = mysqli_real_escape_string($conn, $search);
        $sql .= " AND (title LIKE '%$search%' OR synopsis LIKE '%$search%')";
    }

    if ($genre != '') {
        $genre = mysqli_real_escape_string($conn, $genre);
        $sql .= " AND genre = '$genre'";
    }

    $sql .= ' ORDER BY created_at DESC';

    $result = mysqli_query($conn, $sql);

    while ($film = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $synopsis = $film['synopsis'] ? $film['synopsis'] : '-';
        echo "<tr>
            <td>" . htmlspecialchars($film['title']) . "</td>
            <td>" . htmlspecialchars($film['genre']) . "</td>
            <td>" . $film['duration_minutes'] . " min</td>
            <td>" . htmlspecialchars($film['classification']) . "</td>
            <td>" . htmlspecialchars($synopsis) . "</td>
            <td>
                <button class='btn btn-sm' onclick='editFilm(" . $film['id'] . ")'>Modifier</button>
                <button class='btn btn-sm btn-danger' onclick='deleteFilm(" . $film['id'] . ")'>Supprimer</button>
            </td>
        </tr>";
    }
    exit;
}

if ($method === 'POST') {
    $data = get_json_input();
    required_fields($data, ['title', 'genre', 'duration_minutes', 'classification']);

    $title = mysqli_real_escape_string($conn, trim((string)$data['title']));
    $genre = mysqli_real_escape_string($conn, trim((string)$data['genre']));
    $duration = (int)$data['duration_minutes'];
    $classification = mysqli_real_escape_string($conn, trim((string)$data['classification']));
    $synopsis = mysqli_real_escape_string($conn, trim((string)($data['synopsis'] ?? '')));
    $poster_url = mysqli_real_escape_string($conn, trim((string)($data['poster_url'] ?? '')));

    $sql = "INSERT INTO films (title, genre, duration_minutes, classification, synopsis, poster_url)
            VALUES ('$title', '$genre', $duration, '$classification', '$synopsis', '$poster_url')";

    if (mysqli_query($conn, $sql)) {
        echo "OK";
        exit;
    } else {
        echo "ERROR: " . mysqli_error($conn);
        exit;
    }
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        echo "ERROR: Invalid ID";
        exit;
    }

    $sql = "DELETE FROM films WHERE id = $id";

    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) > 0) {
            echo "OK";
        } else {
            echo "ERROR: Film not found";
        }
    } else {
        echo "ERROR: " . mysqli_error($conn);
    }
    exit;
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        echo "ERROR: Invalid ID";
        exit;
    }

    $data = get_json_input();
    required_fields($data, ['title', 'genre', 'duration_minutes', 'classification']);

    $title = mysqli_real_escape_string($conn, trim((string)$data['title']));
    $genre = mysqli_real_escape_string($conn, trim((string)$data['genre']));
    $duration = (int)$data['duration_minutes'];
    $classification = mysqli_real_escape_string($conn, trim((string)$data['classification']));
    $synopsis = mysqli_real_escape_string($conn, trim((string)($data['synopsis'] ?? '')));
    $poster_url = mysqli_real_escape_string($conn, trim((string)($data['poster_url'] ?? '')));

    $sql = "UPDATE films 
            SET title = '$title', 
                genre = '$genre', 
                duration_minutes = $duration, 
                classification = '$classification', 
                synopsis = '$synopsis', 
                poster_url = '$poster_url',
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = $id AND is_active = 1";

    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) > 0) {
            echo "OK";
        } else {
            echo "ERROR: Film not found";
        }
    } else {
        echo "ERROR: " . mysqli_error($conn);
    }
    exit;
}

echo "ERROR: Method not allowed";
?>
