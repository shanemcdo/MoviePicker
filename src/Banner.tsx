import { mediaType, displayMovieOrTv } from './globals'
import './Banner.scss'

function toggleFiltersSidebar() {
	// TODO
}

export default function Banner() {
	return <nav id="banner">
		<button id="hamburger" class="borderless-button mobile-only" onClick={toggleFiltersSidebar}><i id="hamburger-glyph" class="fa-solid fa-bars"></i></button>
		<p id="website-title">{mediaType()} Picker</p>
		<button id="refresh-button" class="borderless-button" onClick={displayMovieOrTv}><i class="fa-solid fa-arrows-rotate"></i></button>
	</nav>;
}
