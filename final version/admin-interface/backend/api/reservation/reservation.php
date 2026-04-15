<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';
require_once __DIR__ . '/../helpers.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET - Retrieve all reservations or filter by criteria
if ($method === 'GET') {
    $search = isset($_GET['search']) ? trim($_GET['search']) : '';
    $status = isset($_GET['status']) ? trim($_GET['status']) : '';
    $date = isset($_GET['date']) ? trim($_GET['date']) : '';

    $sql = 'SELECT 
                r.id,
                r.seance_id,
                r.user_name,
                r.user_email,
                r.user_phone,
                r.num_seats,
                r.total_price,
                r.status,
                r.created_at,
                r.reservation_code,
                s.start_time,
                f.title as film_title,
                sa.name as room_name
            FROM reservations r
            LEFT JOIN seances s ON r.seance_id = s.id
            LEFT JOIN films f ON s.film_id = f.id
            LEFT JOIN salle sa ON s.room_id = sa.id
            WHERE 1=1';

    // Apply filters
    if ($search !== '') {
        $search = mysqli_real_escape_string($conn, $search);
        $sql .= " AND (r.user_name LIKE '%$search%' OR r.user_email LIKE '%$search%' OR r.reservation_code LIKE '%$search%')";
    }

    if ($status !== '') {
        $status = mysqli_real_escape_string($conn, $status);
        $sql .= " AND r.status = '$status'";
    }

    if ($date !== '') {
        $date = mysqli_real_escape_string($conn, $date);
        $sql .= " AND DATE(s.start_time) = '$date'";
    }

    $sql .= ' ORDER BY r.created_at DESC';

    $result = mysqli_query($conn, $sql);

    if (!$result) {
        json_response(['error' => 'Query failed: ' . mysqli_error($conn)], 500);
    }

    $reservations = [];
    while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $reservations[] = [
            'id' => (int)$row['id'],
            'reservation_code' => htmlspecialchars($row['reservation_code']),
            'seance_id' => (int)$row['seance_id'],
            'user_name' => htmlspecialchars($row['user_name']),
            'user_email' => htmlspecialchars($row['user_email']),
            'user_phone' => htmlspecialchars($row['user_phone']),
            'num_seats' => (int)$row['num_seats'],
            'total_price' => (float)$row['total_price'],
            'status' => htmlspecialchars($row['status']),
            'film_title' => htmlspecialchars($row['film_title'] ?? 'N/A'),
            'room_name' => htmlspecialchars($row['room_name'] ?? 'N/A'),
            'start_time' => $row['start_time'],
            'created_at' => $row['created_at']
        ];
    }

    json_response(['data' => $reservations, 'count' => count($reservations)]);
    exit;
}

// POST - Create new reservation
if ($method === 'POST') {
    $data = get_json_input();
    required_fields($data, ['seance_id', 'user_name', 'user_email', 'num_seats']);

    $seance_id = (int)$data['seance_id'];
    $user_name = mysqli_real_escape_string($conn, trim((string)$data['user_name']));
    $user_email = mysqli_real_escape_string($conn, trim((string)$data['user_email']));
    $user_phone = isset($data['user_phone']) ? mysqli_real_escape_string($conn, trim((string)$data['user_phone'])) : '';
    $num_seats = (int)$data['num_seats'];

    // Validation
    if (strlen($user_name) < 2) {
        json_response(['error' => 'Name must be at least 2 characters'], 400);
    }

    if (!filter_var($user_email, FILTER_VALIDATE_EMAIL)) {
        json_response(['error' => 'Invalid email format'], 400);
    }

    if ($num_seats <= 0 || $num_seats > 10) {
        json_response(['error' => 'Number of seats must be between 1 and 10'], 400);
    }

    // Check seance exists and has available seats
    $seance_sql = "SELECT available_seats, base_price FROM seances WHERE id = $seance_id";
    $seance_result = mysqli_query($conn, $seance_sql);

    if (!$seance_result || mysqli_num_rows($seance_result) === 0) {
        json_response(['error' => 'Seance not found'], 404);
    }

    $seance = mysqli_fetch_array($seance_result, MYSQLI_ASSOC);
    $available_seats = (int)$seance['available_seats'];
    $base_price = (float)$seance['base_price'];

    if ($available_seats < $num_seats) {
        json_response(['error' => "Not enough seats available. Available: $available_seats"], 400);
    }

    // Generate reservation code
    $reservation_code = 'RES-' . strtoupper(substr(md5(uniqid()), 0, 8));
    $total_price = $base_price * $num_seats;
    $status = 'Confirmée';

    // Begin transaction
    mysqli_begin_transaction($conn);

    try {
        // Insert reservation
        $insert_sql = "INSERT INTO reservations (seance_id, user_name, user_email, user_phone, num_seats, total_price, status, reservation_code)
                      VALUES ($seance_id, '$user_name', '$user_email', '$user_phone', $num_seats, $total_price, '$status', '$reservation_code')";

        if (!mysqli_query($conn, $insert_sql)) {
            throw new Exception('Failed to create reservation: ' . mysqli_error($conn));
        }

        $reservation_id = mysqli_insert_id($conn);

        // Update available seats in seance
        $new_available = $available_seats - $num_seats;
        $update_sql = "UPDATE seances SET available_seats = $new_available WHERE id = $seance_id";

        if (!mysqli_query($conn, $update_sql)) {
            throw new Exception('Failed to update seat availability: ' . mysqli_error($conn));
        }

        mysqli_commit($conn);

        json_response([
            'success' => true,
            'message' => 'Reservation created successfully',
            'id' => $reservation_id,
            'reservation_code' => $reservation_code,
            'total_price' => $total_price
        ]);

    } catch (Exception $e) {
        mysqli_rollback($conn);
        json_response(['error' => $e->getMessage()], 500);
    }

    exit;
}

