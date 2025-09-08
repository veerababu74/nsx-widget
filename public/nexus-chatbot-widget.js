// Nexus Chatbot Widget - Universal Integration
// This file creates a standalone chatbot widget that can be embedded in any website

(function() {
    'use strict';
    
    // Configuration
    const CHATBOT_CONFIG = {
        apiBaseUrl: 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net',
        sessionId: 'veera1234',
        indexName: 'veera',
        position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
        theme: 'default', // default, dark, custom
        autoOpen: false,
        welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?"
    };

    // API Functions
    async function fetchChatResponse(message) {
        try {
            const requestPayload = {
                message: message,
                session_id: CHATBOT_CONFIG.sessionId,
                index_name: CHATBOT_CONFIG.indexName
            };

            const response = await fetch(`${CHATBOT_CONFIG.apiBaseUrl}/nexus/ai/v3/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestPayload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching chat response:', error);
            throw new Error('Failed to get AI response. Please try again.');
        }
    }

    async function clearChatSession(sessionId = CHATBOT_CONFIG.sessionId) {
        try {
            const response = await fetch(`${CHATBOT_CONFIG.apiBaseUrl}/improved-chat/session/${sessionId}/clear`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.ok;
        } catch (error) {
            console.error('Error clearing chat session:', error);
            return false;
        }
    }

    // Chatbot Widget Class
    class NexusChatbotWidget {
        constructor(config = {}) {
            this.config = { ...CHATBOT_CONFIG, ...config };
            this.messages = [
                {
                    id: 1,
                    text: this.config.welcomeMessage,
                    sender: 'bot',
                    timestamp: new Date()
                }
            ];
            this.isLoading = false;
            this.isOpen = this.config.autoOpen;
            this.container = null;
            
            this.init();
        }

        init() {
            this.createStyles();
            this.createWidget();
            this.attachEventListeners();
        }

        createStyles() {
            const style = document.createElement('style');
            style.textContent = this.getWidgetStyles();
            document.head.appendChild(style);
        }

        getWidgetStyles() {
            return `
                .nexus-chatbot-widget {
                    position: fixed;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                }
                
                .nexus-chat-toggle {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .nexus-chat-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
                }
                
                .nexus-chat-toggle.open {
                    background: #ff6b6b;
                    opacity: 0;
                    visibility: hidden;
                    transform: scale(0.8);
                    pointer-events: none;
                }
                
                .nexus-chatbot-container {
                    width: 450px;
                    max-width: calc(100vw - 40px);
                    height: 500px;
                    max-height: calc(100vh - 80px);
                    background: white;
                    border-radius: 16px;
                    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
                    display: flex;
                    flex-direction: column;
                    transform: translateY(100%) scale(0.8);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    position: absolute;
                    bottom: 0px;
                    right: 0;
                }
                
                .nexus-chatbot-container.open {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                    visibility: visible;
                }
                
                .nexus-chatbot-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 16px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .nexus-header-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .nexus-bot-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }
                
                .nexus-header-info h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }
                
                .nexus-status {
                    font-size: 12px;
                    opacity: 0.8;
                }
                
                .nexus-header-actions {
                    display: flex;
                    gap: 8px;
                }
                
                .nexus-clear-btn, .nexus-close-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .nexus-clear-btn:hover, .nexus-close-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
                
                .nexus-chatbot-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: #f8f9fa;
                }
                
                .nexus-chatbot-messages::-webkit-scrollbar {
                    width: 6px;
                }
                
                .nexus-chatbot-messages::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .nexus-chatbot-messages::-webkit-scrollbar-thumb {
                    background: #ddd;
                    border-radius: 3px;
                }
                
                .nexus-message {
                    margin-bottom: 16px;
                    display: flex;
                }
                
                .nexus-message.user {
                    justify-content: flex-end;
                }
                
                .nexus-message.bot {
                    justify-content: flex-start;
                }
                
                .nexus-message-content {
                    max-width: 80%;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                }
                
                .nexus-message.bot .nexus-message-content {
                    align-items: flex-start;
                }
                
                .nexus-message-bubble {
                    padding: 12px 16px;
                    border-radius: 18px;
                    word-wrap: break-word;
                    line-height: 1.4;
                    font-size: 14px;
                }
                
                .nexus-message.user .nexus-message-bubble {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-bottom-right-radius: 6px;
                }
                
                .nexus-message.bot .nexus-message-bubble {
                    background: white;
                    color: #333;
                    border: 1px solid #e9ecef;
                    border-bottom-left-radius: 6px;
                }
                
                .nexus-message-bubble.error {
                    background: #ffe6e6;
                    border-color: #ff9999;
                    color: #d63384;
                }
                
                .nexus-message-bubble.loading {
                    padding: 16px;
                }
                
                .nexus-message-time {
                    font-size: 11px;
                    color: #6c757d;
                    margin-top: 4px;
                    margin-left: 8px;
                    margin-right: 8px;
                }
                
                .nexus-typing-indicator {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }
                
                .nexus-typing-indicator span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #6c757d;
                    animation: nexus-typing 1.4s infinite ease-in-out;
                }
                
                .nexus-typing-indicator span:nth-child(1) {
                    animation-delay: -0.32s;
                }
                
                .nexus-typing-indicator span:nth-child(2) {
                    animation-delay: -0.16s;
                }
                
                @keyframes nexus-typing {
                    0%, 80%, 100% {
                        transform: scale(0.8);
                        opacity: 0.5;
                    }
                    40% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                
                .nexus-chatbot-input {
                    padding: 16px 20px;
                    background: white;
                    border-top: 1px solid #e9ecef;
                }
                
                .nexus-input-container {
                    display: flex;
                    gap: 12px;
                    align-items: flex-end;
                }
                
                .nexus-input-container textarea {
                    flex: 1;
                    padding: 12px 16px;
                    border: 1px solid #e9ecef;
                    border-radius: 20px;
                    resize: none;
                    font-family: inherit;
                    font-size: 14px;
                    line-height: 1.4;
                    max-height: 100px;
                    transition: border-color 0.2s;
                }
                
                .nexus-input-container textarea:focus {
                    outline: none;
                    border-color: #667eea;
                }
                
                .nexus-input-container textarea:disabled {
                    background: #f8f9fa;
                    color: #6c757d;
                }
                
                .nexus-send-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    border: none;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }
                
                .nexus-send-btn:hover:not(:disabled) {
                    transform: scale(1.05);
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }
                
                .nexus-send-btn:disabled {
                    background: #e9ecef;
                    color: #6c757d;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }
                
                /* Position Classes */
                .nexus-chatbot-widget.bottom-right {
                    bottom: 20px;
                    right: 20px;
                }
                
                .nexus-chatbot-widget.bottom-right .nexus-chatbot-container {
                    bottom: 0px;
                    right: 0;
                    left: auto;
                }
                
                .nexus-chatbot-widget.bottom-left {
                    bottom: 20px;
                    left: 20px;
                }
                
                .nexus-chatbot-widget.bottom-left .nexus-chatbot-container {
                    bottom: 0px;
                    left: 0;
                    right: auto;
                }
                
                .nexus-chatbot-widget.top-right {
                    top: 20px;
                    right: 20px;
                }
                
                .nexus-chatbot-widget.top-right .nexus-chatbot-container {
                    top: 80px;
                    bottom: auto;
                    right: 0;
                    left: auto;
                }
                
                .nexus-chatbot-widget.top-left {
                    top: 20px;
                    left: 20px;
                }
                
                .nexus-chatbot-widget.top-left .nexus-chatbot-container {
                    top: 80px;
                    bottom: auto;
                    left: 0;
                }
                
                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .nexus-chatbot-container {
                        width: calc(100vw - 40px);
                        height: calc(100vh - 80px);
                        bottom: 0px;
                        left: 50%;
                        right: auto;
                        transform: translateX(-50%) translateY(100%) scale(0.8);
                    }
                    
                    .nexus-chatbot-container.open {
                        transform: translateX(-50%) translateY(0) scale(1);
                    }
                    
                    .nexus-chatbot-widget {
                        bottom: 15px !important;
                        right: 15px !important;
                        left: auto !important;
                        top: auto !important;
                    }
                }
            `;
        }

        createWidget() {
            // Create main container
            this.container = document.createElement('div');
            this.container.className = `nexus-chatbot-widget ${this.config.position}`;
            
            // Create toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'nexus-chat-toggle';
            toggleBtn.innerHTML = this.isOpen ? '✕' : '💬';
            toggleBtn.setAttribute('aria-label', 'Toggle chat');
            
            // Create chat container
            const chatContainer = document.createElement('div');
            chatContainer.className = `nexus-chatbot-container ${this.isOpen ? 'open' : ''}`;
            
            // Create header
            const header = this.createHeader();
            
            // Create messages area
            const messagesArea = document.createElement('div');
            messagesArea.className = 'nexus-chatbot-messages';
            
            // Create input area
            const inputArea = this.createInputArea();
            
            // Assemble widget
            chatContainer.appendChild(header);
            chatContainer.appendChild(messagesArea);
            chatContainer.appendChild(inputArea);
            
            this.container.appendChild(toggleBtn);
            this.container.appendChild(chatContainer);
            
            // Add to page
            document.body.appendChild(this.container);
            
            // Store references
            this.toggleBtn = toggleBtn;
            this.chatContainer = chatContainer;
            this.messagesArea = messagesArea;
            this.inputTextarea = inputArea.querySelector('textarea');
            this.sendBtn = inputArea.querySelector('.nexus-send-btn');
            
            // Ensure proper positioning within viewport
            this.adjustPosition();
            
            // Render initial messages
            this.renderMessages();
        }

        adjustPosition() {
            // Ensure the widget doesn't overflow the viewport
            const rect = this.container.getBoundingClientRect();
            const chatRect = this.chatContainer.getBoundingClientRect();
            
            // Check if chat container would overflow on the right
            if (this.config.position.includes('right')) {
                const rightOverflow = (rect.right + 450) > window.innerWidth;
                if (rightOverflow) {
                    // Adjust the container position to prevent overflow
                    this.chatContainer.style.right = '0px';
                    this.chatContainer.style.left = 'auto';
                    
                    // If still overflowing, make it smaller
                    const availableWidth = window.innerWidth - rect.left - 40;
                    if (availableWidth < 450) {
                        this.chatContainer.style.width = `${Math.max(300, availableWidth)}px`;
                    }
                }
            }
            
            // Check if chat container would overflow on the left
            if (this.config.position.includes('left')) {
                const leftOverflow = (rect.left - 450) < 0;
                if (leftOverflow) {
                    this.chatContainer.style.left = '0px';
                    this.chatContainer.style.right = 'auto';
                    
                    // If still overflowing, make it smaller
                    const availableWidth = window.innerWidth - rect.right - 40;
                    if (availableWidth < 450) {
                        this.chatContainer.style.width = `${Math.max(300, availableWidth)}px`;
                    }
                }
            }
        }

        createHeader() {
            const header = document.createElement('div');
            header.className = 'nexus-chatbot-header';
            header.innerHTML = `
                <div class="nexus-header-info">
                    <div class="nexus-bot-avatar">🤖</div>
                    <div>
                        <h3>Nexus AI Assistant</h3>
                        <span class="nexus-status">Online</span>
                    </div>
                </div>
                <div class="nexus-header-actions">
                    <button class="nexus-clear-btn" title="Clear chat">🗑️</button>
                    <button class="nexus-close-btn" title="Close chat">✕</button>
                </div>
            `;
            return header;
        }

        createInputArea() {
            const inputArea = document.createElement('div');
            inputArea.className = 'nexus-chatbot-input';
            inputArea.innerHTML = `
                <div class="nexus-input-container">
                    <textarea placeholder="Type your message..." rows="1"></textarea>
                    <button class="nexus-send-btn">➤</button>
                </div>
            `;
            return inputArea;
        }

        attachEventListeners() {
            // Toggle button
            this.toggleBtn.addEventListener('click', () => this.toggleChat());
            
            // Close button
            this.container.querySelector('.nexus-close-btn').addEventListener('click', () => this.closeChat());
            
            // Clear button
            this.container.querySelector('.nexus-clear-btn').addEventListener('click', () => this.clearChat());
            
            // Send button
            this.sendBtn.addEventListener('click', () => this.sendMessage());
            
            // Enter key in textarea
            this.inputTextarea.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // Auto-resize textarea
            this.inputTextarea.addEventListener('input', () => {
                this.inputTextarea.style.height = 'auto';
                this.inputTextarea.style.height = this.inputTextarea.scrollHeight + 'px';
            });
            
            // Window resize event to adjust position
            window.addEventListener('resize', () => {
                this.adjustPosition();
            });
        }

        toggleChat() {
            this.isOpen = !this.isOpen;
            this.toggleBtn.innerHTML = this.isOpen ? '✕' : '💬';
            this.toggleBtn.classList.toggle('open', this.isOpen);
            this.chatContainer.classList.toggle('open', this.isOpen);
            
            if (this.isOpen) {
                this.inputTextarea.focus();
                this.scrollToBottom();
            }
        }

        closeChat() {
            this.isOpen = false;
            this.toggleBtn.innerHTML = '💬';
            this.toggleBtn.classList.remove('open');
            this.chatContainer.classList.remove('open');
        }

        async clearChat() {
            try {
                await clearChatSession();
                this.messages = [
                    {
                        id: 1,
                        text: this.config.welcomeMessage,
                        sender: 'bot',
                        timestamp: new Date()
                    }
                ];
                this.renderMessages();
            } catch (error) {
                console.error('Error clearing chat:', error);
            }
        }

        async sendMessage() {
            const message = this.inputTextarea.value.trim();
            if (!message || this.isLoading) return;

            // Add user message
            const userMessage = {
                id: Date.now(),
                text: message,
                sender: 'user',
                timestamp: new Date()
            };

            this.messages.push(userMessage);
            this.inputTextarea.value = '';
            this.inputTextarea.style.height = 'auto';
            this.isLoading = true;
            
            this.renderMessages();
            this.updateInputState();

            try {
                const response = await fetchChatResponse(message);
                
                const botMessage = {
                    id: Date.now() + 1,
                    text: response.response || response.message || 'Sorry, I could not process your request.',
                    sender: 'bot',
                    timestamp: new Date(),
                    metadata: response
                };

                this.messages.push(botMessage);
            } catch (error) {
                const errorMessage = {
                    id: Date.now() + 1,
                    text: 'Sorry, I encountered an error. Please try again.',
                    sender: 'bot',
                    timestamp: new Date(),
                    isError: true
                };
                this.messages.push(errorMessage);
            } finally {
                this.isLoading = false;
                this.renderMessages();
                this.updateInputState();
            }
        }

        renderMessages() {
            this.messagesArea.innerHTML = '';
            
            this.messages.forEach(message => {
                const messageEl = document.createElement('div');
                messageEl.className = `nexus-message ${message.sender}`;
                
                const contentEl = document.createElement('div');
                contentEl.className = 'nexus-message-content';
                
                const bubbleEl = document.createElement('div');
                bubbleEl.className = `nexus-message-bubble ${message.isError ? 'error' : ''}`;
                bubbleEl.textContent = message.text;
                
                const timeEl = document.createElement('div');
                timeEl.className = 'nexus-message-time';
                timeEl.textContent = this.formatTime(message.timestamp);
                
                contentEl.appendChild(bubbleEl);
                contentEl.appendChild(timeEl);
                messageEl.appendChild(contentEl);
                
                this.messagesArea.appendChild(messageEl);
            });
            
            // Add loading indicator if needed
            if (this.isLoading) {
                const loadingEl = document.createElement('div');
                loadingEl.className = 'nexus-message bot';
                loadingEl.innerHTML = `
                    <div class="nexus-message-content">
                        <div class="nexus-message-bubble loading">
                            <div class="nexus-typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                `;
                this.messagesArea.appendChild(loadingEl);
            }
            
            this.scrollToBottom();
        }

        updateInputState() {
            const hasText = this.inputTextarea.value.trim().length > 0;
            this.sendBtn.disabled = !hasText || this.isLoading;
            this.inputTextarea.disabled = this.isLoading;
        }

        scrollToBottom() {
            setTimeout(() => {
                this.messagesArea.scrollTop = this.messagesArea.scrollHeight;
            }, 100);
        }

        formatTime(timestamp) {
            return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        // Public API methods
        open() {
            if (!this.isOpen) {
                this.toggleChat();
            }
        }

        close() {
            if (this.isOpen) {
                this.closeChat();
            }
        }

        sendProgrammaticMessage(message) {
            this.inputTextarea.value = message;
            this.sendMessage();
        }

        updateConfig(newConfig) {
            this.config = { ...this.config, ...newConfig };
        }

        destroy() {
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
        }
    }

    // Global API
    window.NexusChatbot = {
        init: function(config) {
            return new NexusChatbotWidget(config);
        },
        
        // Default instance for simple integration
        widget: null,
        
        start: function(config) {
            if (this.widget) {
                this.widget.destroy();
            }
            this.widget = new NexusChatbotWidget(config);
            return this.widget;
        }
    };

    // Auto-initialize if config is found
    if (window.nexusChatbotConfig) {
        window.NexusChatbot.start(window.nexusChatbotConfig);
    }

})();
