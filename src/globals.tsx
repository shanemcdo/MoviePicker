import { createStore } from 'solid-js/store'
import { createSignal, untrack } from 'solid-js'

type Genre = {
	id: number,
	name: string
};

type DisplayPriorities = {
	CA: number,
	AE: number,
	AR: number,
	AT: number,
	AU: number,
	BE: number,
	BO: number,
	BR: number,
	BG: number,
	CH: number,
	CL: number,
	CO: number,
	CR: number,
	CZ: number,
	DE: number,
	DK: number,
	EC: number,
	EE: number,
	EG: number,
	ES: number,
	FI: number,
	FR: number,
	GB: number,
	GR: number,
	GT: number,
	HK: number,
	HN: number,
	HU: number,
	ID: number,
	IE: number,
	IN: number,
	IT: number,
	JP: number,
	LT: number,
	LV: number,
	MX: number,
	MY: number,
	NL: number,
	NO: number,
	NZ: number,
	PE: number,
	PH: number,
	PL: number,
	PT: number,
	PY: number,
	RU: number,
	SA: number,
	SE: number,
	SG: number,
	SK: number,
	TH: number,
	TR: number,
	TW: number,
	US: number,
	VE: number,
	ZA: number,
	SI: number,
	CV: number,
	GH: number,
	MU: number,
	MZ: number,
	UG: number,
	IL: number,
	BY: number,
	BZ: number,
	CY: number,
	LU: number,
	NI: number,
	UA: number
};

type Provider = { 
	display_priorities: DisplayPriorities,
	display_priority: number,
	logo_path: string,
	provider_name: string,
	provider_id: number
};

type Region = {
	iso_3166_1: string,
	english_name: string,
	native_name: string
};

type Language = {
	iso_639_1: string,
	english_name: string,
	name: string
};

type Args = {
	watch_region: string,
	certification_country: string,
	'certification.gte': string,
	'certification.lte': string,
	with_genres: string,
	without_genres: string,
	with_watch_providers: string,
	with_watch_monetization_types: string,
	'vote_average.gte': number,
	'vote_average.lte': number,
	with_original_language: string,
	page: number
};

type Media = {
	adult: boolean,
	backdrop_path: string,
	genre_ids: number[],
	id: number,
	original_language: string,
	original_title: string,
	overview: string,
	popularity: number,
	poster_path: string,
	release_date: string,
	title: string,
	video: boolean,
	vote_average: number,
	vote_count: number,
};

