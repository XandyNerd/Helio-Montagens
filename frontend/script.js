document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.benefit-card, .service-card, .portfolio-item, .testimonial-card, .price-row');

    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        el.style.transitionDelay = `${index % 3 * 0.1}s`; // Stagger effect
        observer.observe(el);
    });

    // Custom class for visible state
    const style = document.createElement('style');
    style.innerHTML = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
    // Chat Simulation
    const chatContainer = document.getElementById('chatContainer');
    const chatInput = document.getElementById('chatInput');
    const keyboard = document.getElementById('keyboard');
    const phoneScreen = document.querySelector('.phone-screen');
    const micBtn = document.getElementById('micBtn');
    const sendBtn = document.getElementById('sendBtn');
    const keys = document.querySelectorAll('.key:not(.special):not(.wide)');

    const messages = [
        { text: "Olá! Vocês fazem montagem de móveis em Belo Horizonte?", type: "sent", delay: 1000 },
        { text: "Olá! Sim, realizo montagem de todas as marcas e atendo toda a região de BH.", type: "received", delay: 2000 },
        { text: "Ótimo! Como faço para pedir um orçamento?", type: "sent", delay: 1500 },
        { text: "É só me enviar a foto do móvel e eu já te passo o valor rapidinho 😊", type: "received", delay: 2000 }
    ];

    let messageIndex = 0;

    function toggleKeyboard(show) {
        if (show) {
            keyboard.classList.add('open');
            phoneScreen.classList.add('keyboard-active');
            micBtn.style.display = 'none';
            sendBtn.style.display = 'flex';
        } else {
            keyboard.classList.remove('open');
            phoneScreen.classList.remove('keyboard-active');
            micBtn.style.display = 'block';
            sendBtn.style.display = 'none';
        }
    }

    function pressRandomKey() {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        randomKey.style.backgroundColor = '#E5E7EB';
        setTimeout(() => {
            randomKey.style.backgroundColor = '#FFF';
        }, 100);
    }

    function typeMessage(text, callback) {
        let i = 0;
        chatInput.classList.add('typing-text');
        chatInput.textContent = "";
        toggleKeyboard(true);

        const typingInterval = setInterval(() => {
            chatInput.textContent += text.charAt(i);
            pressRandomKey(); // Simulate key press
            i++;
            if (i >= text.length) {
                clearInterval(typingInterval);
                setTimeout(() => {
                    // Simulate user hitting send
                    sendBtn.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        sendBtn.style.transform = 'scale(1)';
                        chatInput.textContent = "";
                        chatInput.classList.remove('typing-text');
                        toggleKeyboard(false);
                        callback();
                    }, 150);
                }, 500); // Wait a bit before sending
            }
        }, 50); // Typing speed
    }

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);

        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');

        // Update Status Bar Time
        document.getElementById('statusBarTime').textContent = timeString;

        messageDiv.innerHTML = `<p>${text}</p><span class="time">${timeString}</span>`;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function playChatSequence() {
        if (messageIndex >= messages.length) {
            // Restart loop after a pause
            setTimeout(() => {
                chatContainer.innerHTML = '';
                messageIndex = 0;
                playChatSequence();
            }, 5000);
            return;
        }

        const msg = messages[messageIndex];

        if (msg.type === 'sent') {
            // Simulate user typing
            setTimeout(() => {
                typeMessage(msg.text, () => {
                    addMessage(msg.text, 'sent');
                    messageIndex++;
                    playChatSequence();
                });
            }, msg.delay);
        } else {
            // Simulate received message (instant or with small delay, no typing in input)
            setTimeout(() => {
                addMessage(msg.text, 'received');
                messageIndex++;
                playChatSequence();
            }, msg.delay);
        }
    }

    // Start simulation when hero section is visible
    const heroSection = document.querySelector('.hero');
    const chatObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                playChatSequence();
                chatObserver.unobserve(entry.target);
            }
        });
    });

    if (heroSection) {
        chatObserver.observe(heroSection);
    }
});
