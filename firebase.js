// firebase.js

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAR9KJNHbQNx4mKvIN8uY79Ly8PIP5OeIk",
  authDomain: "schoolgradehub-42f80.firebaseapp.com",
  projectId: "schoolgradehub-42f80",
  storageBucket: "schoolgradehub-42f80.appspot.com",
  messagingSenderId: "202663365218",
  appId: "1:202663365218:web:3ee2830b64037d4aeedf3b"
});

// Services
const auth = firebase.auth();
const db = firebase.firestore();