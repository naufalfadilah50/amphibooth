<?php
session_start();
include "../config/koneksi.php";

// Memberitahu browser bahwa ini adalah data JSON
header('Content-Type: application/json');

// Cek apakah user sudah login
if (!isset($_SESSION['id_user'])) {
    echo json_encode(["status" => "error", "pesan" => "Belum login"]);
    exit();
}

$id_user = $_SESSION['id_user'];

// --- UBAH BAGIAN INI ---
// Kita JOIN tabel photos dengan tabel loved_photos
// IF(l.id IS NOT NULL, 1, 0) artinya: kalau ada datanya di tabel love, is_loved jadi 1, kalau nggak ada jadi 0.
$query = "SELECT p.*, IF(l.id IS NOT NULL, 1, 0) as is_loved 
          FROM photos p 
          LEFT JOIN loved_photos l ON p.id = l.photo_id AND l.user_id = '$id_user'
          WHERE p.id_user='$id_user' 
          ORDER BY p.id DESC";

$result = mysqli_query($koneksi, $query);

$photos = [];
while ($row = mysqli_fetch_assoc($result)) {
    $photos[] = $row;
}

// Kirim datanya ke JavaScript (sekarang setiap foto punya tambahan field 'is_loved')
echo json_encode(["status" => "sukses", "data" => $photos]);
?>