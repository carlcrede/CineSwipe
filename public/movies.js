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
    let child = $(`<div id="${movie.id}" class="child grid"></div>`);
    let top = $(
        `<div class="child-card-top">
            <a>Trailer</a>
        </div>`);
    
    if (movie.Providers.results.DK.flatrate) {
        let dkProviders = movie.Providers.results.DK.flatrate;
        let providers = $('<div class="child-card-info"></div>');
        dkProviders.forEach((value, index) => {
            providers.append(`<img width="30px" src="https://image.tmdb.org/t/p/w500${value.logo_path}">`);
        });
        top.append(providers);
    };
    child.append(top);
        
    child.append(
        `<div>
            <h2>${movie.title}</h2>
        </div>`);
    child.append(
        `<div class="child-card-info">
            <a><i class="fas fa-star"></i> ${movie.vote_average} <small>/ 10</small></a>
            <a>${movie.release_date}</a>
        </div>`);
    child.append(
        `<div class="child-card-overview"><p>${movie.overview}</p></div>`);
    $('.wrapper').prepend(child);

    //TODO: CSS should be made into classes that can be added, removed and toggled
    child.css('background-image', `linear-gradient(1deg, rgba(62,54,54,0.9419117988992471) 31%, rgba(255,255,255,0) 80%), url('https://www.themoviedb.org/t/p/w500${movie.backdrop_path}')`);
    // jQuery element is always an array, so destructuring to get html element - hammer cant use jQuery object
    initHammer(...child);
    movielist.pop();
}

initialCards().then(() => console.log(movielist));
