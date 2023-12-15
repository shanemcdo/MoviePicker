import { Show, For, createEffect } from 'solid-js';
import { media, displayMovieOrTv, makePosterURL, allGenres, errorMessage, selectedGenres } from './globals'
import MovieProviders from './MovieProviders'
import './MovieInfo.scss'

function getGenre(id: number): string {
	return allGenres().find(genre => genre.id === id)?.name ?? '';
}

function getMoreLikeThis() {
	selectedGenres().clear()
	document.querySelectorAll('#genre-selector input[type="checkbox"]').forEach(ele => {
		const el = ele as HTMLInputElement;
		el.checked = false;
	})
	document.querySelectorAll('#genre-selector label').forEach(ele => {
		const el = ele as HTMLLabelElement;
		el.style.textDecoration = '';
	})
	document.querySelectorAll('.movie-genre').forEach(ele => {
		const el = ele as HTMLElement;
		el.click();
	})
	displayMovieOrTv();
}


export default function MovieInfo() {
	displayMovieOrTv();
	createEffect(() => {
		document.body.style.backgroundImage = `linear-gradient(var(--bg-transparent), var(--bg-transparent)), url(${makePosterURL(media?.backdrop_path ?? '')})`;
	});
	return <div id="movie-info-wrapper">
		<Show
			when={Object.keys(media).length > 0}
			fallback={
				<div id="error-info">
					<h1>No Movie</h1>
					<p id="error-message">{errorMessage()}</p>
				</div>
			}
		>
			<div id="movie-info">
				<p class="movie-title mobile-only">{media?.title}</p>
				<div id="movie-poster-wrapper">
					<img id="movie-poster" alt="Movie Poster" src={makePosterURL(media?.poster_path ?? '')}/>
				</div>
				<div id="movie-text">
					<p class="movie-title desktop-only">{media?.title}</p>
					<div id="movie-date-and-rating" class="pair">
						<p id="movie-date">{media?.release_date}</p>
						<p id="movie-rating">{media?.vote_average?.toFixed(1)}</p>
					</div>
					<div id="movie-genres">
						<For each={media?.genre_ids}>{id =>
							<span class="movie-genre" data-genre-id={id}
								onClick={e =>{
									const el = e.target as HTMLSpanElement;
									const id = el.dataset.genreId!;
									document.getElementById(`genre-${id}`)?.click();
								}}
							>{getGenre(id)}</span>
						}</For>
					</div>
					<p id="movie-desc">{media?.overview}</p>
					<MovieProviders id={media?.id!} />
					<button class="normal-button" onClick={getMoreLikeThis} title="Find another movie with the same genres">More Like This</button>
				</div>
			</div>
		</Show>
	</div>;
}
