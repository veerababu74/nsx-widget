# Azure App Service Deployment Guide for Nexus Chatbot Widget

## 📋 Overview

This guide provides step-by-step instructions for deploying the `widget-v1` Nexus Chatbot to Azure App Service using GitHub Actions CI/CD pipeline.

## 🎯 Prerequisites

- Azure subscription with App Service capabilities
- GitHub account and repository
- Node.js 20 LTS locally (for testing)

## 📁 Required Files (Already Created)

The following files have been created in your `widget-v1` directory:

### 1. **server.js** - Express server for production
```javascript
// Serves the React widget application in production
// Handles static files and React Router routes
```

### 2. **server-package.json** - Production dependencies
```json
// Contains Express server dependencies for Azure deployment
```

### 3. **.deployment** - Azure deployment configuration
```ini
// Tells Azure how to start the application
```

### 4. **.env.production** - Production environment variables
```bash
// Contains production API URLs
```

### 5. **vite.config.js** - Updated build configuration
```javascript
// Optimized for Azure deployment with relative paths
```

### 6. **/.github/workflows/main_nexus-chatbot-widget.yml** - CI/CD pipeline
```yaml
// Automated deployment workflow
```

## 🚀 Step-by-Step Deployment Instructions

### Step 1: Create Azure App Service

1. **Login to Azure Portal** (https://portal.azure.com)

2. **Create Web App:**
   - Click "Create a resource" → "Web App"
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or select existing
   - **Name**: `nexus-chatbot-widget` (must be globally unique)
   - **Publish**: Code
   - **Runtime stack**: Node.js 20 LTS
   - **Operating System**: Linux
   - **Region**: UK South (or your preferred region)
   - **App Service Plan**: Create new (B1 Basic minimum recommended)

3. **Review and Create** the App Service

### Step 2: Configure App Service Settings

1. **Go to your App Service** → Configuration → Application settings

2. **Add the following settings:**
   - `WEBSITE_NODE_DEFAULT_VERSION` = `20-lts`
   - `SCM_DO_BUILD_DURING_DEPLOYMENT` = `false`

3. **Save** the configuration

### Step 3: Setup GitHub Repository

1. **Create GitHub Repository:**
   ```bash
   # Navigate to widget-v1 directory
   cd widget-v1
   
   # Initialize git repository
   git init
   git add .
   git commit -m "Initial widget deployment setup"
   git branch -M main
   
   # Add your GitHub repository (replace with your actual repo URL)
   git remote add origin https://github.com/YOUR_USERNAME/nexus-chatbot-widget.git
   git push -u origin main
   ```

### Step 4: Configure GitHub Secrets

1. **Download Publish Profile:**
   - Azure Portal → Your App Service → Get publish profile
   - Save the `.publishsettings` file

2. **Add GitHub Secret:**
   - GitHub Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - **Name**: `AZUREAPPSERVICE_PUBLISHPROFILE_WIDGET`
   - **Value**: Paste the entire content of the `.publishsettings` file
   - Click "Add secret"

### Step 5: Update Workflow Configuration

1. **Edit the workflow file:** `.github/workflows/main_nexus-chatbot-widget.yml`

2. **Update the app-name** (line 46):
   ```yaml
   app-name: 'YOUR_ACTUAL_APP_SERVICE_NAME'  # Replace with your App Service name
   ```

### Step 6: Deploy the Application

1. **Push your changes:**
   ```bash
   git add .
   git commit -m "Update app service name in workflow"
   git push origin main
   ```

2. **Monitor Deployment:**
   - GitHub Repository → Actions tab
   - Watch the "Build and deploy Node.js app" workflow
   - Both "build" and "deploy" jobs should complete successfully

### Step 7: Verify Deployment

1. **Check Azure Portal:**
   - Your App Service → Deployment Center
   - Verify deployment status is "Success"

2. **Test the Application:**
   - Open your App Service URL: `https://YOUR_APP_NAME.azurewebsites.net`
   - The Nexus Chatbot Widget should load correctly

## 🔧 Troubleshooting

### Common Issues and Solutions:

1. **"Your web app is running and waiting for your content"**
   - Ensure the GitHub Actions workflow completed successfully
   - Check that the publish profile secret is correctly set

2. **Build Failure:**
   - Check GitHub Actions logs for specific error messages
   - Ensure all dependencies are correctly specified in package.json

3. **App Service Won't Start:**
   - Verify the server.js file is in the dist folder after deployment
   - Check Application Insights logs in Azure Portal

4. **API Connection Issues:**
   - Verify the .env.production file has the correct API URL
   - Check CORS settings on your backend API

## 📝 Environment Variables

### Production (.env.production):
```bash
VITE_API_BASE_URL=https://neurax-python-be-emhfejathhhpe6h3.uksouth-01.azurewebsites.net
```

### Development (local):
```bash
VITE_API_BASE_URL=http://localhost:8000
```

## 🎯 Next Steps

1. **Custom Domain** (Optional):
   - Azure Portal → Your App Service → Custom domains
   - Add your custom domain and SSL certificate

2. **Application Insights** (Recommended):
   - Enable Application Insights for monitoring and diagnostics

3. **Auto-scaling** (Optional):
   - Configure auto-scaling rules based on traffic

4. **Staging Slots** (Optional):
   - Create staging slots for testing before production deployment

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs for deployment errors
2. Review Azure App Service logs in the Azure Portal
3. Verify all configuration settings match this guide

---

**Deployment Status:** ✅ Ready for deployment
**Last Updated:** September 8, 2025
