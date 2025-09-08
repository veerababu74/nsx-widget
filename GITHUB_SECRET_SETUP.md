# GitHub Secret Setup Guide for Azure Deployment

## 🔑 Setting up the Azure Publish Profile Secret

To deploy your NSX Widget to Azure App Service, you need to configure a GitHub secret with your Azure publish profile.

### Step 1: Get Azure Publish Profile

1. **Go to Azure Portal** (https://portal.azure.com)
2. **Find your App Service** (the one you created for the widget)
3. **Download Publish Profile:**
   - Click on your App Service
   - In the overview page, click **"Get publish profile"** button
   - This downloads a `.publishsettings` file

### Step 2: Create GitHub Secret

1. **Go to your GitHub repository:** https://github.com/veerababu74/nsx-widget
2. **Navigate to Settings:**
   - Click the "Settings" tab
   - In the left sidebar, click "Secrets and variables" → "Actions"
3. **Add New Secret:**
   - Click "New repository secret"
   - **Name:** `AZUREAPPSERVICE_PUBLISHPROFILE_NSX_WIDGET`
   - **Value:** Open the `.publishsettings` file in a text editor and copy ALL the content
   - Click "Add secret"

### Step 3: Update App Service Name in Workflow

1. **Edit the workflow file:** `.github/workflows/main_nexus-chatbot-widget.yml`
2. **Update line 46:** Replace `YOUR_ACTUAL_APP_SERVICE_NAME` with your actual Azure App Service name
3. **Example:**
   ```yaml
   app-name: 'nsx-widget-app'  # Replace with your actual App Service name
   ```

### Step 4: Deploy

1. **Push any change to main branch** or manually trigger the workflow
2. **Monitor deployment:**
   - Go to your repository → Actions tab
   - Watch the "Build and deploy Node.js app" workflow
3. **Verify deployment:**
   - Check your Azure App Service URL to see the deployed widget

## 🔍 What the Publish Profile Contains

The publish profile contains sensitive information like:
- Deployment URL
- Username and password for deployment
- Site configuration details

**Keep it secure** - never commit it to your repository!

## 🚀 Quick Deployment Checklist

- [ ] Azure App Service created with Node.js 20 LTS
- [ ] Publish profile downloaded from Azure
- [ ] GitHub secret `AZUREAPPSERVICE_PUBLISHPROFILE_NSX_WIDGET` created
- [ ] App service name updated in workflow file
- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow completed successfully
- [ ] Website accessible at your Azure App Service URL

## 🔗 Useful Links

- **Repository:** https://github.com/veerababu74/nsx-widget
- **Actions:** https://github.com/veerababu74/nsx-widget/actions
- **Azure Portal:** https://portal.azure.com

---

**Note:** The workflow is configured to run automatically when you push to the main branch.
