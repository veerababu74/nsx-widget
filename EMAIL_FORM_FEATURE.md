# Email Form Integration - Feature Documentation

## 🎯 Overview
The Nexus Chatbot now includes an integrated email form that appears as a popup modal when users click the "Send an email" button. This feature connects directly to your SendAnEmail API for seamless lead capture.

## ✨ Features

### 📧 Email Form Modal
- **Professional Design**: Clean, modal popup with form fields
- **Responsive Layout**: Works perfectly on desktop and mobile devices
- **Form Validation**: Built-in validation for required fields
- **Loading States**: Visual feedback during email submission
- **Success/Error Messages**: Clear user feedback after form submission

### 🔗 API Integration
- **Direct API Connection**: Connects to `https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net/SendAnEmail/SendMail`
- **Proper Data Format**: Sends data in the expected JSON format:
  ```json
  {
    "Name": "User's Name",
    "ContactPersonEmail": "user@example.com", 
    "Message": "User's message content"
  }
  ```

## 🎨 User Experience Flow

1. **User clicks "Send an email" button**
2. **Modal popup appears** with smooth animation
3. **User fills form fields**:
   - Name (required)
   - Email (required) 
   - Message (required)
4. **User clicks "Send Email"**
5. **Loading indicator shows** while processing
6. **Success/error message displays**
7. **Modal auto-closes** after successful submission

## 🛠️ Technical Implementation

### Form Fields
- **Name Field**: Text input with validation
- **Email Field**: Email input with built-in email validation
- **Message Field**: Textarea with placeholder text
- **All fields are required** and validated before submission

### Visual States
- **Default State**: Clean white form with gradient buttons
- **Loading State**: Spinning indicator with "Sending email..." text
- **Success State**: Green checkmark with confirmation message
- **Error State**: Red X with error message
- **Form closes automatically** 2 seconds after success

### Error Handling
- **Network errors**: Caught and displayed to user
- **Validation errors**: Prevents submission until all fields filled
- **API errors**: Displays user-friendly error messages
- **Form state resets** on close/error for clean reuse

## 🎛️ Configuration

The email form inherits styling from the main chatbot theme and requires no additional configuration. The API endpoint is hardcoded for reliability:

```javascript
// API endpoint (hardcoded for stability)
const EMAIL_API_URL = 'https://neurax-net-f2cwbugzh4gqd8hg.uksouth-01.azurewebsites.net/SendAnEmail/SendMail';
```

## 🔧 Key Methods

### `showEmailForm()`
- Opens the email form modal
- Adds smooth fade-in animation
- Auto-focuses on name field

### `hideEmailForm()` 
- Closes the email form modal
- Resets form fields and states
- Smooth fade-out animation

### `handleEmailSubmit(e)`
- Processes form submission
- Validates all required fields
- Sends data to API
- Manages loading/success/error states

### `resetEmailFormState()`
- Resets all visual states
- Clears loading/success/error indicators
- Re-enables form buttons

## 📱 Mobile Responsiveness

The email form is fully responsive and optimized for mobile:
- **Adaptive sizing**: Form adjusts to screen size
- **Touch-friendly**: Large touch targets for mobile
- **Keyboard support**: Proper keyboard navigation
- **Viewport awareness**: Stays within visible area

## 🎯 Benefits

✅ **Lead Capture**: Direct integration with your email system  
✅ **Professional UI**: Modern, clean design matches chatbot theme  
✅ **User-Friendly**: Intuitive form with clear validation  
✅ **Mobile Ready**: Perfect experience on all devices  
✅ **Error Handling**: Robust error handling and user feedback  
✅ **No Dependencies**: Self-contained within the widget  

## 🧪 Testing

To test the email form:

1. **Open the chatbot** on your website
2. **Click "Send an email"** button at the bottom
3. **Fill out the form** with test data
4. **Submit and verify** API receives the data
5. **Test error scenarios** by disconnecting internet
6. **Test mobile version** on different screen sizes

## 🔒 Privacy & Security

- **Input Validation**: All inputs are validated before sending
- **HTTPS Only**: All API calls use secure HTTPS protocol
- **No Data Storage**: Form data is not stored locally
- **Clear Privacy**: Users know data is being sent via email
- **Form Reset**: Sensitive data cleared after submission

This email form integration provides a seamless way for website visitors to contact you directly through the chatbot interface, improving lead capture and user engagement.