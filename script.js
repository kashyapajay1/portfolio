/* ============================================
   KASHYAP AJAY — PORTFOLIO WEBSITE
   JavaScript: Animations, Interactivity & Effects
   ============================================ */

// Wait for DOM to fully load
document.addEventListener('DOMContentLoaded', () => {

    // ===== 1. NAVBAR: Sticky & Scroll Effects =====
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Add scrolled class to navbar on scroll
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Highlight active nav link based on scroll position
    function updateActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        updateActiveLink();
    });


    // ===== 2. MOBILE NAVIGATION TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinksContainer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });


    // ===== 3. SCROLL ANIMATIONS (Intersection Observer) =====
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('animated');
                }, parseInt(delay));
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => animationObserver.observe(el));


    // ===== 4. SKILL PROGRESS BARS ANIMATION =====
    const skillBars = document.querySelectorAll('.skill-progress');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillBars.forEach(bar => skillObserver.observe(bar));


    // ===== 5. COUNTER ANIMATION (About Section Stats) =====
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 60; // complete in ~60 frames
        const duration = 2000; // 2 seconds
        const stepTime = duration / 60;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, stepTime);
    }


    // ===== 6. BACK TO TOP BUTTON =====
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ===== 7. CONTACT FORM HANDLING (FormSubmit.co) =====
    // Messages are sent to kashyapkdl@gmail.com via FormSubmit.co
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        // Simple validation
        if (!name || !email || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const submitBtn = contactForm.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Send form data via AJAX to FormSubmit.co
        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                showNotification(`Thank you, ${name}! Your message has been sent. I'll get back to you soon.`, 'success');
                contactForm.reset();
            } else {
                showNotification('Oops! Something went wrong. Please try again or email me directly.', 'error');
            }
        })
        .catch(() => {
            showNotification('Network error. Please check your connection and try again.', 'error');
        })
        .finally(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
    });


    // ===== 8. NOTIFICATION SYSTEM =====
    function showNotification(message, type = 'success') {
        // Remove existing notifications
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Notification styles (injected dynamically)
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 24px;
            max-width: 420px;
            padding: 16px 20px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            z-index: 10000;
            animation: slideInRight 0.4s ease;
            font-family: 'Outfit', sans-serif;
            border: 1px solid;
        `;

        if (type === 'success') {
            notification.style.background = 'rgba(0, 206, 201, 0.1)';
            notification.style.borderColor = 'rgba(0, 206, 201, 0.3)';
            notification.style.color = '#00cec9';
        } else {
            notification.style.background = 'rgba(253, 121, 168, 0.1)';
            notification.style.borderColor = 'rgba(253, 121, 168, 0.3)';
            notification.style.color = '#fd79a8';
        }

        const content = notification.querySelector('.notification-content');
        content.style.cssText = 'display: flex; align-items: center; gap: 10px;';

        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none; 
            border: none; 
            color: inherit; 
            cursor: pointer; 
            font-size: 1rem;
            opacity: 0.7;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.4s ease';
                setTimeout(() => notification.remove(), 400);
            }
        }, 5000);
    }

    // Add animation keyframes to the document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(styleSheet);


    // ===== 9. HERO PARTICLES EFFECT =====
    const particlesContainer = document.getElementById('heroParticles');

    function createParticles() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%;';
        particlesContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = 0;
        let mouseY = 0;
        let animationId;

        function resizeCanvas() {
            canvas.width = particlesContainer.offsetWidth;
            canvas.height = particlesContainer.offsetHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Track mouse position
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Particle class
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.5 
                    ? `rgba(108, 92, 231, ${this.opacity})` 
                    : `rgba(0, 206, 201, ${this.opacity})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Mouse interaction — subtle repulsion
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    this.x -= dx * 0.01;
                    this.y -= dy * 0.01;
                }

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Create particles
        const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        // Draw lines between close particles
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        const opacity = (1 - dist / 120) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            
            drawConnections();
            animationId = requestAnimationFrame(animate);
        }

        animate();

        // Cleanup on page visibility change (performance)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(animationId);
            } else {
                animate();
            }
        });
    }

    createParticles();


    // ===== 10. TYPING EFFECT FOR HERO GREETING =====
    const heroGreeting = document.querySelector('.hero-greeting');
    const greetingText = heroGreeting.textContent;
    heroGreeting.textContent = '';
    heroGreeting.style.opacity = '1';

    let charIndex = 0;
    function typeGreeting() {
        if (charIndex < greetingText.length) {
            heroGreeting.textContent += greetingText.charAt(charIndex);
            charIndex++;
            setTimeout(typeGreeting, 80);
        }
    }

    // Delay typing effect slightly
    setTimeout(typeGreeting, 500);


    // ===== 11. SMOOTH REVEAL ON PAGE LOAD =====
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });

    // Fallback: ensure body is visible
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 1000);


    // ===== 12. TILT EFFECT ON SERVICE CARDS =====
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

});
