/* =============== SHOW MENU =============== */
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close');

/* Menu show */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

/* Menu hidden */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

/* =============== REMOVE MENU MOBILE =============== */
const navLink = document.querySelectorAll('.nav__link');

const linkAction = () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
};
navLink.forEach(n => n.addEventListener('click', linkAction));

// Remove menu on scroll
window.addEventListener('scroll', linkAction);

/* =============== SCROLL REVEAL ANIMATION =============== */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});

/* =============== CHANGE BACKGROUND HEADER =============== */
const scrollHeader = () => {
    const header = document.getElementById('header');
    window.scrollY >= 50 ? header.classList.add('scroll-header')
        : header.classList.remove('scroll-header');
};
window.addEventListener('scroll', scrollHeader);

/* =============== SCROLL SECTIONS ACTIVE LINK =============== */
const sections = document.querySelectorAll('section[id]');

const scrollActive = () => {
    const scrollDown = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 100,
            sectionId = current.getAttribute('id'),
            sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']');

        if (scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight) {
            if (sectionsClass) sectionsClass.classList.add('active-link');
        } else {
            if (sectionsClass) sectionsClass.classList.remove('active-link');
        }
    });
};
window.addEventListener('scroll', scrollActive);

/* =============== FORM FEEDBACK =============== */
const contactForm = document.querySelector('.contact__form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const button = contactForm.querySelector('.button');
        const originalText = button.textContent;

        button.textContent = 'Mission Initiated';
        button.style.background = 'var(--accent-cyan)';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

/* =============== FUTURISTIC LIVE READOUT =============== */
const utcClock = document.getElementById('utc-clock');
const latencyReadout = document.getElementById('latency-readout');

const tickTelemetry = () => {
    if (utcClock) {
        const now = new Date();
        utcClock.textContent = now.toISOString().slice(11, 19);
    }

    if (latencyReadout) {
        const jitter = Math.floor(Math.random() * 7) - 3;
        const value = Math.max(8, 12 + jitter);
        latencyReadout.textContent = `${value}ms`;
    }
};

tickTelemetry();
setInterval(tickTelemetry, 1000);

/* =========================================================
   ANTIGRAVITY POPUP CHATBOT LOGIC
   ========================================================= */
const chatbotWidget = document.getElementById('chatbot-widget');
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
const heroChatTrigger = document.getElementById('hero-chat-trigger');

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const sendBtn = document.getElementById('send-btn');

const toggleChat = () => {
    if(chatbotWidget) chatbotWidget.classList.toggle('is-open');
    if (chatbotWidget && chatbotWidget.classList.contains('is-open') && chatInput) {
        setTimeout(() => chatInput.focus(), 300);
    }
};

if (chatbotToggle) chatbotToggle.addEventListener('click', toggleChat);
if (chatbotCloseBtn) chatbotCloseBtn.addEventListener('click', () => chatbotWidget.classList.remove('is-open'));

if (heroChatTrigger) {
    heroChatTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (chatbotWidget && !chatbotWidget.classList.contains('is-open')) {
            chatbotWidget.classList.add('is-open');
            setTimeout(() => chatInput.focus(), 300);
        }
    });
}

if(chatInput) {
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.value.trim() !== '') {
            sendBtn.removeAttribute('disabled');
        } else {
            sendBtn.setAttribute('disabled', 'true');
        }
    });

    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if(chatForm) chatForm.dispatchEvent(new Event('submit'));
        }
    });
}

let chatHistory = [];
const GEMINI_API_KEY = 'REMOVED_FOR_GITHUB_PUSH';
const SYSTEM_PROMPT = "You are Smrithi, an elite, highly advanced AI assistant for AKL Holdings Inc., a premier firm bridging strategic consulting and elite technical execution. Your tone is professional, futuristic, precise, and slightly robotic but helpful. Keep responses concise and impactful.";

if(chatForm) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        chatInput.value = '';
        chatInput.style.height = 'auto';
        sendBtn.setAttribute('disabled', 'true');

        appendMessage('user', message);
        chatHistory.push({ role: "user", parts: [{ text: message }] });

        // Add a typing indicator
        const typingId = 'typing-' + Date.now();
        appendMessage('ai', 'Processing directive...', typingId);

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                    contents: chatHistory
                })
            });

            const data = await response.json();
            
            // Remove typing indicator
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();

            if (data.candidates && data.candidates.length > 0) {
                const aiText = data.candidates[0].content.parts[0].text;
                appendMessage('ai', aiText);
                chatHistory.push({ role: "model", parts: [{ text: aiText }] });
            } else {
                appendMessage('ai', "Error: Neural link disrupted. Could not parse response.");
            }
        } catch (error) {
            console.error(error);
            const typingEl = document.getElementById(typingId);
            if (typingEl) typingEl.remove();
            appendMessage('ai', "Error: Connection to Smrithi failed. Check network uplink.");
        }
    });
}

