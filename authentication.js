// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from"https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDDNfz_E3T5Z8YYGhSfN2ENe5yTBRx9ZmQ",
  authDomain: "tpfsawosz.firebaseapp.com",
  projectId: "tpfsawosz",
  storageBucket: "tpfsawosz.firebasestorage.app",
  messagingSenderId: "382307811302",
  appId: "1:382307811302:web:52f3b69b5c4bba4da72027"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const provider = new GoogleAuthProvider();

const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('exampleInputEmail1');


const userSignIn = async () => { 
    signInWithPopup(auth,
        provider).then((result) => {
         const user = result.user;
         console.log(user);
         updateUserData(user);
         }).catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         })
}
        

const userSignOut = async () => {
            signOut(auth).then(() => {
            alert("You have been signed out!")
            }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            })
}
           
            onAuthStateChanged (auth, (user) => {
            if (user) {
            alert("You are authenticated with Google");
            console.log(user);
            updateUserData(user)
            }
           })
           
           signInButton.addEventListener("click",
            userSignIn);
            signOutButton.addEventListener("click",
            userSignOut);

function updateUserData(user){
const [firstName, lastName] = user.displayName.split(" ");
  firstNameInput.value = firstName;
  
  lastNameInput.value = lastName;
  
  emailInput.value = user.email;
}
            