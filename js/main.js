import { app } from './firebase-config.js';
import {  getAuth ,createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const username = document.getElementById("username")
const email = document.getElementById("email")
const password = document.getElementById("password")
const confirmpassword = document.getElementById("confirmpassword")
const signupform = document.getElementById("signup-form")
const passwordError=document.getElementById("password-error")
const confirmpassowrdError=document.getElementById("confirmpassword-error")
const btnLogin= document.getElementById("btn-login")




signupform.addEventListener("submit",(e)=>{
    e.preventDefault();


    if(password.value.length <5){
      return passwordError.innerHTML="por favor ingresa una contraseña minima de 6 digitos"
    }
    if(password.value!==confirmpassword.value){
        return confirmpassowrdError.innerHTML="Las contraseñan no coincide, ingresar de nuevo"
    }
  
    const auth = getAuth();
    createUserWithEmailAndPassword(auth,email.value,password.value)
    .then((userCredential)=>{
        const user = userCredential.user;
        const userId= user.uid;

      console.log("Username (before save):", username.value);
     console.log("Email (before save):", email.value);


        const db = getFirestore()
        const UserRef= doc(db,"users",userId);

        setDoc(UserRef,{
            username: username.value,
            email: email.value,
            
        })
        .then(()=>{
            username.value=""
            email.value=""
            password.value=""
            confirmpassword.value=""
          
            window.location.href = "dashboard.html";
        })
    })
    .catch((error)=>{
        const errorCode = error.code;
        const errorMessage= error.message;
        console.log("Error de autenticacion:",errorCode,errorMessage)
    })

    

  
    console.log(username.value)
    console.log(email.value)
    console.log(password.value)   
    console.log( confirmpassword.value) 

  
       

})




btnLogin.addEventListener("click",(e)=>{
    window.location.href=("login.html")
})