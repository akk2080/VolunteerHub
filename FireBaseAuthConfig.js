
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";

  import { getAuth} from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCzuWRw1iKr56b2ElzVnP1hJ3ZXwOGIzjk",
    authDomain: "volunteerhub-8f811.firebaseapp.com",
    projectId: "volunteerhub-8f811",
    storageBucket: "volunteerhub-8f811.firebasestorage.app",
    messagingSenderId: "285676387777",
    appId: "1:285676387777:web:5decb6f971433cc58d4340"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  export {auth};
 

