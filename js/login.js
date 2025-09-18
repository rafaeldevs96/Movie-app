import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"; // Si deseas usar Firestore después del login
import { app } from './firebase-config.js';
const email = document.getElementById("email");
const password = document.getElementById("password");
const formlogin= document.getElementById("formLogin");
let spanError= document.getElementById("spanError");
const btnRegister = document.getElementById("btn-register");


formlogin.addEventListener("submit",(e)=>{
    e.preventDefault();

    const auth = getAuth()
    signInWithEmailAndPassword(auth,email.value,password.value)
    .then((userCredential)=>{
        //dentro de la conexion
        const user = userCredential.user;
        console.log(user,"conexion lista")
        window.location.href="dashboard.html"
    })
    .catch((error)=>{
           const errorCode = error.code;
           spanError.textContent = '';

            switch (errorCode) {
        case 'auth/invalid-login-credentials':
            spanError.textContent = "El correo o la contraseña son incorrectos."; // Se corrige
            break;
        case "auth/user-not-found":
            spanError.textContent = "El usuario no está registrado."; // Se corrige
            break;
        case "auth/invalid-email":
            spanError.textContent = "El formato de correo es inválido"; // Se corrige
            break; // Se agrega un 'break'
        default:
            spanError.textContent = 'Ha ocurrido un error inesperado. Por favor, inténtelo de nuevo.';
            console.error("Error al iniciar sesión:", errorCode, errorMessage);
            break;
    }
    })


})


btnRegister.addEventListener("click", (e) => {
    // La variable se declara aquí dentro de la función
    const transition = document.querySelector('.page-transition');

    // Ahora el código puede usar la variable de forma segura
    if (transition) {
        transition.classList.add('is-active');

        setTimeout(() => {
            window.location.href = "index.html";
        }, 500);
    }
});

