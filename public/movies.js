let page = 1;
let movielist = new Array();

const fetchmovies = async(page) => {
    const response = await fetch('http://localhost:8080/movie/popular/' + page);
    const result = await response.json();
    return result;
}

const buildCards = async (cards) => {
    // backdrop
    // title, overview
    // avg vote, imdb?
    // hidden id
    // genres maybe
    // release date / year
    // provider logos
    // playtime
    const data = await cards;
    data.forEach((movie, index) => {
        let child = $('<div class="child"></div>');
        child.append(`<h1>${movie.title}</h1>`);
        $('.wrapper').append(child);
        child.css('background-image', `url('https://www.themoviedb.org/t/p/w500${movie.backdrop_path}')`);
    });
    insertCards();
}

buildCards(fetchmovies(page));
