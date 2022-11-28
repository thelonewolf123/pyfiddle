// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "firebase/app";
import {
    getAnalytics
} from "firebase/analytics";
import {
    getAuth,
    onAuthStateChanged
} from 'firebase/auth'
import store from '../store/store'

const firebaseConfig = {
    apiKey: "AIzaSyDGEw4n-LmSKmDStFY-D5JnfcVqI_lDGgM",
    authDomain: "pyfiddle-dacc5.firebaseapp.com",
    // authDomain: "",
    projectId: "pyfiddle-dacc5",
    storageBucket: "pyfiddle-dacc5.appspot.com",
    messagingSenderId: "243126926397",
    appId: "1:243126926397:web:ce7990f80e1ff53ef23e54",
    measurementId: "G-S54YQX35HB"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);

// auth state
const auth = getAuth()
onAuthStateChanged(auth, (user) => {
    if (user) store.dispatch('updateCurrentUser', user)
    else store.dispatch('updateCurrentUser', null)
})