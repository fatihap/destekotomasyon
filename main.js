document.addEventListener("DOMContentLoaded", function() {
    // Navbar'ı yükle
    fetch("nav.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;
            
            // Aktif sayfa linkini işaretle
            const currentPage = window.location.pathname.split("/").pop();
            if (currentPage === "" || currentPage === "index.html") {
                document.querySelector('.nav-link[href="index.html"]').classList.add('active');
            } else {
                const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                    activeLink.setAttribute('aria-current', 'page');
                }
            }
        });

    // Footer'ı yükle
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
        });
});