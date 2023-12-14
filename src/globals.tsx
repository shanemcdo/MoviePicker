import { createSignal } from 'solid-js'
import { createStore } from 'solid-js/store'

type Genre = {
	id: number,
	name: string
};

export enum MediaType {
	Movie = "Movie",
	Tv = "Tv"
};

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
const languagesListURL = 'https://api.themoviedb.org/3/configuration/languages';
const tmdbOptions = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWNjMDI5ODQzODAyMjI5MmFiNTBiZmI2OWEzODUwMiIsInN1YiI6IjYzMWY5ZGMyZTU1OTM3MDA3YWRhMWUxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B4o3rNSDNFr_2_1l0hHCWEQO-YNZ1CAk7QtPrzeQwQo'
	}
};

export const [mediaType, setMediaType] = createSignal(MediaType.Movie);
export const mediaTypeIsMovie = () => mediaType() == MediaType.Movie;
export const [filtersSidebarIsOpen, setFiltersSideBarIsOpen] = createSignal(false);
export const toggleFiltersSidebar = () => setFiltersSideBarIsOpen(b => !b);
export const [allMovieGenres, setAllMovieGenres] = createStore<Genre[]>([]);
export const [allTvGenres, setAllTvGenres] = createStore<Genre[]>([]);

export function random<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)];
}

export function makeImageUrl(path: string): string {
	return `${posterBaseURL}${path}`;
};

export function makeLogoURL(path: string): string {
	return `${logoBaseURL}${path}`;
}

export function makeBigLogoURL(path: string): string {
	return `${bigLogoBaseURL}${path}`;
}

function getGenre(id: number, genres: Genre[]): string {
	for(const genre of genres) {
		if(id == genre.id) {
			return genre.name;
		}
	}
	return '';
}

export function getMovieGenre(id: number): string {
	return getGenre(id, allMovieGenres);
}

export function getTvGenre(id: number): string {
	return getGenre(id, allTvGenres);
}

export function displayMovieOrTv() {
	// TODO
}

