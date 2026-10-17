<?php
session_start();
include "../config/koneksi.php";

// Memberitahu browser bahwa balasan dari file ini adalah format JSON
header('Content-Type: application/json');

// Cek apakah user benar-benar sudah login
if (!isset($_SESSION['id_user'])) {
    echo json_encode(["status" => "error", "pesan" => "Hayo, login dulu ya cutie! 🥺"]);
    exit();
}

// Menangkap data JSON yang dikirim oleh JavaScript
$data = json_decode(file_get_contents('php://input'), true);
$gambar_base64 = $data['image'];
$id_user = $_SESSION['id_user'];

if ($gambar_base64) {
    // 1. Membersihkan teks Base64 (membuang bagian "data:image/png;base64,")
    $image_parts = explode(";base64,", $gambar_base64);
    $image_base64 = base64_decode($image_parts[1]);

    // 2. Membuat nama file yang unik biar tidak tertimpa (Contoh: cutie_1_17163000.png)
    $waktu = time();
    $nama_file = "cutie_" . $id_user . "_" . $waktu . ".png";
    
    // 3. Menentukan jalur penyimpanan fisik (ke folder assets/photos/ yang baru kamu buat)
    $path_folder = "../assets/photos/";
    
    // Opsional: Kalau foldernya lupa dibuat, PHP akan tolong buatkan otomatis
    if (!file_exists($path_folder)) {
        mkdir($path_folder, 0777, true);
    }
    
    $file_tujuan = $path_folder . $nama_file;

    // 4. Menyimpan file secara fisik & Menyimpan nama filenya ke MySQL
    if (file_put_contents($file_tujuan, $image_base64)) {
        
        $query = "INSERT INTO photos (id_user, nama_file) VALUES ('$id_user', '$nama_file')";
        
        if (mysqli_query($koneksi, $query)) {
            echo json_encode(["status" => "sukses", "pesan" => "Yeyy! Foto berhasil disimpan! 💖"]);
        } else {
            echo json_encode(["status" => "error", "pesan" => "Gagal mencatat di database 🥺"]);
        }
        
    } else {
        echo json_encode(["status" => "error", "pesan" => "Gagal menyimpan file foto secara fisik 🥺"]);
    }
} else {
    echo json_encode(["status" => "error", "pesan" => "Fotonya kosong nih!"]);
}
?>