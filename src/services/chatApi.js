// Widget Chat API service for conversational AI
// Base URL for the chat widget API
const API_BASE_URL = import.meta.env.DEV 
    ? '' 
    : (import.meta.env.VITE_API_BASE_URL || 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net');

/**
 * Get widget key (chatbot ID) by website URL
 * @param {string} webUrl - The website URL to get the chatbot ID for
 * @returns {Promise<string>} - The chatbot ID
 */
export const getWidgetKeyByWebUrl = async (webUrl = null) => {
    try {
        // Use current website URL if not provided
        let currentUrl = webUrl || window.location.origin;
        
        // Remove trailing slash if present
        if (currentUrl.endsWith('/')) {
            currentUrl = currentUrl.slice(0, -1);
        }

        const response = await fetch(`https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net/Registration_NoKey/GetWidgetKeyByWebUrl?webUrl=${encodeURIComponent(currentUrl)}`, {
            method: 'GET',
            headers: {
                'accept': 'text/plain',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const chatbotId = await response.text();
        return chatbotId.trim(); // Remove any whitespace
    } catch (error) {
        console.error('Error fetching widget key by web URL:', error);
        throw new Error('Failed to get widget key for this website.');
    }
};

/**
 * Send a chat message to the widget chat endpoint
 * @param {string} message - The user message
 * @param {string} sessionId - Session ID (optional, defaults to auto-generated)
 * @param {string} indexName - Index name for the conversation context (optional)
 * @param {string} chatbotId - Chatbot ID for widget key identification (optional)
 * @returns {Promise<Object>} - The full AI response object
 */
export const fetchImprovedChatResponse = async (message, sessionId = null, indexName = "default", chatbotId = null) => {
    try {
        // Generate session ID if not provided
        const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const requestPayload = {
            message: message,
            session_id: currentSessionId,
            index_name: indexName
        };

        const headers = {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        };

        // Add x-widget-key header if chatbotId is provided
        if (chatbotId) {
            headers['x-widget-key'] = chatbotId;
        }

        const response = await fetch(`${API_BASE_URL}/nexus/ai/widget/chat`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestPayload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching widget chat response:', error);
        throw new Error('Failed to get AI response. Please try again.');
    }
};

/**
 * Save user reaction to assistant's response
 * @param {string} sessionId - Session ID
 * @param {string} messageId - Message ID to react to
 * @param {boolean} reaction - Reaction (true for like/positive, false for dislike/negative)
 * @param {string} chatbotId - Chatbot ID for widget key identification (optional)
 * @returns {Promise<Object>} - The API response
 */
export const saveReaction = async (sessionId, messageId, reaction, chatbotId = null) => {
    try {
        const requestPayload = {
            session_id: sessionId,
            message_id: messageId,
            reaction: reaction
        };

        const headers = {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        };

        // Add x-widget-key header if chatbotId is provided
        if (chatbotId) {
            headers['x-widget-key'] = chatbotId;
        }

        const response = await fetch(`${API_BASE_URL}/nexus/ai/widget/chat/reaction`, {
            method: 'POST',
            headers: headers,
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
};

/**
 * Clear conversation state for a session
 * @param {string} sessionId - Session ID to clear
 * @param {string} chatbotId - Chatbot ID for widget key identification (optional)
 * @returns {Promise<string>} - Success message
 */
export const clearImprovedChatSession = async (sessionId, chatbotId = null) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        };

        // Add x-widget-key header if chatbotId is provided
        if (chatbotId) {
            headers['x-widget-key'] = chatbotId;
        }

        const response = await fetch(`${API_BASE_URL}/nexus/ai/widget/session/${sessionId}/clear`, {
            method: 'DELETE',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error clearing widget session:', error);
        throw new Error('Failed to clear session. Please try again.');
    }
};

/**
 * Save user reaction to an assistant response (alias for backward compatibility)
 * @param {string} sessionId - Session ID
 * @param {string} messageId - Message ID to react to
 * @param {boolean} reaction - Reaction (true for like, false for dislike)
 * @param {string} chatbotId - Chatbot ID for widget key identification (optional)
 * @returns {Promise<Object>} - Reaction response
 */
export const saveChatReaction = async (sessionId, messageId, reaction, chatbotId = null) => {
    return saveReaction(sessionId, messageId, reaction, chatbotId);
};

/**
 * Get clinic settings from the Settings API
 * @param {string} chatbotId - Chatbot ID for widget key identification (optional)
 * @returns {Promise<Object>} - Clinic settings object
 */
export const getClinicSettings = async (chatbotId = null) => {
    try {
        const headers = {
            'accept': 'text/plain',
        };

        // Add x-widget-key header if chatbotId is provided
        if (chatbotId) {
            headers['x-widget-key'] = chatbotId;
        }

        const response = await fetch('https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net/Settings_Widget/Get', {
            method: 'GET',
            headers: headers,
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
};

/**
 * Get starter questions from the StarterQuestions API
 * @param {string} chatbotId - Chatbot ID for widget key identification (optional)
 * @returns {Promise<Object>} - Starter questions object containing q1, q2, q3 and their answers
 */
export const getStarterQuestions = async (chatbotId = null) => {
    try {
        const headers = {
            'accept': 'text/plain',
        };

        // Add x-widget-key header if chatbotId is provided
        if (chatbotId) {
            headers['x-widget-key'] = chatbotId;
        }

        const response = await fetch('https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net/StarterQuestions_Widget/Get', {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching starter questions:', error);
        throw new Error('Failed to load starter questions. Please try again.');
    }
};

/**
 * Send email via SendAnEmail API
 * @param {string} name - Sender's name
 * @param {string} email - Sender's email address
 * @param {string} message - Email message content
 * @param {string} chatbotId - Chatbot ID for widget key identification (optional)
 * @returns {Promise<string>} - API response (text/plain)
 */
export const sendEmail = async (name, email, message, chatbotId = null) => {
    try {
        const requestPayload = {
            Name: name,
            ContactPersonEmail: email,
            Message: message
        };

        const headers = {
            'Content-Type': 'application/json',
            'accept': 'application/json',
        };

        // Add x-widget-key header if chatbotId is provided
        if (chatbotId) {
            headers['x-widget-key'] = chatbotId;
        }

        const response = await fetch('https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net/SendAnEmail_Widget/SendMail', {
            method: 'POST',
            headers: headers,
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
};

/**
 * Get doctor details for the widget
 * @param {string} chatbotId - Chatbot ID for widget key identification
 * @returns {Promise<Object>} - The doctor details object
 */
export const getDoctorDetails = async (chatbotId) => {
    try {
        const headers = {
            'accept': 'text/plain',
        };

        // Add x-widget-key header
        if (chatbotId) {
            headers['x-widget-key'] = chatbotId;
        }

        const response = await fetch('https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net/Staff_Widget/GetDoctorDetails', {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching doctor details:', error);
        throw new Error('Failed to get doctor details.');
    }
};

// Deprecated function - kept for backward compatibility
export const getImprovedChatSession = async (sessionId) => {
    console.warn('getImprovedChatSession is deprecated. Session info is now included in chat responses.');
    return { session_id: sessionId, status: 'active' };
};
