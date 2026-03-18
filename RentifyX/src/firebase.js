import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCNPAjT-HyNwkfENdBjvhp3LHGsv-vFgqI",
  authDomain: "rentifyx-831dc.firebaseapp.com",
  projectId: "rentifyx-831dc",
  storageBucket: "rentifyx-831dc.firebasestorage.app",
  messagingSenderId: "219596040785",
  appId: "1:219596040785:web:c9da82a4e21b9476d72670"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account",
});

export { auth, provider };