
const filters = {
    page: 1,
    media_types: {movie: true, tv: true},
    genres: { movie: {}, tv: {} },
    watchProviders: [],
    sortBy: 'default'
}

const fetchGenres = async (media_type) => {
    const genres = await fetch(`/genre/${media_type}`);
    return genres.json();
}

const initGenres = (list) => {
    list.forEach(({genres, type}) => {
        genres.forEach((value, index) => {
            const name = value.name;
            const genre = {
                id: value.id,
                enabled: true
            }
            filters.genres[type][name] = genre;
        });
    });
    const distinctGenres = {...filters.genres.movie, ...filters.genres.tv};
    Object.entries(distinctGenres).forEach(value => {
        $('.genres').append(`<button>${value[0]}</button>`);
    });
}

const initFilters = async() => {
    const movieGenres = await fetchGenres('movie');
    const tvGenres = await fetchGenres('tv');
    initGenres([{genres: movieGenres.genres, type: 'movie'}, {genres: tvGenres.genres, type: 'tv'}]);
}

const displayFilters = () => {
    Object.entries(filters.media_types).forEach(([key, value]) => {
        if (value) {
            $(`#${key}`).addClass('active');
        } else {
            $(`#${key}`).removeClass('active');
        }
    });
    
}

$('.media button').on('click', ({target}) => {
    if ($(target).siblings().hasClass('active')) {
        filters.media_types[target.id] = !filters.media_types[target.id];
        displayFilters();
    }
});

$('#filterBtn').on('click', () => {
    displayFilters();
    $('body').toggleClass('noscroll');
    $('#filters').show();
});

$('#closeFilterBtn').on('click', () => {
    $('body').toggleClass('noscroll');
    $('#filters').hide();
});

initFilters().catch(error => console.error(error));