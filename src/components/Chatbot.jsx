import React, { useState, useRef, useEffect } from 'react';
import { fetchImprovedChatResponse, clearImprovedChatSession, saveReaction, sendEmail, getClinicSettings } from '../services/chatApi';
import './Chatbot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! Ask me about our services, fees, or how to get started.",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastBotMessageId, setLastBotMessageId] = useState(null); // Track the last bot message ID
  const [hasUserReacted, setHasUserReacted] = useState(false); // Track if user has reacted to current message
  const [privacyAgreed, setPrivacyAgreed] = useState(false); // Track privacy agreement
  const [showEmailForm, setShowEmailForm] = useState(false); // Track email form visibility
  const [clinicSettings, setClinicSettings] = useState(null); // Store clinic settings
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load clinic settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getClinicSettings();
        setClinicSettings(settings);
        console.log('Clinic settings loaded:', settings);
        
        // Apply brand color to CSS custom properties
        if (settings.BrandColour) {
          document.documentElement.style.setProperty('--nexus-brand-color', settings.BrandColour);
        }
      } catch (error) {
        console.error('Failed to load clinic settings:', error);
        // Set default settings if loading fails
        setClinicSettings({
          ClinicName: "Clinic Name",
          BrandColour: "RGB(173, 216, 230)",
          LogoUrl: "",
          PrivacyNoticeUrl: "",
          RetentionDays: "30",
          HandOffEmails: "",
          BookNowUrl: "",
          BookNowLabel: "book now",
          BookNowShow: "True",
          SendAnEmailLabel: "Send an email",
          SendAnEmailShow: "True"
        });
        
        // Apply default brand color
        document.documentElement.style.setProperty('--nexus-brand-color', 'RGB(173, 216, 230)');
      }
    };
    
    loadSettings();
  }, []);

  const handleSendMessage = async () => {
    if (!privacyAgreed) {
      alert('Please agree to the privacy notice first.');
      return;
    }
    
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
    // Reset reaction state when user sends a new message
    setHasUserReacted(false);

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
      // Update the last bot message ID
      setLastBotMessageId(botMessage.id);
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
          text: "Hi! Ask me about our services, fees, or how to get started.",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
      // Reset reaction states
      setLastBotMessageId(null);
      setHasUserReacted(false);
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
      
      // Mark that user has reacted
      setHasUserReacted(true);
      
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

  // Privacy agreement handler
  const handlePrivacyAgreement = () => {
    setPrivacyAgreed(true);
  };

  // Email form handlers
  const handleShowEmailForm = () => {
    setShowEmailForm(true);
  };

  const handleHideEmailForm = () => {
    setShowEmailForm(false);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name')?.trim();
    const email = formData.get('email')?.trim();
    const message = formData.get('message')?.trim();

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      await sendEmail(name, email, message);
      alert('Email sent successfully! We\'ll get back to you soon.');
      handleHideEmailForm();
    } catch (error) {
      console.error('Email send error:', error);
      alert('Failed to send email. Please try again.');
    }
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
      <div className={`chatbot-container ${isOpen ? 'open' : ''} ${!privacyAgreed ? 'privacy-mode' : ''}`}>
        <div className="chatbot-header">
          <div className="header-info">
            <div className="bot-avatar">
              {clinicSettings?.LogoUrl ? (
                <img 
                  src={clinicSettings.LogoUrl} 
                  alt="Clinic Logo" 
                  style={{
                    width: '100%', 
                    height: '100%', 
                    borderRadius: '50%', 
                    objectFit: 'cover'
                  }} 
                />
              ) : (
                '🤖'
              )}
            </div>
            <div>
              <h3>{clinicSettings?.ClinicName || 'Clinic Name'}</h3>
              <span className="status">Educational only</span>
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

        {/* Privacy Notice */}
        {!privacyAgreed && (
          <div className="privacy-notice">
            <p>I'm an educational assistant. I don't provide medical advice or diagnosis.</p>
            <p>
              By continuing, you consent to educational responses and lead capture. See our{' '}
              {clinicSettings?.PrivacyNoticeUrl ? (
                <a href={clinicSettings.PrivacyNoticeUrl} target="_blank" rel="noopener noreferrer">
                  Privacy Notice
                </a>
              ) : (
                <a 
                  href="#" 
                  onClick={() => alert('Privacy Notice: We collect basic information to improve our services.')}
                >
                  Privacy Notice
                </a>
              )}
              .
            </p>
            <div className="privacy-agree">
              <label>
                <input type="checkbox" id="privacy-checkbox" />
                I agree
              </label>
              <button 
                className="agree-btn" 
                onClick={handlePrivacyAgreement}
              >
                I agree
              </button>
            </div>
          </div>
        )}

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
                
                {/* Show reactions only for the last bot message, and only show them if:
                    1. User hasn't reacted yet, OR 
                    2. User has reacted and this is the message they reacted to */}
                {message.sender === 'bot' && message.message_id && !message.isError && 
                 message.id === lastBotMessageId && 
                 (!hasUserReacted || (hasUserReacted && message.userReaction !== null)) && (
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

        {/* Action Buttons */}
        <div className="action-buttons">
          {clinicSettings?.BookNowShow === 'True' && (
            <button 
              className="action-btn" 
              onClick={() => {
                if (clinicSettings?.BookNowUrl) {
                  window.open(clinicSettings.BookNowUrl, '_blank');
                } else {
                  alert('Book Now: Please call us at your clinic number or visit our website to book an appointment.');
                }
              }}
            >
              {clinicSettings?.BookNowLabel || 'book now'}
            </button>
          )}
          {clinicSettings?.SendAnEmailShow === 'True' && (
            <button 
              className="action-btn secondary" 
              onClick={handleShowEmailForm}
            >
              {clinicSettings?.SendAnEmailLabel || 'Send an email'}
            </button>
          )}
        </div>

        {/* Email Form Modal */}
        {showEmailForm && (
          <div className="email-form-overlay" onClick={(e) => e.target === e.currentTarget && handleHideEmailForm()}>
            <div className="email-form">
              <h3>Send us an Email</h3>
              <form onSubmit={handleEmailSubmit}>
                <div className="email-form-group">
                  <label htmlFor="email-name">Your Name*</label>
                  <input type="text" id="email-name" name="name" required />
                </div>
                <div className="email-form-group">
                  <label htmlFor="email-address">Your Email*</label>
                  <input type="email" id="email-address" name="email" required />
                </div>
                <div className="email-form-group">
                  <label htmlFor="email-message">Message*</label>
                  <textarea 
                    id="email-message" 
                    name="message" 
                    placeholder="Please tell us how we can help you..." 
                    required
                  />
                </div>
                <div className="email-form-buttons">
                  <button type="button" className="email-form-btn secondary" onClick={handleHideEmailForm}>
                    Cancel
                  </button>
                  <button type="submit" className="email-form-btn primary">
                    Send Email
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;
