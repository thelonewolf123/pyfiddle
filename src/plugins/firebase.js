// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "firebase/app";
import {
    getAnalytics
} from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDGEw4n-LmSKmDStFY-D5JnfcVqI_lDGgM",
    authDomain: "pyfiddle-dacc5.firebaseapp.com",
    projectId: "pyfiddle-dacc5",
    storageBucket: "pyfiddle-dacc5.appspot.com",
    messagingSenderId: "243126926397",
    appId: "1:243126926397:web:ce7990f80e1ff53ef23e54",
    measurementId: "G-S54YQX35HB"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);