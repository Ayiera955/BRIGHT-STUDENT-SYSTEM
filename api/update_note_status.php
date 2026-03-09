<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['note_id']) || !isset($data['status'])) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$note_id = intval($data['note_id']);
$status = $data['status'];

$stmt = $conn->prepare("UPDATE notes SET status = ? WHERE id = ?");
$stmt->bind_param("si", $status, $note_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => $stmt->error]);
}
$stmt->close();
?>