// PUT - Update reservation
if ($method === 'PUT') {
    $data = get_json_input();

    if (!isset($data['id']) || $data['id'] <= 0) {
        json_response(['error' => 'Invalid reservation ID'], 400);
    }

    $id = (int)$data['id'];
    $updates = [];
    $params = [];

    // Check which fields to update
    if (isset($data['user_name']) && strlen(trim($data['user_name'])) >= 2) {
        $user_name = mysqli_real_escape_string($conn, trim((string)$data['user_name']));
        $updates[] = "user_name = '$user_name'";
    }

    if (isset($data['user_email']) && filter_var($data['user_email'], FILTER_VALIDATE_EMAIL)) {
        $user_email = mysqli_real_escape_string($conn, trim((string)$data['user_email']));
        $updates[] = "user_email = '$user_email'";
    }

    if (isset($data['user_phone'])) {
        $user_phone = mysqli_real_escape_string($conn, trim((string)$data['user_phone']));
        $updates[] = "user_phone = '$user_phone'";
    }

    if (isset($data['status'])) {
        $status = mysqli_real_escape_string($conn, trim((string)$data['status']));
        $updates[] = "status = '$status'";
    }

    if (empty($updates)) {
        json_response(['error' => 'No valid fields to update'], 400);
    }

    $update_set = implode(', ', $updates);
    $sql = "UPDATE reservations SET $update_set WHERE id = $id";

    if (mysqli_query($conn, $sql)) {
        if (mysqli_affected_rows($conn) === 0) {
            json_response(['error' => 'Reservation not found'], 404);
        }
        json_response(['success' => true, 'message' => 'Reservation updated successfully']);
    } else {
        json_response(['error' => 'Update failed: ' . mysqli_error($conn)], 500);
    }

    exit;
}

// DELETE - Delete/Cancel reservation
if ($method === 'DELETE') {
    $data = get_json_input();

    if (!isset($data['id']) || $data['id'] <= 0) {
        json_response(['error' => 'Invalid reservation ID'], 400);
    }

    $id = (int)$data['id'];

    // Get reservation and seance info for seat refund
    $get_sql = "SELECT seance_id, num_seats FROM reservations WHERE id = $id";
    $get_result = mysqli_query($conn, $get_sql);

    if (!$get_result || mysqli_num_rows($get_result) === 0) {
        json_response(['error' => 'Reservation not found'], 404);
    }

    $reservation = mysqli_fetch_array($get_result, MYSQLI_ASSOC);
    $seance_id = (int)$reservation['seance_id'];
    $num_seats = (int)$reservation['num_seats'];

    // Begin transaction
    mysqli_begin_transaction($conn);

    try {
        // Delete reservation
        $delete_sql = "DELETE FROM reservations WHERE id = $id";

        if (!mysqli_query($conn, $delete_sql)) {
            throw new Exception('Failed to delete reservation: ' . mysqli_error($conn));
        }

        // Restore available seats
        $update_sql = "UPDATE seances SET available_seats = available_seats + $num_seats WHERE id = $seance_id";

        if (!mysqli_query($conn, $update_sql)) {
            throw new Exception('Failed to restore seat availability: ' . mysqli_error($conn));
        }

        mysqli_commit($conn);
        json_response(['success' => true, 'message' => 'Reservation cancelled successfully']);

    } catch (Exception $e) {
        mysqli_rollback($conn);
        json_response(['error' => $e->getMessage()], 500);
    }

    exit;
}

// Unsupported method
json_response(['error' => 'Method not allowed'], 405);
?>
