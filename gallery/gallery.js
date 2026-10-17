// ==========================================================================
// AMPHIBOOTH - GALLERY JAVASCRIPT (FINAL DENGAN DATABASE)
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    
    fetch("../auth/cek_sesi.php")
        .then(response => response.json())
        .then(data => {
            if (data.status === "sukses") {
                document.getElementById("nama-user").innerText = data.username;
                loadGallery();
            } else {
                window.location.href = "../auth/login.html";
            }
        })
        .catch(error => console.error("Error cek sesi:", error));

    document.getElementById("btn-logout").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../auth/logout.php";
    });

    function loadGallery() {
        const galleryGrid = document.getElementById("gallery-grid");
        const loadingMsg = document.getElementById("loading-msg");
        const emptyState = document.getElementById("empty-state");

        fetch("get_photos.php")
            .then(response => response.json())
            .then(res => {
                loadingMsg.style.display = "none";
                if (res.status === "sukses" && res.data.length > 0) {
                    res.data.forEach(photo => {
                        const card = document.createElement("div");
                        card.className = "photo-card";
                        
                        // PERUBAHAN 1: Cek status is_loved dari database buat nentuin class 'active'
                        const isLoved = photo.is_loved == 1 ? "active" : "";

                        card.innerHTML = `
                            <img src="../assets/photos/${photo.nama_file}" alt="Foto Imutku">
                            <div class="card-actions">
                                <button class="btn-action btn-love ${isLoved}" onclick="toggleLove(this, ${photo.id})">
                                    <i class="fa-solid fa-heart"></i>
                                </button>
                                <button class="btn-action btn-trash" onclick="deletePhoto(${photo.id}, this)">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        `;
                        galleryGrid.appendChild(card);
                    });
                } else {
                    emptyState.classList.remove("hidden");
                }
            })
            .catch(error => {
                loadingMsg.innerText = "Duh, gagal memuat foto nih 🥺";
                console.error(error);
            });
    }
});

// PERUBAHAN 2: Fungsi kirim data ke update_love.php
window.toggleLove = (btn, photoId) => {
    btn.classList.toggle("active");
    const isLoved = btn.classList.contains("active") ? 1 : 0;
    
    fetch("update_love.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: photoId, loved: isLoved })
    }).catch(err => console.error("Gagal update love:", err));
};

// PERUBAHAN 3: Fungsi delete tetap sama
window.deletePhoto = (id, btn) => {
    if (confirm("Yakin mau hapus foto imut ini? 🥺")) {
        btn.closest(".photo-card").remove();
    }
};

window.filterGallery = (filterType) => {
    const cards = document.querySelectorAll('.photo-card');
    cards.forEach(card => {
        const isLoved = card.querySelector('.btn-love').classList.contains('active');
        card.style.display = (filterType === 'loved' && !isLoved) ? 'none' : 'block';
    });
};