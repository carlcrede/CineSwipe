const filters = {
    media_types: {movie: true, tv: true},
    genres: { movie: {}, tv: {} },
    watchProviders: [],
    sortBy: 'default'
}

const initGenres = (list) => {
    list.forEach(({genres, type}) => {
        genres.forEach((value, index) => {
            const name = value.name;
            const genre = {
                id: value.id,
                enabled: false,
                type: type
            }
            filters.genres[type][name] = genre;
        });
    });
    const distinctGenres = {...filters.genres.movie, ...filters.genres.tv};
    Object.entries(distinctGenres).forEach(value => {
        $('.genres').append(`<button class="" id="${value[1].id}" data-name="${value[0]}">${value[0]}</button>`);
    });
}

( async function initFilters () {
    const movieGenres = await ItemFetch.genres('movie');
    const tvGenres = await ItemFetch.genres('tv');
    initGenres([{genres: movieGenres.genres, type: 'movie'}, {genres: tvGenres.genres, type: 'tv'}]);
    initGenreBtnClickHandler();
})();

const updateMediaTypes = () => {
    Object.entries(filters.media_types).forEach(([key, value]) => {
        if (value) {
            $(`#${key}`).addClass('active');
        } else {
            $(`#${key}`).removeClass('active');
        }
    });
}

const updateGenres = (media = 'movie+tv') => {
    //const movieOrTvGenres = (filters.media_types.movie) ? filters.genres.movie : filters.genres.tv;
    Object.entries(filters.genres).forEach(([key, value]) => {
        Object.entries(value).forEach(([key, value]) => {
            if (value.enabled) {
                $(`#${value.id}`).addClass('active');
            } else {
                $(`#${value.id}`).removeClass('active');
            }
        });
    });
}

const updateFilters = () => {
    updateMediaTypes();
    updateGenres();
}

$('#saveBtn').on('click', async() => {
    await CardManager.updateCardsWithFilters();
    $('#filters').hide();
    $('body').toggleClass('noscroll');
});

const initGenreBtnClickHandler = () => {
    $('.genres button').on('click', ({target}) => {
        const type = target.dataset.type;
        const name = target.dataset.name;
        /* if ($(target).siblings().hasClass('active')) {
            if (type == 'movie+tv') {
                filters.genres.movie[name].enabled = !filters.genres.movie[name].enabled;
                filters.genres.tv[name].enabled = !filters.genres.tv[name].enabled;
            } else if (type == 'movie') {
                filters.genres.movie[name].enabled = !filters.genres.movie[name].enabled;
            } else {
                filters.genres.tv[name].enabled = !filters.genres.tv[name].enabled;
            }
            updateGenres();
        } */
        console.table('filters:', filters.genres);
    }); 
}


$('.media button').on('click', ({target}) => {
    if ($(target).siblings().hasClass('active')) {
        filters.media_types[target.id] = !filters.media_types[target.id];
        
        /* $('.genres').children().map((index, element) => {
            const type = target.id;
            const type2 = (type == 'movie') ? 'tv' : 'movie';
            const genreName = element.dataset.name;

            if (filters.genres[type][genreName] && !filters.genres[type2][genreName]) {
                element.classList.remove('active');
                element.setAttribute('disabled', true);
            }
        }); */
        
        
        updateFilters();
    }
    //console.table('filters:', filters.genres);
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