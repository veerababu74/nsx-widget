// Improved Chat API service for enhanced chat functionality
// Use proxy in development, direct URL in production
const API_BASE_URL = import.meta.env.DEV 
    ? '' 
    : (import.meta.env.VITE_API_BASE_URL || 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net');

/**
 * Fetch improved chat response from the backend
 * @param {string} message - The user message
 * @returns {Promise<Object>} - The full AI response object
 */
export const fetchImprovedChatResponse = async (message) => {
    try {
        const requestPayload = {
            message: message,
            session_id: "test1234", // Static as requested
            index_name: "test" // Static as requested
        };

        const response = await fetch(`${API_BASE_URL}/nexus/ai/v3/chat`, {
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
        console.error('Error fetching improved chat response:', error);
        throw new Error('Failed to get AI response. Please try again.');
    }
};

/**
 * Get chat session info
 * @param {string} sessionId - Session ID
 * @returns {Promise<Object>} - Session information
 */
export const getImprovedChatSession = async (sessionId = "test1234") => {
    try {
        const response = await fetch(`${API_BASE_URL}/improved-chat/session/${sessionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching session info:', error);
        return null;
    }
};

/**
 * Clear improved chat session
 * @param {string} sessionId - Session ID to clear
 * @returns {Promise<boolean>} - Success status
 */
export const clearImprovedChatSession = async (sessionId = "test1234") => {
    try {
        const response = await fetch(`${API_BASE_URL}/improved-chat/session/${sessionId}/clear`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.ok;
    } catch (error) {
        console.error('Error clearing improved chat session:', error);
        return false;
    }
};

/**
 * Save user reaction to a chatbot response
 * @param {string} sessionId - Session ID
 * @param {string} messageId - Message ID to react to
 * @param {boolean|null} reaction - true for like, false for dislike, null for no reaction
 * @returns {Promise<Object>} - The API response
 */
export const saveReaction = async (sessionId, messageId, reaction) => {
    try {
        const requestPayload = {
            session_id: sessionId,
            message_id: messageId,
            reaction: reaction
        };

        const response = await fetch(`${API_BASE_URL}/nexus/ai/v3/chat/reaction`, {
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
        console.error('Error saving reaction:', error);
        throw new Error('Failed to save reaction. Please try again.');
    }
};
