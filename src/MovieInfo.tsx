/*
function getMoreLikeThis() {
	selectedMovieGenres.clear();
	$('#genre-selector input[type="checkbox"]').prop('checked', false);
	$('.movie-genre').click();
	displayMovieOrTv();
}
*/

import { createEffect } from 'solid-js';
import { media, displayMovieOrTv } from './globals'

export default function MovieInfo() {
	// TODO
	// displayMovieOrTv();
	createEffect(() => {
		console.table({ ...media });
	});
	return <></>;
}
