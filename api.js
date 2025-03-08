const TMDB_API_KEY = '';

export async function getPopularMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Ocorreu um erro ao obter os filmes mais populares: ", error);
        return [];
    }
}

export async function getMovies(filter, page) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${filter}?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ocorreu um erro ao obter os filmes mais populares: ", error);
        return [];
    }
}

export async function getMovieDetails(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=pt-BR`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Ocorreu um erro ao obter detalhes do filme com id ${movieId}: `, error);
        return null;
    }
}

export async function getMovieImage(imageName) {
    try {
        const response = await fetch(`https://image.tmdb.org/t/p/original/${imageName}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Ocorreu um erro ao obter a lista de gêneros: ", error);
        return [];
    }
}

export async function getListGenres() {
    let listGenres = [];

    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`);
        const data = await response.json();

        if (data.genres && Array.isArray(data.genres)) {
            data.genres.forEach(genre => {
                listGenres.push(genre);
            });
        }
    } catch (error) {
        console.error("Ocorreu um erro ao obter a lista de gêneros: ", error);
    }

    return listGenres;
}