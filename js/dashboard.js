import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { app } from "./firebase-config.js";
import {
  getMoviesPopular,
  searchMovies,
  moviesGeneros,
} from "./tmdb-config.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
const btnSingOut = document.getElementById("btn-singOut");
const searchFilter = document.getElementById("searchFilter");
const btnSearch = document.getElementById("btnSearch");
const btnGenerosSeccion = document.getElementById("btn-genres-section");
const moviesSection = document.getElementById("section-movies");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");
const btnFiltros = document.getElementById("btn-toggle-genres")
const btnMyAccount = document.getElementById("btn-myAccount");
const db = getFirestore(app)
const auth = getAuth();
const selectGeneros = new Set();

let currentPage = 1;
let currentMovies = []



console.log(app)

/* Logica para  controlador el paginado */
nextPageButton.addEventListener("click", async () => {
  currentPage++;
  const query = searchFilter.value.trim();
  const update = await searchMovies(query, selectGeneros, currentPage);
  renderMovies(update);
});

prevPageButton.addEventListener("click", async () => {
  if (currentPage > 1) {
    currentPage--;
    const query = searchFilter.value.trim();
    const update = await searchMovies(query, selectGeneros, currentPage);
    renderMovies(update);
  }
});


/* config para el menur hamburguesa y filtros */

btnFiltros.addEventListener("click",()=>{
    const currentDisplay = btnGenerosSeccion.style.display;
    if (currentDisplay === "flex") {
        btnGenerosSeccion.style.display = "none";
    } else {
        btnGenerosSeccion.style.display = "flex";
    }
})

btnGenerosSeccion.addEventListener("click", async (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.generoId) {
        // Obtenemos el ID del género y el botón
        const generoId = Number(e.target.dataset.generoId);
        const targetButton = e.target;

        // Alterna el estado activo del botón
        targetButton.classList.toggle('active');

        // Lógica para añadir o quitar el género del Set
        if (selectGeneros.has(generoId)) {
            selectGeneros.delete(generoId);
        } else {
            selectGeneros.add(generoId);
        }

        // Resetea la página y realiza la búsqueda con los géneros seleccionados
        currentPage = 1;
        const query = searchFilter.value.trim();
        const newMovies = await searchMovies(query, selectGeneros, currentPage);
        currentMovies = newMovies;
        renderMovies(newMovies);

        // Oculta el menú solo si el tamaño de la pantalla es de móvil
        if (window.innerWidth <= 850) {
            btnGenerosSeccion.style.display = "none";
        }
    }
});


/* funcion para cargar las peliculas cuando el usuario inicia sesion */

async function peliculaPorDefecto() {
  const moviesFavorites = await getMoviesPopular();
  currentMovies=moviesFavorites
  renderMovies(moviesFavorites);
  
}




/* funcion para generar el html dinamicamente */
function renderMovies(movies) {
  moviesSection.innerHTML = "";

  const fragment = document.createDocumentFragment();

  movies.forEach((movie) => {
    let moviesCard = document.createElement("article");
  /*   console.log(movie) */

    moviesCard.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>${movie.release_date}</p>
        <p>${movie.overview}</p>
        <p>Calification:${movie.vote_average}</p>
        <div class="opcionsMovies">
        <button data-id="${movie.id}" data-action="favorites">Agregar Favoritos</button>
        <button data-id="${movie.id}" data-action="to_wacth">Por ver</button>
        <button data-id="${movie.id}" data-action="watched"> Vista</button>
        </div>
       
        `;

    fragment.appendChild(moviesCard);
  });

  moviesSection.appendChild(fragment);
}

/* funcion para renderizar los botones */
async function mostrarGeneros() {
  const generosData = await moviesGeneros();
  btnGeneros(generosData.genres);
}




/* funcion para generar botones */

function btnGeneros(datos) {
  datos.forEach((genero) => {
    let btnGeneros = document.createElement("button");
    btnGeneros.textContent = genero.name;
    btnGeneros.dataset.generoId = genero.id;
    btnGenerosSeccion.appendChild(btnGeneros);
  });
}

/* evento con la funcion de busquedad */

btnSearch.addEventListener("click", async () => {
  currentPage = 1;
  const query = searchFilter.value.trim();
  const movieSearc = await searchMovies(query, selectGeneros, currentPage);
  currentMovies = movieSearc
  renderMovies(movieSearc);
});

/* funcionalides de favoritos, vistas y por ver  */

moviesSection.addEventListener("click",  (e)=>{

   const movieId =e.target.dataset.id
   const movieAction = e.target.dataset.action;
   

   if(movieId && movieAction ){
    const movieData= currentMovies.find(movie => movie.id.toString() === movieId)
    if(movieData){
      saveMovies(movieId,movieAction,movieData)
    }
   }

})

async function saveMovies(peliculaId,tipoDelista,datosPelicula) {
    const user = auth.currentUser;
    if(user){
      const docRef = doc(
        db,
        "users",
          user.uid,
          tipoDelista,
          String(peliculaId)
      );
       try{
      await setDoc(docRef,datosPelicula);
      console.log("pelicula guardada con existo")
    }catch(error){
      console.error("Error al guardar pelicula",error)
    }

    } else{
      console.log("usuario no autenticado")
    }

   

}


/* Manejo de estado de usuario y ciere de sesion con FireBase */

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    console.log(user, "usuario autenticado");
    peliculaPorDefecto();
    mostrarGeneros();
  }
});

btnSingOut.addEventListener("click", () => {
  signOut(auth)
    .them(() => {
      console.log("sesion cerrada");
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.log("Error al cerrar sesion", error);
    });
});

btnMyAccount.addEventListener("click", () => {
    window.location.href = "user.html"; 
});