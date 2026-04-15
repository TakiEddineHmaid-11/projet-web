<?php
header('Content-Type: application/json');
require_once '../../bootstrap.php';

// Vérifier les paramètres requis
if (!isset($_GET['room_id']) || !isset($_GET['start_time']) || !isset($_GET['film_id'])) {
    json_response(['error' => 'Paramètres manquants (room_id, start_time, film_id)'], 400);
    exit;
}

$room_id = (int)$_GET['room_id'];
$start_time = mysqli_real_escape_string($conn, trim((string)$_GET['start_time']));
$film_id = (int)$_GET['film_id'];
$exclude_seance_id = isset($_GET['exclude_seance_id']) ? (int)$_GET['exclude_seance_id'] : 0;

// Validation de base
if ($room_id <= 0 || $film_id <= 0) {
    json_response(['error' => 'room_id et film_id doivent être positifs'], 400);
    exit;
}

// Récupérer la durée du film
$film_query = mysqli_query($conn, "SELECT duration_minutes FROM films WHERE id = $film_id AND is_active = 1");
if (mysqli_num_rows($film_query) === 0) {
    json_response(['error' => 'Film non trouvé'], 404);
    exit;
}

$film_data = mysqli_fetch_array($film_query, MYSQLI_ASSOC);
$duration_minutes = (int)$film_data['duration_minutes'];
$buffer_minutes = 15; // 15 minutes entre les séances
$total_duration = $duration_minutes + $buffer_minutes;

// Convertir start_time en DateTime pour les calculs
try {
    $start_dt = new DateTime($start_time);
    $end_dt = clone $start_dt;
    $end_dt->modify("+$total_duration minutes");
} catch (Exception $e) {
    json_response(['error' => 'Format start_time invalide (YYYY-MM-DD HH:MM:SS attendu)'], 400);
    exit;
}

$start_str = $start_dt->format('Y-m-d H:i:s');
$end_str = $end_dt->format('Y-m-d H:i:s');

// Debug logging
error_log("📍 Availability Check: room_id=$room_id, film_id=$film_id, exclude_seance_id=$exclude_seance_id");
error_log("⏰ New seance: $start_str to $end_str (duration: $total_duration min)");

// Chercher les séances qui chevauchent cet intervalle
$exclude_clause = $exclude_seance_id > 0 ? "AND se.id != $exclude_seance_id" : "";

$sql = "SELECT 
            se.id,
            se.start_time,
            f.title as film_title,
            f.duration_minutes,
            DATE_ADD(se.start_time, INTERVAL f.duration_minutes + 15 MINUTE) as fin_prevue
        FROM seances se
        JOIN films f ON se.film_id = f.id
        WHERE se.room_id = $room_id
        $exclude_clause
        AND se.start_time < '$end_str'
        AND DATE_ADD(se.start_time, INTERVAL f.duration_minutes + 15 MINUTE) > '$start_str'
        ORDER BY se.start_time ASC";

error_log("🔍 SQL Query: $sql");

$result = mysqli_query($conn, $sql);

if (!$result) {
    json_response(['error' => 'Erreur requête BD: ' . mysqli_error($conn)], 500);
    exit;
}

$conflicts = [];
while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    $conflicts[] = [
        'id' => (int)$row['id'],
        'film_title' => htmlspecialchars($row['film_title']),
        'start_time' => $row['start_time'],
        'fin_prevue' => $row['fin_prevue'],
        'duration_minutes' => (int)$row['duration_minutes']
    ];
}

// Response
$available = count($conflicts) === 0;

error_log("📊 Conflicts found: " . count($conflicts));
foreach ($conflicts as $c) {
    error_log("  - " . $c['film_title'] . " from " . $c['start_time'] . " to " . $c['fin_prevue']);
}

json_response([
    'available' => $available,
    'requested_time' => $start_str,
    'requested_end' => $end_str,
    'duration_requested' => $total_duration,
    'conflicts' => $conflicts,
    'message' => $available 
        ? "Room available from $start_str to $end_str" 
        : "Room occupied. Conflicts detected."
]);
