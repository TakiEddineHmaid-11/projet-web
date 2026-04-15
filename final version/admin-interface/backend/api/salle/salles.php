<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../helpers.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';

    $sql = 'SELECT id, name, capacity FROM salle';

    if ($search != '') {
        $search = mysqli_real_escape_string($conn, $search);
        $sql .= " AND name LIKE '%$search%'";
    }

    $sql .= ' ORDER BY name ASC';

    $result = mysqli_query($conn, $sql);

    $salles = [];
    while ($salle = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $salles[] = [
            'id' => (int)$salle['id'],
            'nom' => htmlspecialchars($salle['name']),
            'capacite' => (int)$salle['capacity']
        ];
    }

    json_response(['salles' => $salles]);
    exit;
}

if ($method === 'POST') {
    $data = get_json_input();
    required_fields($data, ['nom', 'capacite']);

    $nom = mysqli_real_escape_string($conn, trim((string)$data['nom']));
    $capacite = (int)$data['capacite'];

    // Validation
    if (strlen($nom) < 2) {
        json_response(['error' => 'Le nom doit contenir au moins 2 caractères'], 400);
    }

    if ($capacite <= 0 || $capacite > 500) {
        json_response(['error' => 'La capacité doit être entre 1 et 500'], 400);
    }

    $sql = "INSERT INTO salle (name, capacity)
            VALUES ('$nom', $capacite)";

    if (mysqli_query($conn, $sql)) {
        $id = mysqli_insert_id($conn);
        json_response(['success' => true, 'id' => $id]);
        exit;
    } else {
        json_response(['error' => 'Erreur lors de l\'insertion: ' . mysqli_error($conn)], 500);
        exit;
    }
}

if ($method === 'PUT') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        json_response(['error' => 'ID invalide'], 400);
    }

    $data = get_json_input();
    required_fields($data, ['nom', 'capacite']);

    $nom = mysqli_real_escape_string($conn, trim((string)$data['nom']));
    $capacite = (int)$data['capacite'];

    // Validation
    if (strlen($nom) < 2) {
        json_response(['error' => 'Le nom doit contenir au moins 2 caractères'], 400);
    }

    if ($capacite <= 0 || $capacite > 500) {
        json_response(['error' => 'La capacité doit être entre 1 et 500'], 400);
    }

    $sql = "UPDATE salle SET name = '$nom', capacity = $capacite WHERE id = $id";

    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) > 0) {
            json_response(['success' => true]);
        } else {
            json_response(['error' => 'Salle non trouvée'], 404);
        }
    } else {
        json_response(['error' => 'Erreur lors de la mise à jour: ' . mysqli_error($conn)], 500);
    }
    exit;
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if ($id <= 0) {
        json_response(['error' => 'ID invalide'], 400);
    }

    // Hard delete
    $sql = "DELETE FROM salle WHERE id = $id";

    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) > 0) {
            json_response(['success' => true]);
        } else {
            json_response(['error' => 'Salle non trouvée'], 404);
        }
    } else {
        json_response(['error' => 'Erreur lors de la suppression: ' . mysqli_error($conn)], 500);
    }
    exit;
}

json_response(['error' => 'Méthode non autorisée'], 405);
