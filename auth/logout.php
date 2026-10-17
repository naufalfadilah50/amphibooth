<?php
session_start();
// Menghapus semua sesi yang sedang berjalan
session_unset();
session_destroy();

// Pindah balik ke halaman login dengan alert imut
echo "<script>
        alert('Bye-bye! Sampai jumpa lagi ya, cutie! 👋✨');
        window.location.href='login.html';
      </script>";
?>