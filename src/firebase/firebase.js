import { initializeApp } from "firebase/app";

import {getFirestore}  from "firebase/firestore";
import { getStorage,ref, uploadBytes, getDownloadURL } from "firebase/storage";
// const firebaseConfig = {
//     apiKey: "AIzaSyDsNGJGAnDqcvcHfi_FHvwcfGg8NyOGQAg",
//     authDomain: "nupost-482ec.firebaseapp.com",
//     projectId: "nupost-482ec",
//     storageBucket: "nupost-482ec.appspot.com",
//     messagingSenderId: "673819162868",
//     appId: "1:673819162868:web:44e7a006b2d008600746a1",
//     measurementId: "G-EQYVVJJPSS"
//   };
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
const storage = getStorage(app);
export {firestore,storage,ref,uploadBytes,getDownloadURL} ;
