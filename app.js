// Inicialización cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar AOS para animaciones
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // Funcionalidad del menú móvil
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            // Cambiar icono según el estado
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            }
        });
    }

    // Cerrar menú móvil al hacer clic en un enlace
    const mobileLinks = document.querySelectorAll('#mobile-menu a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Navegación suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Slider de testimonios automático
    let testimonialSlider;
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-slider > div');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    function initTestimonialSlider() {
        if (testimonials.length > 0) {
            // Iniciar slider automático
            testimonialSlider = setInterval(() => {
                nextTestimonial();
            }, 5000);
            
            // Añadir eventos a los dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    goToTestimonial(index);
                });
            });
            
            // Pausar slider al hacer hover
            const sliderContainer = document.querySelector('.testimonial-slider');
            if (sliderContainer) {
                sliderContainer.addEventListener('mouseenter', () => {
                    clearInterval(testimonialSlider);
                });
                
                sliderContainer.addEventListener('mouseleave', () => {
                    testimonialSlider = setInterval(() => {
                        nextTestimonial();
                    }, 5000);
                });
            }
        }
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        goToTestimonial(currentTestimonial);
    }

    function goToTestimonial(index) {
        currentTestimonial = index;
        const slider = document.querySelector('.testimonial-slider');
        const testimonial = testimonials[index];
        
        if (slider && testimonial) {
            slider.scrollTo({
                left: testimonial.offsetLeft - slider.offsetLeft,
                behavior: 'smooth'
            });
        }
        
        // Actualizar dots activos
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
                dot.classList.remove('bg-gray-300');
                dot.classList.add('bg-primary-500');
            } else {
                dot.classList.remove('active');
                dot.classList.add('bg-gray-300');
                dot.classList.remove('bg-primary-500');
            }
        });
    }

    // Inicializar slider de testimonios
    initTestimonialSlider();

    // Formulario de contacto
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validación básica
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const whatsapp = document.getElementById('whatsapp').value;
            
            if (!name || !email || !whatsapp) {
                showNotification('Por favor, completa todos los campos obligatorios', 'error');
                return;
            }
            
            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor, ingresa un email válido', 'error');
                return;
            }
            
            // Simular envío (en producción, esto se conectaría a un backend)
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showNotification('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.', 'success');
                contactForm.reset();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        });
    }

    // Función para mostrar notificaciones
    function showNotification(message, type = 'success') {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`;
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => {
            notification.classList.add('translate-x-0');
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }

    // Intersection Observer para animaciones adicionales
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });

        // Observar elementos que no están siendo animados por AOS
        document.querySelectorAll('.service-card, .testimonial, .meta-result-item').forEach(el => {
            observer.observe(el);
        });
    };

    observeElements();

    // Contador animado para estadísticas
    const initCounters = () => {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (current > target) current = target;
                    counter.textContent = Math.round(current);
                    requestAnimationFrame(updateCounter);
                }
            };
            
            // Iniciar cuando el elemento sea visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        updateCounter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    };

    initCounters();

    // Efecto parallax para el hero
    const initParallax = () => {
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.5;
                heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            });
        }
    };

    initParallax();

    // Preloader (opcional)
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 500);
    });

    // Gestión del estado activo de la navegación
    const updateActiveNav = () => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const headerHeight = document.querySelector('nav').offsetHeight;
            
            if (window.scrollY >= sectionTop - headerHeight && 
                window.scrollY < sectionTop + sectionHeight - headerHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-primary-600');
            link.classList.add('text-gray-700');
            
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.remove('text-gray-700');
                link.classList.add('text-primary-600');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav(); // Ejecutar al cargar

    // Google Analytics (descomentar y añadir tu ID)
    /*
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'TU_ID_DE_GOOGLE_ANALYTICS');
    */

    console.log('Growthix Marketing Agency - Sitio cargado correctamente');
});

// Funciones utilitarias globales
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Exportar funciones para uso global (si es necesario)
window.Growthix = {
    debounce,
    throttle,
    showNotification: function(message, type) {
        // Implementación similar a la función showNotification anterior
        console.log('Notification:', message, type);
    }
};
