<?php
require 'config.php';

$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit;
}

if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing email or password']);
    exit;
}

$email = trim($data['email']);
$password = trim($data['password']);

$stmt = $conn->prepare("SELECT id, name, email, password FROM users WHERE email = ?");
if (!$stmt) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        $stmt2 = $conn->prepare("SELECT year, semester FROM semesters WHERE user_id = ? AND is_archived = 0 ORDER BY year DESC, semester DESC LIMIT 1");
        $stmt2->bind_param("i", $user['id']);
        $stmt2->execute();
        $sem_result = $stmt2->get_result();
        $year = 1;
        $semester = 1;
        if ($sem_result->num_rows > 0) {
            $sem = $sem_result->fetch_assoc();
            $year = $sem['year'];
            $semester = $sem['semester'];
        }
        $stmt2->close();
        http_response_code(200);
        echo json_encode(['success' => true, 'user' => ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email'], 'year' => $year, 'semester' => $semester]]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid password']);
    }
} else {
    http_response_code(401);
    echo json_encode(['error' => 'User not found']);
}
$stmt->close();
?>
