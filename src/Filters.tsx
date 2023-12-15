import tmdbLogo from './assets/tmdb.png'
import {
	minRating,
	maxRating,
	setMinRating,
	setMaxRating,
	setMediaTypeIsMovie,
	filtersSidebarIsOpen,
	allGenres,
	allProviders,
	allRegions,
	allLanguages,
	makeLogoURL,
	monetizationTypes,
	defaults
} from './globals'
import { For } from 'solid-js'
import './filters.scss'

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
			<ul id="genre-selector" class="selector-list">
				<For each={allGenres()}>{genre => {
					const boxId = `genre-${genre.id}`;
					return <li>
						<input
							type="checkbox"
							value={genre.id}
							id={boxId}
						/>
						<label
							for={boxId}
							style={ /* TODO */ false ? 'text-decoration: line-through' : ''}
						>{genre.name}</label>
						<input
							type="button"
							value="X"
							data-genre-id={genre.id}
							title={`$"Exclude ${genre.name} Genre`}
							class="borderless-button exclude-button"
							onClick={() => { /* TODO */ }}
						/>
					</li>;
				}}</For>
			</ul>
		</details>
		<details>
			<summary>Providers</summary>
			<input type="search" class="selector-search" placeholder="Search Providers"/>
			<ul id="provider-selector" class="selector-list">
				<For each={allProviders()}>{provider => {
					const boxId = `provider-${provider.provider_id}`;
					return <li>
						<input
							type="checkbox"
							id={boxId}
							value={provider.provider_id}
						/>
						<label for={boxId}>
							<img class="logo" src={makeLogoURL(provider.logo_path)} />
							{provider.provider_name}
						</label>
					</li>;
				}}</For>
			</ul>
		</details>
		<details>
			<summary>Monetization Types</summary>
			<ul id="monetization-selector" class="selector-list">
				<For each={Object.keys(monetizationTypes)}>{type => {
					const name = (monetizationTypes as { [key: string]: string })[type];
					const id = `monetization-${type}`;
					return <li>
						<input type="checkbox" id={id} value={type} />
						<label for={id} >{name}</label>
					</li>;
				}}</For>
			</ul>
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
			<select name="regions" id="regions">
				<For each={allRegions}>{region =>
					<option value={region.iso_3166_1}>{region.english_name}</option>
				}</For>
			</select>
		</details>
		<details>
			<summary>Language</summary>
			<select name="languages" id="languages">
				<For each={allLanguages}>{language =>
					<option value={language.iso_639_1}>{language.english_name}</option>
				}</For>
			</select>
		</details>
		<button id="clear-filters-button" class="normal-button" onClick={clearFilters}>Clear Filters</button>
		<div class="flex-spacer"></div>
		<div id="credit">
			<img src={tmdbLogo} alt=""/>
			<p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
		</div>
	</div>;
}
