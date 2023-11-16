const apiBaseURL = 'https://api.themoviedb.org/3';
const discoverMovieBaseURL = `${apiBaseURL}/discover/movie`;
const discoverTvBaseURL = `${apiBaseURL}/discover/tv`;
const movieGenreListURL = `${apiBaseURL}/genre/movie/list`;
const tvGenreListURL = `${apiBaseURL}/genre/tv/list`;
const movieProviderListURL = `${apiBaseURL}/watch/providers/movie`;
const tvProviderListURL = `${apiBaseURL}/watch/providers/tv`;
const regionListURL = `${apiBaseURL}/watch/providers/regions`;
const imageBaseURL = 'https://image.tmdb.org/t/p';
const posterBaseURL = `${imageBaseURL}/original`;
const logoBaseURL = `${imageBaseURL}/w45`;
const bigLogoBaseURL = `${imageBaseURL}/w500`;
const tmdbOptions = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWNjMDI5ODQzODAyMjI5MmFiNTBiZmI2OWEzODUwMiIsInN1YiI6IjYzMWY5ZGMyZTU1OTM3MDA3YWRhMWUxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B4o3rNSDNFr_2_1l0hHCWEQO-YNZ1CAk7QtPrzeQwQo'
	}
};
const monetizationTypes = { 
	flatrate: 'Stream',
	buy: 'Buy',
	rent: 'Rent',
};
const selectedMonetizationTypes = new Set();
const selectedMovieGenres = new Set();
const selectedTvGenres = new Set();
const excludedMovieGenres = new Set();
const excludedTvGenres = new Set();
const selectedMovieProviders = new Set();
const selectedTvProviders = new Set();
const seenMovies = new Set();
const seenTvs = new Set();
let currentMoviePage = 1;
let currentTvPage = 1;
let previousMovieFilters = {};
let previousTvFilters = {};
let allMovieGenres = [];
let allTvGenres = [];
let allMovieProviders = [];
let allTvProviders = [];
let allRegions = [];
const defaults = {
	rating: {
		min: parseInt($('#min-slider').prop('min')),
		max: parseInt($('#min-slider').prop('max')),
	},
	region: 'US',
};
let mediaTypeIsMovie = true;

