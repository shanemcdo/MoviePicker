const apiBaseURL = 'https://api.themoviedb.org/3';
const discoverMovieBaseURL = `${apiBaseURL}/discover/movie`;
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
		filters.css('left', '');
		hamburger.removeClass('fa-x');
		hamburger.addClass('fa-bars');
	} else {
		filters.css('left', 0);
		hamburger.removeClass('fa-bars');
		hamburger.addClass('fa-x');
	}
}

async function getMovie() {
	const res = await fetch(discoverMovieBaseURL, tmdbOptions);
	const json = await res.json();
	console.log(json);
	const movie = random(json.results);
	console.log(movie);
	$('#movie-poster').attr('src', makeImageURL(movie.poster_path));
	$('.movie-title').text(movie.title);
	$('#movie-date').text(movie.release_date);
	$('#movie-rating').text(`${movie.vote_average}/10`);
	$('#movie-desc').text(movie.overview);
	// $('body').css('background-image', `URL(${makeImageURL(movie.backdrop_path)})`);
}

getMovie();
