const Filtering = (() => {
    let filters = {
        /* media_types: [],
        genres: [],
        watchProviders: [],
        watch_monetization_types: '',
        watch_region: 'DK',
        sortBy: ,
        release_date_gte: 'date',
        release_date_lte: 'date',
        vote_average_gte: 0,
        vote_average_lte: 0,
        runtime_gte: 0,
        runtime_lte: 0 */
    }

    const getFilters = () => {
        return filters;
    }

    const initGenres = (distinctGenres, movieGenres, tvGenres) => {
        // maybe insert some element that acts as a 'reset btn' for the checkboxes.
        //$('.genrelist').append(`<label class="active" for="allGenres">All</label><input type="checkbox" id="allGenres" data-name="allGenres" name="genres" value="[]" checked hidden>`);
    
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
                $('.genrelist').append(`<label for="${value.id}" data-type="tv">${value.name}</label><input id="${value.id}" type="checkbox" data-name="${value.name}" name="tv_genres" value="${value.id}" data-type="tv" hidden>`);
            } else {
                $('.genrelist').append(`<label for="${value.id}" data-type="movie">${value.name}</label><input id="${value.id}" type="checkbox" data-name="${value.name}" name="movie_genres" value="${value.id}" data-type="movie" hidden>`);
            }
        });
    }
    
    (async function initFilters () {
        const movieGenres = await ItemFetch.genres('movie');
        const tvGenres = await ItemFetch.genres('tv');
        initGenres([...movieGenres.genres, ...tvGenres.genres], movieGenres.genres, tvGenres.genres);
        initGenreBtnClickHandler();
    })();

    $('#filtersForm').on('submit', async(event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const filter = Object.fromEntries(data.entries());
        filter.media = data.getAll('media');
        filter.movie_genres = data.getAll('movie_genres');
        filter.tv_genres = data.getAll('tv_genres');
        filter.genres = data.getAll('genres');
        filters = {...filters, ...filter};
        // show some kind of spinner / progress when fetching filtered data
        await CardManager.updateCardsWithFilters(filters);
        $('#filters').hide();
        $('body').toggleClass('noscroll');
    });

    const initGenreBtnClickHandler = () => {
        $('.genrelist label').on('click', (event) => {
            event.preventDefault();
            const label = event.target;
            const input = event.target.control;
            if (!$(input).attr('disabled')) {
                $(label).toggleClass('active');
                input.toggleAttribute('checked');
            }
        }); 
    }

    $('.media label').on('click', (event) => {
        event.preventDefault();
        if ($(event.target).siblings().hasClass('active')) {
            $(event.target).toggleClass('active');
            event.target.control.toggleAttribute('checked'); 
            // disable genres that are unique to the media type
            $(`input[data-type=${event.target.htmlFor}]`).removeAttr('checked');
            $(`input[data-type=${event.target.htmlFor}]`).prop('disabled', (i, v) => { return !v; });
            $(`label[data-type=${event.target.htmlFor}]`).toggleClass('disabled').removeClass('active');
        }
    });
    
    $('#filterBtn').on('click', () => {
        $('body').toggleClass('noscroll');
        $('#filters').show();
    });
    
    $('#closeFilterBtn').on('click', () => {
        $('body').toggleClass('noscroll');
        $('#filters').hide();
    });

    return { getFilters }

})();