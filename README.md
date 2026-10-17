# 📸 Amphibooth - Web-Based Photo Booth Application

**Amphibooth** adalah aplikasi web *photo booth* interaktif bertema estetika *cute/pastel* yang memungkinkan pengguna untuk mengambil foto langsung melalui *webcam*, menerapkan berbagai pilihan filter atau efek visual yang menarik (*Devil Horns, Blushing, Frog Hat, Cat Ears*, dll.), serta mengelola galeri foto pribadi dengan fitur favorit (*Loved Only*) dan penyimpanan otomatis.

---

## 📸 Tampilan Antarmuka & Halaman Utama

* **Halaman Booth (Strike a Pose!)**: Antarmuka utama untuk mengambil foto via *webcam* dengan pilihan panel *Filters* di sisi kanan dan tombol *Snap It!* yang interaktif.
* **Halaman Galeri (My Cuteness Collection)**: Ruang penyimpanan hasil foto pengguna lengkap dengan tombol interaksi seperti ikon hati (*Loved Only*) untuk menandai foto favorit dan ikon tempat sampah untuk menghapus foto.
* **Navigasi Atas**: Menu bar praktis untuk beralih antar halaman (*Booth*, *Gallery*, dan *Logout / Bye-bye!*).

---

## 🚀 Fitur-Fitur Utama

### 1. 📷 Interactive Photo Booth
* **Live Webcam Integration**: Mengakses kamera perangkat secara *real-time* untuk mengambil foto.
* **Dynamic Filters Selection**: Berbagai pilihan filter efek visual yang dapat dipilih secara langsung sebelum menjepret foto (seperti *No Filter, Devil Horns, Blushing, Frog Hat, Cat Ears*).
* **Snap & Save**: Tombol jepret instan untuk menyimpan momen foto ke dalam database dan direktori galeri.

### 2. 🖼️ Personal Gallery & Collection
* **All Photos View**: Menampilkan seluruh riwayat foto yang pernah diambil oleh pengguna.
* **Loved Only Filter**: Menyaring galeri secara khusus untuk menampilkan foto-foto yang diberi tanda suka (*favorites*).
* **Photo Management**: Fitur interaktif untuk menghapus foto yang tidak diinginkan dari galeri.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend**: HTML5, CSS3 (Custom Pastel Aesthetic & Responsive Flexbox/Grid), JavaScript (DOM Manipulation & Webcam API)
* **Backend**: PHP
* **Database**: MySQL / MariaDB (XAMPP)

---

## 📂 Struktur Direktori Proyek

```text
amphibooth/
├── assets/         # Aset gambar, ikon, dan penyimpanan foto hasil jepretan
├── auth/           # Sistem autentikasi pengguna (Login, Register, Cek Sesi)
├── booth/          # Modul utama photo booth & fungsionalitas webcam (booth.html/js)
├── config/         # Berkas konfigurasi koneksi database (koneksi.php)
├── gallery/        # Modul galeri foto & manajemen favorit (gallery.html/js)
└── index.php       # File pengarah (redirect) otomatis ke halaman login
