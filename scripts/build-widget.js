const fs = require('fs-extra');
const { minify } = require('terser');
const path = require('path');

async function buildWidget() {
    console.log('🚀 Building Nexus Chatbot Widget...');
    
    try {
        // Create dist directory
        await fs.ensureDir('dist');
        
        // Read the widget source
        const widgetSource = await fs.readFile('public/nexus-chatbot-widget.js', 'utf8');
        
        // Minify the widget
        const minified = await minify(widgetSource, {
            compress: {
                drop_console: false, // Keep console.error for debugging
                drop_debugger: true,
                pure_funcs: ['console.log'] // Remove console.log but keep console.error
            },
            mangle: true,
            format: {
                comments: /^!/
            }
        });
        
        if (minified.error) {
            throw minified.error;
        }
        
        // Add banner comment
        const banner = `/*!
 * Nexus Chatbot Widget v1.0.0
 * Universal chatbot widget for any website
 * (c) ${new Date().getFullYear()} - MIT License
 */
`;
        
        const finalCode = banner + minified.code;
        
        // Write minified version
        await fs.writeFile('dist/nexus-chatbot-widget.min.js', finalCode);
        
        // Copy unminified version
        await fs.writeFile('dist/nexus-chatbot-widget.js', widgetSource);
        
        // Copy demo files
        await fs.copy('public/integration-demo.html', 'dist/integration-demo.html');
        
        // Create CDN-ready version with integrity hash
        const crypto = require('crypto');
        const hash = crypto.createHash('sha384').update(finalCode).digest('base64');
        
        // Generate usage examples
        const examples = generateUsageExamples(hash);
        await fs.writeFile('dist/INTEGRATION.md', examples);
        
        // Get file sizes
        const originalSize = (await fs.stat('public/nexus-chatbot-widget.js')).size;
        const minifiedSize = (await fs.stat('dist/nexus-chatbot-widget.min.js')).size;
        
        console.log('✅ Build completed successfully!');
        console.log(`📦 Original size: ${(originalSize / 1024).toFixed(2)} KB`);
        console.log(`🗜️  Minified size: ${(minifiedSize / 1024).toFixed(2)} KB`);
        console.log(`💾 Compression: ${((originalSize - minifiedSize) / originalSize * 100).toFixed(1)}%`);
        console.log('\n📁 Files generated:');
        console.log('   - dist/nexus-chatbot-widget.js (unminified)');
        console.log('   - dist/nexus-chatbot-widget.min.js (minified)');
        console.log('   - dist/integration-demo.html (demo page)');
        console.log('   - dist/INTEGRATION.md (integration guide)');
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        process.exit(1);
    }
}

function generateUsageExamples(hash) {
    return `# Nexus Chatbot Widget - Integration Guide

## Quick Start

### 1. Basic Integration (Recommended)

\`\`\`html
<!-- Add before closing </body> tag -->
<script>
  window.nexusChatbotConfig = {
    position: 'bottom-right',
    autoOpen: false,
    welcomeMessage: "Hello! How can I help you today?"
  };
</script>
<script src="https://your-cdn.com/nexus-chatbot-widget.min.js"></script>
\`\`\`

### 2. CDN Integration with Integrity Check

\`\`\`html
<script 
  src="https://your-cdn.com/nexus-chatbot-widget.min.js"
  integrity="sha384-${hash}"
  crossorigin="anonymous">
</script>
\`\`\`

### 3. Manual Initialization

\`\`\`html
<script src="https://your-cdn.com/nexus-chatbot-widget.min.js"></script>
<script>
  const chatbot = NexusChatbot.start({
    position: 'bottom-left',
    apiBaseUrl: 'https://your-api.com',
    sessionId: 'unique-session-' + Date.now(),
    autoOpen: true
  });
</script>
\`\`\`

## Configuration Options

\`\`\`javascript
{
  // API Settings
  apiBaseUrl: 'https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net',
  sessionId: 'veera1234',
  indexName: 'veera',
  
  // Appearance
  position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
  theme: 'default',
  
  // Behavior
  autoOpen: false,
  welcomeMessage: "Hello! I'm your AI assistant. How can I help you today?"
}
\`\`\`

## WordPress Integration

Add to your theme's \`functions.php\`:

\`\`\`php
function add_nexus_chatbot() {
    ?>
    <script>
        window.nexusChatbotConfig = {
            position: 'bottom-right',
            welcomeMessage: 'Welcome to <?php echo get_bloginfo('name'); ?>! How can I help?'
        };
    </script>
    <script src="<?php echo get_template_directory_uri(); ?>/js/nexus-chatbot-widget.min.js"></script>
    <?php
}
add_action('wp_footer', 'add_nexus_chatbot');
\`\`\`

## React/Next.js Integration

\`\`\`jsx
import { useEffect } from 'react';

export default function Layout({ children }) {
  useEffect(() => {
    // Load the widget script
    const script = document.createElement('script');
    script.src = '/nexus-chatbot-widget.min.js';
    script.async = true;
    
    // Configure before loading
    window.nexusChatbotConfig = {
      position: 'bottom-right',
      welcomeMessage: 'Welcome to our React app!'
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Cleanup on unmount
      if (window.NexusChatbot?.widget) {
        window.NexusChatbot.widget.destroy();
      }
    };
  }, []);

  return <div>{children}</div>;
}
\`\`\`

## API Methods

\`\`\`javascript
// Access the widget instance
const chatbot = NexusChatbot.widget;

// Control visibility
chatbot.open();
chatbot.close();

// Send messages programmatically
chatbot.sendProgrammaticMessage("Hello from the website!");

// Update configuration
chatbot.updateConfig({ position: 'bottom-left' });

// Remove widget
chatbot.destroy();
\`\`\`

## Customization

### Custom Styling

Override CSS variables:

\`\`\`css
:root {
  --nexus-primary-color: #your-color;
  --nexus-accent-color: #your-accent;
}
\`\`\`

### Multiple Widgets

\`\`\`javascript
// Create multiple widget instances
const supportBot = NexusChatbot.init({
  position: 'bottom-right',
  sessionId: 'support-' + userId
});

const salesBot = NexusChatbot.init({
  position: 'bottom-left',
  sessionId: 'sales-' + userId,
  welcomeMessage: 'Interested in our products?'
});
\`\`\`

## Deployment Checklist

- [ ] Upload \`nexus-chatbot-widget.min.js\` to your CDN
- [ ] Test on mobile and desktop devices
- [ ] Verify API endpoint is accessible
- [ ] Check console for any errors
- [ ] Test chat functionality
- [ ] Verify responsive behavior

## File Sizes

- Minified: ~${((await fs.stat('dist/nexus-chatbot-widget.min.js')).size / 1024).toFixed(2)} KB
- Gzipped: ~${((await fs.stat('dist/nexus-chatbot-widget.min.js')).size / 1024 * 0.3).toFixed(2)} KB (estimated)

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions  
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

---

For more examples, see the \`integration-demo.html\` file.
`;
}

// Run the build
buildWidget().catch(console.error);
