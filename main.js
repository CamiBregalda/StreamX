import { getPopularMovies, getMovies, getMovieDetails, getMovieImage, getListGenres } from './api.js';

let page = 1;
let filter = 'popular';
let filterYear = 'all';
let filterGenre = 'all';
let filterName = '';

/* ADICIONANDO ANIMAÇÃO NO BOTÃO DE BUSCA */

const header = document.querySelector('header');
const nav = document.querySelector('nav');
const navbarMenuBtn = document.querySelector('.navbar-menu-btn');

const navbarForm = document.querySelector('.navbar-form');
const navbarFormCloseBtn = document.querySelector('.navbar-form-close');
const navbarSearchBtn = document.querySelector('.navbar-search-btn');

function navIsActive(){
    header.classList.toggle('active');
    nav.classList.toggle('active');
    navbarMenuBtn.classList.toggle('active');
}

const searchBarIsActive = () => navbarForm.classList.toggle('active');

function initNavbarEvents() {
    navbarMenuBtn.addEventListener('click', navIsActive);
    navbarSearchBtn.addEventListener('click', searchBarIsActive);
    navbarFormCloseBtn.addEventListener('click', searchBarIsActive);
}

document.addEventListener("DOMContentLoaded", initNavbarEvents);

/* INSERINDO DADOS DO BANNER */

const banner = document.getElementById('banner-container');

