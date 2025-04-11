
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from"https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyB5hN4iMQAdE515PHT6zUFedGGpvqCnGzw",
    authDomain: "sign-in-with-outside-provider.firebaseapp.com",
    projectId: "sign-in-with-outside-provider",
    storageBucket: "sign-in-with-outside-provider.firebasestorage.app",
    messagingSenderId: "318386758816",
    appId: "1:318386758816:web:29b71894107b5405ae55c5",
    measurementId: "G-9TMVMNE7KX"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

  const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

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
            