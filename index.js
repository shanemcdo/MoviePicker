function displayError() {
	$('#movie-info').hide();
	// get rid of background from movie
	$('body').css('background-image', '');
	$('#error-info').show();
}

function clearError() {
	$('#error-message').html('Loading...');
}

function displayLoading() {
	clearError();
	displayError();
};

async function displayMovieOrTv() {
	clearError();
	const media = await getMovieOrTv();
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
	const providersEl = $('#movie-providers');
	if(providers !== undefined) {
		providersEl.html('');
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
	} else {
		providersEl.html('<b>This is not available to stream in your region</b>');
	}
}

function loadGenres(genres) {
	const selectedGenres = mediaTypeIsMovie ? selectedMovieGenres : selectedTvGenres;
	const excludedGenres = mediaTypeIsMovie ? excludedMovieGenres : excludedTvGenres;
	$('#genre-selector').html('');
	genres.forEach(item => {
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

async function main() {
	$('#media-type-switch').on('change', async function() {
		let completed = false;
		// show loading if it takes more than 100 ms
		setTimeout(() => {
			if(!completed) {
				displayLoading();
			}
		}, 100);
		mediaTypeIsMovie = !$(this).prop('checked');
		if(mediaTypeIsMovie) {
			$('#media-type').text('Movie');
			loadGenres(allMovieGenres);
			loadProviders(allMovieProviders);
		} else {
			$('#media-type').text('TV');
			if(allTvGenres.length === 0) {
				allTvGenres = await getTvGenres();
			}
			if(allTvProviders.length === 0) {
				allTvProviders = await getAllTvProviders();
			}
			loadGenres(allTvGenres);
			loadProviders(allTvProviders);
		}
		await displayMovieOrTv();
		completed = true;
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
	allLanguages = await getLanguages();
	loadLanguages();
	await displayMovieOrTv();
}

main();
