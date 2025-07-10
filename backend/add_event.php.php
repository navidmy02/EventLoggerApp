<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->title) && !empty($data->description)) {
    $title = $conn->real_escape_string($data->title);
    $description = $conn->real_escape_string($data->description);

    $sql = "INSERT INTO events (title, description) VALUES ('$title', '$description')";

    if ($conn->query($sql)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Missing fields"]);
}
?>