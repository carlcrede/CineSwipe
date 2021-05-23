const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

const router = require('express').Router();

let initalItems = new Array();

const fetchInitialItems = async(page) => {
    const movies = await popularMovies(page);
    const tv = await popularTv(page);
    const combined = [...movies, ...tv].sort((a, b) => b.popularity - a.popularity);
    return combined;
};

const popularMovies = async (page) => {
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

const popularTv = async (page) => {
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

router.get('/items/initial', (req, res, next) => {
    res.send(initalItems);
});

router.get('/:media_type/:id/details', async (req, res, next) => {
    const id = req.params.id;
    const media_type = req.params.media_type;
    const item = await itemDetails(id, media_type);
    res.send(item);
});

router.get('/movie/popular/:page', async (req, res, next) => {
    const page = Number(req.params.page);
    const movies = await popularMovies(page);
    res.send(movies);
});

router.get('/tv/popular/:page', async (req, res, next) => {
    const page = Number(req.params.page);
    const tv = await popularTv(page);
    res.send(tv);
});

fetchInitialItems(1).then(result => {
    initalItems = [...result];
});

module.exports = {
    router
}