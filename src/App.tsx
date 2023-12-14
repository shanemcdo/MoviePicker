import './App.css'
import Banner from './Banner'
import Filters from './Filters'
import MovieInfo from './MovieInfo'

export default function App() {
	return (
		<>
		<Banner />
		<div id="wrapper">
			<Filters />
			<MovieInfo />
		</div>
		</>
	);
}

