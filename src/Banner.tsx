import { mediaType, filtersSidebarIsOpen, toggleFiltersSidebar, displayMovieOrTv } from './globals';
import './Banner.scss';

export default function Banner() {
	return <nav id="banner">
		<button id="hamburger" class="borderless-button mobile-only" onClick={toggleFiltersSidebar}>
			<i id="hamburger-glyph" class={`fa-solid ${filtersSidebarIsOpen() ? 'fa-x' : 'fa-bars'}`} />
		</button>
		<p id="website-title">{mediaType()} Picker</p>
		<button id="refresh-button" class="borderless-button" onClick={displayMovieOrTv}>
			<i class="fa-solid fa-arrows-rotate" />
		</button>
	</nav>;
}
