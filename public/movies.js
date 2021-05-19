let moviePage = 1;
let tvPage = 1;
let movielist = new Array();
let tvList = new Array();
let popularMoviesAndTv = new Array();
const img_url = 'https://image.tmdb.org/t/p/';

const fetchPopularMovies = async(page) => {
    const response = await fetch(`/movie/popular/${page}`);
    const result = await response.json();
    movielist = [...result];
    return result;
}

const fetchPopularTv = async (page) => {
    const response = await fetch(`/tv/popular/${page}`);
    const result = await response.json();
    tvList = [...result];
    return result;
}

const combinePopularMoviesAndTv = () => { 
    let result = [...movielist, ...tvList];
    result.sort((a, b) => b.popularity - a.popularity);
    popularMoviesAndTv = [...result];
    return result;
}

// backdrop
// title, overview
// avg vote, imdb?
// hidden id
// genres maybe
// release date / year
// provider logos
// playtime

// card is built and added to card container div
const addCard = async () => {
    let element = popularMoviesAndTv[0];
    if (popularMoviesAndTv.length == 0) {
        moviePage++;
        await fetchPopularMovies(moviePage);
        tvPage++;
        await fetchPopularTv(tvPage);
        combinePopularMoviesAndTv();
        element = popularMoviesAndTv[0];
    }
    let card = (element.media_type == 'movie') ? await buildMovieCard(element) : await buildTvCard(element);
    
    $('.wrapper').prepend(card);

    // destructuring jQuery element, since Hammer dont work with them by default.
    initHammer(...card);
    popularMoviesAndTv.shift();

    

    /* let movie = movielist[movielist.length-1];
    if (!movie) {
        page++;
        await fetchPopularMovies(page);
        movie = movielist[movielist.length-1];
    } */

    /* let child = $(
        `<div id="${movie.id}" class="child grid"></div>`);
    
    let top = $(
        `<div class="child-card-top">
            <a>Trailer</a>
        </div>`);
    
    if (movie.Providers.results.DK.flatrate) {
        let dkProviders = movie.Providers.results.DK.flatrate;
        let providers = $('<div class="child-card-info"></div>');
        dkProviders.forEach((value, index) => {
            providers.append(`<img width="30px" src="https://image.tmdb.org/t/p/original${value.logo_path}">`);
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
    child.css('background-image', `linear-gradient(1deg, rgba(62,54,54,0.9419117988992471) 31%, rgba(255,255,255,0) 80%), url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')`);
    // jQuery element is always an array, so destructuring to get html element - hammer cant use jQuery object
    initHammer(...child);
    movielist.pop(); */
}

// building movie card div with jQuery
const buildMovieCard = (movie) => {
    let child = $(`<div id="${movie.id}" class="child grid"></div>`);
    let top = $(
        `<div class="child-card-top">
            <a>Trailer</a>
        </div>`);
    const logopaths = providers(movie);
    let providers = buildProviderLogos(logopaths);
    top.append(providers);
    child.append(top);

    child.css('background-image', `linear-gradient(1deg, rgba(62,54,54,0.9419117988992471) 31%, rgba(255,255,255,0) 80%), url('${img_url}original${movie.backdrop_path}')`);
    return child;
}

// building tv card div with jQuery 
const buildTvCard = async (tv) => {
    let child = $(`<div id="${tv.id}" class="child grid"></div>`);
    let top = $(
        `<div class="child-card-top">
            <a>Trailer</a>
        </div>`);
    const logopaths = providers(tv);
    let providers = buildProviderLogos(logopaths);
    top.append(providers);
    child.append(top);

    child.css('background-image', `linear-gradient(1deg, rgba(62,54,54,0.9419117988992471) 31%, rgba(255,255,255,0) 80%), url('${img_url}original${tv.backdrop_path}')`);
    return child;
}

const providers = (object, country = 'DK') => {
    let providers = object.watch_providers.results[country];
    if (providers) {
        delete providers.link;
        let list = Object.values(providers);
        let result = new Set();
        list.forEach(value => {
            value.forEach(val => {
                result.add(val.logo_path);
            });
        });
        return [...new Set(result)];
    };
}

const buildProviderLogos = (logopaths) => {
    let providers = $('<div class="child-card-info"></div>');
    if (logopaths) {
        logopaths.forEach((value, index) => {
            providers.append(`<img width="30px" src="${img_url}/original${value.logo_path}">`);
        });
    }
    return providers;
}

const initialCards = async () => {
   
    combinePopularMoviesAndTv();

    for (let i = 0; i < 10; i++) {
        await addCard();
    }
}

initialCards().then(() => console.log('initialcards called'));
//initialCards().then(() => console.log(popularMoviesAndTv));
