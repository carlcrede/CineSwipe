const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

const router = require('express').Router();

/* const popularMovies = async (pageNumber) => {
    const popularMovies = await moviedb.moviePopular({ region: 'DK', page: pageNumber });
    const dkMovies = await Promise.all(popularMovies.results.map(async (result) => {
        const providers = await moviedb.movieWatchProviders(result.id);
        if ('DK' in providers.results) {
            result['Providers'] = providers;
            return result;
        } else {
            return undefined;
        }
        //return 'DK' in providers.results ? result: undefined;
    }));
    const filtered = dkMovies.filter((val, index) => {
        return val;
    });
    return filtered;
} */
const popularMovies = async (page) => {
    const popularMovies = await moviedb.moviePopular({ page: page });
    const movies = await Promise.all(popularMovies.results.map(async (result) => {
        const details = await moviedb.movieInfo({ id: result.id, append_to_response: 'watch/providers,videos' });
        //const providers = await moviedb.movieWatchProviders(result.id);
        //result['watch_providers'] = providers;
        details['media_type'] = 'movie';
        return details;
    }));
    return movies;
}

const popularTv = async (page) => {
    const popularTv = await moviedb.tvPopular({ page: page });
    const tv = await Promise.all(popularTv.results.map(async (result) => {
        const details = await moviedb.tvInfo({ id: result.id, append_to_response: 'watch/providers,videos' });
        //const providers = await moviedb.tvWatchProviders(result.id);
        //result['watch_providers'] = providers;
        details['media_type'] = 'tv';
        return details;
    }));
    return tv;
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

/* router.get("/movie/popular/:page", (req, res, next) => {
    const page = Number(req.params.page);
    console.log('/movie/popular/:page called');
    if(Number.isInteger(page)){
        console.log('"/movie/popular/" parameter is valid');
        popularMovies(page).then(result => res.send(result));
    } else {
        console.log('"/movie/popular/" parameter is not valid');
        next();
    }
}); */

// popularMovies(1).then(res => console.log(res.length));

module.exports = {
    router
}