type Tv = {
	backdrop_path: string,
	first_air_date: string,
	genre_ids: number[],
	id: number,
	name: string,
	origin_country: number[],
	original_language: string,
	original_name: string,
	overview: string,
	popularity: number,
	poster_path: string,
	vote_average: number,
	vote_count: number,
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
export const defaults = {
	rating: {
		min: 0,
		max: 10
	},
	region: 'US',
	language: 'en',
};
export const monetizationTypes = { 
	flatrate: 'Stream',
	buy: 'Buy',
	rent: 'Rent',
};
// TODO
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
let previousMovieFilters: Partial<Args> = {};
let previousTvFilters: Partial<Args> = {};

// stores
export const [allMovieGenres, setAllMovieGenres] = createStore<Genre[]>([]);
export const [allTvGenres, setAllTvGenres] = createStore<Genre[]>([]);
export const [allMovieProviders, setAllMovieProviders] = createStore<Provider[]>([]);
export const [allTvProviders, setAllTvProviders] = createStore<Provider[]>([]);
export const [allRegions, setAllRegions] = createStore<Region[]>([]);
export const [allLanguages, setAllLanguages] = createStore<Language[]>([]);
export const [media, setMedia] = createStore<Media | null>(null);
// signals
export const [mediaType, setMediaType] = createSignal(MediaType.Movie);
export const mediaTypeIsMovie = () => mediaType() == MediaType.Movie;
export const setMediaTypeIsMovie = (b: boolean) => setMediaType(b ? MediaType.Movie : MediaType.Tv);
export const [filtersSidebarIsOpen, setFiltersSideBarIsOpen] = createSignal(false);
export const toggleFiltersSidebar = () => setFiltersSideBarIsOpen(b => !b);
export const [minRating, setMinRating] = createSignal(defaults.rating.min);
export const [maxRating, setMaxRating] = createSignal(defaults.rating.max);
export const [errorMessage, setErrorMessage] = createSignal('');

export const allGenres = () => mediaTypeIsMovie() ? allMovieGenres : allTvGenres
export const allProviders = () => mediaTypeIsMovie() ? allMovieProviders : allTvProviders

function tvToMedia(tv: Tv): Media { 
	const { name, original_name, first_air_date, ...others} = tv;
	return {
		adult: false,
		video: true,
		title: name,
		original_title: original_name,
		release_date: first_air_date,
		...others
	};
}

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

export function clearFilters() {

};

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

async function getMovieGenres(): Promise<Genre[]> {
	const res = await fetch(movieGenreListURL, tmdbOptions);
	return (await res.json()).genres;
}

async function getTvGenres(): Promise<Genre[]> {
	const res = await fetch(tvGenreListURL, tmdbOptions);
	return (await res.json()).genres;
}

async function getAllMovieProviders(): Promise<Provider[]> {
	const res = await fetch(movieProviderListURL, tmdbOptions);
	return (await res.json()).results;
}

async function getAllTvProviders(): Promise<Provider[]> {
	const res = await fetch(tvProviderListURL, tmdbOptions);
	return (await res.json()).results;
}

async function getRegions(): Promise<Region[]> {
	const res = await fetch(regionListURL, tmdbOptions);
	return (await res.json()).results;
}

async function getLanguages(): Promise<Language[]> {
	const res = await fetch(languagesListURL, tmdbOptions);
	return await res.json();
};

export function getAllApiData() {
	getMovieGenres().then(setAllMovieGenres);
	// TODO uncomment when ready to not spam API
	getTvGenres().then(setAllTvGenres);
	getAllMovieProviders().then(setAllMovieProviders);
	getAllTvProviders().then(setAllTvProviders);
	// TODO set region back to default after this
	getRegions().then(regions => {
		setAllRegions(regions);
		(document.querySelector('#regions') as HTMLSelectElement).value = defaults.region;
	});
	// TODO set language back to default after this
	getLanguages().then(langs => {
		setAllLanguages(langs);
		(document.querySelector('#languages') as HTMLSelectElement).value = defaults.language;
	});
};

export async function getMovieProviders(movieId: number): Promise<Provider> {
	const url = `${apiBaseURL}/movie/${movieId}/watch/providers`;
	const res = await fetch(url, tmdbOptions);
	return (await res.json()).results.US;
}

export async function getTvProviders(tvId: number): Promise<Provider> {
	const url = `${apiBaseURL}/tv/${tvId}/watch/providers`;
	const res = await fetch(url, tmdbOptions);
	return (await res.json()).results.US;
}

async function getMedia(args: { [key: string]: string | number }, baseURL: string): Promise<any> {
	const url = new URL(baseURL);
	for(const arg in args) {
		if(!args[arg]) continue;
		url.searchParams.set(arg, args[arg].toString());
	}
	try {
		const res = await fetch(url, tmdbOptions);
		return await res.json();
	} catch (e) {
		return null;
	}
}

async function getMovies(args: Args) {
	return await getMedia(args, discoverMovieBaseURL);
}

async function getTvs(args: Args) {
	return await getMedia(args, discoverTvBaseURL);
}

async function getMovieOrTv(): Promise<Media | null> {
	const isMovie = untrack(mediaTypeIsMovie);
	let selectedGenres    = isMovie ? selectedMovieGenres    : selectedTvGenres;
	let excludedGenres    = isMovie ? excludedMovieGenres    : excludedTvGenres;
	let selectedProviders = isMovie ? selectedMovieProviders : selectedTvProviders;
	let currentPage       = isMovie ? currentMoviePage       : currentTvPage;
	let previousFilters   = isMovie ? previousMovieFilters   : previousTvFilters;
	let getMediaList      = isMovie ? getMovies              : getTvs;
	let seenMedia         = isMovie ? seenMovies             : seenTvs
	while(1){
		const args: Args = {
			'watch_region': (document.querySelector('#regions') as HTMLSelectElement).value,
			'certification_country': 'US',
			'certification.gte': 'G',
			'certification.lte': 'R',
			'with_genres': [...selectedGenres].join(','),
			'without_genres': [...excludedGenres].join(','),
			'with_watch_providers': [...selectedProviders].join('|'),
			'with_watch_monetization_types': [...selectedMonetizationTypes].join('|'),
			'vote_average.gte': untrack(minRating),
			'vote_average.lte': untrack(maxRating),
			'with_original_language': (document.querySelector('#languages') as HTMLSelectElement).value,
			'page': currentPage
		};
		console.table(args);
		if(
			args.with_genres !== previousFilters.with_genres
			|| args.without_genres !== previousFilters.without_genres
			|| args.with_watch_providers !== previousFilters.with_watch_providers
			|| args['vote_average.gte'] !== previousFilters['vote_average.gte']
			|| args['vote_average.lte'] !== previousFilters['vote_average.lte']
			|| args['watch_region'] !== previousFilters['watch_region']
			|| args['with_original_language'] !== previousFilters['with_original_language']
		) {
			args.page = currentPage = 1;
			if(isMovie) {
				currentMoviePage = 1;
			} else {
				currentTvPage = 1;
			}
		}
		previousFilters = args;
		if(isMovie) {
			previousMovieFilters = args;
		} else {
			previousTvFilters = args;
		}
		const media = await getMediaList(args);
		const mediaType = isMovie ? 'movie' : 'shows';
		if(media === null) {
			setErrorMessage('Could not connect to API');
			return null;
		}
		if(media.results === undefined) {
			setErrorMessage(`API returned message: ${media.status_message}`);
			return null;
		}
		if(media.total_pages < 1) {
			setErrorMessage(`No ${mediaType} found with selected filters`);
			return null;
		}
		if(media.total_pages < currentPage) {
			setErrorMessage(`No more ${mediaType} remaining`);
			return null;
		}
		const filteredArray = media.results.filter((item: { id: number }) => !seenMedia.has(item.id));
		if(filteredArray.length > 0) {
			const media = random<Media | Tv>(filteredArray);
			if(isMovie) {
				return media as Media;
			}
			return tvToMedia(media as Tv);
		}
		currentPage += 1;
		if(isMovie) {
			currentMoviePage = currentPage;
		} else {
			currentTvPage = currentPage;
		}
	}
	// unreachable but here for ts compiler
	return null
}


export async function displayMovieOrTv() {
	const media = await getMovieOrTv()!;
	setMedia(media);
}
