<?php
require 'config.php';

echo "<h1>🔍 Database Connection & System Test</h1>";

// Test 1: Database Connection
echo "<h2>Test 1: Database Connection</h2>";
if ($conn->connect_error) {
    echo "<p style='color: red;'>❌ Connection failed: " . $conn->connect_error . "</p>";
} else {
    echo "<p style='color: green;'>✅ Database connected successfully</p>";
}

// Test 2: Check tables exist
echo "<h2>Test 2: Database Tables</h2>";
$tables = ['users', 'semesters', 'units', 'topics', 'notes', 'materials'];
foreach ($tables as $table) {
    $result = $conn->query("SHOW TABLES LIKE '$table'");
    if ($result->num_rows > 0) {
        echo "<p style='color: green;'>✅ Table '$table' exists</p>";
    } else {
        echo "<p style='color: red;'>❌ Table '$table' missing</p>";
    }
}

// Test 3: Check user count
echo "<h2>Test 3: User Data</h2>";
$result = $conn->query("SELECT COUNT(*) as count FROM users");
$row = $result->fetch_assoc();
echo "<p>Total users: " . $row['count'] . "</p>";

// Test 4: Check semesters
echo "<h2>Test 4: Semester Data</h2>";
$result = $conn->query("SELECT COUNT(*) as count FROM semesters");
$row = $result->fetch_assoc();
echo "<p>Total semesters: " . $row['count'] . "</p>";

// Test 5: Check units
echo "<h2>Test 5: Unit Data</h2>";
$result = $conn->query("SELECT COUNT(*) as count FROM units");
$row = $result->fetch_assoc();
echo "<p>Total units: " . $row['count'] . "</p>";

// Test 6: Sample data
echo "<h2>Test 6: Sample Data</h2>";
$result = $conn->query("SELECT u.id, u.name, u.email, s.year, s.semester, COUNT(un.id) as unit_count 
                        FROM users u 
                        LEFT JOIN semesters s ON u.id = s.user_id 
                        LEFT JOIN units un ON s.id = un.semester_id 
                        GROUP BY u.id, s.id 
                        LIMIT 5");

if ($result->num_rows > 0) {
    echo "<table border='1' cellpadding='10' style='border-collapse: collapse;'>";
    echo "<tr><th>User ID</th><th>Name</th><th>Email</th><th>Year</th><th>Semester</th><th>Units</th></tr>";
    while ($row = $result->fetch_assoc()) {
        echo "<tr>";
        echo "<td>" . $row['id'] . "</td>";
        echo "<td>" . $row['name'] . "</td>";
        echo "<td>" . $row['email'] . "</td>";
        echo "<td>" . $row['year'] . "</td>";
        echo "<td>" . $row['semester'] . "</td>";
        echo "<td>" . $row['unit_count'] . "</td>";
        echo "</tr>";
    }
    echo "</table>";
} else {
    echo "<p>No user data found</p>";
}

echo "<hr>";
echo "<p><a href='../index.html'>← Back to App</a></p>";
?>
