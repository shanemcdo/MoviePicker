import tmdbLogo from './assets/tmdb.png';
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
	defaults,
	mediaType,
    displayMovieOrTv,
	selectedGenres,
    excludedGenres,
    selectedProviders,
    selectedMonetizationTypes,
    MonetizationTypes,
} from './globals';
import { createEffect, For, on } from 'solid-js';
import './Filters.scss';

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
	selectedGenres().clear();
	excludedGenres().clear();
	selectedProviders().clear();
	selectedMonetizationTypes.clear();
	document.querySelectorAll('.selector-list input[type="checkbox"]').forEach(el => {
		(el as HTMLInputElement).checked = false;
	});
	document.querySelectorAll('.selector-list label').forEach(el => {
		(el as HTMLLabelElement).style.textDecoration = '';
	});
}

function searchList(this: HTMLInputElement) {
	const val = this.value.toLowerCase();
	// TODO: jQuery could be alot faster. remember you have a stash for that
	this.parentElement?.querySelectorAll('li').forEach(el => {
		const labelName = el.querySelector('label')?.innerText?.toLowerCase() ?? '';
		if(labelName === '') return;
		if(labelName.includes(val)) {
			el.style.display = '';
		} else {
			el.style.display = 'none';
		}
	});
}

export default function Filters() {
	const selectorSearchProps = {
		type: 'search',
		class: 'selector-search',
		onInput: searchList
	};
	createEffect(on(mediaType, () => {
		displayMovieOrTv();
	}));
	createEffect(() => console.log('sg', selectedGenres()));
	createEffect(() => console.log('eg', excludedGenres()));
	createEffect(() => console.log('sp', selectedProviders()));
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
			<input { ...selectorSearchProps } placeholder="Search Genres"/>
			<ul id="genre-selector" class="selector-list">
				<For each={allGenres()}>{genre => {
					const id = genre.id.toString();
					const boxId = `genre-${id}`;
					const include = selectedGenres();
					const exclude = excludedGenres();
					return <li>
						<input
							type="checkbox"
							value={id}
							id={boxId}
							checked={include.has(id)}
							onInput={(e: InputEvent & { target: HTMLInputElement }) => {
								if(e.target.checked) {
									include.add(id);
									if(exclude.has(id)) {
										(e.target.parentElement?.querySelector('input[type="button"]') as HTMLElement)?.click();
									}
								} else {
									include.delete(id);
								}
							}}
						/>
						<label
							for={boxId}
							style={exclude.has(genre.id.toString()) ? 'text-decoration: line-through' : ''}
						>{genre.name}</label>
						<input
							type="button"
							value="X"
							data-genre-id={genre.id}
							title={`$"Exclude ${genre.name} Genre`}
							class="borderless-button exclude-button"
							onClick={(e: MouseEvent ) => {
								const el = e.target as HTMLInputElement;
								const label = el.parentElement?.querySelector('label')!;
								if(exclude.has(id)) {
									exclude.delete(id);
									label.style.textDecoration = '';
								} else {
									exclude.add(id);
									label.style.textDecoration = 'line-through';
									if(include.has(id)) {
										(el.parentElement?.querySelector('input[type="checkbox"]') as HTMLInputElement)?.click();
									}
								}
							}}
						/>
					</li>;
				}}</For>
			</ul>
		</details>
		<details>
			<summary>Providers</summary>
			<input { ...selectorSearchProps } placeholder="Search Providers"/>
			<ul id="provider-selector" class="selector-list">
				<For each={allProviders()}>{provider => {
					const boxId = `provider-${provider.provider_id}`;
					const id = provider.provider_id.toString();
					const include = selectedProviders();
					return <li>
						<input
							type="checkbox"
							id={boxId}
							value={id}
							checked={include.has(id)}
							onInput={() => {
								if(include.has(id)){
									include.delete(id);
								} else {
									include.add(id);
								}
							}}
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
				<For each={Object.keys(monetizationTypes) as MonetizationTypes[]}>{type => {
					const name = monetizationTypes[type];
					const id = `monetization-${type}`;
					return <li>
						<input
							type="checkbox"
							id={id}
							value={type} 
							onInput={() => {
								if(selectedMonetizationTypes.has(type)){
									selectedMonetizationTypes.delete(type);
								} else {
									selectedMonetizationTypes.add(type);
								}
							}}
						/>
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