function random(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function makeImageURL(path) {
	return `${posterBaseURL}${path}`;
}

function makeLogoURL(path) {
	return `${logoBaseURL}${path}`;
}

function makeBigLogoURL(path) {
	return `${bigLogoBaseURL}${path}`;
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

function clearFilters() {
	$('#filters input[type="checkbox"]').prop('checked', false);
	$('#filters label').css('text-decoration', '');
	$('#min-slider').val(defaults.rating.min);
	$('#max-slider').val(defaults.rating.max);
	$('.range-slider').trigger('input');
	selectedMonetizationTypes.clear();
	selectedMovieGenres.clear();
	excludedMovieGenres.clear();
	selectedMovieProviders.clear();
}

function getGenre(id, genres) {
	for(const genre of genres) {
		if(id == genre.id) {
			return genre.name;
		}
	}
	return name;
}

function getMovieGenre(id) {
	return getGenre(id, allMovieGenres);
}

function getTvGenre(id) {
	return getGenre(id, allTvGenres);
}

function getMoreLikeThis() {
	selectedMovieGenres.clear();
	$('#genre-selector input[type="checkbox"]').prop('checked', false);
	$('.movie-genre').each(function() {
		$(this).click();
	});
	displayMovieOrTv();
}

async function getMovieGenres() {
	const res = await fetch(movieGenreListURL, tmdbOptions);
	return (await res.json()).genres;
}

async function getTvGenres() {
	const res = await fetch(tvGenreListURL, tmdbOptions);
	return (await res.json()).genres;
}

async function getAllMovieProviders() {
	const res = await fetch(movieProviderListURL, tmdbOptions);
	return (await res.json()).results;
}

async function getAllTvProviders() {
	const res = await fetch(tvProviderListURL, tmdbOptions);
	return (await res.json()).results;
}

async function getRegions() {
	const res = await fetch(regionListURL, tmdbOptions);
	return (await res.json()).results;
}

async function getMovieProviders(movieId) {
	const url = `${apiBaseURL}/movie/${movieId}/watch/providers`;
	const res = await fetch(url, tmdbOptions);
	return (await res.json()).results.US;
}

async function getTvProviders(tvId) {
	const url = `${apiBaseURL}/tv/${tvId}/watch/providers`;
	const res = await fetch(url, tmdbOptions);
	return (await res.json()).results.US;
}

async function getMedia(args, baseURL) {
	let url = new URL(baseURL);
	for(const arg in args) {
		if(!args[arg]) continue;
		url.searchParams.set(arg, args[arg]);
	}
	url = url.toString();
	try {
		const res = await fetch(url, tmdbOptions);
		const json = await res.json();
		return json;
	} catch (e) {
		return null;
	}
}

async function getMovies(args) {
	return getMedia(args, discoverMovieBaseURL);
}

async function getTvs(args) {
	return getMedia(args, discoverTvBaseURL);
}

async function getMovieOrTv() {
	let selectedGenres    = mediaTypeIsMovie ? selectedMovieGenres    : selectedTvGenres;
	let excludedGenres    = mediaTypeIsMovie ? excludedMovieGenres    : excludedTvGenres;
	let selectedProviders = mediaTypeIsMovie ? selectedMovieProviders : selectedTvProviders;
	let currentPage       = mediaTypeIsMovie ? currentMoviePage       : currentTvPage;
	let previousFilters   = mediaTypeIsMovie ? previousMovieFilters   : previousTvFilters;
	let getMediaList      = mediaTypeIsMovie ? getMovies              : getTvs;
	let seenMedia         = mediaTypeIsMovie ? seenMovies             : seenTvs
	while(1){
		const args = {
			'watch_region': $('#regions').val(),
			'certification_country': 'US',
			'certification.gte': 'G',
			'certification.lte': 'PG-13',
			'with_genres': [...selectedGenres].join(','),
			'without_genres': [...excludedGenres].join(','),
			'with_watch_providers': [...selectedProviders].join('|'),
			'with_watch_monetization_types': [...selectedMonetizationTypes].join('|'),
			'vote_average.gte': $('#min-slider').val(),
			'vote_average.lte': $('#max-slider').val(),
			'page': currentPage
		};
		if(
			args.with_genres !== previousFilters.with_genres
			|| args.without_genres !== previousFilters.without_genres
			|| args.with_providers !== previousFilters.with_providers
			|| args['vote_average.gte'] !== previousFilters['vote_average.gte']
			|| args['vote_average.lte'] !== previousFilters['vote_average.lte']
			|| args['watch_region'] !== previousFilters['watch_region']
		) {
			args.page = currentPage = 1;
			if(mediaTypeIsMovie) {
				currentMoviePage = 1;
			} else {
				currentTvPage = 1;
			}
		}
		if(mediaTypeIsMovie) {
			previousMovieFilters = args;
		} else {
			previousTvFilters = args;
		}
		const media = await getMediaList(args);
		const mediaType = mediaTypeIsMovie ? 'movie' : 'shows';
		if(media === null) {
			$('#error-message').html('Could not connect to API');
			return null;
		}
		if(media.results === undefined) {
			$('#error-message').html(`API returned message: ${media.status_message}`);
			return null;
		}
		if(media.total_pages < 1) {
			$('#error-message').html(`No ${mediaType} found with selected filters`);
			return null;
		}
		if(media.total_pages < currentPage) {
			$('#error-message').html(`No more ${mediaType} remaining`);
			return null;
		}
		const filteredArray = media.results.filter(item => !seenMedia.has(item.id));
		if(filteredArray.length > 0) {
			return random(filteredArray);
		}
		currentPage += 1;
		if(mediaTypeIsMovie) {
			currentMoviePage = currentPage;
		} else {
			currentTvPage = currentPage;
		}
	}
}

async function displayError() {
	$('#movie-info').hide();
	// get rid of background from movie
	$('body').css('background-image', '');
	$('#error-info').show();
}

async function displayMovieOrTv() {
	$('#error-message').html('Loading...');
	const media = await getMovieOrTv();
	console.log(media);
	if(media === null) {
		displayError();
		return;
	}
	const selectedGenres    = mediaTypeIsMovie ? selectedMovieGenres    : selectedTvGenres;
	const excludedGenres    = mediaTypeIsMovie ? excludedMovieGenres    : excludedTvGenres;
	const selectedProviders = mediaTypeIsMovie ? selectedMovieProviders : selectedTvProviders;
	const previousFilters   = mediaTypeIsMovie ? previousMovieFilters   : previousTvFilters;
	const seenMedia         = mediaTypeIsMovie ? seenMovies             : seenTvs
	const getMediaProviders = mediaTypeIsMovie ? getMovieProviders      : getTvProviders;
	const getGenre          = mediaTypeIsMovie ? getMovieGenre          : getTvGenre;
	$('#error-info').hide();
	$('#movie-info').show();
	seenMedia.add(media.id);
	$('#movie-poster').attr('src', makeImageURL(media.poster_path));
	$('.movie-title').text(media[mediaTypeIsMovie ? 'title' : 'name']);
	$('#movie-date').text(media[mediaTypeIsMovie ? 'release_date' : 'first_air_date']);
	$('#movie-rating').text(`${parseFloat(media.vote_average).toFixed(1)}/${defaults.rating.max}`);
	$('#movie-desc').text(media.overview);
	$('body').css('background-image', `linear-gradient(var(--bg-transparent), var(--bg-transparent)), url(${makeImageURL(media.backdrop_path)})`);
	$('#movie-genres').html('');
	for(const id of media.genre_ids) {
		$('#movie-genres').append(
			`<span class="movie-genre" data-genre-id="${id}">${getGenre(id)}</span>`
		);
	}
	$('.movie-genre').click(function() {
		$(`#genre-selector input[type="checkbox"][value="${$(this).attr('data-genre-id')}"]`).click();
	});
	const providers = await getMediaProviders(media.id);
	console.log(providers);
	const providersEl = $('#movie-providers');
	providersEl.html('');
	if(providers !== undefined) {
		for(const type in monetizationTypes) {
			const name = monetizationTypes[type];
			if(providers[type] !== undefined && providers[type].length > 0) {
				providersEl.append(`<h4 class="monetization-header"><b>${name}</b></h4>`);
				const logos = providers[type].map(provider =>
					`<img
						class="big_logo logo"
						src="${makeBigLogoURL(provider.logo_path)}"
						alt="${provider.provider_name}"
						title="${provider.provider_name}"
					>`
				).join('');
				const list = providersEl.append(`<a href="${providers.link}">${logos}</a>`);
			}
		}
	}
}

function loadGenres(genres) {
	const selectedGenres = mediaTypeIsMovie ? selectedMovieGenres : selectedTvGenres;
	const excludedGenres = mediaTypeIsMovie ? excludedMovieGenres : excludedTvGenres;
	$('#genre-selector').html('');
	genres.forEach(item => {
		console.log(item.id, excludedGenres.has(item.id.toString()) ? 'style="text-decoration: strike-through;"' : '');
		$('#genre-selector').append(
			`<li>
				<input type="checkbox" value="${item.id}" id="genre-${item.id}" ${selectedGenres.has(item.id.toString()) ? 'checked' : ''}>
				<label for="genre-${item.id}" ${excludedGenres.has(item.id.toString()) ? 'style="text-decoration: line-through;"' : ''}>${item.name}</label>
				<input
					type="button"
					value="X"
					data-genre-id='${item.id}'
					title="Exclude ${item.name} Genre"
					class="borderless-button exclude-button"
				>
			</li>`
		);
	});
	$('#genre-selector input[type="button"]').click(function() {
		const el = $(this);
		const id = el.attr('data-genre-id');
		const parent = el.parent();
		const label = $('label', parent);
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
		const id = el.val();
		if(selectedGenres.has(id)) {
			selectedGenres.delete(id);
		} else {
			selectedGenres.add(id);
			if(excludedGenres.has(id)) {
				$('input[type="button"]', el.parent()).click();
			}
		}
	});
}

function loadProviders(providers) {
	const selectedProviders = mediaTypeIsMovie ? selectedMovieProviders : selectedTvProviders;
	$('#provider-selector').html('');
	providers.forEach(item => {
		$('#provider-selector').append(
			`<li>
				<input type="checkbox" id="provider-${item.provider_id}" value="${item.provider_id}" ${selectedProviders.has(item.provider_id.toString()) ? 'checked' : ''}>
				<label for="provider-${item.provider_id}">
					<img class="logo" src="${makeLogoURL(item.logo_path)}"/>
					${item.provider_name}
				</label>
			</li>`
		);
	});
	$('#provider-selector input[type="checkbox"]').click(function() {
		const id = $(this).val();
		if(selectedProviders.has(id)) {
			selectedProviders.delete(id);
		} else {
			selectedProviders.add(id);
		}
	});
}

function loadMonitizationTypes() {
	for(const type in monetizationTypes) {
		const name = monetizationTypes[type];
		$('#monetization-selector').append(
			`<li>
				<input type="checkbox" id="monetization-${type}" value="${type}">
				<label for="monetization-${type}">${name}</label>
			</li>`
		);
	}
	$('#monetization-selector input[type="checkbox"]').click(function() {
		const type = $(this).val();
		if(selectedMonetizationTypes.has(type)) {
			selectedMonetizationTypes.delete(type);
		} else {
			selectedMonetizationTypes.add(type);
		}
	});
}

function loadRegions() {
	$('#regions').append(
		allRegions.map(region => 
			`<option value="${region.iso_3166_1}">${region.english_name}</option>`
		).join('')
	);
	$('#regions').val(defaults.region);
}

async function main() {
	$('#media-type-switch').on('change', async function() {
		mediaTypeIsMovie = !$(this).prop('checked');
		if(mediaTypeIsMovie) {
			loadGenres(allMovieGenres);
			loadProviders(allMovieProviders);
		} else {
			if(allTvGenres.length === 0) {
				allTvGenres = await getTvGenres();
			}
			if(allTvProviders.length === 0) {
				allTvProviders = await getAllTvProviders();
			}
			loadGenres(allTvGenres);
			loadProviders(allTvProviders);
		}
		displayMovieOrTv();
	});
	allMovieGenres = await getMovieGenres();
	loadGenres(allMovieGenres);
	allMovieProviders = await getAllMovieProviders();
	loadProviders(allMovieProviders);
	loadMonitizationTypes();
	$('.selector-search').on('input', function() {
		const el = $(this);
		const value = el.val().toLowerCase();
		const lis = $('li', el.parent());
		if(value === '') {
			lis.show();
			return;
		}
		lis.each(function() {
			const name = $('label', this).html().toLowerCase();
			if(name.includes(value)) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
	});
	$('.range-slider').on('input', function() {
		const el = $(this);
		$(`#${el.attr('data-value-el')}`).text(parseFloat(el.val()).toFixed(1));
		const min = $('#min-slider');
		const max = $('#max-slider');
		const other = el[0].id === 'min-slider' ? max : min;
		if(parseFloat(min.val()) > parseFloat(max.val())) {
			other.val(el.val())
			other.trigger('input');
		}
	});
	allRegions = await getRegions();
	loadRegions();
	await displayMovieOrTv();
}

main();
