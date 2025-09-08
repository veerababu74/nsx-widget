# Nexus Chatbot Widget - Website Integration Guide

A universal chatbot widget that can be integrated into **any website** with just a few lines of code. No dependencies, framework-agnostic, and fully responsive.

## 🚀 Quick Integration (30 seconds)

### Option 1: Simple Script Tag (Recommended)

Add this code before your closing `</body>` tag:

```html
<!-- Configure the chatbot (optional) -->
<script>
  window.nexusChatbotConfig = {
    position: 'bottom-right',
    autoOpen: false,
    welcomeMessage: "Hello! How can I help you today?"
  };
</script>

<!-- Load the chatbot widget -->
<script src="https://your-domain.com/nexus-chatbot-widget.js"></script>
```

### Option 2: CDN Integration

```html
<script src="https://cdn.jsdelivr.net/gh/your-repo/nexus-chatbot@latest/dist/nexus-chatbot-widget.min.js"></script>
```

## 📱 Platform-Specific Integration

### WordPress
1. **Via Theme Editor:**
   - Go to Appearance → Theme Editor
   - Edit `footer.php`
   - Add the script before `</body>`

2. **Via Functions.php:**
   ```php
   function add_nexus_chatbot() {
       ?>
       <script>
           window.nexusChatbotConfig = {
               position: 'bottom-right',
               welcomeMessage: 'Welcome to <?php echo get_bloginfo('name'); ?>!'
           };
       </script>
       <script src="<?php echo get_template_directory_uri(); ?>/js/nexus-chatbot-widget.js"></script>
       <?php
   }
   add_action('wp_footer', 'add_nexus_chatbot');
   ```

### Shopify
1. Go to Online Store → Themes → Actions → Edit Code
2. Open `theme.liquid`
3. Add before `</body>`:
   ```liquid
   <script>
     window.nexusChatbotConfig = {
       position: 'bottom-right',
       welcomeMessage: 'Need help with {{ shop.name }}?'
     };
   </script>
   <script src="{{ 'nexus-chatbot-widget.js' | asset_url }}"></script>
   ```

### Wix
1. Go to Settings → Custom Code
2. Add to "Body - End":
   ```html
   <script>
     window.nexusChatbotConfig = { position: 'bottom-right' };
   </script>
   <script src="https://your-domain.com/nexus-chatbot-widget.js"></script>
   ```

### Squarespace
1. Go to Settings → Advanced → Code Injection
2. Add to Footer:
   ```html
   <script>
     window.nexusChatbotConfig = { position: 'bottom-right' };
   </script>
   <script src="https://your-domain.com/nexus-chatbot-widget.js"></script>
   ```

### React/Next.js
```jsx
import { useEffect } from 'react';

export default function ChatbotWrapper() {
  useEffect(() => {
    // Configure chatbot
    window.nexusChatbotConfig = {
      position: 'bottom-right',
      welcomeMessage: 'Welcome to our React app!'
    };

    // Load script
    const script = document.createElement('script');
    script.src = '/nexus-chatbot-widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (window.NexusChatbot?.widget) {
        window.NexusChatbot.widget.destroy();
      }
    };
  }, []);

  return null; // This component doesn't render anything
}
```

### Vue.js
```vue
<template>
  <div>
    <!-- Your app content -->
  </div>
</template>

<script>
export default {
  mounted() {
    // Configure chatbot
    window.nexusChatbotConfig = {
      position: 'bottom-right'
    };

    // Load script
    const script = document.createElement('script');
    script.src = '/nexus-chatbot-widget.js';
    document.body.appendChild(script);
  },
  
  beforeDestroy() {
    if (window.NexusChatbot?.widget) {
      window.NexusChatbot.widget.destroy();
    }
  }
}
</script>
```

## ⚙️ Configuration Options

```javascript
window.nexusChatbotConfig = {
  // API Configuration
  apiBaseUrl: 'https://your-api-endpoint.com',
  sessionId: 'unique-session-id',
  indexName: 'your-index-name',
  
  // Widget Position
  position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
  
  // Appearance
  theme: 'default', // default, dark, custom
  
  // Behavior
  autoOpen: false, // Auto-open on page load
  welcomeMessage: "Hello! How can I help you today?",
  
  // Custom Colors (optional)
  primaryColor: '#667eea',
  accentColor: '#764ba2'
};
```

## 🎛️ Programmatic Control

