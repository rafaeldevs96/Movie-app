const apiKey = "53b4401d56c1085e29ed0a2380118905";
const baseUrl = "https://api.themoviedb.org/3";

async function getMoviesPopular() {
  const response = await fetch(
    `${baseUrl}/movie/popular?api_key=${apiKey}&page=1`
  );
  const data = await response.json();
  return data.results;
}

export { getMoviesPopular };

async function searchMovies(query, setGeneros, page=1) {
      let movies = [];
      const pageParam= `&page=${page}`

    if (query && setGeneros.size===0) {
    const response = await fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${query}${pageParam}`);
    const data = await response.json(); 
     movies = data.results.slice(0,15);
    

    }else if(setGeneros.size>0 && !query){
        const generos = Array.from(setGeneros).join(",")
        const response = await fetch(`${baseUrl}/discover/movie?api_key=${apiKey}&with_genres=${generos}${pageParam}`)
        const data = await response.json();
        movies= data.results
    } else if (query && setGeneros.size > 0) {
        const response = await fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${query}${pageParam}`);
        const data = await response.json();
        movies = data.results.filter((pelicula)=>{
            return pelicula.genre_ids.some(id=> setGeneros.has(id.toString()))
        })
    }else{
       const response = await fetch(`${baseUrl}/movie/popular?api_key=${apiKey}${pageParam}`);
        const data = await response.json();
        movies = data.results;
    }
    return movies;
  
}

export { searchMovies };

async function moviesGeneros() {
  const response = await fetch(`${baseUrl}/genre/movie/list?api_key=${apiKey}`);
  const data = await response.json();

  if (data.genres) {
    data.genres.forEach((genero) => {});
  } else {
    console.log("no se encontro generos");
  }

  return data;
}

export { moviesGeneros };
