const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

const router = require('express').Router();

const fetchPopularMovies = async (page) => {
    try {
        const popularMovies = await moviedb.moviePopular({ page: page });
        const movies = await Promise.all(popularMovies.results.map(async (result) => {
            const details = await moviedb.movieInfo({ id: result.id, append_to_response: 'watch/providers,videos' });
            details['media_type'] = 'movie';
            return details;
        })); 
        return movies;
    } catch (error) {
        console.error(error);
    }
}

const fetchPopularTv = async (page) => {
    try {
        const popularTv = await moviedb.tvPopular({ page: page });
        const tv = await Promise.all(popularTv.results.map(async (result) => {
            const details = await moviedb.tvInfo({ id: result.id, append_to_response: 'watch/providers,videos' });
            details['media_type'] = 'tv';
            return details;
        }));
        return tv;
    } catch (error) {
        console.error(error);
    }
}

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

const sortByPopularity = async (items) => {
    items.sort((a, b) => b.popularity - a.popularity);
    return items;
};

let cache = {
    initialitems: undefined,
};


const fetchInitialItems = async () => {
    const popMovies = await fetchPopularMovies(1);
    const popTv = await fetchPopularTv(1);
    const data = await sortByPopularity([...popMovies, ...popTv])
    return data;
};

const cacheResponse = (key, data) => {
    console.log(`cached ${key}`, new Date);
    cache.initialitems = {
        time: Date.now(),
        data: data
    }
}

cacheResponse('initialitems', fetchInitialItems());

router.get('/items/initial', async (req, res, next) => {
    try {
        if(!cache.initialitems || Date.now() - cache.initialitems.time > 60 * 1000){
            cacheResponse('initialitems', fetchInitialItems());
        }
        res.send(await cache.initialitems.data);
    } catch (error) {
        console.error(error);
        next();
    }
});

router.get('/:media_type/:id/details', async (req, res, next) => {
    const id = req.params.id;
    const media_type = req.params.media_type;
    const item = await itemDetails(id, media_type);
    res.send(item);
});

router.get('/movie/popular/:page', async (req, res, next) => {
    const page = Number(req.params.page);
    const data = await fetchPopularMovies(page);
    res.send(data);
});

router.get('/tv/popular/:page', async (req, res, next) => {
    const page = Number(req.params.page);
    const data = await fetchPopularTv(page);
    res.send(data);
});

router.get('/genre/:media_type', async (req, res, next) => {
    const media_type = req.params.media_type;
    try {
        const genres = (media_type == 'movie') ? await moviedb.genreMovieList() : await moviedb.genreTvList();
        res.send(genres);
    } catch (error) {
        console.error(error);
        next();
    }

});

module.exports = {
    router
}