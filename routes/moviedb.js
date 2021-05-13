const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

const router = require('express').Router();

const popularMovies = async (pageNumber) => {
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
}

router.get("/movie/popular/:page", (req, res, next) => {
    const page = Number(req.params.page);
    console.log('/movie/popular/:page called');
    if(Number.isInteger(page)){
        console.log('"/movie/popular/" parameter is valid');
        popularMovies(page).then(result => res.send(result));
    } else {
        console.log('"/movie/popular/" parameter is not valid');
        next();
    }
});

// popularMovies(1).then(res => console.log(res.length));

module.exports = {
    router
}