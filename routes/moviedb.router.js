const moviedb = require('../moviedb');
const router = require('express').Router();

router.get('/:media_type/:id', async (req, res) => {
    const media_type = req.params.media_type;
    const id = req.params.id;
    const item = await moviedb.itemDetails(id, media_type);
    res.send(item);
});

router.get('/search', async (req, res) => {
    const { query } = req.query;
    const searchResults = await moviedb.search({ query });
    res.send(searchResults);
});

router.get('/discover', async (req, res) => {
    const { filters } = req.query;
    const parsedFilters = JSON.parse(filters);
    if (!parsedFilters.media.movie) {
        const response = await moviedb.getDiscoverTv(parsedFilters);
        res.send(response.results);
    } else if (!parsedFilters.media.tv) {
        const response = await moviedb.getDiscoverMovies(parsedFilters);
        res.send(response.results);
    } else {
        const movies = await moviedb.getDiscoverMovies(parsedFilters);
        const tv = await moviedb.getDiscoverTv(parsedFilters);
        const data = await moviedb.mixAndSortItems([...movies.results, ...tv.results], parsedFilters.sort_by);
        res.send(data);
    }
});

router.get('/discover/movies', async (req, res) => {
    const options = req.query;
    const response = await moviedb.fetchMovies(options);
    res.send(response);
});

router.get('/discover/tv', async (req, res) => {
    const options = req.query;
    const response = await moviedb.fetchTv(options);
    res.send(response);
});

router.get('/trending/:media_type/:time_window', async (req, res) => {
    const options = req.query;
    const params = req.params;
    if (params.media_type == 'movie') {
        const response = await moviedb.fetchTrendingMovies(params, options);
        res.send(response);
    } else {
        const response = await moviedb.fetchTrendingTv(params, options);
        res.send(response);
    }
});

module.exports = {
    router
};