```javascript
// Access the widget
const chatbot = window.NexusChatbot.widget;

// Control visibility
chatbot.open();    // Open the chat
chatbot.close();   // Close the chat

// Send messages
chatbot.sendProgrammaticMessage("Hello from the website!");

// Update settings
chatbot.updateConfig({ position: 'bottom-left' });

// Remove widget
chatbot.destroy();
```

## 🎨 Custom Styling

Override the default styles by adding CSS:

```css
/* Custom button color */
.nexus-chat-toggle {
  background: linear-gradient(135deg, #your-color 0%, #your-accent 100%) !important;
}

/* Custom chat header */
.nexus-chatbot-header {
  background: linear-gradient(135deg, #your-color 0%, #your-accent 100%) !important;
}

/* Custom message bubbles */
.nexus-message.user .nexus-message-bubble {
  background: linear-gradient(135deg, #your-color 0%, #your-accent 100%) !important;
}
```

## 🔧 Advanced Usage

### Multiple Widgets
```javascript
// Create multiple chatbots for different purposes
const supportBot = NexusChatbot.init({
  position: 'bottom-right',
  sessionId: 'support-chat',
  welcomeMessage: 'Need technical support?'
});

const salesBot = NexusChatbot.init({
  position: 'bottom-left',
  sessionId: 'sales-chat',
  welcomeMessage: 'Interested in our products?'
});
```

### Conditional Loading
```javascript
// Only load chatbot for certain pages
if (window.location.pathname.includes('/support')) {
  window.nexusChatbotConfig = {
    position: 'bottom-right',
    welcomeMessage: 'How can we help you today?'
  };
  
  // Load script
  const script = document.createElement('script');
  script.src = '/nexus-chatbot-widget.js';
  document.body.appendChild(script);
}
```

### User Context
```javascript
// Pass user information to the chatbot
window.nexusChatbotConfig = {
  sessionId: 'user-' + userId,
  welcomeMessage: \`Hello \${userName}! How can I help you?\`,
  // You can extend the API to include user context
  userContext: {
    id: userId,
    name: userName,
    email: userEmail
  }
};
```

## 📦 File Structure

When you integrate the widget, you'll have:

```
your-website/
├── js/
│   └── nexus-chatbot-widget.js    # The widget file
└── index.html                     # Your page with the script tag
```

## 🌍 Hosting the Widget

### Option 1: Self-Hosted
1. Download `nexus-chatbot-widget.js`
2. Upload to your website's `/js/` folder
3. Reference: `<script src="/js/nexus-chatbot-widget.js"></script>`

### Option 2: CDN (Recommended)
1. Upload to a CDN service (CloudFlare, AWS CloudFront, etc.)
2. Reference: `<script src="https://your-cdn.com/nexus-chatbot-widget.js"></script>`

### Option 3: GitHub Pages
1. Fork this repository
2. Enable GitHub Pages
3. Reference: `<script src="https://username.github.io/nexus-chatbot/nexus-chatbot-widget.js"></script>`

## 🚨 Troubleshooting

### Widget Not Appearing
- Check browser console for errors
- Verify the script URL is accessible
- Ensure no other scripts are conflicting

### API Errors
- Verify the API endpoint is accessible
- Check CORS settings on your API
- Confirm session ID and index name are correct

### Mobile Issues
- Test on actual mobile devices
- Verify viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0">`

### Performance
- Use the minified version for production
- Load the script asynchronously
- Consider lazy loading for non-critical pages

## 📊 Analytics Integration

Track chatbot usage with Google Analytics:

```javascript
// Track when chat is opened
window.addEventListener('nexus-chat-opened', () => {
  gtag('event', 'chatbot_opened', {
    event_category: 'engagement'
  });
});

// Track messages sent
window.addEventListener('nexus-message-sent', () => {
  gtag('event', 'chatbot_message', {
    event_category: 'engagement'
  });
});
```

## 🔒 Security Considerations

- Always use HTTPS for the widget script
- Validate and sanitize user inputs on your API
- Implement rate limiting on your API endpoints
- Consider implementing authentication for sensitive applications

## 📈 Performance Tips

- Use a CDN for the widget file
- Implement lazy loading for non-critical pages
- Minify the widget file for production
- Enable gzip compression on your server

---

**Need help?** Check the [demo page](integration-demo.html) for a working example!

**File size:** ~25KB minified (~8KB gzipped)  
**Dependencies:** None  
**Browser support:** All modern browsers + IE11
