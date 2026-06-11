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
const GEMINI_API_KEY = '';
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
