// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,

} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

// Define the Firebase configuration object
import { firebaseConfig } from './config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const provider2 = new FacebookAuthProvider();
const provider3 = new GithubAuthProvider();

// Cache the DOM elements
const signInEmailInput = document.querySelector(".sign-in-form .input-field input[type='email']");
const signInPasswordInput = document.querySelector(".sign-in-form .input-field input[type='password']");
const signUpEmailInput = document.querySelector(".sign-up-form .input-field input[type='email']");
const signUpPasswordInput = document.querySelector(".sign-up-form .input-field input[type='password']");
const signUpBtn = document.querySelector(".sign-up-form .btn");
const signInBtn = document.querySelector(".sign-in-form .btn");
const signOutBtn = document.getElementById("sign-out-btn");

//Caching the DOM elements for Social Media Authentication:
const facebookSignInBtn = document.querySelector(".social-icon .facebook-btn");
//const twitterSignInBtn = document.querySelector(".social-icon .twitter-btn");
const googleSignInBtn = document.getElementById("google-sign-in-btn");
const githubSignInBtn = document.getElementById("github-sign-in-btn");

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

//Google sign in function
const signInWithGoogle = async () => {
  try {
    // Force Firebase to allow for account selection every time you sign in
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    console.log("Attempting to sign in with Google...");
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google Sign-In successful:", user);
    alert("Signed in with Google successfully!");
    window.location.href = "/"; // Redirect to the homepage
  } catch (error) {
    const { code, message } = error;
    console.log("Google Sign-In error:", code, message);
    alert(message);
  }
};

//Github sign in function
const signInWithGithub = async () => {
  try {
    // Force Firebase to allow for account selection every time you sign in
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    console.log("Attempting to sign in with Github...");
    const result = await signInWithPopup(auth, provider3);
    const user = result.user;
    console.log("Github Sign-In successful:", user);
    alert("Signed in with Github successfully!");
    window.location.href = "/"; // Redirect to the homepage
  } catch (error) {
    const { code, message } = error;
    console.log("Github Sign-In error:", code, message);
    alert(message);
  }
};

// Facebook Sign-In function
const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, provider2);
    const user = result.user;
    console.log("Facebook Sign-In successful:", user);
    alert("Signed in with Facebook successfully!");
    window.location.href = "/"; // Redirect to the homepage
  } catch (error) {
    const { code, message } = error;
    console.log("Facebook Sign-In error:", code, message);
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

// Google Sign-In button event listener
if (googleSignInBtn) {
  googleSignInBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default anchor behavior
    signInWithGoogle();
  });
} else {
  console.log("Google Sign-In button not found");
}

// Github Sign-In button event listener
if (githubSignInBtn) {
  githubSignInBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default anchor behavior
    signInWithGithub();
  });
} else {
  console.log("Github Sign-In button not found");
}

// Facebook Sign-In button event listener
if (facebookSignInBtn) {
  facebookSignInBtn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default anchor behavior
    signInWithFacebook();
  });
} else {
  console.log("Facebook Sign-In button not found");
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
