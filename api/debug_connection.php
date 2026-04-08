<?php
header('Content-Type: application/json; charset=utf-8');

// Test database connection
$host = 'localhost';
$user = 'root';
$password = '';
$database = 'brightstudent';

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

echo json_encode(['success' => true, 'message' => 'Database connected']);
?>
