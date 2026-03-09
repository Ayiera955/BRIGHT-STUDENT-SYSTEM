<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['unit_id']) || !isset($data['label']) || !isset($data['name'])) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$unit_id = intval($data['unit_id']);
$label = $data['label'];
$name = $data['name'];

$stmt = $conn->prepare("INSERT INTO topics (unit_id, label, name) VALUES (?, ?, ?)");
$stmt->bind_param("iss", $unit_id, $label, $name);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'id' => $conn->insert_id]);
} else {
    echo json_encode(['error' => $stmt->error]);
}
$stmt->close();
?>
