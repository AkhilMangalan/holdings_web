document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatContent = document.querySelector('.chat-content');
    const sendBtn = document.getElementById('send-btn');
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        
        if (this.value.trim() !== '') {
            sendBtn.removeAttribute('disabled');
        } else {
            sendBtn.setAttribute('disabled', 'true');
        }
    });

    // Enter key to send (Shift+Enter for newline)
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // Sidebar toggles
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.remove('collapsed');
        });
    }
    
    // Close sidebar on mobile when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !sidebar.classList.contains('collapsed')) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.add('collapsed');
            }
        }
    });

    // Handle form submission
    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;

        // Reset input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        sendBtn.setAttribute('disabled', 'true');

        // Add user message
        appendMessage('user', message);

        // Simulate AI thinking delay
        setTimeout(() => {
            appendMessage('ai', getMockResponse(message));
        }, 1000 + Math.random() * 1500);
    });

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}-message`;
        
        const isUser = sender === 'user';
        
        const avatarHtml = isUser ? '' : `
            <div class="message-avatar ai-avatar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12 2.1 7.1"/><path d="M12 12l9.9 4.9"/></svg>
            </div>
        `;
        
        const authorHtml = isUser ? '' : `<div class="message-author">Antigravity</div>`;

        msgDiv.innerHTML = `
            ${avatarHtml}
            <div class="message-body">
                ${authorHtml}
                <div class="message-text">
                    <p>${escapeHTML(text)}</p>
                </div>
            </div>
        `;
        
        chatContent.appendChild(msgDiv);
        
        // Scroll to bottom using the scroll area
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    function getMockResponse(input) {
        const lowerInput = input.toLowerCase();
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hello! I am a simulated version of the Google Antigravity UI. How can I assist you with your project today?";
        }
        if (lowerInput.includes('style') || lowerInput.includes('design') || lowerInput.includes('css')) {
            return "This interface was rebuilt to perfectly match the Google Material 3 dark mode palette, ensuring a clean, distraction-free conversational experience.";
        }
        
        const responses = [
            "I'm here to help you code. What specific feature are you working on right now?",
            "Understood. Let me analyze that for you...",
            "That's a great question. Let's break down the technical requirements.",
            "I can write a script to handle that. Would you like me to use Python or Node.js?",
            "This interface is fully responsive. Try resizing your browser window."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
});
