<?php
session_start();
include "../config/koneksi.php"; // Pake $koneksi sesuai file lu yang lain

$data = json_decode(file_get_contents("php://input"), true);
$photo_id = $data['id'];

// PASTIIN SAMA KAYAK DI get_photos.php (id_user)
$user_id = $_SESSION['id_user']; 

if ($data['loved'] == 1) {
    // Pakai $koneksi bukan $conn
    $query = "INSERT INTO loved_photos (user_id, photo_id) VALUES ('$user_id', '$photo_id')";
} else {
    $query = "DELETE FROM loved_photos WHERE user_id = '$user_id' AND photo_id = '$photo_id'";
}

mysqli_query($koneksi, $query);
?>