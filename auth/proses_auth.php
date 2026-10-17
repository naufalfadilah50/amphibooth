<?php
session_start();
// Memanggil file koneksi dari folder config
include "../config/koneksi.php";

// Menangkap aksi dari form (login / register / forgot)
$aksi = $_POST['aksi'];

// ==========================================
// 1. PROSES REGISTER
// ==========================================
if ($aksi == 'register') {
    $username = mysqli_real_escape_string($koneksi, $_POST['username']);
    $email = mysqli_real_escape_string($koneksi, $_POST['email']);
    $password = $_POST['password'];

    // Cek apakah email sudah pernah didaftarkan
    $cek_email = mysqli_query($koneksi, "SELECT * FROM users WHERE email='$email'");
    
    if (mysqli_num_rows($cek_email) > 0) {
        echo "<script>
                alert('Email sudah terdaftar, cutie! Coba pakai email lain atau langsung login ya. 🥺'); 
                window.location.href='register.html';
              </script>";
    } else {
        // Enkripsi password biar aman!
        $password_hashed = password_hash($password, PASSWORD_DEFAULT);
        
        // Masukkan data ke database
        $query = "INSERT INTO users (username, email, password) VALUES ('$username', '$email', '$password_hashed')";
        
        if(mysqli_query($koneksi, $query)){
            echo "<script>
                    alert('Yeay! Akun berhasil dibuat 💖 Silakan Login ya!'); 
                    window.location.href='login.html';
                  </script>";
        } else {
            echo "<script>
                    alert('Oops, ada yang salah nih sama servernya. Coba lagi ya! 😭'); 
                    window.location.href='register.html';
                  </script>";
        }
    }
}

// ==========================================
// 2. PROSES LOGIN
// ==========================================
elseif ($aksi == 'login') {
    $email = mysqli_real_escape_string($koneksi, $_POST['email']);
    $password = $_POST['password'];

    // Cari user berdasarkan email
    $query = mysqli_query($koneksi, "SELECT * FROM users WHERE email='$email'");
    $data = mysqli_fetch_assoc($query);

    if ($data) {
        // Cocokkan password yang diketik dengan password acak di database
        if (password_verify($password, $data['password'])) {
            
            // Simpan sesi login!
            $_SESSION['id_user'] = $data['id'];
            $_SESSION['username'] = $data['username'];
            
            echo "<script>
                    alert('Welcome back, " . $data['username'] . "! 🐸✨ Siap untuk foto-foto?'); 
                    window.location.href='../booth/booth.html'; /* PERUBAHAN: Diarahkan ke booth.html */
                  </script>";
        } else {
            echo "<script>
                    alert('Password salah, cutie! Coba ingat-ingat lagi ya 🥺'); 
                    window.location.href='login.html';
                  </script>";
        }
    } else {
        echo "<script>
                alert('Email belum terdaftar nih. Sign up dulu yuk! 🌸'); 
                window.location.href='login.html';
              </script>";
    }
}

// ==========================================
// 3. PROSES FORGOT PASSWORD
// ==========================================
elseif ($aksi == 'forgot') {
    $email = mysqli_real_escape_string($koneksi, $_POST['email']);
    
    // Karena kirim email beneran butuh konfigurasi server SMTP yang panjang, 
    // kita buat simulasi alert imut dulu ya!
    echo "<script>
            alert('Link reset password sudah dikirim (bohong-bohongan) ke $email ya! 💌✨'); 
            window.location.href='login.html';
          </script>";
}
?>