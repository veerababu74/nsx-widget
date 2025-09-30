# Chatbot ID Integration Guide

## Overview

The Nexus Chatbot Widget now supports multiple website differentiation through a `chatbotId` parameter. This key is passed as an `x-widget-key` header to all API calls, allowing the backend to identify and customize responses for different websites.

## Usage

### Standalone Widget Integration

```html
<script>
  // Configure the chatbot before loading
  window.nexusChatbotConfig = {
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    theme: 'default',
    autoOpen: false,
    welcomeMessage: "Hello! How can I help you today?",
    chatbotId: "335934ee-d6cf-4a80-a17e-e42071c9466a" // Default widget key - replace with your unique key
  };
</script>
<script src="https://your-domain.com/nexus-chatbot-widget.js"></script>
```

### React Component Integration

```jsx
import { Chatbot } from './components/Chatbot';

function App() {
  return (
    <div className="App">
      <Chatbot chatbotId="335934ee-d6cf-4a80-a17e-e42071c9466a" />
    </div>
  );
}
```

## API Header

When a `chatbotId` is provided, all API calls will include the following header:

```
x-widget-key: your-unique-website-key
```

## Affected API Endpoints

The following API endpoints now support the `x-widget-key` header:

1. **Chat Messages**: `/nexus/ai/widget/chat`
2. **Session Management**: `/nexus/ai/widget/session/{sessionId}/clear`
3. **Reactions**: `/nexus/ai/widget/chat/reaction`
4. **Settings**: `/Settings_Widget/Get`
5. **Starter Questions**: `/StarterQuestions_Widget/Get`
6. **Email**: `/SendAnEmail_Widget/SendMail`

## Benefits

- **Multi-tenant Support**: Different websites can have customized responses
- **Analytics**: Track usage per website/client
- **Customization**: Each website can have different settings, branding, and responses
- **Security**: Validate requests from authorized websites only

## Example Implementation

### Website A
```html
<script>
  window.nexusChatbotConfig = {
    chatbotId: "website-a-clinic",
    welcomeMessage: "Welcome to Clinic A! How can we help you today?",
    position: 'bottom-right'
  };
</script>
<script src="https://your-domain.com/nexus-chatbot-widget.js"></script>
```

### Website B
```html
<script>
  window.nexusChatbotConfig = {
    chatbotId: "website-b-hospital",
    welcomeMessage: "Welcome to Hospital B! What information do you need?",
    position: 'bottom-left'
  };
</script>
<script src="https://your-domain.com/nexus-chatbot-widget.js"></script>
```

## Backward Compatibility

The chatbotId parameter is optional. If not provided, the widget will function as before without sending the `x-widget-key` header.

## Migration

To migrate existing implementations:

1. Add the `chatbotId` parameter to your `window.nexusChatbotConfig`
2. Update your backend to handle the `x-widget-key` header
3. Configure different responses/settings per chatbot ID

No other changes are required - the widget will automatically include the header when chatbotId is provided.