# Nexus Chatbot - Universal Website Widget

A modern, responsive chatbot widget that can be integrated into **any website** with just a few lines of code. No dependencies, framework-agnostic, and fully responsive.

## 🚀 Quick Integration (30 seconds)

Add this to any website before the closing `</body>` tag:

```html
<script>
  window.nexusChatbotConfig = {
    position: 'bottom-right',
    welcomeMessage: "Hello! How can I help you today?"
  };
</script>
<script src="https://your-domain.com/nexus-chatbot-widget.js"></script>
```

**That's it!** Your website now has a professional AI chatbot.

## ✨ Features

- 🤖 **AI-Powered**: Integrated with Nexus AI API for intelligent responses
- 🌐 **Universal**: Works on ANY website - WordPress, Shopify, React, Vue, vanilla HTML
- 📱 **Responsive**: Perfect experience on mobile, tablet, and desktop
- ⚡ **Lightweight**: ~25KB minified, no dependencies
- 🎨 **Customizable**: Multiple positions, themes, and styling options
- 🔧 **Easy Setup**: Just 2-3 lines of code to integrate
- � **Session Management**: Persistent conversations with clear history option

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

## 📦 Files Structure

```
nexus-chatbot/
├── public/
│   ├── nexus-chatbot-widget.js     # 🎯 Main widget file (copy this!)
│   ├── integration-demo.html       # 📋 Integration examples
│   └── simple-test.html           # 🧪 Simple test page
├── src/                           # React development version
├── INTEGRATION.md                 # 📖 Detailed integration guide
└── README.md                      # This file
```

## ⚙️ Configuration Options

```javascript
window.nexusChatbotConfig = {
  // API Settings
  apiBaseUrl: 'https://your-api-endpoint.com',
  sessionId: 'unique-session-id',
  indexName: 'your-index-name',
  
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

## 🚀 Production Deployment

1. **Copy the widget file**: Take `public/nexus-chatbot-widget.js`
2. **Upload to your website**: Put it in your `/js/` folder or CDN
3. **Add integration code**: Use the examples above
4. **Test**: Verify it works on your website

### CDN Deployment
Upload to any CDN and reference like:
```html
<script src="https://your-cdn.com/nexus-chatbot-widget.js"></script>
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
