import tmdbLogo from './assets/tmdb.png'
import { minRating, maxRating, setMinRating, setMaxRating, setMediaTypeIsMovie, filtersSidebarIsOpen, defaults } from './globals'

function sliderProps(partialName: 'min' | 'max') {
	const name = partialName + '-slider';
	const isMin = partialName === 'min';
	return {
		type: 'range',
		min: defaults.rating.min,
		max: defaults.rating.max,
		name,
		id: name,
		step: 0.1,
		class: 'range-slider',
		value: isMin ? minRating() : maxRating(),
		onInput: (e: InputEvent & { target: HTMLInputElement }) => {
			const setRating = isMin ? setMinRating : setMaxRating;
			const val = parseFloat(e.target.value);
			setRating(val);
			console.log(val);
			if(isMin && minRating() > maxRating()) {
				setMaxRating(val);
			} else if(!isMin && maxRating() < minRating()) {
				setMinRating(val);
			}
		}
	};
}

function clearFilters() {
	setMinRating(defaults.rating.min);
	setMaxRating(defaults.rating.max);
	// TODO reset other filters
}

export default function Filters() {
	return <div id="filters" style={filtersSidebarIsOpen() ? 'left: 0' : ''} >
		<label for="media-type-switch" class="switch">
			Movie
			<input
				type="checkbox"
				name="media-type-switch"
				id="media-type-switch"
				onChange={e => setMediaTypeIsMovie(!e.target.checked)}
			/>
			TV Show
		</label>
		<details>
			<summary>Genres</summary>
			<input type="search" class="selector-search" placeholder="Search Genres"/>
			<ul id="genre-selector" class="selector-list"></ul>
		</details>
		<details>
			<summary>Providers</summary>
			<input type="search" class="selector-search" placeholder="Search Providers"/>
			<ul id="provider-selector" class="selector-list"></ul>
		</details>
		<details>
			<summary>Monetization Types</summary>
			<ul id="monetization-selector" class="selector-list"></ul>
		</details>
		<details>
			<summary>Rating</summary>
			<div id="rating-slider-wrapper">
				<label for="min-slider">Min:</label>
				<input { ...sliderProps('min') }  />
				<span id="min-rating">{minRating().toFixed(1)}</span>
				<label for="max-slider">Max:</label>
				<input { ...sliderProps('max') }  />
				<span id="max-rating">{maxRating().toFixed(1)}</span>
			</div>
		</details>
		<details>
			<summary>Watch Region</summary>
			<select name="regions" id="regions"></select>
		</details>
		<details>
			<summary>Language</summary>
			<select name="languages" id="languages"></select>
		</details>
		<button id="clear-filters-button" class="normal-button" onClick={clearFilters}>Clear Filters</button>
		<div class="flex-spacer"></div>
		<div id="credit">
			<img src={tmdbLogo} alt=""/>
			<p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
		</div>
	</div>;
}
