// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Define the Firebase configuration object
import { firebaseConfig } from './config.js'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Cache the DOM elements
const email = document.getElementById("email");
const password = document.getElementById("password");
const signUpBtn = document.getElementById("signUpBtn");
const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const login = document.getElementById("login");
const authPart = document.getElementById("authPart");

// Hide the top secret part initially
authPart.style.display = "none";

// Signup function
const signUp = async () => {
  const signUpEmail = email.value;
  const signUpPassword = password.value;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signUpEmail,
      signUpPassword
    );
    const user = userCredential.user;
    console.log(user);
    alert("User created successfully");
  } catch (error) {
    const { code, message } = error;
    console.log(code, message);
    alert(message);
  }
};

// Signin function
const signIn = async () => {
  const signInEmail = email.value;
  const signInPassword = password.value;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      signInEmail,
      signInPassword
    );
    const user = userCredential.user;
    console.log(user);
    alert("User signed in successfully");
  } catch (error) {
    const { code, message } = error;
    console.log(code, message);
    alert(message);
  }
};

// Check auth state
const checkAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      login.style.display = "none";
      authPart.style.display = "flex";
      console.log("User is signed in");
    } else {
      login.style.display = "block";
      authPart.style.display = "none";
      console.log("User is signed out");
    }
  });
};

checkAuthState();

// Signout function
const userSignOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
    alert("User signed out successfully");
  } catch (error) {
    const { code, message } = error;
    console.log(code, message);
    alert(message);
  }
};

// Add event listeners
signUpBtn.addEventListener("click", signUp);
signInBtn.addEventListener("click", signIn);
signOutBtn.addEventListener("click", userSignOut);
