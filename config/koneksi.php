<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "amphibooth";

// Membuat koneksi ke database MySQL
$koneksi = mysqli_connect($host, $user, $pass, $db);

// Cek apakah koneksi berhasil
if (!$koneksi) {
    die("Duh, koneksi database gagal nih: " . mysqli_connect_error());
}
?>