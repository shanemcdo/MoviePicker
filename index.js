const apiBaseURL = 'https://api.themoviedb.org/3';
const discoverMovieBaseURL = `${apiBaseURL}/discover/movie`;
const genreListURL = `${apiBaseURL}/genre/movie/list`;
const imageBaseURL = 'https://image.tmdb.org/t/p';
const posterBaseURL = `${imageBaseURL}/original`;
const logoBaseURL = `${imageBaseURL}/w45`;
const tmdbOptions = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWNjMDI5ODQzODAyMjI5MmFiNTBiZmI2OWEzODUwMiIsInN1YiI6IjYzMWY5ZGMyZTU1OTM3MDA3YWRhMWUxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B4o3rNSDNFr_2_1l0hHCWEQO-YNZ1CAk7QtPrzeQwQo'
	}
};
let allGenres = []
const selectedGenres = new Set();

function random(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function makeImageURL(path) {
	return `${posterBaseURL}${path}`;
}

function toggleFiltersSidebar() {
	const filters = $('#filters');
	const hamburger = $('#hamburger-glyph');
	if(hamburger.hasClass('fa-x')) {
		$('#credit').css('left', '');
		filters.css('left', '');
		hamburger.removeClass('fa-x');
		hamburger.addClass('fa-bars');
	} else {
		filters.css('left', 0);
		$('#credit').css('left', 0);
		hamburger.removeClass('fa-bars');
		hamburger.addClass('fa-x');
	}
}

function getGenre(id) {
	for(const genre of allGenres) {
		if(id == genre.id)
			return genre.name
	};
	return name;
};

async function getGenres() {
	const res = await fetch(genreListURL, tmdbOptions);
	return (await res.json()).genres;
};

async function getMovies(args) {
	let query = '';
	for(const arg in args) {
		if(!args[arg]) continue;
		if(query) {
			query += '&';
		}
		query += `${arg}=${args[arg]}`;
	};
	const url = discoverMovieBaseURL + '?' + query;
	const res = await fetch(url, tmdbOptions);
	const json = await res.json();
	return json;
};

async function getMovie() {
	const movies = await getMovies({
		'watch_region': 'US',
		'certification_country': 'US',
		'certification.lte': 'PG-13',
		'with_genres': [...selectedGenres].join(',')
	});
	const movie = random(movies.results);
	$('#movie-poster').attr('src', makeImageURL(movie.poster_path));
	$('.movie-title').text(movie.title);
	$('#movie-date').text(movie.release_date);
	$('#movie-rating').text(`${movie.vote_average}/10`);
	$('#movie-desc').text(movie.overview);
	$('body').css('background-image', `linear-gradient(var(--bg-transparent), var(--bg-transparent)), url(${makeImageURL(movie.backdrop_path)})`);
	$('#movie-genres').html('')
	for(const genre of movie.genre_ids.map(getGenre)) {
		$('#movie-genres').append(
			`<span class="movie-genre">${genre}</span>`
		);
	};
}

async function main() {
	allGenres = await getGenres();
	allGenres.forEach(item => {
		$('#genre-selector').append(`<li><input type="checkbox" id="${item.id}" value="${item.id}"><label for="${item.id}">${item.name}</label></li>`);
	});
	$('#genre-selector input[type="checkbox"]').click(function() {
		const el = $(this);
		const checked = el.prop('checked');
		if(el.prop('checked')) {
			selectedGenres.add(el.val())
		} else {
			selectedGenres.delete(el.val())
		}
	});
	await getMovie();
};

main();
