// Nexus Chatbot Widget - Universal Integration
// This file creates a standalone chatbot widget that can be embedded in any website

(function() {
    'use strict';
    
    // Configuration
    const CHATBOT_CONFIG = {
        // Use proxy in development (localhost), direct URL in production
        apiBaseUrl: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') 
            ? '' 
            : 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net',
        sessionId: null, // Will be generated dynamically
        indexName: 'default',
        position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
        theme: 'default', // default, dark, custom
        autoOpen: false,
        welcomeMessage: "Hi! Ask me about our services, fees, or how to get started.",
        clinicName: "Clinic Name",
        logoUrl: "",
        privacyNoticeText: "I'm an educational assistant. I don't provide medical advice or diagnosis.",
        privacyNoticeUrl: "",
        bookNowText: "book now",
        bookNowUrl: "",
        bookNowShow: true,
        sendEmailText: "Send an email", 
        sendEmailShow: true,
        brandColour: "RGB(173, 216, 230)"
    };

    // Generate unique session ID
    function generateSessionId() {
        return `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Initialize session ID
    if (!CHATBOT_CONFIG.sessionId) {
        CHATBOT_CONFIG.sessionId = generateSessionId();
    }

    // API Functions
    async function fetchChatResponse(message) {
        try {
            const requestPayload = {
                message: message,
                session_id: CHATBOT_CONFIG.sessionId,
                index_name: CHATBOT_CONFIG.indexName
            };

            const response = await fetch(`${CHATBOT_CONFIG.apiBaseUrl}/nexus/ai/widget/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
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
            const response = await fetch(`${CHATBOT_CONFIG.apiBaseUrl}/nexus/ai/widget/session/${sessionId}/clear`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error clearing chat session:', error);
            throw error;
        }
    }

    async function saveReaction(sessionId, messageId, reaction) {
        try {
            const requestPayload = {
                session_id: sessionId,
                message_id: messageId,
                reaction: reaction
            };

            const response = await fetch(`${CHATBOT_CONFIG.apiBaseUrl}/nexus/ai/widget/chat/reaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
                body: JSON.stringify(requestPayload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error saving reaction:', error);
            throw new Error('Failed to save reaction. Please try again.');
        }
    }

    // Send email API function
    async function sendEmail(name, email, message) {
        try {
            const requestPayload = {
                Name: name,
                ContactPersonEmail: email,
                Message: message
            };

            const response = await fetch('https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net/SendAnEmail/SendMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
                body: JSON.stringify(requestPayload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text(); // API returns text/plain
            return data;
        } catch (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send email. Please try again.');
        }
    }

    // Get clinic settings from Settings API
    async function getClinicSettings() {
        try {
            const response = await fetch('https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net/Settings/Get', {
                method: 'GET',
                headers: {
                    'accept': 'text/plain',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching clinic settings:', error);
            throw new Error('Failed to load clinic settings. Please try again.');
        }
    }

    // Backward compatibility alias
    async function saveChatReaction(sessionId, messageId, reaction) {
        return saveReaction(sessionId, messageId, reaction);
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
            this.privacyAgreed = false;
            
            // Initialize asynchronously
            this.init().catch(error => {
                console.error('Failed to initialize chatbot widget:', error);
                // Fallback to default initialization
                this.createStyles();
                this.createWidget();
                this.attachEventListeners();
            });
        }

        async init() {
            await this.loadClinicSettings();
            this.createStyles();
            this.createWidget();
            this.attachEventListeners();
        }

        async loadClinicSettings() {
            try {
                const settings = await getClinicSettings();
                // Update config with API settings
                this.config = {
                    ...this.config,
                    clinicName: settings.ClinicName || this.config.clinicName,
                    logoUrl: settings.LogoUrl || '',
                    privacyNoticeUrl: settings.PrivacyNoticeUrl || '',
                    bookNowUrl: settings.BookNowUrl || '',
                    bookNowText: settings.BookNowLabel || this.config.bookNowText,
                    bookNowShow: settings.BookNowShow === 'True',
                    sendEmailText: settings.SendAnEmailLabel || this.config.sendEmailText,
                    sendEmailShow: settings.SendAnEmailShow === 'True',
                    brandColour: settings.BrandColour || '#667eea'
                };
                console.log('Widget clinic settings loaded:', settings);
            } catch (error) {
                console.error('Failed to load clinic settings for widget:', error);
                // Continue with default settings
            }
        }

        createStyles() {
            const style = document.createElement('style');
            style.textContent = this.getWidgetStyles();
            document.head.appendChild(style);
        }

        getWidgetStyles() {
            const brandColor = this.config.brandColour || 'RGB(173, 216, 230)';
            const gradientColor = `linear-gradient(135deg, ${brandColor}, #764ba2 100%)`;
            
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
                    background: ${gradientColor};
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
                    width: 650px;
                    max-width: calc(100vw - 40px);
                    height: 480px;
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
                    background: ${gradientColor};
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
                    background: ${gradientColor};
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
                    border-color: ${brandColor};
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
                    background: ${gradientColor};
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
                    
                    .nexus-reaction-btn {
                        width: 28px !important;
                        height: 28px !important;
                        font-size: 14px !important;
                    }

                    .nexus-follow-up-question {
                        padding: 8px 10px !important;
                        font-size: 12px !important;
                    }

                    .nexus-topic-tag {
                        padding: 3px 8px !important;
                        font-size: 11px !important;
                    }
                }
                
                /* Reaction buttons styling */
                .nexus-reaction-buttons {
                    display: flex;
                    gap: 8px;
                    margin-top: 8px;
                    justify-content: flex-start;
                }
                
                .nexus-reaction-btn {
                    background: none;
                    border: none;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 16px;
                    transition: all 0.2s ease;
                    background-color: rgba(0, 0, 0, 0.05);
                    opacity: 0.6;
                }
                
                .nexus-reaction-btn:hover {
                    opacity: 1;
                    transform: scale(1.1);
                    background-color: rgba(0, 0, 0, 0.1);
                }
                
                .nexus-reaction-btn.nexus-like:hover {
                    background-color: rgba(34, 197, 94, 0.2);
                }
                
                .nexus-reaction-btn.nexus-dislike:hover {
                    background-color: rgba(239, 68, 68, 0.2);
                }
                
                .nexus-reaction-btn.active {
                    opacity: 1;
                    transform: scale(1.05);
                }
                
                .nexus-reaction-btn.nexus-like.active,
                .nexus-reaction-btn.liked {
                    background-color: #22c55e !important;
                    color: white !important;
                    box-shadow: 0 2px 8px rgba(34, 197, 94, 0.4);
                }
                
                .nexus-reaction-btn.nexus-dislike.active,
                .nexus-reaction-btn.disliked {
                    background-color: #ef4444 !important;
                    color: white !important;
                    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
                }
                
                .nexus-reaction-btn:active {
                    transform: scale(0.95);
                }

                /* Suggestions styling */
                .nexus-follow-up-section {
                    margin-top: 12px;
                }

                .nexus-follow-up-question {
                    background: linear-gradient(135deg, #f8f9ff 0%, #e3e8ff 100%);
                    border: 1px solid #c7d2fe;
                    border-radius: 12px;
                    padding: 10px 12px;
                    margin: 8px 0;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                }

                .nexus-follow-up-question:hover {
                    background: linear-gradient(135deg, #eef2ff 0%, #ddd6fe 100%);
                    border-color: #a78bfa;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
                }

                .nexus-follow-up-icon {
                    font-size: 14px;
                    flex-shrink: 0;
                }

                .nexus-follow-up-text {
                    flex: 1;
                    color: #4c1d95;
                    font-weight: 500;
                }

                .nexus-follow-up-arrow {
                    font-size: 12px;
                    color: #7c3aed;
                    opacity: 0.7;
                    transition: transform 0.2s ease;
                }

                .nexus-follow-up-question:hover .nexus-follow-up-arrow {
                    transform: translateX(2px);
                }

                .nexus-suggested-topics-section {
                    margin-top: 12px;
                }

                .nexus-topics-label {
                    font-size: 12px;
                    color: #6b7280;
                    margin-bottom: 6px;
                    font-weight: 600;
                }

                .nexus-suggested-topics {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .nexus-topic-tag {
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                    border: 1px solid #bae6fd;
                    color: #0369a1;
                    padding: 4px 10px;
                    border-radius: 16px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }

                .nexus-topic-tag:hover {
                    background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
                    border-color: #0ea5e9;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 6px rgba(14, 165, 233, 0.2);
                    color: #0c4a6e;
                }

                /* Privacy Notice Styles */
                .nexus-privacy-notice {
                    background: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 8px;
                    padding: 12px 16px;
                    margin: 16px 20px;
                    font-size: 14px;
                    color: #856404;
                    line-height: 1.4;
                }

                .nexus-privacy-notice p {
                    margin: 0 0 8px 0;
                }

                .nexus-privacy-notice a {
                    color: #007bff;
                    text-decoration: underline;
                    cursor: pointer;
                }

                .nexus-privacy-notice a:hover {
                    color: #0056b3;
                }

                .nexus-privacy-agree {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-top: 12px;
                }

                .nexus-privacy-agree input[type="checkbox"] {
                    margin: 0;
                }

                .nexus-privacy-agree label {
                    font-size: 13px;
                    cursor: pointer;
                    user-select: none;
                }

                .nexus-agree-btn {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-left: auto;
                    transition: background 0.2s;
                }

                .nexus-agree-btn:hover {
                    background: #0056b3;
                }

                .nexus-agree-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                /* Action Buttons Styles */
                .nexus-action-buttons {
                    padding: 16px 20px;
                    border-top: 1px solid #eee;
                    display: flex;
                    gap: 12px;
                    background: #f8f9fa;
                }

                .nexus-action-btn {
                    flex: 1;
                    background: ${gradientColor};
                    color: white;
                    border: none;
                    padding: 12px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    text-align: center;
                }

                .nexus-action-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                .nexus-action-btn.secondary {
                    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                }

                .nexus-chatbot-container.privacy-mode .nexus-chatbot-input,
                .nexus-chatbot-container.privacy-mode .nexus-action-buttons {
                    display: none;
                }

                .nexus-chatbot-container.privacy-mode .nexus-chatbot-messages {
                    flex: none;
                    height: auto;
                    max-height: 200px;
                }

                /* Email Form Popup Styles */
                .nexus-email-form-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1001;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                .nexus-email-form-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }

                .nexus-email-form {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    width: 90%;
                    max-width: 400px;
                    max-height: 90%;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    transform: scale(0.8) translateY(20px);
                    transition: all 0.3s ease;
                }

                .nexus-email-form-overlay.show .nexus-email-form {
                    transform: scale(1) translateY(0);
                }

                .nexus-email-form h3 {
                    margin: 0 0 16px 0;
                    color: #333;
                    font-size: 18px;
                    font-weight: 600;
                }

                .nexus-email-form-group {
                    margin-bottom: 16px;
                }

                .nexus-email-form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 14px;
                    font-weight: 500;
                    color: #555;
                }

                .nexus-email-form-group input,
                .nexus-email-form-group textarea {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    font-size: 14px;
                    font-family: inherit;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }

                .nexus-email-form-group input:focus,
                .nexus-email-form-group textarea:focus {
                    outline: none;
                    border-color: ${brandColor};
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .nexus-email-form-group textarea {
                    resize: vertical;
                    min-height: 100px;
                    max-height: 200px;
                }

                .nexus-email-form-buttons {
                    display: flex;
                    gap: 12px;
                    margin-top: 20px;
                }

                .nexus-email-form-btn {
                    flex: 1;
                    padding: 12px 16px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .nexus-email-form-btn.primary {
                    background: ${gradientColor};
                    color: white;
                }

                .nexus-email-form-btn.primary:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }

                .nexus-email-form-btn.primary:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .nexus-email-form-btn.secondary {
                    background: #f8f9fa;
                    color: #666;
                    border: 1px solid #ddd;
                }

                .nexus-email-form-btn.secondary:hover {
                    background: #e9ecef;
                    border-color: #adb5bd;
                }

                .nexus-email-form-loading {
                    display: none;
                    align-items: center;
                    gap: 8px;
                    color: #666;
                    font-size: 14px;
                }

                .nexus-email-form-loading.show {
                    display: flex;
                }

                .nexus-email-form-loading .nexus-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid ${brandColor};
                    border-radius: 50%;
                    animation: nexus-spin 1s linear infinite;
                }

                @keyframes nexus-spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .nexus-email-form-success {
                    display: none;
                    text-align: center;
                    color: #28a745;
                    font-size: 14px;
                    margin-top: 12px;
                }

                .nexus-email-form-success.show {
                    display: block;
                }

                .nexus-email-form-error {
                    display: none;
                    text-align: center;
                    color: #dc3545;
                    font-size: 14px;
                    margin-top: 12px;
                }

                .nexus-email-form-error.show {
                    display: block;
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
            chatContainer.className = `nexus-chatbot-container ${this.isOpen ? 'open' : ''} privacy-mode`;
            
            // Create header
            const header = this.createHeader();
            
            // Create privacy notice
            const privacyNotice = this.createPrivacyNotice();
            
            // Create messages area
            const messagesArea = document.createElement('div');
            messagesArea.className = 'nexus-chatbot-messages';
            
            // Create input area
            const inputArea = this.createInputArea();
            
            // Create action buttons
            const actionButtons = this.createActionButtons();
            
            // Create email form
            const emailForm = this.createEmailForm();
            
            // Assemble widget
            chatContainer.appendChild(header);
            chatContainer.appendChild(privacyNotice);
            chatContainer.appendChild(messagesArea);
            chatContainer.appendChild(inputArea);
            chatContainer.appendChild(actionButtons);
            chatContainer.appendChild(emailForm);
            
            this.container.appendChild(toggleBtn);
            this.container.appendChild(chatContainer);
            
            // Add to page
            document.body.appendChild(this.container);
            
            // Store references
            this.toggleBtn = toggleBtn;
            this.chatContainer = chatContainer;
            this.messagesArea = messagesArea;
            this.privacyNotice = privacyNotice;
            this.inputTextarea = inputArea.querySelector('textarea');
            this.sendBtn = inputArea.querySelector('.nexus-send-btn');
            this.actionButtons = actionButtons;
            this.emailForm = emailForm;
            
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
                const rightOverflow = (rect.right + 650) > window.innerWidth;
                if (rightOverflow) {
                    // Adjust the container position to prevent overflow
                    this.chatContainer.style.right = '0px';
                    this.chatContainer.style.left = 'auto';
                    
                    // If still overflowing, make it smaller
                    const availableWidth = window.innerWidth - rect.left - 40;
                    if (availableWidth < 650) {
                        this.chatContainer.style.width = `${Math.max(350, availableWidth)}px`;
                    }
                }
            }
            
            // Check if chat container would overflow on the left
            if (this.config.position.includes('left')) {
                const leftOverflow = (rect.left - 650) < 0;
                if (leftOverflow) {
                    this.chatContainer.style.left = '0px';
                    this.chatContainer.style.right = 'auto';
                    
                    // If still overflowing, make it smaller
                    const availableWidth = window.innerWidth - rect.right - 40;
                    if (availableWidth < 650) {
                        this.chatContainer.style.width = `${Math.max(350, availableWidth)}px`;
                    }
                }
            }
        }

        createHeader() {
            const header = document.createElement('div');
            header.className = 'nexus-chatbot-header';
            const logoHtml = this.config.logoUrl 
                ? `<img src="${this.config.logoUrl}" alt="Clinic Logo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;" />`
                : '🤖';
            
            header.innerHTML = `
                <div class="nexus-header-info">
                    <div class="nexus-bot-avatar">${logoHtml}</div>
                    <div>
                        <h3>${this.config.clinicName}</h3>
                        <span class="nexus-status">Educational only</span>
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

        createPrivacyNotice() {
            const privacyNotice = document.createElement('div');
            privacyNotice.className = 'nexus-privacy-notice';
            const privacyLinkHtml = this.config.privacyNoticeUrl 
                ? `<a href="${this.config.privacyNoticeUrl}" target="_blank" rel="noopener noreferrer">Privacy Notice</a>`
                : `<a href="#" onclick="alert('Privacy Notice: We collect basic information to improve our services.')">Privacy Notice</a>`;
            
            privacyNotice.innerHTML = `
                <p>${this.config.privacyNoticeText}</p>
                <p>By continuing, you consent to educational responses and lead capture. See our ${privacyLinkHtml}.</p>
                <div class="nexus-privacy-agree">
                    <input type="checkbox" id="nexus-privacy-checkbox">
                    <label for="nexus-privacy-checkbox">I agree</label>
                    <button class="nexus-agree-btn" disabled onclick="window.nexusChatbot.handlePrivacyAgreement()">I agree</button>
                </div>
            `;
            return privacyNotice;
        }

        createActionButtons() {
            const actionButtons = document.createElement('div');
            actionButtons.className = 'nexus-action-buttons';
            
            let buttonsHtml = '';
            
            // Book Now button
            if (this.config.bookNowShow) {
                const bookNowAction = this.config.bookNowUrl 
                    ? `window.open('${this.config.bookNowUrl}', '_blank')`
                    : `alert('Book Now: Please call us at your clinic number or visit our website to book an appointment.')`;
                
                buttonsHtml += `
                    <button class="nexus-action-btn" onclick="${bookNowAction}">
                        ${this.config.bookNowText}
                    </button>
                `;
            }
            
            // Send Email button
            if (this.config.sendEmailShow) {
                buttonsHtml += `
                    <button class="nexus-action-btn secondary" onclick="window.nexusChatbot.showEmailForm()">
                        ${this.config.sendEmailText}
                    </button>
                `;
            }
            
            actionButtons.innerHTML = buttonsHtml;
            return actionButtons;
        }

        createEmailForm() {
            const emailFormOverlay = document.createElement('div');
            emailFormOverlay.className = 'nexus-email-form-overlay';
            emailFormOverlay.innerHTML = `
                <div class="nexus-email-form">
                    <h3>Send us an Email</h3>
                    <form id="nexus-email-form">
                        <div class="nexus-email-form-group">
                            <label for="nexus-email-name">Your Name*</label>
                            <input type="text" id="nexus-email-name" name="name" required>
                        </div>
                        <div class="nexus-email-form-group">
                            <label for="nexus-email-address">Your Email*</label>
                            <input type="email" id="nexus-email-address" name="email" required>
                        </div>
                        <div class="nexus-email-form-group">
                            <label for="nexus-email-message">Message*</label>
                            <textarea id="nexus-email-message" name="message" placeholder="Please tell us how we can help you..." required></textarea>
                        </div>
                        <div class="nexus-email-form-loading">
                            <div class="nexus-spinner"></div>
                            <span>Sending email...</span>
                        </div>
                        <div class="nexus-email-form-success">
                            ✅ Email sent successfully! We'll get back to you soon.
                        </div>
                        <div class="nexus-email-form-error">
                            ❌ Failed to send email. Please try again.
                        </div>
                        <div class="nexus-email-form-buttons">
                            <button type="button" class="nexus-email-form-btn secondary" onclick="window.nexusChatbot.hideEmailForm()">
                                Cancel
                            </button>
                            <button type="submit" class="nexus-email-form-btn primary">
                                Send Email
                            </button>
                        </div>
                    </form>
                </div>
            `;
            return emailFormOverlay;
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

            // Privacy checkbox
            const privacyCheckbox = this.container.querySelector('#nexus-privacy-checkbox');
            const agreeBtn = this.container.querySelector('.nexus-agree-btn');
            if (privacyCheckbox && agreeBtn) {
                privacyCheckbox.addEventListener('change', () => {
                    agreeBtn.disabled = !privacyCheckbox.checked;
                });
            }

            // Email form event listeners
            const emailFormElement = this.container.querySelector('#nexus-email-form');
            if (emailFormElement) {
                emailFormElement.addEventListener('submit', (e) => this.handleEmailSubmit(e));
            }

            // Email form overlay click to close
            this.emailForm.addEventListener('click', (e) => {
                if (e.target === this.emailForm) {
                    this.hideEmailForm();
                }
            });

            // Set up global reference for privacy agreement
            window.nexusChatbot = this;
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

        handlePrivacyAgreement() {
            this.privacyAgreed = true;
            this.chatContainer.classList.remove('privacy-mode');
            this.privacyNotice.style.display = 'none';
            
            // Focus on input after agreeing to privacy
            if (this.inputTextarea) {
                this.inputTextarea.focus();
            }
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
            if (!this.privacyAgreed) {
                alert('Please agree to the privacy notice first.');
                return;
            }

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
                    metadata: response,
                    message_id: response.message_id,
                    session_id: response.session_id || CHATBOT_CONFIG.sessionId,
                    userReaction: null, // Track user's reaction: null, true (like), false (dislike)
                    followUpQuestion: response.follow_up_question,
                    suggestedTopics: response.suggested_topics
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

        getLatestBotMessageIndex() {
            // Find the index of the last bot message in the array
            for (let i = this.messages.length - 1; i >= 0; i--) {
                if (this.messages[i].sender === 'bot' && !this.messages[i].isError) {
                    return i;
                }
            }
            return -1; // No bot message found
        }

        renderMessages() {
            this.messagesArea.innerHTML = '';
            
            // Find the index of the latest bot message
            const latestBotMessageIndex = this.getLatestBotMessageIndex();
            
            this.messages.forEach((message, index) => {
                const messageEl = document.createElement('div');
                messageEl.className = `nexus-message ${message.sender}`;
                
                const contentEl = document.createElement('div');
                contentEl.className = 'nexus-message-content';
                
                const bubbleEl = document.createElement('div');
                bubbleEl.className = `nexus-message-bubble ${message.isError ? 'error' : ''}`;
                bubbleEl.textContent = message.text;
                
                contentEl.appendChild(bubbleEl);
                
                // Check if this is the latest bot message for showing reactions and suggestions
                const isLatestBotMessage = (message.sender === 'bot' && index === latestBotMessageIndex);

                // Add follow-up question only for the latest bot message
                if (isLatestBotMessage && message.followUpQuestion && !message.isError) {
                    const followUpEl = document.createElement('div');
                    followUpEl.className = 'nexus-follow-up-section';
                    
                    const followUpQuestion = document.createElement('div');
                    followUpQuestion.className = 'nexus-follow-up-question';
                    followUpQuestion.innerHTML = `
                        <span class="nexus-follow-up-icon">💡</span>
                        <span class="nexus-follow-up-text">${message.followUpQuestion}</span>
                        <span class="nexus-follow-up-arrow">→</span>
                    `;
                    followUpQuestion.onclick = () => this.handleFollowUpClick(message.followUpQuestion);
                    followUpQuestion.title = 'Click to ask this question';
                    
                    followUpEl.appendChild(followUpQuestion);
                    contentEl.appendChild(followUpEl);
                }

                // Add suggested topics only for the latest bot message
                if (isLatestBotMessage && message.suggestedTopics && message.suggestedTopics.length > 0 && !message.isError) {
                    const topicsSection = document.createElement('div');
                    topicsSection.className = 'nexus-suggested-topics-section';
                    
                    const topicsLabel = document.createElement('div');
                    topicsLabel.className = 'nexus-topics-label';
                    topicsLabel.textContent = '🏷️ Suggested Topics';
                    
                    const topicsContainer = document.createElement('div');
                    topicsContainer.className = 'nexus-suggested-topics';
                    
                    message.suggestedTopics.forEach(topic => {
                        const topicTag = document.createElement('span');
                        topicTag.className = 'nexus-topic-tag';
                        topicTag.textContent = topic;
                        topicTag.onclick = () => this.handleTopicClick(topic);
                        topicTag.title = `Click to ask about: ${topic}`;
                        topicsContainer.appendChild(topicTag);
                    });
                    
                    topicsSection.appendChild(topicsLabel);
                    topicsSection.appendChild(topicsContainer);
                    contentEl.appendChild(topicsSection);
                }

                const timeEl = document.createElement('div');
                timeEl.className = 'nexus-message-time';
                timeEl.textContent = this.formatTime(message.timestamp);
                
                contentEl.appendChild(timeEl);
                
                // Add reaction buttons only for the latest bot message with message_id
                if (isLatestBotMessage && message.message_id && !message.isError) {
                    const reactionsEl = document.createElement('div');
                    reactionsEl.className = 'nexus-reaction-buttons';
                    
                    const likeBtn = document.createElement('button');
                    likeBtn.className = `nexus-reaction-btn nexus-like ${message.userReaction === true ? 'active liked' : ''}`;
                    likeBtn.innerHTML = '👍';
                    likeBtn.title = 'Like this response';
                    likeBtn.onclick = () => this.handleReaction(message.id, message.session_id, true);
                    
                    const dislikeBtn = document.createElement('button');
                    dislikeBtn.className = `nexus-reaction-btn nexus-dislike ${message.userReaction === false ? 'active disliked' : ''}`;
                    dislikeBtn.innerHTML = '👎';
                    dislikeBtn.title = 'Dislike this response';
                    dislikeBtn.onclick = () => this.handleReaction(message.id, message.session_id, false);
                    
                    reactionsEl.appendChild(likeBtn);
                    reactionsEl.appendChild(dislikeBtn);
                    contentEl.appendChild(reactionsEl);
                }
                
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

        async handleReaction(messageId, sessionId, reaction) {
            try {
                // Find the current reaction for this message
                const currentMessage = this.messages.find(msg => msg.id === messageId);
                const currentReaction = currentMessage?.userReaction;
                
                // If clicking the same reaction, remove it (set to null)
                const newReaction = currentReaction === reaction ? null : reaction;
                
                // Update local state immediately for better UX
                this.messages = this.messages.map(message => 
                    message.id === messageId 
                        ? { ...message, userReaction: newReaction }
                        : message
                );
                
                // Re-render messages to show updated reaction state
                this.renderMessages();
                
                // Save reaction to backend
                await saveReaction(sessionId, messageId, newReaction);
            } catch (error) {
                console.error('Error saving reaction:', error);
                // Revert local state on error
                this.messages = this.messages.map(message => 
                    message.id === messageId 
                        ? { ...message, userReaction: currentMessage?.userReaction || null }
                        : message
                );
                this.renderMessages();
            }
        }

        handleFollowUpClick(followUpQuestion) {
            this.inputTextarea.value = followUpQuestion;
            this.inputTextarea.focus();
            // Auto-resize the textarea
            this.inputTextarea.style.height = 'auto';
            this.inputTextarea.style.height = this.inputTextarea.scrollHeight + 'px';
        }

        handleTopicClick(topic) {
            this.inputTextarea.value = `Tell me about ${topic}`;
            this.inputTextarea.focus();
            // Auto-resize the textarea
            this.inputTextarea.style.height = 'auto';
            this.inputTextarea.style.height = this.inputTextarea.scrollHeight + 'px';
        }

        // Email form methods
        showEmailForm() {
            this.emailForm.classList.add('show');
            // Focus on the name field
            setTimeout(() => {
                const nameInput = this.emailForm.querySelector('#nexus-email-name');
                if (nameInput) nameInput.focus();
            }, 300);
        }

        hideEmailForm() {
            this.emailForm.classList.remove('show');
            // Reset form
            const form = this.emailForm.querySelector('#nexus-email-form');
            if (form) {
                form.reset();
                this.resetEmailFormState();
            }
        }

        resetEmailFormState() {
            const loading = this.emailForm.querySelector('.nexus-email-form-loading');
            const success = this.emailForm.querySelector('.nexus-email-form-success');
            const error = this.emailForm.querySelector('.nexus-email-form-error');
            const submitBtn = this.emailForm.querySelector('button[type="submit"]');
            const cancelBtn = this.emailForm.querySelector('.secondary');

            if (loading) loading.classList.remove('show');
            if (success) success.classList.remove('show');
            if (error) error.classList.remove('show');
            if (submitBtn) submitBtn.disabled = false;
            if (cancelBtn) cancelBtn.disabled = false;
        }

        async handleEmailSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const message = formData.get('message').trim();

            if (!name || !email || !message) {
                this.showEmailError('Please fill in all required fields.');
                return;
            }

            const loading = this.emailForm.querySelector('.nexus-email-form-loading');
            const success = this.emailForm.querySelector('.nexus-email-form-success');
            const error = this.emailForm.querySelector('.nexus-email-form-error');
            const submitBtn = this.emailForm.querySelector('button[type="submit"]');
            const cancelBtn = this.emailForm.querySelector('.secondary');

            try {
                // Show loading state
                loading.classList.add('show');
                success.classList.remove('show');
                error.classList.remove('show');
                submitBtn.disabled = true;
                cancelBtn.disabled = true;

                // Send email
                await sendEmail(name, email, message);

                // Show success
                loading.classList.remove('show');
                success.classList.add('show');
                
                // Auto close after success
                setTimeout(() => {
                    this.hideEmailForm();
                }, 2000);

            } catch (err) {
                console.error('Email send error:', err);
                loading.classList.remove('show');
                error.classList.add('show');
                submitBtn.disabled = false;
                cancelBtn.disabled = false;
            }
        }

        showEmailError(message) {
            const error = this.emailForm.querySelector('.nexus-email-form-error');
            if (error) {
                error.textContent = `❌ ${message}`;
                error.classList.add('show');
                setTimeout(() => {
                    error.classList.remove('show');
                }, 3000);
            }
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
