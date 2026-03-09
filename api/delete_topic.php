<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['topic_id'])) {
    echo json_encode(['error' => 'Missing topic_id']);
    exit;
}

$topic_id = intval($data['topic_id']);

$sql = "DELETE FROM topics WHERE id = $topic_id";

if ($conn->query($sql) === TRUE) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => $conn->error]);
}
?>
