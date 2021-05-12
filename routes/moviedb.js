const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

const router = require('express').Router();

const popularMovies = async () => {
    const popularMovies = await moviedb.moviePopular({ region: 'DK' });
    const dkMovies = await Promise.all(popularMovies.results.filter(async (result) => {
        const providers = await moviedb.movieWatchProviders(result.id);
        return 'DK' in providers.results;
    }));
    console.log(dkMovies);
}

popularMovies();

module.exports = {
    router
}