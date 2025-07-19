document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Optional: Close menu when a link is clicked (useful for single-page apps or smooth scrolling)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });

    // --- Codice per lo Slideshow ---
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderDotsContainer = document.querySelector('.slider-dots');
    let currentSlideIndex = 0;
    let slideInterval; // Variabile per tenere traccia dell'intervallo

    // Funzione per mostrare una slide specifica
    function showSlide(index) {
        // Nasconde tutte le slide e rimuove lo stato attivo dai puntini
        heroSlides.forEach(slide => slide.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));

        // Mostra la slide desiderata e attiva il puntino corrispondente
        if (heroSlides[index]) {
            heroSlides[index].classList.add('active');
            if (sliderDotsContainer && sliderDotsContainer.children[index]) {
                sliderDotsContainer.children[index].classList.add('active');
            }
        }
    }

    // Funzione per passare alla slide successiva
    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % heroSlides.length;
        showSlide(currentSlideIndex);
    }

    // Funzione per avviare lo slideshow automatico
    function startSlideShow() {
        if (heroSlides.length > 1) { // Avvia solo se ci sono più di una slide
            slideInterval = setInterval(nextSlide, 5000); // Cambia slide ogni 5 secondi (5000ms)
        }
    }

    // Funzione per resettare l'intervallo (utile quando si interagisce con i puntini)
    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    // Genera i puntini per la navigazione
    if (sliderDotsContainer) {
        heroSlides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentSlideIndex = index;
                showSlide(currentSlideIndex);
                resetSlideShow(); // Resetta l'autoplay dopo l'interazione manuale
            });
            sliderDotsContainer.appendChild(dot);
        });
    }

    // Inizializza lo slideshow
    if (heroSlides.length > 0) {
        showSlide(currentSlideIndex); // Mostra la prima slide all'inizio
        startSlideShow(); // Avvia l'autoplay
    }
});