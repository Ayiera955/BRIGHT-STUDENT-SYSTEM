<?php
require 'config.php';

$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$year = isset($_GET['year']) ? intval($_GET['year']) : 0;
$semester = isset($_GET['semester']) ? intval($_GET['semester']) : 0;

if ($user_id == 0) {
    echo json_encode(['error' => 'Missing user_id']);
    exit;
}

$sql = "SELECT u.id, u.name, u.progress_percentage, s.year, s.semester 
        FROM units u 
        JOIN semesters s ON u.semester_id = s.id 
        WHERE s.user_id = $user_id AND s.is_archived = 0";

if ($year > 0 && $semester > 0) {
    $sql .= " AND s.year = $year AND s.semester = $semester";
}

$result = $conn->query($sql);
$units = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $units[] = $row;
    }
}

echo json_encode(['success' => true, 'units' => $units]);
?>
