import { createSignal } from 'solid-js'

export enum MediaType {
	Movie = "Movie",
	Tv = "Tv"
};

export const [mediaType, setMediaType] = createSignal(MediaType.Movie);
export const mediaTypeIsMovie = () => mediaType() == MediaType.Movie;
