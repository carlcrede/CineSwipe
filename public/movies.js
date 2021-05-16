let page = 1;
let movielist = new Array();

const fetchmovies = async(page) => {
    const response = await fetch('http://localhost:8080/movie/popular/' + page);
    const result = await response.json();
    movielist = [...result];
    return result;
}

const initialCards = async () => {
    await fetchmovies(page);
    const length = movielist.length;
    for (let i = length-1; i >= length-10; i--) {
        await addCard();
    }
}

// backdrop
// title, overview
// avg vote, imdb?
// hidden id
// genres maybe
// release date / year
// provider logos
// playtime
const addCard = async () => {
    let movie = movielist[movielist.length-1];
    if (!movie) {
        page++;
        await fetchmovies(page);
        movie = movielist[movielist.length-1];
    }
    let child = $(`<div id="${movie.id}" class="child"></div>`);
    child.append(`<h1>${movie.title}</h1>`);
    $('.wrapper').prepend(child);

    //TODO: CSS should be made into classes that can be added, removed and toggled
    child.css('background-image', `linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(10,10,10,1)), url('https://www.themoviedb.org/t/p/w500${movie.backdrop_path}')`);
    // jQuery element is always an array, so destructuring to get html element - hammer cant use jQuery object
    initHammer(...child);
    movielist.pop();
}

initialCards().then(() => console.log(movielist));
