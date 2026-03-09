<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['note_id'])) {
    echo json_encode(['error' => 'Missing note_id']);
    exit;
}

$note_id = intval($data['note_id']);

$sql = "DELETE FROM notes WHERE id = $note_id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => $conn->error]);
}
?>
