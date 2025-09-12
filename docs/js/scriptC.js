
        // Agregar interactividad a las tarjetas
        document.querySelectorAll('.course-card').forEach(card => {
            card.addEventListener('click', () => {
                // Efecto de click
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        });

        // Funcionalidad de búsqueda
        document.querySelector('.search-box').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const cards = document.querySelectorAll('.course-card');
            
            cards.forEach(card => {
                const title = card.querySelector('.course-title').textContent.toLowerCase();
                const subtitle = card.querySelector('.course-subtitle').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || subtitle.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = searchTerm === '' ? 'block' : 'none';
                }
            });
        });

        // Animación de entrada para las tarjetas
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'slideInUp 0.6s ease forwards';
                }
            });
        }, observerOptions);

        // Agregar animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .course-card {
                opacity: 0;
            }
        `;
        document.head.appendChild(style);

        // Observar todas las tarjetas
        document.querySelectorAll('.course-card').forEach(card => {
            observer.observe(card);
        });