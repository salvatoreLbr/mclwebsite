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

    // --- Codice per Leaflet Maps ---
    const mapElement = document.getElementById('map');
    const tableRows = document.querySelectorAll('.table-container tbody tr'); // Seleziona le righe della tabella

    if (mapElement && typeof L !== 'undefined') { // Assicurati che l'elemento mappa esista e Leaflet sia caricato
        // Inizializza la mappa Leaflet
        const map = L.map('map').setView([45.3621, 9.6961], 12); // Centro iniziale (es. Crema) e zoom

        // Aggiungi un layer di OpenStreetMap (i "tiles" della mappa)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const markers = []; // Array per tenere traccia dei marker

        // Aggiungi marker per ogni riga della tabella
        tableRows.forEach(row => {
            const lat = parseFloat(row.dataset.lat);
            const lng = parseFloat(row.dataset.lng);
            console.log('lat:'+lat+" long:"+lng);

            // Prendi i dati dalla tabella per il popup del marker
            const luogo = row.querySelector('td:nth-child(1)').textContent;
            const indirizzo = row.querySelector('td:nth-child(2)').textContent;
            
            if (!isNaN(lat) && !isNaN(lng)) { // Assicurati che le coordinate siano valide
                const marker = L.marker([lat, lng]).addTo(map);

                // Contenuto per il popup del marker
                const popupContent = `
                    <div style="font-family: Arial, sans-serif; padding: 5px;">
                        <h4 style="margin: 0 0 5px 0; color: #0d47a1;">${luogo}</h4>
                        <p style="margin: 0 0 3px 0;">${indirizzo}</p>
                        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(indirizzo)}" target="_blank" style="display: block; margin-top: 8px; font-weight: bold; color: var(--primary-color);">Vedi su Google Maps</a>
                    </div>
                `;

                marker.bindPopup(popupContent); // Lega il popup al marker

                markers.push(marker); // Aggiungi il marker all'array
            }
        });

        // Se ci sono marker, imposta il bounds della mappa per includerli tutti
        if (markers.length > 0) {
            const group = new L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1)); // Adatta la mappa per mostrare tutti i marker, con un piccolo padding
        }

    } else if (mapElement) {
        // Messaggio di fallback se Leaflet non si carica
        mapElement.innerHTML = '<p style="text-align: center; padding: 20px;">Impossibile caricare la mappa. Verifica la tua connessione internet.</p>';
        mapElement.style.display = 'flex';
        mapElement.style.alignItems = 'center';
        mapElement.style.justifyContent = 'center';
    }
});
