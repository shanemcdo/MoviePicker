const imageBaseURL = "https://image.tmdb.org/t/p/";
const tmdbOptions = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxOWNjMDI5ODQzODAyMjI5MmFiNTBiZmI2OWEzODUwMiIsInN1YiI6IjYzMWY5ZGMyZTU1OTM3MDA3YWRhMWUxNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B4o3rNSDNFr_2_1l0hHCWEQO-YNZ1CAk7QtPrzeQwQo'
	}
};

function random(array) {
	return array[Math.floor(Math.random() * array.length)];
}

function makeImageUrl(fragment) {
	return `${imageBaseURL}original${fragment}`;
}

async function main() {
	const res = await fetch('https://api.themoviedb.org/3/discover/movie', tmdbOptions);
	const json = await res.json();
	console.log(json);
	const movie = random(json.results);
	console.log(movie);
	$('#movie-poster').attr('src', makeImageUrl(movie.poster_path));
	$('#movie-title').text(movie.title);
	$('#movie-date').text(movie.release_date);
	$('#movie-desc').text(movie.overview);
}

main();
