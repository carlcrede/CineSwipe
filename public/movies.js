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

// card is built and added to card container div
const addCard = async () => {
    if (popularMoviesAndTv.length == 0) {
        moviePage++;
        await fetchPopularMovies(moviePage);
        tvPage++;
        await fetchPopularTv(tvPage);
        combinePopularMoviesAndTv();
    }
    let element = popularMoviesAndTv[0];
    let card = (element.media_type == 'movie') ? buildMovieCard(element) : buildTvCard(element);
    
    $('.wrapper').prepend(card);

    // destructuring jQuery element, since Hammer dont work with them by default.
    initHammer(...card);
    popularMoviesAndTv.shift();
    console.log(element);
}

// building movie card div with jQuery
const buildMovieCard = (movie) => {
    let child = $(`<div id="${movie.id}" class="child-wrapper child"></div>`);
    
    let top = $(`<div class="child-card-top"></div>`);
    const trailer = buildTrailer(movie);
    top.append(trailer);

    const logopaths = getDistrinctProviders(movie);
    let providers = buildProviderLogos(logopaths);
    top.append(providers);
    child.append(top);

    // adding title
    child.append(
        `<div>
            <h2>${movie.title}</h2>
        </div>`);

    // release date
    const release = movie.release_date.split('-')[0];

    // genres
    const genres = buildGenres(movie.genres);

    // runtime
    const runtime = convertTime(movie.runtime);

    let middleDiv = $(`<div class="child-card-info"></div>`);
    
    middleDiv.append(
        `<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"/>
        <a><i class="fas fa-star"></i> ${movie.vote_average} <small>/ 10</small></a>
        <a>${release}</a>
        <a>${runtime}</a>`);
    
    middleDiv.append(genres);
    
    child.append(middleDiv);

    child.append(`<div class="child-card-overview"><p>${movie.overview}</p></div>`);

    child.css('background-image', `linear-gradient(1deg, rgba(62,54,54,0.9419117988992471) 31%, rgba(255,255,255,0) 80%), url('${img_url}original${movie.backdrop_path}')`);
    return child;
}

const convertTime = time => {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return `${hours} h ${minutes} min`;
}

const buildTrailer = (item) => {
    let trailerLink = $(`<a target="_blank"></a>`);
    let trailer;
    if (item.videos.results.length > 0) {
        trailer = item.videos.results.find((item) => {
            return item.site == 'YouTube' && item.type == 'Trailer';
        });
        if (trailer) {
            trailerLink.html('<i class="fas fa-play"></i>Trailer');
            trailerLink.attr('href', `https://youtu.be/${trailer.key}`);
        }
    }
    return trailerLink;
}

const buildGenres = (genres) => {
    let genresDiv = $(`<div></div>`);
    genresDiv.append(`<a>${genres[0].name}</a>`);
    if (genres.length > 1) {
        genresDiv.append(`<a>, ${genres[1].name}</a>`);
    }
    return genresDiv;
}

// building tv card div with jQuery 
const buildTvCard = (tv) => {
    let child = $(`<div id="${tv.id}" class="child grid"></div>`);

    let top = $(`<div class="child-card-top"></div>`);
    const trailer = buildTrailer(tv);
    top.append(trailer);

    const logopaths = getDistrinctProviders(tv);
    let providers = buildProviderLogos(logopaths);
    top.append(providers);
    child.append(top);

    // adding name
    child.append(
        `<div>
            <h2>${tv.name}</h2>
        </div>`);

    let middleDiv = $(`<div class="child-card-info"></div>`);

    // airdate
    let first_aired = `${tv.first_air_date.split('-')[0]}`;
    if (tv.status == 'Ended') { 
        first_aired += ` - ${tv.last_air_date.split('-')[0]}`; 
    } else {
        first_aired += ' - Present';
    }

    middleDiv.append(
        `<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"/>
        <a><i class="fas fa-star"></i> ${tv.vote_average} <small>/ 10</small></a>
        <a>${first_aired}</a>`);
    
    // adding genres
    const genres = buildGenres(tv.genres);
    middleDiv.append(genres);

    let seasons = tv.number_of_seasons;
    let episodes = tv.number_of_episodes;
    const episodesOrSeasons = seasons > 1 ? seasons + ' Seasons' : episodes + ' Episodes';
    middleDiv.append(`<a>${episodesOrSeasons}</a>`)
    
    child.append(middleDiv);

    child.append(`<div class="child-card-overview"><p>${tv.overview}</p></div>`);

    child.css('background-image', `linear-gradient(1deg, rgba(62,54,54,0.9419117988992471) 31%, rgba(255,255,255,0) 80%), url('${img_url}original${tv.backdrop_path}')`);
    return child;
}

const getDistrinctProviders = (object, country = 'DK') => {
    const watchProviders = object['watch/providers'].results[country];
    if (watchProviders) {
        delete watchProviders.link;
        let list = Object.values(watchProviders);
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
            providers.append(`<img width="30px" src="${img_url}original${value}">`);
        });
    }
    return providers;
}

const initialCards = async () => {
    await fetchPopularMovies(moviePage);
    await fetchPopularTv(tvPage);
    combinePopularMoviesAndTv();

    for (let i = 0; i < 10; i++) {
        await addCard();
    }
}

initialCards().then(() => console.log('cards initialized'));


// code from earlier, may be needed later
/* let movie = movielist[movielist.length-1];
    if (!movie) {
        page++;
        await fetchPopularMovies(page);
        movie = movielist[movielist.length-1];
    }

     let child = $(
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