# Render Deployment Setup Guide

## Current Deployment Status
✅ **Deployed:** https://ved-7jpz.onrender.com

## Environment Variables Required on Render

### 1. Firebase Admin SDK (CRITICAL - Currently Missing)

**Get Firebase Service Account:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon ⚙️ → Project Settings
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Save the JSON file (e.g., `serviceAccount.json`)

**Encode to Base64:**
```bash
# On macOS/Linux:
cat serviceAccount.json | base64 | tr -d '\n' > encoded.txt

# On Windows (PowerShell):
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("serviceAccount.json")) | Out-File -FilePath encoded.txt
```

**Add to Render:**
1. Go to your Render dashboard: https://dashboard.render.com/
2. Select your service: `ved-7jpz`
3. Click **Environment** in left sidebar
4. Click **Add Environment Variable**
5. Key: `FIREBASE_SERVICE_ACCOUNT_JSON`
6. Value: (paste the base64 encoded string from `encoded.txt`)
7. Click **Save Changes**

### 2. Database Connection

**Key:** `MONGO_URI`  
**Value:** Your MongoDB connection string  
*Example:* `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### 3. ImageKit Configuration

Already configured with:
- `IMAGEKIT_PUBLIC_KEY`: public_HbDrL+avJGQ4n3jrMC+LZL7nk7k=
- `IMAGEKIT_PRIVATE_KEY`: (already set)
- `IMAGEKIT_URL_ENDPOINT`: https://ik.imagekit.io/vedified

✅ ImageKit is working correctly!

### 4. Gemini AI API

**Key:** `GEMINI_API_KEY`  
**Value:** Your Gemini API key  
Get from: https://makersuite.google.com/app/apikey

✅ Already configured!

### 5. Optional: User Email Whitelist

**Key:** `ALLOWED_USER_EMAILS`  
**Value:** Comma-separated emails  
*Example:* `admin@example.com,user@example.com`

## Automatic Redeployment

After adding environment variables in Render, your service will automatically redeploy with the new configuration.

## Verify Deployment

After adding the Firebase credentials, check the logs again. You should see:
```
✅ Firebase Admin SDK initialized with service account
```

Instead of:
```
⚠️ Firebase Admin SDK initialized without credentials (local dev mode)
```

## Need Help?

If you encounter any issues:
1. Check Render logs for error messages
2. Verify all environment variables are set correctly
3. Ensure Firebase service account JSON is properly base64 encoded
4. Make sure MongoDB URI is accessible from Render's IP addresses