async function insertBanner() {
    const movies = await getPopularMovies();

    banner.innerHTML = '';

    movies.forEach(async (movie) => {
        const movieDetails = await getMovieDetails(movie.id);
        const imageUrl = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
        const genres = movieDetails.genres.map(genre => genre.name).join(', ');

        const slideHTML = `
            <div class="swiper-slide">
                <div class="banner-card">
                    <div class="overlay-banner"></div>
                    <img class="banner-img" src="${imageUrl}" alt="${movie.title}">
                    
                    <div class="card-content">
                        <div class="card-info">
                            <div class="genre">
                                <ion-icon name="film"></ion-icon>
                                <span>${genres}</span>
                            </div>
                            <div class="year">
                                <ion-icon name="calendar"></ion-icon>
                                <span>${movie.release_date.split('-')[0]}</span>
                            </div>
                            <div class="duration">
                                <ion-icon name="time"></ion-icon>
                                <span>${movieDetails.runtime} min</span>
                            </div>
                            <div class="quality">4k</div>
                        </div>
                        <h2 class="card-title">${movie.title}</h2>
                    </div>
                </div>
            </div>
        `;

        banner.innerHTML += slideHTML;
    });

    updateCards();

    setTimeout(() => {
        new Swiper('.swiper', {
            loop: true,
            autoplay: {
                delay: 10000, 
                disableOnInteraction: false, 
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }, 1000);
}

/* INSERINDO DADOS DE GÊNEROS */

async function insertGenres() {
    try {
        const genres = await getListGenres();
        const genresContainer = document.getElementById('genres');

        const genreTranslations = {
            "Action": "Ação",
            "Adventure": "Aventura",
            "Animation": "Animação",
            "Comedy": "Comédia",
            "Crime": "Crime",
            "Documentary": "Documentário",
            "Drama": "Drama",
            "Family": "Família",
            "Fantasy": "Fantasia",
            "History": "História",
            "Horror": "Terror",
            "Music": "Música",
            "Mystery": "Mistério",
            "Romance": "Romance",
            "Science Fiction": "Ficção Científica",
            "TV Movie": "Filme para TV",
            "Thriller": "Suspense",
            "War": "Guerra",
            "Western": "Faroeste"
        };

        const option = document.createElement('option');
        option.value = 'all'; 
        option.textContent = 'Todos os gêneros';
        genresContainer.appendChild(option);

        genres.forEach(genre => {
            const option = document.createElement('option');
            option.value = genre.id; 
            option.textContent = genreTranslations[genre.name] || genre.name;
            genresContainer.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar os gêneros:", error);
    }
}

/* INSERINDO DADOS NOS CARDS */

function insertCardMovie(movie) {
    const movieCard = document.createElement('div');
    const imageUrl = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
    const genres = movie.genres.map(genre => genre.name).join(' / ');
    const releaseDate = movie.release_date.split('-')[0];

    movieCard.classList.add('movie-card');
    movieCard.innerHTML = `
        <div class="card-head">
            <img src="${imageUrl}" alt="${movie.title}" class="card-img">

            <div class="card-overlay">
                <div class="bookmark">
                    <ion-icon name="bookmark"></ion-icon>
                </div>

                <div class="rating">
                    <ion-icon name="star-outline"></ion-icon>
                    <span>${movie.vote_average.toFixed(1)}</span>
                </div>

                <div class="play">
                    <ion-icon name="play-circle-outline"></ion-icon>
                </div>
            </div>
        </div>

        <div class="card-body">
            <h3 class="card-title">${movie.title}</h3>

            <div class="card-info">
                <span class="genre">${genres}</span>
                <span class="year">${releaseDate}</span>
            </div>
        </div>
    `;

    return movieCard;
}

async function displayMovies() {
    const dataMovies = await getMovies(filter, page);
    const moviesContainer = document.getElementById('movies-grid');
    moviesContainer.innerHTML = '';

    dataMovies.results.forEach(async (m) => {
        // Filtrando por ano
        let showMovie = true;

        if (filterYear !== 'all') {
            if (filterYear.includes('-')) {
                const [startYear, endYear] = filterYear.split('-').map(Number);
                showMovie = m.release_date.split('-')[0] >= startYear && m.release_date.split('-')[0] <= endYear;
            } else {
                showMovie = m.release_date.split('-')[0] === filterYear;
            }
        }

        // Filtrando por gênero
        if (filterGenre !== 'all') {
            showMovie = m.genre_ids.includes(Number(filterGenre));
        }

        // Filtrando por nome
        if (filterName !== '') {
            const searchInput = document.querySelector('#search-input');
            const searchValue = searchInput.value.toLowerCase();
            showMovie = m.title.toLowerCase().includes(searchValue);
        }

        if (showMovie) { 
            const movie = await getMovieDetails(m.id);

            const movieCard = insertCardMovie(movie);
            moviesContainer.appendChild(movieCard);
        }
    });

    createPagination(dataMovies.total_pages);
}

function updateCards() {
    let dados = '';
    const radios = document.querySelectorAll('input[name="grade"]');
    const labels = document.querySelectorAll('label');

    radios.forEach((radio, index) => {
        const label = labels[index];

        if (radio.checked) {
            label.classList.add('checked-radio-bg'); 
            filter = radio.id;
        } else {
            label.classList.remove('checked-radio-bg');
        }
    });

    displayMovies();
}


/* INSERINDO PAGINAÇÃO */

const pages = document.querySelector(".pages");

function createPagination(totalPages) {
    pages.innerHTML = "";
    const buttons = [];

    if (totalPages <= 10) {
        for (let i = 1; i <= totalPages; i++) {
            buttons.push(createPageButton(i));
        }
    } else {
        if (page <= 5) {
            // Caso inicial (mostra as 8 primeiras + ... + última)
            for (let i = 1; i <= 8; i++) {
                buttons.push(createPageButton(i, totalPages));
            }
            buttons.push(createEllipsis());
            buttons.push(createPageButton(totalPages, totalPages));
        } else if (page >= totalPages - 4) {
            // Caso final (... + 7 últimas páginas)
            buttons.push(createPageButton(1, totalPages));
            buttons.push(createEllipsis());
            for (let i = totalPages - 6; i <= totalPages; i++) {
                buttons.push(createPageButton(i, totalPages));
            }
        } else {
            // Caso do meio (... 3 antes, atual, 3 depois ...)
            buttons.push(createPageButton(1, totalPages));
            buttons.push(createEllipsis());

            for (let i = page - 3; i <= page + 3; i++) {
                buttons.push(createPageButton(i, totalPages));
            }

            buttons.push(createEllipsis());
            buttons.push(createPageButton(totalPages, totalPages));
        }
    }

    buttons.forEach((btn) => pages.appendChild(btn));
}

function createPageButton(pageNumber, totalPages) {
    const button = document.createElement("button");
    button.classList.add("page");
    button.textContent = pageNumber;

    if (pageNumber === page) {
        button.classList.add("active");
    }

    button.addEventListener("click", () => {
        page = pageNumber;
        displayMovies();
        createPagination(totalPages);
    });

    return button;
}

function createEllipsis() {
    const span = document.createElement("span");
    span.classList.add("ellipsis");
    span.textContent = "...";
    return span;
}

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.querySelector(".navbar-form-search");
    const searchButton = document.querySelector(".navbar-form-btn");

    searchButton.addEventListener("click", function (event) {
        event.preventDefault(); 

        filterName = searchInput.value.trim().toLowerCase();
        if (filterName) {
            displayMovies();
        }
    });
});

document.querySelectorAll('input[name="grade"]').forEach(radio => {
    radio.addEventListener('change', updateCards);
});

document.querySelector('#genres').addEventListener('change', function () {
    filterGenre = this.value; 
    displayMovies(); 
});

document.querySelector('#years').addEventListener('change', function () {
    filterYear = this.value; 
    displayMovies(); 
});

insertBanner();
insertGenres();