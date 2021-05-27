const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

const router = require('express').Router();

let cache;

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

const sortByPopularity = async (items) => {
    items.sort((a, b) => b.popularity - a.popularity);
    return items;
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

const initCache = async() => {
    const popMovies = await fetchPopularMovies(1);
    const popTv = await fetchPopularTv(1);
    const combined = await sortByPopularity([...popMovies, ...popTv]);
    console.log('caching movies and tv:', new Date, Date.now());
    return {
        initial: {
            time: Date.now(),
            data: combined,
    
        },
        movies: {
            time: Date.now(),
            data: popMovies,
    
        },
        tv: {
            time: Date.now(),
            data: popTv,
        },
    }
}

initCache().then(result => cache = result);

router.get('/items/initial', async (req, res, next) => {
    if(cache.initial.time > Date.now() - 30 * 1000){
        console.log('didnt cache');
        return res.send(cache.initial.data);
    } else {
        console.log('recached');
        const popMovies = await fetchPopularMovies(1);
        const popTv = await fetchPopularTv(1);
        const combined = await sortByPopularity([...popMovies, ...popTv]);

        cache.initial = {
            time: Date.now(),
            data: combined
        }
        return res.send(cache.initial.data);
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
    const movies = await fetchPopularMovies(page);
    res.send(movies);
});

router.get('/tv/popular/:page', async (req, res, next) => {
    const page = Number(req.params.page);
    const tv = await fetchPopularTv(page);
    res.send(tv);
});

router.get('/cachetime', (req, res) => {
    res.send({cache: cache});
});

module.exports = {
    router
}