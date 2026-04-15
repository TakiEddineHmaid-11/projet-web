<?php

declare(strict_types=1);

/**
 * helpers.php
 * Common helper functions for API endpoints
 */

/**
 * Send JSON response and exit
 */
function json_response(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($payload);
    exit;
}

/**
 * Get JSON input from request body
 */
function get_json_input(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return [];
    }

    return $data;
}

/**
 * Validate required fields in data array
 */
function required_fields(array $data, array $fields): void
{
    foreach ($fields as $field) {
        if (!array_key_exists($field, $data) || $data[$field] === '' || $data[$field] === null) {
            json_response(['error' => 'Missing required field: ' . $field], 422);
        }
    }
}

/**
 * Normalize reservation status
 */
function normalize_reservation_status(?string $value): string
{
    $value = strtolower(trim((string) $value));
    if ($value === 'attente') {
        return 'Attente';
    }
    if ($value === 'annule' || $value === 'annulee') {
        return 'Annulee';
    }
    return 'Confirmee';
}

/**
 * Normalize seance status
 */
function normalize_seance_status(?string $value): string
{
    $value = strtolower(trim((string) $value));
    if ($value === 'complet') {
        return 'Complet';
    }
    if ($value === 'annule' || $value === 'annulee') {
        return 'Annule';
    }
    return 'Disponible';
}

?>
