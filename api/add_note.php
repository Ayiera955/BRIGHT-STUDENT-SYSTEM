<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['topic_id']) || !isset($data['content'])) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$topic_id = intval($data['topic_id']);
$content = $data['content'];
$status = isset($data['status']) ? $data['status'] : 'Unresolved';

$stmt = $conn->prepare("INSERT INTO notes (topic_id, content, status) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $topic_id, $content, $status);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
} else {
    echo json_encode(['error' => $stmt->error]);
}
$stmt->close();
?>
