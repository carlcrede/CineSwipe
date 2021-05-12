const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

const router = require('express').Router();

const popularMovies = async () => {
    const popularMovies = await moviedb.moviePopular({ region: 'DK' });
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

popularMovies().then(res => console.log(res));

module.exports = {
    router
}