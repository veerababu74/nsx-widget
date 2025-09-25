// Widget Chat API service for conversational AI
// Base URL for the chat widget API
const API_BASE_URL = import.meta.env.DEV 
    ? '' 
    : (import.meta.env.VITE_API_BASE_URL || 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net');

/**
 * Send a chat message to the widget chat endpoint
 * @param {string} message - The user message
 * @param {string} sessionId - Session ID (optional, defaults to auto-generated)
 * @param {string} indexName - Index name for the conversation context (optional)
 * @returns {Promise<Object>} - The full AI response object
 */
export const fetchImprovedChatResponse = async (message, sessionId = null, indexName = "default") => {
    try {
        // Generate session ID if not provided
        const currentSessionId = sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const requestPayload = {
            message: message,
            session_id: currentSessionId,
            index_name: indexName
        };

        const response = await fetch(`${API_BASE_URL}/nexus/ai/widget/chat`, {
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
        console.error('Error fetching widget chat response:', error);
        throw new Error('Failed to get AI response. Please try again.');
    }
};

/**
 * Save user reaction to assistant's response
 * @param {string} sessionId - Session ID
 * @param {string} messageId - Message ID to react to
 * @param {boolean} reaction - Reaction (true for like/positive, false for dislike/negative)
 * @returns {Promise<Object>} - The API response
 */
export const saveReaction = async (sessionId, messageId, reaction) => {
    try {
        const requestPayload = {
            session_id: sessionId,
            message_id: messageId,
            reaction: reaction
        };

        const response = await fetch(`${API_BASE_URL}/nexus/ai/widget/chat/reaction`, {
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
};

/**
 * Clear conversation state for a session
 * @param {string} sessionId - Session ID to clear
 * @returns {Promise<string>} - Success message
 */
export const clearImprovedChatSession = async (sessionId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/nexus/ai/widget/session/${sessionId}/clear`, {
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
        console.error('Error clearing widget session:', error);
        throw new Error('Failed to clear session. Please try again.');
    }
};

/**
 * Save user reaction to an assistant response (alias for backward compatibility)
 * @param {string} sessionId - Session ID
 * @param {string} messageId - Message ID to react to
 * @param {boolean} reaction - Reaction (true for like, false for dislike)
 * @returns {Promise<Object>} - Reaction response
 */
export const saveChatReaction = async (sessionId, messageId, reaction) => {
    return saveReaction(sessionId, messageId, reaction);
};

// Deprecated function - kept for backward compatibility
export const getImprovedChatSession = async (sessionId) => {
    console.warn('getImprovedChatSession is deprecated. Session info is now included in chat responses.');
    return { session_id: sessionId, status: 'active' };
};
