import { initializeApp } from "firebase/app";

import {getFirestore}  from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD903liLVSY6P4jGmLwfvMFo5bJ-s43_Xk",
    authDomain: "nupost-app.firebaseapp.com",
    projectId: "nupost-app",
    storageBucket: "nupost-app.appspot.com",
    messagingSenderId: "1055147137413",
    appId: "1:1055147137413:web:6cf7db3f825dbbbc2e4cec",
    measurementId: "G-2YSLDM7WHP"

};
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export {firestore} ;
