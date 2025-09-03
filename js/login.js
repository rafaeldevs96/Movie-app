import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"; // Si deseas usar Firestore después del login
import { app } from './firebase-config.js';
const email = document.getElementById("email");
const password = document.getElementById("password");
const formlogin= document.getElementById("formLogin");
const spanError= document.getElementById("spanError");


formlogin.addEventListener("submit",(e)=>{
    e.preventDefault();

    const auth = getAuth()
    signInWithEmailAndPassword(auth,email.value,password.value)
    .then((userCredential)=>{
        //dentro de la conexion
        const user = userCredential.user;
        console.log(user,"conexion lista")
        window.location.href="dsahboard.html"
    })
    .catch((error)=>{
           const errorCode = error.code;
           const errorMessage = error.message
           spanError.textContent="Error" + errorMessage
    })


})
