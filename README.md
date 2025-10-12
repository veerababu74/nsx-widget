# Nexus Chatbot - Universal Website Widget

A modern, responsive chatbot widget that can be integrated into **any website** with just a few lines of code. No dependencies, framework-agnostic, and fully responsive.

## 🚀 Quick Integration (30 seconds)

Add this to any website before the closing `</body>` tag:

```html
<script>
  window.nexusChatbotConfig = {
    position: 'bottom-right',
    welcomeMessage: "Hello! I'm your AI assistant with enhanced capabilities. How can I help you today?",
    chatbotId: "335934ee-d6cf-4a80-a17e-e42071c9466a" // Default widget key - replace with your unique key
  };
</script>
<script src="https://your-domain.com/nexus-chatbot-widget.js"></script>
```

**That's it!** Your website now has a professional AI chatbot with personalized responses.

## ✨ Enhanced Features

- 🤖 **Advanced AI**: Integrated with Nexus AI v3 API for intelligent responses
- 💡 **Smart Suggestions**: AI provides follow-up questions and topic suggestions
- 👍 **Smart Reactions**: Context-aware like/dislike system that appears only for recent responses
- 🔘 **Multi-CTA Support**: Up to 3 customizable action buttons (Book Now, Send Email, Custom CTA)
- 🌐 **Multi-Website Support**: Unique chatbot IDs for different websites with personalized responses
- 🌐 **Universal**: Works on ANY website - WordPress, Shopify, React, Vue, vanilla HTML
- 📱 **Mobile Optimized**: Perfect responsive experience on all devices
- ⚡ **Lightweight**: ~30KB minified, no dependencies
- 🎨 **Modern UI**: Beautiful gradients, animations, and hover effects
- 🔧 **Easy Setup**: Just 2-3 lines of code to integrate
- 📊 **Session Management**: Enhanced session tracking with reaction analytics

## 🎯 Platform Examples

### WordPress
```php
// Add to functions.php
function add_nexus_chatbot() {
    ?>
    <script>window.nexusChatbotConfig = {position: 'bottom-right'};</script>
    <script src="<?php echo get_template_directory_uri(); ?>/js/nexus-chatbot-widget.js"></script>
    <?php
}
add_action('wp_footer', 'add_nexus_chatbot');
```

### Shopify
```liquid
<!-- Add to theme.liquid before </body> -->
<script>window.nexusChatbotConfig = {position: 'bottom-right'};</script>
<script src="{{ 'nexus-chatbot-widget.js' | asset_url }}"></script>
```

### React/Next.js
```jsx
useEffect(() => {
  window.nexusChatbotConfig = {position: 'bottom-right'};
  const script = document.createElement('script');
  script.src = '/nexus-chatbot-widget.js';
  document.body.appendChild(script);
}, []);
```

### Any HTML Website
```html
<script>window.nexusChatbotConfig = {position: 'bottom-right'};</script>
<script src="/nexus-chatbot-widget.js"></script>
```

## 🛠️ Development & Testing

### Quick Start
```bash
npm install
npm run dev
```

### Test the Widget
1. Open http://localhost:5173/simple-test.html
2. Click the chat button to test functionality
3. Try the integration demo at http://localhost:5173/integration-demo.html

## 🎯 New Enhanced Features

### 💡 Intelligent Suggestions
- **Follow-up Questions**: AI automatically suggests relevant follow-up questions
- **Topic Suggestions**: Smart topic tags for deeper exploration
- **Click to Chat**: Users can click suggestions to instantly ask questions

### 👍 Smart Reaction System
- **Contextual Display**: Reactions only appear for the most recent AI response
- **Like/Dislike System**: Users can rate AI responses with visual feedback
- **Smart Hiding**: Reactions automatically hide when user sends a new message
- **Persistent Feedback**: If user reacts, the reaction stays visible until next message
- **Color Feedback**: Green for likes, red for dislikes with smooth animations  
- **Toggle Functionality**: Click the same reaction twice to remove it
- **Analytics Ready**: All reactions are tracked for improvement insights

