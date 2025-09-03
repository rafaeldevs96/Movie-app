import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { app } from './firebase-config.js';
const btnSingOut= document.getElementById("btn-singOut")
const auth= getAuth();

onAuthStateChanged(auth,(user)=>{
    if(!user){
        window.location.href="login.html"
    }else{
        console.log(user,"usuario autenticado")
    }
})

btnSingOut.addEventListener("click",()=>{
    signOut(auth).them(()=>{
        console.log("sesion cerrada")
        window.location.href="login.html"
    }).catch((error)=>{
        console.log("Error al cerrar sesion",error)
    })
})