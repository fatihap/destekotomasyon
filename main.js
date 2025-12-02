document.addEventListener("DOMContentLoaded", function () {

    // HTML Yükleme Fonksiyonu (Nav ve Footer için)
    const loadHTML = (id, url) => {
        return fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;

                // Nav yüklendikten sonra aktif linki belirle
                if (id === 'navbar-placeholder') {
                    const currentPage = window.location.pathname.split("/").pop() || "index.html";
                    // Tüm nav linklerini seç
                    const navLinks = document.querySelectorAll('.nav-link');

                    navLinks.forEach(link => {
                        // Linkin href değerini al
                        const href = link.getAttribute('href');

                        // Eğer href, mevcut sayfa ismini içeriyorsa veya anasayfa ise
                        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.classList.remove('active');
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            })
            .catch(err => console.error('Yükleme hatası:', err));
    };

    // Navbar ve Footer'ı yükle
    Promise.all([
        loadHTML("navbar-placeholder", "nav.html"),
        loadHTML("footer-placeholder", "footer.html")
    ]).then(() => {
        // Yükleme tamamlandıktan sonra yapılacak işlemler (varsa)
    });

    // Sayaç Animasyonu (Sadece stats-section varsa çalışır)
    if (document.querySelector('.stats-section')) {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; // Animasyon hızı

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