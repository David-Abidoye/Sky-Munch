// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged  
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Define the Firebase configuration object
import { firebaseConfig } from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Cache the DOM elements
const signInEmailInput = document.querySelector(".sign-in-form .input-field input[type='email']");
const signInPasswordInput = document.querySelector(".sign-in-form .input-field input[type='password']");
const signUpEmailInput = document.querySelector(".sign-up-form .input-field input[type='email']");
const signUpPasswordInput = document.querySelector(".sign-up-form .input-field input[type='password']");
const signUpBtn = document.querySelector(".sign-up-form .btn");
const signInBtn = document.querySelector(".sign-in-form .btn");
const signOutBtn = document.getElementById("sign-out-btn");

// Signup function
const signUp = async () => {
  const signUpEmail = signUpEmailInput.value;
  const signUpPassword = signUpPasswordInput.value;
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      signUpEmail,
      signUpPassword
    );
    const user = userCredential.user;
    console.log("User signed up:", user);
    alert("User created successfully");
  } catch (error) {
    const { code, message } = error;
    console.log("Sign up error:", code, message);
    alert(message);
  }
};

// Signin function
const signIn = async () => {
  const signInEmail = signInEmailInput.value;
  const signInPassword = signInPasswordInput.value;
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      signInEmail,
      signInPassword
    );
    const user = userCredential.user;
    console.log("User signed in:", user);
    alert("User signed in successfully");
    window.location.href = "/"; // Redirect to the homepage
  } catch (error) {
    const { code, message } = error;
    console.log("Sign in error:", code, message);
    alert(message);
  }
};

// Signout function
const userSignOut = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
    alert("User signed out successfully");
  } catch (error) {
    const { code, message } = error;
    console.log("Sign out error:", code, message);
    alert(message);
  }
};

// Add event listeners
if (signUpBtn) {
  signUpBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default form submission
    signUp();
  });
}

if (signInBtn) {
  signInBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default form submission
    signIn();
  });
}

if (signOutBtn) {
  signOutBtn.addEventListener("click", userSignOut);
}

// Panel toggle functions
const signUpPanelBtn = document.getElementById("sign-up-btn");
const signInPanelBtn = document.getElementById("sign-in-btn");

if (signUpPanelBtn) {
  signUpPanelBtn.addEventListener("click", () => {
    document.querySelector(".container").classList.add("sign-up-mode");
  });
}

if (signInPanelBtn) {
  signInPanelBtn.addEventListener("click", () => {
    document.querySelector(".container").classList.remove("sign-up-mode");
  });
}

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user);
    document.getElementById('sign-out-btn').style.display = 'block'; // Show sign-out button
  } else {
    console.log("No user is signed in.");
    document.getElementById('sign-out-btn').style.display = 'none'; // Hide sign-out button
  }
});
