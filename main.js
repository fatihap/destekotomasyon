document.addEventListener("DOMContentLoaded", function () {

    // HTML Yükleme Fonksiyonu (Nav ve Footer için)
    const loadHTML = (id, url) => {
        return fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;

                // Nav yüklendikten sonra aktif linki belirle ve çevir
                if (id === 'navbar-placeholder') {
                    const currentPage = window.location.pathname.split("/").pop() || "index.html";
                    const navLinks = document.querySelectorAll('.nav-link');

                    navLinks.forEach(link => {
                        const href = link.getAttribute('href');

                        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.classList.remove('active');
                            link.removeAttribute('aria-current');
                        }
                    });

                    // Dil gösterimini güncelle
                    updateLanguageDisplay();
                    // Yüklenen içeriği çevir
                    translatePage();
                }

                if (id === 'footer-placeholder') {
                    // Footer'ı da çevir
                    translatePage();
                }
            })
            .catch(err => console.error('Yükleme hatası:', err));
    };

    // Dil değiştirme fonksiyonu (global)
    window.setLanguage = function (lang) {
        localStorage.setItem('language', lang);
        updateLanguageDisplay();
        translatePage();
    };

    // Dil gösterimini güncelle
    function updateLanguageDisplay() {
        const lang = localStorage.getItem('language') || 'tr';
        const langDropdown = document.getElementById('langDropdown');
        if (langDropdown) {
            langDropdown.innerHTML = `<i class="bi bi-globe me-1"></i> ${lang.toUpperCase()}`;
        }
    }

    // Çeviri fonksiyonu
    function translatePage() {
        const lang = localStorage.getItem('language') || 'tr';

        // languages.js dosyasındaki translations değişkenini kullan
        if (typeof translations === 'undefined') {
            console.error('Translations not loaded');
            return;
        }

        const langData = translations[lang];
        if (!langData) {
            console.error('Language not found:', lang);
            return;
        }

        // data-i18n attribute'una sahip tüm elementleri bul ve çevir
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (langData[key]) {
                // Eğer element bir input placeholder'ı ise
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = langData[key];
                } else {
                    element.textContent = langData[key];
                }
            }
        });

        // data-i18n-html attribute'una sahip elementler (HTML içeriği olan)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            if (langData[key]) {
                element.innerHTML = langData[key];
            }
        });
    }

    // Navbar ve Footer'ı yükle
    Promise.all([
        loadHTML("navbar-placeholder", "nav.html"),
        loadHTML("footer-placeholder", "footer.html")
    ]).then(() => {
        // İlk yüklemede sayfayı çevir
        translatePage();
    });

    // Sayaç Animasyonu (Sadece stats-section varsa çalışır)
    if (document.querySelector('.stats-section')) {
        const counters = document.querySelectorAll('.counter');
        const speed = 200;

        const animateCounter = (counter) => {
            const target = +counter.innerText.replace('+', '');
            counter.innerText = '0';

            const updateCount = () => {
                const count = +counter.innerText;
                const increment = target / speed;

                if (count < target) {
                    counter.innerText = `${Math.ceil(count + increment)}`;
                    setTimeout(updateCount, 10);
                } else {
                    counter.innerText = `${target}+`;
                }
            };
            updateCount();
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) counters.forEach(animateCounter);
        }, { threshold: 0.5 });
        observer.observe(document.querySelector('.stats-section'));
    }
});