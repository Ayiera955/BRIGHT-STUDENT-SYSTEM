<?php
require 'config.php';

$unit_id = isset($_GET['unit_id']) ? intval($_GET['unit_id']) : 0;

if ($unit_id == 0) {
    echo json_encode(['error' => 'Missing unit_id']);
    exit;
}

$sql = "SELECT id, label, name, status, created_at FROM topics WHERE unit_id = $unit_id ORDER BY created_at DESC";
$result = $conn->query($sql);
$topics = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $topics[] = $row;
    }
}

echo json_encode(['success' => true, 'topics' => $topics]);
?>
