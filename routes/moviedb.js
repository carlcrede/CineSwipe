const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

const fetch = require('node-fetch');

const router = require('express').Router();

const fetchMovies = async (options) => {
    try {
        const moviesResponse = await moviedb.discoverMovie(options);
        const moviesList = await Promise.all(moviesResponse.results.map(async (result) => {
            const movieDetails = await moviedb.movieInfo({ id: result.id, append_to_response: 'watch/providers,videos'});
            movieDetails['media_type'] = 'movie';
            return movieDetails;
        }));
        return moviesList;
    } catch (error) {
        console.error(error);
    }
}

const fetchTv = async (options) => {
    try {
        const tvResponse = await moviedb.discoverTv(options);
        const tvList = await Promise.all(tvResponse.results.map(async (result) => {
            const tvDetails = await moviedb.tvInfo({ id: result.id, append_to_response: 'watch/providers,videos'});
            tvDetails['media_type'] = 'tv';
            return tvDetails;
        }));
        return tvList;
    } catch (error) {
        console.error(error);
    }
}

const fetchProviders = async (watch_region) => {
    const base_url = 'https://api.themoviedb.org/3/watch/providers';
    const query = `?api_key=${process.env.MOVIEDB_API_KEY}&language=en-US&watch_region=${watch_region}`;
    try {
        const [movieProvidersResponse, tvProvidersResponse] = await Promise.all([fetch(`${base_url}/movie${query}`), fetch(`${base_url}/tv${query}`)]);
        const [ movieProviders, tvProviders ] = await Promise.all([movieProvidersResponse.json(), tvProvidersResponse.json()]);
        return {movieProviders, tvProviders};
    } catch (error) {
        console.error(error);
    }
};

const itemDetails = async (id, media_type) => {
    let details;
    if (media_type == 'movie') {
        details = await moviedb.movieInfo({ id: id, append_to_response: 'watch/providers,videos' });
        details['media_type'] = 'movie';
    } else {
        details = await moviedb.tvInfo({ id: id, append_to_response: 'watch/providers,videos' });
        details['media_type'] = 'tv';
    }
    return details;
}

const buildFilterOptions = (page, filter = {}) => {
    const { 
        movie_genres = [], 
        tv_genres = [], 
        genres = [], 
        providers = [], 
        tv_providers = [], 
        movie_providers = [],
        watch_region = '',
        watch_monetization_types = []
    } = filter;
    const movieOptions = { 
        page: page, 
        with_genres: [...movie_genres, ...genres].join('|'),
        with_watch_providers: [...movie_providers, ...providers].join('|'),
        watch_region: watch_region,
        with_watch_monetization_types: watch_monetization_types.join('|')
    };
    const tvOptions = {
        page: page, 
        with_genres: [...tv_genres, ...genres].join('|'),
        with_watch_providers: [...tv_providers, ...providers].join('|'),
        watch_region: watch_region,
        with_watch_monetization_types: watch_monetization_types.join('|')
    };
    return { movieOptions, tvOptions };
}

const sortByPopularity = async (items) => {
    items.sort((a, b) => b.popularity - a.popularity);
    return items;
};

let cache = {
    initialitems: {},
};

const fetchInitialItems = async (watch_region) => {
    let { movieProviders, tvProviders } = await fetchProviders(watch_region);
    movieProviders = movieProviders.results.map(value => value.provider_id);
    tvProviders = tvProviders.results.map(value => value.provider_id);

    const { movieOptions, tvOptions } = buildFilterOptions(1, {watch_region: watch_region, movie_providers: movieProviders, tv_providers: tvProviders});
    const movies = await fetchMovies(movieOptions);
    const tv = await fetchTv(tvOptions);
    const data = await sortByPopularity([...movies, ...tv]);
    return data;
};

const cacheResponse = (watch_region, data) => {
    console.log(`cached ${watch_region}`, new Date);
    cache.initialitems[watch_region] = {
        time: Date.now(),
        data: data
    }
}

cacheResponse('DK', fetchInitialItems('DK'));

router.get('/items/initial/:watch_region', async (req, res, next) => {
    const watch_region = req.params.watch_region;
    try {
        if(!cache.initialitems[watch_region] || Date.now() - cache.initialitems[watch_region].time > 60 * 1000){
            cacheResponse(watch_region, fetchInitialItems(watch_region));
        };
        res.send(await cache.initialitems[watch_region].data);
    } catch (error) {
        console.error(error);
        next();
    }
});

router.get('/items/:page', async (req, res, next) => {
    const filter = req.query;
    const page = req.params.page;
    const { movieOptions, tvOptions } = buildFilterOptions(page, filter);
    if (filter.media.length == 2) {
        const movies = await fetchMovies(movieOptions);
        const tv = await fetchTv(tvOptions);
        const data = await sortByPopularity([...movies, ...tv])
        res.send(data);
    } else if (filter.media[0] == 'movie') {
        const movies = await fetchMovies(movieOptions);
        res.send(movies);
    } else {
        const tv = await fetchTv(tvOptions);
        res.send(tv);
    }
});

router.get('/:media_type/:id/details', async (req, res, next) => {
    const id = req.params.id;
    const media_type = req.params.media_type;
    const item = await itemDetails(id, media_type);
    res.send(item);
});

router.get('/genres/:media_type', async (req, res, next) => {
    const media_type = req.params.media_type;
    try {
        const genres = (media_type == 'movie') ? await moviedb.genreMovieList() : await moviedb.genreTvList();
        res.send(genres);
    } catch (error) {
        console.error(error);
        next();
    }

});

router.get('/providers', async (req, res, next) => {
    const { watch_region } = req.query;
    try{
        const { movieProviders, tvProviders } = await fetchProviders(watch_region);
        res.send({movieProviders, tvProviders});
    } catch (error) {
        console.error(error);
        next();
    }
});

module.exports = {
    router
}