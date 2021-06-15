const Filtering = (() => {
    let filters = {
        page: 1,
        media: ['movie', 'tv'],
        watch_monetization_types: [],
        watch_region: 'DK',
        sort_by: 'vote_count.desc',
    }

    let localProviders = {};

    const img_url = 'https://image.tmdb.org/t/p/original';

    const getFilters = () => {
        return filters;
    }

    const setFilters = (changes) => {
        filters = { ...filters, ...changes};
    }

    const paginate = () => {
        filters.page++;
    }

    const initGenres = (distinctGenres, movieGenres, tvGenres) => {
        $('#genrelist').append('<div id="allGenres" class="all active">All</div>');
        
        const movieGenreKeys = movieGenres.map(value => {
            return value.id
        });
        const tvGenreKeys = tvGenres.map(value => {
            return value.id
        });
        
        distinctGenres.forEach((value, index) => {
            if (movieGenreKeys.includes(value.id) && tvGenreKeys.includes(value.id)) {
                $('#genrelist').append(`<label for="${value.id}">${value.name}</label><input id="${value.id}" type="checkbox" data-name="${value.name}" name="genres" value="${value.id}" data-type="movie+tv" hidden>`);
            } else if (!(movieGenreKeys.includes(value.id))) {
                $('#genrelist').append(`<label for="${value.id}" data-type="tv">${value.name}</label><input id="${value.id}" type="checkbox" data-name="${value.name}" name="tv_genres" value="${value.id}" data-type="tv" hidden>`);
            } else {
                $('#genrelist').append(`<label for="${value.id}" data-type="movie">${value.name}</label><input id="${value.id}" type="checkbox" data-name="${value.name}" name="movie_genres" value="${value.id}" data-type="movie" hidden>`);
            }
        });
    }

    const initProviders = (distinctProviders, movieProviders, tvProviders) => {
        $('#providerlist').append('<div id="allProviders" class="all active">All</div>');

        const movieProviderKeys = movieProviders.map(value => value.provider_id);
        const tvProviderKeys = tvProviders.map(value => value.provider_id);

        filters.movie_providers = movieProviderKeys;
        filters.tv_providers = tvProviderKeys;

        localProviders = { movie_providers: movieProviderKeys, tv_providers: tvProviderKeys };

        distinctProviders.forEach(({provider_id, provider_name, logo_path}, index) => {
            if (movieProviderKeys.includes(provider_id) && tvProviderKeys.includes(provider_id)) {
                $('#providerlist').append(
                    `<label for="${provider_id}"><img width="30px" loading="lazy" src="${img_url}${logo_path}">${provider_name}</label>
                    <input id="${provider_id}" type="checkbox" data-name="${provider_name}" name="providers" value="${provider_id}" data-type="movie+tv" hidden>`
                );
            } else if (!(movieProviderKeys.includes(provider_id))) {
                $('#providerlist').append(
                    `<label for="${provider_id}" data-type="tv"><img width="30px" loading="lazy" src="${img_url}${logo_path}">${provider_name}</label>
                    <input id="${provider_id}" type="checkbox" data-name="${provider_name}" name="tv_providers" value="${provider_id}" data-type="tv" hidden>`
                );
            } else {
                $('#providerlist').append(
                    `<label for="${provider_id}" data-type="movie"><img width="30px" loading="lazy" src="${img_url}${logo_path}">${provider_name}</label>
                    <input id="${provider_id}" type="checkbox" data-name="${provider_name}" name="movie_providers" value="${provider_id}" data-type="movie" hidden>`
                );
            }
        });
    }

    const getDistinctGenres = (movieGenres, tvGenres) => {
        const seen = new Set();
        const genres = [...movieGenres, ...tvGenres].filter(el => {
            const duplicate = seen.has(el.id);
            seen.add(el.id);
            return !duplicate;
        });
        return genres;
    }

    const getDistinctProviders = (movieProviders, tvProviders) => {
        const seen = new Set();
        const genres = [...movieProviders, ...tvProviders].filter(el => {
            const duplicate = seen.has(el.provider_id);
            seen.add(el.provider_id);
            return !duplicate;
        });
        return genres;
    }
    
    const initFilters = async () => {
        
        const { countryCode } = await ItemFetch.fetchIpData();
        setFilters({watch_region: countryCode});
        
        const movieGenres = await ItemFetch.fetchGenres('movie');
        const tvGenres = await ItemFetch.fetchGenres('tv');
        const distinctGenres = getDistinctGenres(movieGenres.genres, tvGenres.genres);
        initGenres(distinctGenres, movieGenres.genres, tvGenres.genres);
        
        const {movieProviders, tvProviders} = await ItemFetch.fetchProviders(filters.watch_region);
        const distinctProviders = getDistinctProviders(movieProviders.results, tvProviders.results);
        initProviders(distinctProviders, movieProviders.results, tvProviders.results);
        
        initFilterClickHandlers();
        
    };

    const addFilterFormSubmitListener = async () => {
        $('#filtersForm').on('submit', async(event) => {
            event.preventDefault();
            disablePointerEvents(true);
            showLoading(true);
            const data = new FormData(event.target);
            const filter = Object.fromEntries(data.entries());
            filter.media = data.getAll('media');
            filter.movie_genres = data.getAll('movie_genres');
            filter.tv_genres = data.getAll('tv_genres');
            filter.genres = data.getAll('genres');
            filter.sort_by = data.get('sort_by');
            filters = {...filters, ...filter};
            filters.page = 1;
            await CardManager.updateCardsWithFilters(filters);
            $('#filtersModal').hide();
            $('#contentFilters').hide();
            showLoading(false);
            Socket.clientUpdatedFilters(filters, document.getElementById('filtersModal').innerHTML);
            $('body').toggleClass('noscroll');
        });
    }

    const addProviderFormSubmitListener = async () => {
        $('#providersForm').on('submit', async(event) => {
            event.preventDefault();
            disablePointerEvents(true);
            showLoading(true);
            const data = new FormData(event.target);
            if(!$('#allProviders').hasClass('active')){
                const newfilters = Object.fromEntries(data.entries());
                newfilters.tv_providers = data.getAll('tv_providers');
                newfilters.providers = data.getAll('providers');
                newfilters.movie_providers = data.getAll('movie_providers');
                filters = {...filters, ...newfilters};
            } else {
                filters = {...filters, ...localProviders};
            };
            filters.watch_monetization_types = data.getAll('monetization');
            filters.page = 1;
            await CardManager.updateCardsWithFilters(filters);
            $('#filtersModal').hide();
            $('#providerFilters').hide();
            showLoading(false);
            Socket.clientUpdatedFilters(filters, document.getElementById('filtersModal').innerHTML);
            $('body').toggleClass('noscroll');
        });
    }

    const showLoading = (enabled) => {
        if(enabled){
            $('.saveBtn').text('');
            $('.saveBtn').append('<img class="spinner" src="/img/spinner.svg">');
        } else {
            $('.saveBtn').text('Save');
        }
        $('.spinner').toggleClass('enabled', enabled);
    };

    const initFilterClickHandlers = () => {
        addFilterCloseBtnListener();
        addMediaListener();
        addFormInputListeners();
        addFilterFormSubmitListener();
        addProviderFormSubmitListener();

        $('#sort_by').change(({target}) => {
            const options = target.options;
            options[0].defaultSelected = false;
            options[1].defaultSelected = false;
            options[2].defaultSelected = false;
            options[3].defaultSelected = false;
            
            options[target.selectedIndex].defaultSelected = true;
            options.selectedIndex = options.selectedIndex;
        });
    };

    const disablePointerEvents = (bool) => {
        $('#closeFilterBtn').toggleClass('no-click', bool);
        $('#contentFilters').toggleClass('no-click', bool);
        $('#providerFilters').toggleClass('no-click', bool);
    }

    const addMediaListener = async() => {
        $('#media label').on('click', (event) => {
            event.preventDefault();
            if ($(event.target).siblings().hasClass('active')) {
                $(event.target).toggleClass('active');
                event.target.control.toggleAttribute('checked'); 
                // disable genres that are unique to the media type
                $(`input[data-type=${event.target.htmlFor}]`).removeAttr('checked');
                $(`input[data-type=${event.target.htmlFor}]`).prop('disabled', (i, v) => { return !v; });
                $(`label[data-type=${event.target.htmlFor}]`).toggleClass('disabled').removeClass('active');
            };
        });
    };

    const addFormInputListeners = async () => {
        const ids = [{label: 'genrelist', all: 'allGenres'}, {label: 'providerlist', all: 'allProviders'}, {label: 'monetizationlist'}]
        ids.forEach(({label, all}, index) => {
            $(`#${label} label`).on('click', (event) => {
                event.preventDefault();
                const label = event.target;
                const input = event.target.control;
                if (!$(input).attr('disabled')) {
                    if (!$(label).siblings().hasClass('active')) {
                        $(`#${all}`).toggleClass('active', true);
                    } else {
                        $(`#${all}`).toggleClass('active', false);
                    }
                    $(label).toggleClass('active');
                    input.toggleAttribute('checked');
                };
            });
            $(`#${all}`).on('click', (event) => {
                const btn = $(event.target);
                const isEnabled = btn.hasClass('active');
                const labels = $(`#${label} label`);
                const inputs = $(`#${label} input`);
                if (!isEnabled) {
                    btn.addClass('active');
                    labels.removeClass('active');
                    inputs.removeAttr('checked');
                };
            });
        });
    }
    
    $('#contentFilterBtn').on('click', () => {
        disablePointerEvents(false);
        $('body').toggleClass('noscroll');
        $('#contentFilters').show();
        $('#filtersModal').show();
    });

    $('#providerFilterBtn').on('click', () => {
        disablePointerEvents(false);
        $('body').toggleClass('noscroll');
        $('#providerFilters').show();
        $('#filtersModal').show();
    });
    
    const addFilterCloseBtnListener = async() => {
        $('#closeFilterBtn').on('click', () => {
            $('body').toggleClass('noscroll');
            $('.modal-content').hide();
            $('#filtersModal').hide();
        });
    };

    return { getFilters, setFilters, paginate, initFilterClickHandlers, initFilters };

})();