import { getAuth, onAuthStateChanged,signOut } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";
import { app } from "./firebase-config.js";

const userName = document.getElementById("userName");
const menu= document.getElementById("menu")
const btnSingOut = document.getElementById("btn-singOut");
const db = getFirestore(app);
const auth = getAuth();

// Funcion para cargar los datos del usuario
async function loadeUserData(user) {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        userName.textContent = `Bienvenido ${userData.username}`;
    }

    const lists = [
        { name: "favorites", containerId: "favorites-container" },
        { name: "to_wacth", containerId: "to_watch-container" }, 
        { name: "watched", containerId: "watched-container" },
    ];

    for (const list of lists) {
        const listRef = collection(db, "users", user.uid, list.name);
        const listSnapshot = await getDocs(listRef);
        const movies = [];
        
        listSnapshot.forEach((doc) => {
            // Aseguramos que el ID del documento se incluya en los datos
            const movieData = doc.data();
            movieData.id = doc.id;
            movies.push(movieData);
        });

        if (movies.length > 0) {
            renderUserMovies(movies, list.containerId, list.name); // Pasamos el nombre de la lista
        } else {
            const container = document.getElementById(list.containerId);
            container.innerHTML = `<p>Aún no tienes películas en esta lista.</p>`;
        }
    }
}

// Para eliminar una película de la base de datos
async function deleteMovie(movieId, listName, userId) {
    const movieRef = doc(db, 'users', userId, listName, movieId);

    try {
        await deleteDoc(movieRef);
        console.log("Pelicula eliminada con exito");
    } catch (error) {
        console.error("Error al eliminar pelicula", error);
    }
}

// Se elimina la función 'getAndDisplayMovies' que no se usa.

// Se corrige y simplifica la función de renderizado
function renderUserMovies(movies, containerId, listName) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`El contenedor con ID "${containerId}" no fue encontrado.`);
        return;
    }
    container.innerHTML = "";
    const fragment = document.createDocumentFragment();

    movies.forEach((movie) => {
        let moviesCard = document.createElement("article");
        moviesCard.className = "movie-card";

        moviesCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <div class="movie-body">
                <p>${movie.overview}</p>
            </div>
            <div class="movie-footer">
                <p>Calificación: ${movie.vote_average}</p>
                <button class="delete-btn" 
                        data-movie-id="${movie.id}" 
                        data-list-name="${listName}">
                    Eliminar
                </button>
            </div>
        `;
        fragment.appendChild(moviesCard);
    });

    container.appendChild(fragment);

    // ESTE CÓDIGO DEBE ESTAR DENTRO DE ESTA FUNCIÓN para que funcione
    const deleteButtons = document.querySelectorAll(`#${containerId} .delete-btn`);
    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const movieId = e.target.dataset.movieId;
            const listName = e.target.dataset.listName;
            const userId = auth.currentUser.uid;

            deleteMovie(movieId, listName, userId);
            e.target.closest('.movie-card').remove();
        });
    });
}

// Se corrige el llamado a la función en onAuthStateChanged
onAuthStateChanged(auth, async (user) => {
    if (user) {
        loadeUserData(user);
    } else {
        // Se corrige la redirección
        window.location.href = "login.html";
    }
});

menu.addEventListener("click",()=>  {
    console.log("click")
    window.location.href="dashboard.html"
})


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
