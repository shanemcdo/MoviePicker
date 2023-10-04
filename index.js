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
const excludedGenres = new Set();

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
		'certification.gte': 'G',
		'certification.lte': 'PG-13',
		'with_genres': [...selectedGenres].join(','),
		'without_genres': [...excludedGenres].join(',')
	});
	const movie = random(movies.results);
	$('#movie-poster').attr('src', makeImageURL(movie.poster_path));
	$('.movie-title').text(movie.title);
	$('#movie-date').text(movie.release_date);
	$('#movie-rating').text(`${movie.vote_average}/10`);
	$('#movie-desc').text(movie.overview);
	$('body').css('background-image', `linear-gradient(var(--bg-transparent), var(--bg-transparent)), url(${makeImageURL(movie.backdrop_path)})`);
	$('#movie-genres').html('')
	for(const id of movie.genre_ids) {
		$('#movie-genres').append(
			`<span class="movie-genre" data-genre-id="${id}">${getGenre(id)}</span>`
		);
	};
	$('.movie-genre').click(function() {
		$(`#genre-selector input[type="checkbox"][value="${$(this).attr('data-genre-id')}"]`).click();
	});
}

async function main() {
	allGenres = await getGenres();
	allGenres.forEach(item => {
		$('#genre-selector').append(
			`<li>
				<input type="checkbox" value="${item.id}">
				<input type="button" value="X" data-genre-id='${item.id}' title="Exclude ${item.name} Genre ">
				<label for="${item.id}">${item.name}</label>
			</li>`
		);
	});
	$('#genre-selector input[type="button"]').click(function() {
		const el = $(this);
		const id = el.attr('data-genre-id');
		const parent = el.parent()
		const label = $('label', parent)
		if(excludedGenres.has(id)) {
			excludedGenres.delete(id);
			label.css('text-decoration', '');
		} else {
			excludedGenres.add(id);
			label.css('text-decoration', 'line-through');
			if(selectedGenres.has(id)) {
				$('input[type="checkbox"]', parent).click();
			}
		}
	});
	$('#genre-selector input[type="checkbox"]').click(function() {
		const el = $(this);
		const id = $(this).val();
		if(selectedGenres.has(id)) {
			selectedGenres.delete(id);
		} else {
			selectedGenres.add(id);
			if(excludedGenres.has(id)) {
				$('input[type="button"]', el.parent()).click();
			}
		}
	});
	await getMovie();
};

main();
