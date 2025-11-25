document.addEventListener("DOMContentLoaded", function() {
    const loadHTML = (id, url) => {
        return fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;
            });
    };

    const setLanguage = (lang) => {
        localStorage.setItem('language', lang);
        location.reload();
    };

    const translatePage = () => {
        const lang = localStorage.getItem('language') || 'tr'; // Varsayılan dil Türkçe
        const translation = translations[lang];

        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translation[key]) {
                element.innerHTML = translation[key];
            }
        });
        document.documentElement.lang = lang; // html etiketinin lang özelliğini güncelle
    };

    // Navbar ve Footer'ı yükle, sonra çeviriyi yap
    Promise.all([
        loadHTML("navbar-placeholder", "nav.html"),
        loadHTML("footer-placeholder", "footer.html")
    ]).then(() => {
        translatePage();

        // Aktif sayfa linkini işaretle
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }

        // Dil değiştirme butonlarına event listener ekle
        window.setLanguage = setLanguage; // Fonksiyonu global scope'a taşı
    });
});