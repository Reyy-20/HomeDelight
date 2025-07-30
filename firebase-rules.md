# Firebase Security Rules for Home Delight

## Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Businesses collection
    match /businesses/{businessId} {
      allow read, write: if request.auth != null && request.auth.uid == businessId;
    }
    
    // Active users collection (for real-time tracking)
    match /activeUsers/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Properties collection
    match /properties/{propertyId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null && 
        (request.auth.uid == resource.data.businessId || 
         request.auth.uid == resource.data.userId);
    }
  }
}
```

## Authentication Rules

### User Types
1. **Regular Users** (`users` collection)
   - Can register with email/password
   - Can update their own profile
   - Can view their own data

2. **Business Users** (`businesses` collection)
   - Can register with business information
   - Can update their business profile
   - Can manage properties

3. **Active Users** (`activeUsers` collection)
   - Real-time tracking of online users
   - Auto-cleanup of offline users

## Setup Instructions

1. **Enable Authentication in Firebase Console:**
   - Go to Firebase Console > Authentication
   - Enable Email/Password authentication
   - Add your domain to authorized domains

2. **Set up Firestore Database:**
   - Go to Firebase Console > Firestore Database
   - Create database in production mode
   - Apply the security rules above

3. **Configure Real-time Features:**
   - Enable Firestore real-time listeners
   - Set up offline persistence (optional)

## Collections Structure

### users
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  name: "User Name",
  phone: "1234567890",
  address: "User Address",
  userType: "user",
  createdAt: timestamp
}
```

### businesses
```javascript
{
  uid: "business_id",
  email: "business@example.com",
  businessName: "Business Name",
  phone: "1234567890",
  address: "Business Address",
  license: "License Number",
  userType: "business",
  createdAt: timestamp
}
```

### activeUsers
```javascript
{
  uid: "user_id",
  email: "user@example.com",
  lastSeen: timestamp,
  online: boolean
}
```

## Real-time Features

1. **User Tracking:**
   - Users are tracked when they log in
   - Status updates in real-time
   - Automatic cleanup of offline users

2. **Authentication State:**
   - Automatic login state management
   - UI updates based on auth state
   - Secure session handling

3. **Data Synchronization:**
   - Real-time updates across all clients
   - Offline support with sync when online
   - Conflict resolution for concurrent edits 