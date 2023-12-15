import './App.css'
import Banner from './Banner'
import Filters from './Filters'
import MovieInfo from './MovieInfo'
import { getAllApiData } from './globals'

export default function App() {
	getAllApiData();
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

