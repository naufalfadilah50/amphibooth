<?php
session_start();

// Memberi tahu browser bahwa file ini mengembalikan data JSON
header('Content-Type: application/json');

if (!isset($_SESSION['id_user'])) {
    // Jika belum login
    echo json_encode([
        "status" => "error", 
        "pesan" => "Belum login"
    ]);
    exit();
}

// Jika sudah login
echo json_encode([
    "status" => "sukses",
    "username" => $_SESSION['username']
]);
?>