
document.getElementById('searchInput').addEventListener('keyup', function(e) {
  const query = e.target.value.toLowerCase();
  // Elimina resaltados anteriores
  document.querySelectorAll('.highlight-search').forEach(el => {
    el.outerHTML = el.innerText;
  });
  if (query.length > 1) {
    // Busca en todos los textos de la página
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while(walker.nextNode()) {
      const node = walker.currentNode;
      if (node.nodeValue.toLowerCase().includes(query)) {
        const span = document.createElement('span');
        span.className = 'highlight-search';
        const idx = node.nodeValue.toLowerCase().indexOf(query);
        const before = node.nodeValue.slice(0, idx);
        const match = node.nodeValue.slice(idx, idx + query.length);
        const after = node.nodeValue.slice(idx + query.length);
        span.textContent = match;
        const frag = document.createDocumentFragment();
        if (before) frag.appendChild(document.createTextNode(before));
        frag.appendChild(span);
        if (after) frag.appendChild(document.createTextNode(after));
        node.parentNode.replaceChild(frag, node);
      }
    }
  }
});
   
   let currentSlideIndex = 0;
    const totalSlides = 5;
    let autoSlideInterval;

    function updateSlides() {
      const cards = document.querySelectorAll('.client-card');
      const dots = document.querySelectorAll('.carousel-dots .dot');
      
      cards.forEach((card, index) => {
        // Calcular la posición relativa a la tarjeta activa
        let position = index - currentSlideIndex;
        
        // Limpiar todas las clases de posición
        card.className = 'client-card';
        
        // Asignar la nueva clase según la posición
        if (position === 0) {
          card.classList.add('active');
        } else if (position === 1) {
          card.classList.add('next');
        } else if (position === -1) {
          card.classList.add('prev');
        } else if (position === 2) {
          card.classList.add('far-right');
        } else if (position === -2) {
          card.classList.add('far-left');
        } else {
          card.classList.add('hidden');
        }
      });
      
      // Actualizar dots
      dots.forEach(dot => dot.classList.remove('active'));
      dots[currentSlideIndex].classList.add('active');
    }

    function nextSlide() {
      currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
      updateSlides();
      resetAutoSlide();
    }

    function previousSlide() {
      currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
      updateSlides();
      resetAutoSlide();
    }

    function currentSlide(n) {
      currentSlideIndex = n;
      updateSlides();
      resetAutoSlide();
    }

    function autoSlide() {
      nextSlide();
    }

    function startAutoSlide() {
      autoSlideInterval = setInterval(autoSlide, 4000);
    }

    function resetAutoSlide() {
      clearInterval(autoSlideInterval);
      startAutoSlide();
    }

    // Pausar auto-slide cuando el mouse está sobre el carrusel
    document.addEventListener('DOMContentLoaded', function() {
      const carousel = document.querySelector('.carousel');
      if (carousel) {
        carousel.addEventListener('mouseenter', () => {
          clearInterval(autoSlideInterval);
        });

        // Reanudar auto-slide cuando el mouse sale del carrusel
        carousel.addEventListener('mouseleave', () => {
          startAutoSlide();
        });

        // Click en las tarjetas para navegar
        document.querySelectorAll('.client-card').forEach(card => {
          card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index);
            if (index !== currentSlideIndex) {
              currentSlide(index);
            }
          });
        });

        // Touch support para móviles
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        carousel.addEventListener('touchstart', (e) => {
          startX = e.touches[0].clientX;
          isDragging = true;
        });

        carousel.addEventListener('touchmove', (e) => {
          if (!isDragging) return;
          currentX = e.touches[0].clientX;
        });

        carousel.addEventListener('touchend', (e) => {
          if (!isDragging) return;
          isDragging = false;
          
          const deltaX = startX - currentX;
          
          if (Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
              nextSlide();
            } else {
              previousSlide();
            }
          }
        });

        // Inicializar
        startAutoSlide();
      }
    });