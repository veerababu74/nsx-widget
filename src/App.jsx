
import './App.css'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    // Initialize the chatbot widget when the component mounts
    if (window.NexusChatbot) {
      window.NexusChatbot.start({
        position: 'bottom-right',
        theme: 'default',
        autoOpen: false,
        welcomeMessage: "Welcome to Nexus AI! I'm here to help you with any questions."
      });
    }
    
    // Load the widget script if it's not already loaded
    const existingScript = document.querySelector('script[src*="nexus-chatbot-widget.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = '/nexus-chatbot-widget.js';
      script.onload = () => {
        if (window.NexusChatbot) {
          window.NexusChatbot.start({
            position: 'bottom-right',
            theme: 'default',
            autoOpen: false,
            welcomeMessage: "Welcome to Nexus AI! I'm here to help you with any questions."
          });
        }
      };
      document.head.appendChild(script);
    }
    
    return () => {
      // Cleanup widget on unmount
      if (window.NexusChatbot && window.NexusChatbot.widget) {
        window.NexusChatbot.widget.destroy();
      }
    };
  }, []);

  const openChat = () => {
    if (window.NexusChatbot && window.NexusChatbot.widget) {
      window.NexusChatbot.widget.open();
    }
  };
  
  const sendTestMessage = () => {
    if (window.NexusChatbot && window.NexusChatbot.widget) {
      window.NexusChatbot.widget.open();
      setTimeout(() => {
        window.NexusChatbot.widget.sendProgrammaticMessage("This is a test message from the main app!");
      }, 500);
    }
  };

  return (
    <div className="app-container">
      <div className="demo-container">
        <h1>🤖 Nexus Chatbot - Main App</h1>
        
        <p>This is the main Nexus Chatbot application. The chatbot widget is now active on this page - look for the chat button in the bottom right corner!</p>
        
        <div className="feature-grid">
          <div className="feature-card">
            <h3>✨ AI-Powered Responses</h3>
            <p>Get intelligent answers powered by Nexus AI</p>
          </div>
          <div className="feature-card">
            <h3>👍 Reaction System</h3>
            <p>Like or dislike responses to improve AI</p>
          </div>
          <div className="feature-card">
            <h3>📱 Mobile Responsive</h3>
            <p>Works perfectly on all devices</p>
          </div>
          <div className="feature-card">
            <h3>🚀 Real-time Chat</h3>
            <p>Instant responses and smooth experience</p>
          </div>
        </div>
        
        <div className="demo-controls">
          <h3>Demo Controls</h3>
          <p>Try these buttons to test the chatbot:</p>
          <button className="demo-button" onClick={openChat}>
            Open Chat
          </button>
          <button className="demo-button" onClick={sendTestMessage}>
            Send Test Message
          </button>
        </div>
        
        <div className="integration-info">
          <h3>📋 Integration Options</h3>
          <p>
            Visit <a href="/integration-demo.html">Integration Demo</a> to see detailed 
            integration instructions and examples for embedding this chatbot in your own website.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
