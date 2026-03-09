<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['user_id']) || !isset($data['name']) || !isset($data['year']) || !isset($data['semester'])) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$user_id = intval($data['user_id']);
$name = $data['name'];
$year = intval($data['year']);
$semester = intval($data['semester']);

$stmt = $conn->prepare("SELECT id FROM semesters WHERE user_id = ? AND year = ? AND semester = ? AND is_archived = 0");
$stmt->bind_param("iii", $user_id, $year, $semester);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    $stmt2 = $conn->prepare("INSERT INTO semesters (user_id, year, semester) VALUES (?, ?, ?)");
    $stmt2->bind_param("iii", $user_id, $year, $semester);
    $stmt2->execute();
    $semester_id = $conn->insert_id;
    $stmt2->close();
} else {
    $row = $result->fetch_assoc();
    $semester_id = $row['id'];
}

$stmt3 = $conn->prepare("INSERT INTO units (semester_id, name) VALUES (?, ?)");
$stmt3->bind_param("is", $semester_id, $name);

if ($stmt3->execute()) {
    echo json_encode(['success' => true, 'id' => $conn->insert_id, 'semester_id' => $semester_id]);
} else {
    echo json_encode(['error' => $stmt3->error]);
}
$stmt->close();
$stmt3->close();
?>
