#!/bin/bash

# Firebase Service Account Setup Script for Render
# This script helps you encode your Firebase service account for Render deployment

echo "🔥 Firebase Service Account Setup for Render"
echo "=============================================="
echo ""
echo "Step 1: Get your Firebase Service Account JSON"
echo "  1. Go to: https://console.firebase.google.com/"
echo "  2. Select your project"
echo "  3. Click Settings (⚙️) → Project Settings"
echo "  4. Go to 'Service Accounts' tab"
echo "  5. Click 'Generate New Private Key'"
echo "  6. Save the file as 'serviceAccount.json' in this directory"
echo ""
read -p "Press Enter when you have the serviceAccount.json file ready..."

if [ ! -f "serviceAccount.json" ]; then
    echo "❌ Error: serviceAccount.json not found!"
    echo "Please download it from Firebase Console and place it in this directory."
    exit 1
fi

echo ""
echo "Step 2: Encoding to Base64..."
BASE64_ENCODED=$(cat serviceAccount.json | base64 | tr -d '\n')

echo "✅ Encoded successfully!"
echo ""
echo "Step 3: Add to Render"
echo "====================="
echo "1. Go to: https://dashboard.render.com/"
echo "2. Select your service: ved-7jpz"
echo "3. Click 'Environment' in the left sidebar"
echo "4. Click 'Add Environment Variable'"
echo "5. Key: FIREBASE_SERVICE_ACCOUNT_JSON"
echo "6. Value: Copy the text below"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "COPY THIS VALUE (entire line):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "$BASE64_ENCODED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "✅ Also saved to: firebase-encoded.txt"
echo "$BASE64_ENCODED" > firebase-encoded.txt

echo ""
echo "⚠️  SECURITY NOTE: Delete serviceAccount.json and firebase-encoded.txt after adding to Render!"
echo ""
echo "Step 4: After adding the variable in Render, your service will auto-deploy."
echo "Check the logs - you should see: '✅ Firebase Admin SDK initialized with service account'"
echo ""
echo "Done! 🎉"