### � Enhanced User Experience
- **Modern UI**: Beautiful gradient backgrounds and hover effects
- **Smooth Animations**: Professional transitions and micro-interactions
- **Mobile Optimized**: Perfect touch-friendly experience on all devices
- **Smart Input**: Auto-fill and focus management for seamless interaction

## 📦 Files Structure

```
nexus-chatbot/
├── dist/                          # 📦 Production builds
│   ├── nexus-chatbot-widget.min.js # 🎯 Minified widget (30KB)
│   ├── nexus-chatbot-widget.js     # 🔍 Unminified for debugging
│   └── INTEGRATION.md              # � Complete integration guide
├── public/
│   ├── nexus-chatbot-widget.js     # 🛠️ Development version
│   └── integration-demo.html       # 🧪 Live demo page
├── src/                           # React development version
└── scripts/
    └── build-widget.js            # 🔨 Build script
```

## ⚙️ Configuration Options

```javascript
window.nexusChatbotConfig = {
  // Enhanced API Settings (Updated for v3)
  apiBaseUrl: 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net',
  sessionId: 'test1234', // Updated session ID for new API
  indexName: 'test', // Updated index name for new API
  
  // Multi-Website Support
  chatbotId: '335934ee-d6cf-4a80-a17e-e42071c9466a', // Default widget key - replace with your unique key
  
  // Widget Appearance
  position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
  theme: 'default',
  
  // Behavior
  autoOpen: false,
  welcomeMessage: "Hello! How can I help you today?"
};
```

## 🎛️ Programmatic Control

```javascript
// Access the widget
const chatbot = window.NexusChatbot.widget;

// Control the widget
chatbot.open();                    // Open chat
chatbot.close();                   // Close chat
chatbot.sendProgrammaticMessage("Hello!"); // Send message
chatbot.destroy();                 // Remove widget
```

## � Building the Widget

Build the optimized production version:

```bash
# Install dependencies
npm install

# Build the widget (generates dist/ folder)
npm run build-widget

# Files generated:
# - dist/nexus-chatbot-widget.min.js (29KB minified)
# - dist/nexus-chatbot-widget.js (43KB unminified)  
# - dist/INTEGRATION.md (complete guide)
```

## �🚀 Production Deployment

### Option 1: Use Built Files (Recommended)
1. **Run build**: `npm run build-widget`
2. **Use minified version**: Take `dist/nexus-chatbot-widget.min.js`
3. **Upload to CDN**: Put it on your CDN or `/js/` folder
4. **Add integration code**: Use the examples above

### Option 2: Development Version
1. **Copy widget file**: Take `public/nexus-chatbot-widget.js`  
2. **Upload to website**: Put it in your `/js/` folder
3. **Add integration code**: Use the examples above

### CDN Deployment Examples
```html
<!-- Minified version (recommended) -->
<script src="https://your-cdn.com/nexus-chatbot-widget.min.js"></script>

<!-- With integrity check -->
<script 
  src="https://your-cdn.com/nexus-chatbot-widget.min.js"
  integrity="sha384-[generated-hash]"
  crossorigin="anonymous">
</script>
```

## 🌍 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile
- IE11+ (with polyfills)

## 📊 Performance

- **File size**: ~25KB minified (~8KB gzipped)
- **Dependencies**: Zero
- **Loading time**: < 100ms on 3G
- **Memory usage**: < 5MB

## 📝 Integration Examples

For detailed examples and advanced configurations, see:
- [`INTEGRATION.md`](INTEGRATION.md) - Complete integration guide
- [`public/integration-demo.html`](public/integration-demo.html) - Live demo with examples
- [`public/simple-test.html`](public/simple-test.html) - Basic test page

## 🔧 Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Test integration examples
npm run demo
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Test your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use in personal and commercial projects.

---

**🎯 Perfect for**: Customer support, lead generation, FAQ automation, user engagement  
**⚡ Ready in**: 30 seconds  
**🔧 Maintenance**: Zero configuration required
