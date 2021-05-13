const page = 1;
const movielist = new Array();

const fetchmovies = async(page) => {
    const response = await fetch('http://localhost:8080/movie/popular/' + page);
    const result = await response.json();
    return result;
}

fetchmovies(page).then(result => movielist.push(...result));
console.log(movielist);