function appendMessage(sender, text, id = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}-message`;
    if (id) msgDiv.id = id;
    
    const isUser = sender === 'user';
    const avatarHtml = isUser ? '' : `
        <div class="message-avatar ai-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12 2.1 7.1"/><path d="M12 12l9.9 4.9"/></svg>
        </div>
    `;
    const authorHtml = isUser ? '' : `<div class="message-author">Smrithi</div>`;

    // Convert simple markdown to HTML (bold, newlines) for AI responses
    let formattedText = escapeHTML(text);
    if (!isUser) {
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formattedText = formattedText.replace(/\n/g, '<br>');
    }

    msgDiv.innerHTML = `
        ${avatarHtml}
        <div class="message-body">
            ${authorHtml}
            <div class="message-text">
                <p>${formattedText}</p>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag)
    );
}

/* =========================================================
   PARTICLE FIELD ANIMATION (Antigravity Style)
   ========================================================= */
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Stellar AI Neural Colors (Blues & Cyans)
    const colors = ['#00F0FF', '#3b82f6', '#60a5fa', '#a855f7'];
    
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let cameraX = 0;
    let cameraY = 0;
    
    function resize() {
        width = canvas.parentElement.clientWidth || window.innerWidth;
        height = canvas.parentElement.clientHeight || window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
    }
    
    window.addEventListener('resize', resize);
    
    function initParticles() {
        particles = [];
        const numParticles = 700; // Increased density
        
        for (let i = 0; i < numParticles; i++) {
            // Distribute particles across a wide 3D volume
            const x = (Math.random() - 0.5) * width * 3;
            const y = (Math.random() - 0.5) * height * 3;
            const z = (Math.random() - 0.5) * 2500; // Deeper Z-space
            
            particles.push({
                x: x, 
                y: y, 
                z: z,
                vx: (Math.random() - 0.5) * 0.8, // Faster horizontal drift
                vy: (Math.random() - 0.5) * 0.8, // Faster vertical drift
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 2.5 + 0.5,
                angle: Math.random() * Math.PI * 2, // Orientation of the dash
                rotSpeed: (Math.random() - 0.5) * 0.04
            });
        }
    }
    
    document.addEventListener('mousemove', (e) => {
        // Normalize mouse coordinates to -1 .. 1
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;
        
        // Target camera position for parallax
        targetCameraX = mouseX * 200; 
        targetCameraY = mouseY * 200;
    });
    
    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        // Smooth camera movement (Parallax)
        cameraX += (targetCameraX - cameraX) * 0.05;
        cameraY += (targetCameraY - cameraY) * 0.05;
        
        const cx = width / 2;
        const cy = height / 2;
        const perspective = 800;
        
        particles.forEach(p => {
            // Drift particles
            p.x += p.vx;
            p.y += p.vy;
            p.angle += p.rotSpeed;
            
            // Wrap particles around if they drift too far
            if (p.x > width * 1.5) p.x = -width * 1.5;
            if (p.x < -width * 1.5) p.x = width * 1.5;
            if (p.y > height * 1.5) p.y = -height * 1.5;
            if (p.y < -height * 1.5) p.y = height * 1.5;
            
            // Apply camera parallax offset
            const relX = p.x - cameraX * (p.z / 1000 + 1);
            const relY = p.y - cameraY * (p.z / 1000 + 1);
            
            // 3D projection
            const scale = perspective / (perspective + p.z + 1000); // Shift Z back so they don't clip through screen
            const x3d = cx + relX * scale;
            const y3d = cy + relY * scale;
            
            // Fade based on depth, enhanced for glow effect
            const alpha = Math.max(0.05, Math.min(1, scale * 2));
            
            // Draw a dashed line (like Antigravity) with glow
            ctx.beginPath();
            const dashLength = p.size * 5 * scale;
            
            ctx.moveTo(x3d - Math.cos(p.angle) * dashLength, y3d - Math.sin(p.angle) * dashLength);
            ctx.lineTo(x3d + Math.cos(p.angle) * dashLength, y3d + Math.sin(p.angle) * dashLength);
            
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = Math.max(0.5, p.size * scale);
            ctx.shadowBlur = 8;
            ctx.shadowColor = p.color;
            ctx.stroke();
            
            // Reset shadow to avoid massive performance hit across the board
            ctx.shadowBlur = 0;
            
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = alpha * 0.7; // Make them slightly transparent overall
            ctx.lineWidth = p.size * scale;
            ctx.lineCap = 'round';
            ctx.stroke();
        });
        
        requestAnimationFrame(animate);
    }
    
    setTimeout(() => {
        resize();
        initParticles();
        animate();
    }, 100);
}
