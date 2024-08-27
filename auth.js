
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/10.13/firebase-auth.js'
import { firebaseConfig } from "./config.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//cach the dom
const email = document.getElementById('email');
const password = document.getElementById('password');
const signUpBtn = document.getElementById('signUpBtn');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const login = document.getElementById('login');
const authPart = document.getElementById('authPart');

//hiding the top secret part initially 
authPart.style.display = 'none';

//signup
const signUp = async () => {
  const signUpEmail = email.value;
  const signUpPassword = password.value;
  createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCreditional) => {
      // Signed in 
      const user = userCreditional.user;
      console.log(user);
      alert('user created successfully');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(errorMessage);
    });
}

//signin
const signIn = async () => {
  const signInEmail = email.value;
  const signInPassword = password.value;
  signInWithEmailAndPassword(auth, signInEmail, signInPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      alert('user signed in successfully');
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      alert(errorMessage);
    });
}
//check auth state
const checkAuthState = () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      login.style.display = 'none';
      authPart.style.display = 'flex';
      console.log('user is signed in');
    } else {
      login.style.display = 'block';
      authPart.style.display = 'none';
      console.log('user is signed out');
    }
  })
}
checkAuthState();
//signout
const userSignOut = () => {
  signOut(auth).then(() => {

    console.log('user signed out');
    alert('user signed out successfully');
  }).catch((error) => {
    // An error happened.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage);
    alert(errorMessage);
  });
}

signUpBtn.addEventListener('click', signUp);
signInBtn.addEventListener('click', signIn);
signOutBtn.addEventListener('click', userSignOut);