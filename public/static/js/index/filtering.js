const filters = {
    media_types: {movie: true, tv: true},
    genres: [],
    watchProviders: [],
    sortBy: 'default'
}

// have all filter options be in a form, and on save / submit use FormData API to get object from form fields
// maybe better to separate the visual feedback and setting filter values

const initGenres = (distinctGenres, movieGenres, tvGenres) => {
    $('.genrelist').append(`<label class="active" for="allGenres">All</label><input type="checkbox" id="allGenres" data-name="allGenres" name="genres" value="all" checked hidden>`);
    // make two arrays with keys from genres to check against
    console.log('movie', movieGenres, 'tv', tvGenres);
    const movieGenreKeys = movieGenres.map(value => {
        return value.id
    });
    const tvGenreKeys = tvGenres.map(value => {
        return value.id
    });
    
    distinctGenres.forEach((value, index) => {
        if (movieGenreKeys.includes(value.id) && tvGenreKeys.includes(value.id)) {
            $('.genrelist').append(`<label for="${value.id}">${value.name}</label><input id="${value.id}" type="checkbox" data-name="${value.name}" name="genres" value="${value.id}" data-type="movie+tv" hidden>`);
        } else if (!(movieGenreKeys.includes(value.id))) {
            $('.genrelist').append(`<label for="${value.id}" data-type="tv">${value.name}</label><input id="${value.id}" type="checkbox" data-name="${value.name}" name="genres" value="${value.id}" data-type="tv" hidden>`);
        } else {
            $('.genrelist').append(`<label for="${value.id}" data-type="movie">${value.name}</label><input id="${value.id}" type="checkbox" data-name="${value.name}" name="genres" value="${value.id}" data-type="movie" hidden>`);
        }
    });
}

( async function initFilters () {
    const movieGenres = await ItemFetch.genres('movie');
    const tvGenres = await ItemFetch.genres('tv');
    initGenres([...movieGenres.genres, ...tvGenres.genres], movieGenres.genres, tvGenres.genres);
    initGenreBtnClickHandler();
})();

$('#filtersForm').on('submit', async(event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    const formJSON = Object.fromEntries(data.entries());
    console.log(formJSON);
    formJSON.media = data.getAll('media');
    formJSON.genres = data.getAll('genres');
    console.log(formJSON);
    //await CardManager.updateCardsWithFilters();
    $('#filters').hide();
    $('body').toggleClass('noscroll');
});

const initGenreBtnClickHandler = () => {
    $('.genrelist label').on('click', (event) => {
        event.preventDefault();
        const label = event.target;
        const input = event.target.control;
        // if pressing 'all'
        $(label).toggleClass('active');
        input.toggleAttribute('checked');
    }); 
}

$('.media label').on('click', (event) => {
    event.preventDefault();
    if ($(event.target).siblings().hasClass('active')) {
        $(event.target).toggleClass('active');
        event.target.control.toggleAttribute('checked'); 
        // disable genres that are unique to the media type
        $(`input[data-type=${event.target.htmlFor}`).prop('disabled', (i, v) => { return !v; });
        $(`label[data-type=${event.target.htmlFor}]`).toggleClass('disabled');
    }   
});

$('#filterBtn').on('click', () => {
    updateFilters();
    $('body').toggleClass('noscroll');
    $('#filters').show();
});

$('#closeFilterBtn').on('click', () => {
    $('body').toggleClass('noscroll');
    $('#filters').hide();
});