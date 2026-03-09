<?php
require 'config.php';

$topic_id = isset($_GET['topic_id']) ? intval($_GET['topic_id']) : 0;

if ($topic_id == 0) {
    echo json_encode(['error' => 'Missing topic_id']);
    exit;
}

$sql = "SELECT id, content, status, created_at FROM notes WHERE topic_id = $topic_id ORDER BY created_at DESC";
$result = $conn->query($sql);
$notes = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $notes[] = $row;
    }
}

echo json_encode(['success' => true, 'notes' => $notes]);
?>
