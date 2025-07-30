# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the Home Delight project.

## Prerequisites

1. A Google account
2. Basic knowledge of web development

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "home-delight")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle the "Enable" switch
   - Click "Save"

## Step 3: Set up Firestore Database

1. In your Firebase project console, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can change security rules later)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 4: Get Firebase Configuration

1. In your Firebase project console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to the "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "Home Delight Web")
6. Copy the Firebase configuration object

## Step 5: Update Firebase Configuration

1. Open the file `public/js/firebase-config.js`
2. Replace the placeholder configuration with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 6: Set up Firestore Security Rules

1. In your Firebase console, go to Firestore Database
2. Click on the "Rules" tab
3. Replace the default rules with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own business data
    match /businesses/{businessId} {
      allow read, write: if request.auth != null && request.auth.uid == businessId;
    }
    
    // Allow users to read and write their own properties
    match /properties/{propertyId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Allow public read access to properties (for dashboard)
    match /properties/{propertyId} {
      allow read: if true;
    }
  }
}
```

## Step 7: Test the Setup

1. Open `public/index.html` in your browser
2. Try to register a new business account
3. Try to log in with the created account
4. Verify that the profile dropdown appears when logged in

## Features Implemented

### Authentication Features:
- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ User logout functionality
- ✅ Authentication state persistence
- ✅ Protected routes (Dashboard and Upload pages)

### UI Features:
- ✅ Profile dropdown with user email
- ✅ Dashboard and Upload links in dropdown
- ✅ Automatic UI updates based on authentication state
- ✅ Responsive design for mobile devices

### Data Storage:
- ✅ Business information stored in Firestore
- ✅ User-specific data isolation
- ✅ Secure data access rules

## File Structure

```
public/
├── js/
│   ├── firebase-config.js    # Firebase configuration
│   ├── auth.js              # Authentication logic
│   └── Database.js          # Database operations
├── css/
│   ├── profile-dropdown.css  # Profile dropdown styles
│   └── loginandregister.css # Login/Register styles
├── index.html               # Main page with auth
├── business-login.html      # Login page
├── Business-Register.html   # Registration page
├── dashboard.html           # Protected dashboard
└── Upload.html              # Protected upload page
```

## Troubleshooting

### Common Issues:

1. **"Firebase is not defined" error**
   - Make sure Firebase SDK scripts are loaded before your custom scripts
   - Check that the Firebase configuration is correct

2. **Authentication not working**
   - Verify that Email/Password authentication is enabled in Firebase Console
   - Check browser console for error messages

3. **Database access denied**
   - Ensure Firestore security rules are properly configured
   - Check that the user is authenticated before accessing data

4. **Profile dropdown not showing**
   - Verify that Font Awesome CSS is loaded
   - Check that the auth.js file is properly loaded

### Debug Mode:

To enable debug logging, add this to your `firebase-config.js`:

```javascript
// Enable debug mode (remove in production)
firebase.firestore().settings({
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});
```

## Security Considerations

1. **API Keys**: Never commit your Firebase API keys to public repositories
2. **Security Rules**: Always implement proper Firestore security rules
3. **Input Validation**: Validate all user inputs on both client and server side
4. **HTTPS**: Always use HTTPS in production

## Next Steps

1. Add password reset functionality
2. Implement email verification
3. Add social authentication (Google, Facebook)
4. Set up proper error handling and user feedback
5. Add user profile management
6. Implement role-based access control

## Support

If you encounter any issues, check the Firebase documentation or create an issue in the project repository. 