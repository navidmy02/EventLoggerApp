<?php
include 'db.php';

$result = $conn->query("SELECT id, title, description FROM events ORDER BY created_at DESC");

$events = [];

while ($row = $result->fetch_assoc()) {
    $events[] = $row;
}

echo json_encode($events);
?>