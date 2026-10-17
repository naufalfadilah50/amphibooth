// ==========================================================================
// AMPHIBOOTH - CORE JAVASCRIPT (UPDATE: FILTER FIX & PROPORTION)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. CEK SESI LOGIN
    fetch("../auth/cek_sesi.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === "sukses") {
                document.getElementById("nama-user").innerText = data.username;
            } else {
                window.location.href = "../auth/login.html";
            }
        })
        .catch(error => console.error("Duh, gagal ngecek sesi:", error));

    document.getElementById("btn-logout").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../auth/logout.php";
    });

    const videoFeed = document.getElementById("video-feed");
    const loadingText = document.querySelector(".loading-text");
    const liveOverlay = document.getElementById("live-overlay"); // Deklarasi overlay stiker

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
            videoFeed.srcObject = stream;
            videoFeed.style.display = "block";
            loadingText.style.display = "none";
        })
        .catch((error) => {
            console.error("Kamera gagal nyala:", error);
            loadingText.innerText = "Yhaaa, kameranya gak bisa nyala 🥺";
        });

    // ==========================================================================
    // 4. TAHAP FOTO BEKU & SNAPSHOT ASLI
    // ==========================================================================
    
    const shutterButton = document.getElementById("shutter-button");
    const canvasOverlay = document.getElementById("canvas-overlay");
    const context = canvasOverlay.getContext("2d");
    
    const filtersPanel = document.getElementById("filters-panel");
    const postCapturePanel = document.getElementById("post-capture-panel");
    
    let originalImageData = null; 

    shutterButton.addEventListener("click", () => {
        canvasOverlay.width = videoFeed.videoWidth;
        canvasOverlay.height = videoFeed.videoHeight;
        
        context.save();
        context.translate(canvasOverlay.width, 0);
        context.scale(-1, 1);
        context.drawImage(videoFeed, 0, 0, canvasOverlay.width, canvasOverlay.height);
        context.restore(); // KEMBALIKAN KE NORMAL BIAR STIKER GAK TERBALIK
        
        // --- TAMBAHAN: TEMPEL STIKER KE FOTO JIKA ADA YANG AKTIF ---
        if (liveOverlay && liveOverlay.style.display === "block" && liveOverlay.src) {
            context.drawImage(liveOverlay, 0, 0, canvasOverlay.width, canvasOverlay.height);
        }
        // -------------------------------------------------------------

        originalImageData = context.getImageData(0, 0, canvasOverlay.width, canvasOverlay.height);
        
        videoFeed.style.display = "none";
        if (liveOverlay) liveOverlay.style.display = "none"; // Sembunyikan stiker saat di-preview
        
        canvasOverlay.style.display = "block";
        shutterButton.style.display = "none";
        
        // --- REVISI PANEL: TUKAR PANEL SAAT DIJEPRET ---
        filtersPanel.classList.add("hidden"); 
        postCapturePanel.classList.remove("hidden");
        // -----------------------------------------------
    });

    // ==========================================================================
    // 6. LOGIKA FILTER & STIKER (TAMBAHAN FIX: PROPORSI)
    // ==========================================================================
    
    function applyFilter(effect) {
        if (!originalImageData) return;

        // --- TAMBAHAN: MENGUNCI PROPORSIONAL KANVAS ---
        canvasOverlay.style.width = "100%";
        canvasOverlay.style.height = "auto";
        canvasOverlay.style.objectFit = "cover";
        // ----------------------------------------------

        // RESET KE GAMBAR ASLI
        context.putImageData(originalImageData, 0, 0);
        canvasOverlay.style.filter = "none";

        if (effect === 'none') return;

        const imageData = context.getImageData(0, 0, canvasOverlay.width, canvasOverlay.height);
        const data = imageData.data;

        if (effect === 'grayscale') {
            for (let i = 0; i < data.length; i += 4) {
                let avg = (data[i] + data[i+1] + data[i+2]) / 3;
                data[i] = data[i+1] = data[i+2] = avg;
            }
        } else if (effect === 'sepia') {
            for (let i = 0; i < data.length; i += 4) {
                let r = data[i], g = data[i+1], b = data[i+2];
                data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
                data[i+1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
                data[i+2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
            }
        } else if (effect === 'invert') {
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i+1] = 255 - data[i+1];
                data[i+2] = 255 - data[i+2];
            }
        } else if (effect === 'blur') {
            canvasOverlay.style.filter = "blur(5px)";
        }
        
        context.putImageData(imageData, 0, 0);
    }

    // --- REVISI: PISAHKAN LOGIKA KLIK STIKER & KLIK EFEK WARNA ---
    document.querySelectorAll(".btn-filter").forEach(btn => {
        btn.addEventListener("click", () => {
            
            // JIKA TOMBOL STIKER YANG DIKLIK (Panel Kiri/Awal)
            if (btn.hasAttribute("data-filter")) {
                document.querySelectorAll("#filter-options .btn-filter").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                
                let filterName = btn.getAttribute("data-filter");
                if (filterName === "none") {
                    liveOverlay.style.display = "none";
                    liveOverlay.src = "";
                } else {
                    liveOverlay.style.display = "block";
                    // PENYESUAIAN PATH: Arahkan ke folder filters/
                    liveOverlay.src = "filters/" + filterName + ".png"; 
                }
            } 
            // JIKA TOMBOL EFEK WARNA YANG DIKLIK (Panel Kanan/Setelah Jepret)
            else if (btn.hasAttribute("data-effect")) {
                document.querySelectorAll("#effect-options .btn-filter").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                applyFilter(btn.getAttribute("data-effect"));
            }
        });
    });

    // ==========================================================================
    // 5. FITUR SIMPAN & DELETE
    // ==========================================================================
    
    const deleteButton = document.getElementById("delete-button");
    deleteButton.addEventListener("click", () => {
        context.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
        originalImageData = null; 
        canvasOverlay.style.display = "none";
        videoFeed.style.display = "block";
        
        // --- TAMBAHAN: MUNCULKAN KEMBALI STIKER JIKA SEBELUMNYA AKTIF ---
        const activeFilterBtn = document.querySelector("#filter-options .btn-filter.active");
        if (activeFilterBtn && activeFilterBtn.getAttribute("data-filter") !== "none") {
            if (liveOverlay) liveOverlay.style.display = "block";
        }
        // --------------------------------------------------------------

        shutterButton.style.display = "block";
        
        // --- REVISI PANEL: KEMBALIKAN PANEL SAAT DI-DELETE ---
        postCapturePanel.classList.add("hidden"); 
        filtersPanel.classList.remove("hidden");
        // -----------------------------------------------------
    });

    const saveButton = document.getElementById("save-button");
    saveButton.addEventListener("click", () => {
        const fotoBase64 = canvasOverlay.toDataURL("image/png");
        saveButton.innerText = "Menyimpan... ⏳";
        saveButton.disabled = true;

        fetch("simpan_foto.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: fotoBase64 })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.pesan);
            if(data.status === "sukses") deleteButton.click();
        })
        .finally(() => {
            saveButton.innerText = "Save";
            saveButton.disabled = false;
        });
    });
});