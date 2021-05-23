let moviePage = 1;
let tvPage = 1;
let movielist = new Array();
let tvList = new Array();
let popularMoviesAndTv = new Array();
const img_url = 'https://image.tmdb.org/t/p/';
let cards = $('#cards');

const fetchInitialItems = async() => {
    const response = await fetch(`/items/initial`);
    const result = await response.json();
    return result;
}

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

const fetchDetails = async (item) => {
    const response = await fetch(`/${item.media_type}/${item.id}/details`);
    const result = await response.json();
    return result;
}

const addCardToMatches = async (item) => {
    const element = await fetchDetails(item);
    let card = (element.media_type == 'movie') ? buildMovieCard(element) : buildTvCard(element);
    card.css('position', 'relative');
    card.attr('id', `match-${item.id}`);
    console.log('Match card:', card);
    $('#match').prepend(card);
}

// card is built and added to card container div
const addCard = async () => {
    console.log(popularMoviesAndTv.length);
    if (popularMoviesAndTv.length == 0) {
        console.log('list is empty', popularMoviesAndTv.length);
        moviePage++;
        await fetchPopularMovies(moviePage);
        tvPage++;
        await fetchPopularTv(tvPage);
        combinePopularMoviesAndTv();
    }
    let element = popularMoviesAndTv[0];
    if (element.status == 'Planned') {
        popularMoviesAndTv.shift();
        element = popularMoviesAndTv[0];
    }
    let card = (element.media_type == 'movie') ? buildMovieCard(element) : buildTvCard(element);
    const buttons = buildButtons(element.id);

    card.append(buttons);
    cards.prepend(card);
    
    // destructuring jQuery element, since Hammer dont work with them by default.
    initHammer(...card);
    popularMoviesAndTv.shift();
}

// building movie card div with jQuery
const buildMovieCard = (movie) => {
    let child = $(`<div id="${movie.id}" data-type="movie" class="child-wrapper child"></div>`);
    let top = $(`<div class="child-card-top"></div>`);
    let middleDiv = $(`<div class="child-card-info"></div>`);
    
    const trailer = buildTrailer(movie);
    const providers = buildProviderLogos(movie);
    const title = movie.title || 'No title';
    const release = movie.release_date.split('-')[0];
    const genres = buildGenres(movie.genres);
    const runtime = convertTime(movie.runtime);
    const overview = $(`<div class="child-card-overview">${movie.overview}</div>`);

    top.append(trailer);
    top.append(providers);

    middleDiv.append(`<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"/>`);
    
    if (movie.vote_average) {
        middleDiv.append(`<a><i class="fas fa-star"></i> ${movie.vote_average} <small>/ 10</small></a>`);
    }
    if (release) {
        middleDiv.append(`<a>${release}</a>`);
    }
    if (runtime) {
        middleDiv.append(`<a>${runtime}</a>`);
    }
        
    middleDiv.append(genres);
    
    child.append(top);
    child.append(`<div><h2>${title}</h2></div>`);
    child.append(middleDiv);
    child.append(overview);

    if (!movie.backdrop_path) { console.log('nobackdrop', movie); }

    if (movie.backdrop_path) {
        child.css({'background-image': `linear-gradient(1deg, rgba(62,54,54,0.98) 31%, rgba(255,255,255,0) 80%), url('${img_url}original${movie.backdrop_path}')`, 'background-size': 'cover'});
    }
    
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
            trailerLink.html('<i class="fas fa-play"></i> Trailer');
            trailerLink.attr('href', `https://youtu.be/${trailer.key}`);
        }
    }
    return trailerLink;
}

const buildGenres = (genres) => {
    let genresDiv = $(`<div></div>`);
    if (genres) {
        genresDiv.append(`<a>${genres[0].name}</a>`);
    }
    if (genres.length > 1) {
        genresDiv.append(`<a>, ${genres[1].name}</a>`);
    }
    return genresDiv;
}

// building tv card div with jQuery 
const buildTvCard = (tv) => {
    let child = $(`<div id="${tv.id}" data-type="tv" class="child grid"></div>`);
    let top = $(`<div class="child-card-top"></div>`);
    let middleDiv = $(`<div class="child-card-info"></div>`);
    
    const trailer = buildTrailer(tv);
    const providers = buildProviderLogos(tv);
    const name = tv.name || 'No name';
    let first_aired = `${tv.first_air_date.split('-')[0]}`;
    if (tv.status == 'Ended') { 
        first_aired += ` - ${tv.last_air_date.split('-')[0]}`; 
    } else {
        first_aired += ' - Present';
    }
    const genres = buildGenres(tv.genres);
    const seasons = tv.number_of_seasons;
    const episodes = tv.number_of_episodes;
    const episodesOrSeasons = seasons > 1 ? seasons + ' Seasons' : episodes + ' Episodes';
    const overview = $(`<div class="child-card-overview">${tv.overview}</div>`);

    top.append(trailer);
    top.append(providers);
    
    middleDiv.append(`<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"/>`);
    
    if (tv.vote_average) {
        middleDiv.append(`<a><i class="fas fa-star"></i> ${tv.vote_average} <small>/ 10</small></a>`);
    }
    if (first_aired) {
        middleDiv.append(`<a>${first_aired}</a>`);
    }

    middleDiv.append(genres);

    middleDiv.append(`<a>${episodesOrSeasons}</a>`)
        
    child.append(top);
    child.append(`<div><h2>${name}</h2></div>`);
    child.append(middleDiv);
    child.append(overview);

    if (!tv.backdrop_path) { console.log('nobackdrop', tv); }

    if (tv.backdrop_path) {
        child.css({'background-image': `linear-gradient(1deg, rgba(62,54,54,0.98) 31%, rgba(255,255,255,0) 80%), url('${img_url}original${tv.backdrop_path}')`, 'background-size': 'cover'});
    }
    
    return child;
}

const buildButtons = (id) => {
    let btnDiv = $(`<div class="child-card-buttons"></div>`);
    const dislikebtn = $(`<a id="dislikeBtn">👎</a>`);
    btnDiv.append(dislikebtn);
    const likebtn = $(`<a id="likeBtn">👍</a>`);
    btnDiv.append(likebtn);

    btnDiv.map((index, element) => {
        const btnHammer = new Hammer(element);
        btnHammer.on('tap pressup', (ev) => {
            const parent = $(`#${id}`);
            if (ev.target.id == 'dislikeBtn') {
                parent.css('transition', 'all .4s ease-in-out');
                parent.css('transform', 'translate3d(-2000px, 0, 0)');
            } else {
                parent.css('transition', 'all .4s ease-in-out');
                parent.css('transform', 'translate3d(2000px, 0, 0)');
                clientLikedItem(parent.attr('id'), parent.attr('data-type'));
            }
            swipedElements.push(parent);
            addCard();
        });
    });

    return btnDiv;
}

const getDistrinctProviders = (item, country = 'DK') => {
    const watchProviders = item['watch/providers'].results[country];
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

const buildProviderLogos = (item) => {
    let providers = $('<div class="child-card-info"></div>');
    const logopaths = getDistrinctProviders(item);
    if (logopaths) {
        logopaths.forEach((value, index) => {
            providers.append(`<img width="30px" src="${img_url}original${value}">`);
        });
    }
    return providers;
}

const initCards = async () => {
    const initialItems = await fetchInitialItems();
    popularMoviesAndTv = [...initialItems];
    for (let i = 0; i < 10; i++) {
        await addCard();
    }
}

initCards().then(() => console.log('cards initialized'));


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