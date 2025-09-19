import React, { useState, useRef, useEffect } from 'react';
import { fetchImprovedChatResponse, clearImprovedChatSession, saveReaction } from '../services/chatApi';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your AI assistant with enhanced capabilities. I can provide follow-up questions and topic suggestions to help guide our conversation. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetchImprovedChatResponse(inputMessage);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.response || response.message || 'Sorry, I could not process your request.',
        sender: 'bot',
        timestamp: new Date(),
        metadata: response,
        message_id: response.message_id,
        session_id: response.session_id || "test1234",
        userReaction: null, // Track user's reaction: null, true (like), false (dislike)
        followUpQuestion: response.follow_up_question,
        suggestedTopics: response.suggested_topics
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = async () => {
    try {
      await clearImprovedChatSession();
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your AI assistant with enhanced capabilities. I can provide follow-up questions and topic suggestions to help guide our conversation. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error('Error clearing chat:', error);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleReaction = async (messageId, sessionId, reaction) => {
    try {
      // Find the current reaction for this message
      const currentMessage = messages.find(msg => msg.id === messageId);
      const currentReaction = currentMessage?.userReaction;
      
      // If clicking the same reaction, remove it (set to null)
      const newReaction = currentReaction === reaction ? null : reaction;
      
      // Update local state immediately for better UX
      setMessages(prev => prev.map(message => 
        message.id === messageId 
          ? { ...message, userReaction: newReaction }
          : message
      ));
      
      // Save reaction to backend
      await saveReaction(sessionId, messageId, newReaction);
    } catch (error) {
      console.error('Error saving reaction:', error);
      // Revert local state on error
      setMessages(prev => prev.map(message => 
        message.id === messageId 
          ? { ...message, userReaction: currentMessage?.userReaction || null }
          : message
      ));
    }
  };

  const handleFollowUpClick = (followUpQuestion) => {
    setInputMessage(followUpQuestion);
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      const textarea = document.querySelector('.chatbot-input textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  };

  const handleTopicClick = (topic) => {
    setInputMessage(`Tell me about ${topic}`);
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      const textarea = document.querySelector('.chatbot-input textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button 
        className={`chat-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <div className="header-info">
            <div className="bot-avatar">🤖</div>
            <div>
              <h3>Nexus AI Assistant</h3>
              <span className="status">Online</span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={clearChat} className="clear-btn" title="Clear chat">
              🗑️
            </button>
            <button onClick={() => setIsOpen(false)} className="close-btn" title="Close chat">
              ✕
            </button>
          </div>
        </div>

        <div className="chatbot-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <div className={`message-bubble ${message.isError ? 'error' : ''}`}>
                  {message.text}
                </div>
                
                {/* Follow-up question */}
                {message.sender === 'bot' && message.followUpQuestion && !message.isError && (
                  <div className="follow-up-section">
                    <div 
                      className="follow-up-question"
                      onClick={() => handleFollowUpClick(message.followUpQuestion)}
                      title="Click to ask this question"
                    >
                      <span className="follow-up-icon">💡</span>
                      <span className="follow-up-text">{message.followUpQuestion}</span>
                      <span className="follow-up-arrow">→</span>
                    </div>
                  </div>
                )}

                {/* Suggested topics */}
                {message.sender === 'bot' && message.suggestedTopics && message.suggestedTopics.length > 0 && !message.isError && (
                  <div className="suggested-topics-section">
                    <div className="topics-label">🏷️ Suggested Topics</div>
                    <div className="suggested-topics">
                      {message.suggestedTopics.map((topic, index) => (
                        <span
                          key={index}
                          className="topic-tag"
                          onClick={() => handleTopicClick(topic)}
                          title={`Click to ask about: ${topic}`}
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
                
                {message.sender === 'bot' && message.message_id && !message.isError && (
                  <div className="reaction-buttons">
                    <button
                      className={`reaction-btn like ${message.userReaction === true ? 'active liked' : ''}`}
                      onClick={() => handleReaction(message.id, message.session_id, true)}
                      title="Like this response"
                    >
                      👍
                    </button>
                    <button
                      className={`reaction-btn dislike ${message.userReaction === false ? 'active disliked' : ''}`}
                      onClick={() => handleReaction(message.id, message.session_id, false)}
                      title="Dislike this response"
                    >
                      👎
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="message-bubble loading">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <div className="input-container">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              rows="1"
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="send-btn"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
