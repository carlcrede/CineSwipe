const { MovieDb } = require('moviedb-promise');
const moviedb = new MovieDb(process.env.MOVIEDB_API_KEY);

exports.fetchMovies = async (options) => {
    try {
        const moviesResponse = await moviedb.discoverMovie(options);
        return Promise.all(moviesResponse.results.map(async (result) => {
            const movieDetails = await moviedb.movieInfo({ id: result.id, append_to_response: 'watch/providers,videos'});
            movieDetails['media_type'] = 'movie';
            return movieDetails;
        }));
    } catch (error) {
        console.error(error);
    }
};

exports.fetchTv = async (options) => {
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
};

exports.fetchTrendingMovies = async (params, options) => {
    try {
        const moviesResponse = await moviedb.trending(params, options);
        return Promise.all(moviesResponse.results.map(async (result) => {
            const movieDetails = await moviedb.movieInfo({ id: result.id});
            movieDetails['media_type'] = 'movie';
            return movieDetails;
        }));
    } catch (error) {
        console.error(error);
    }
};

exports.fetchTrendingTv = async (options) => {
    try {
        const TvsResponse = await moviedb.trending(options);
        return Promise.all(TvsResponse.results.map(async (result) => {
            const tvDetails = await moviedb.tvInfo({ id: result.id});
            tvDetails['media_type'] = 'tv';
            return tvDetails;
        }));
    } catch (error) {
        console.error(error);
    }
};

exports.getDiscoverMovies = async (options = {}) => {
    try {
        const discoverMovieResponse = await moviedb.discoverMovie(options);
        return discoverMovieResponse;
    } catch (error) {
        console.error(error);
    }
};

exports.getDiscoverTv = async (options = {}) => {
    try {
        const discoverTvResponse = await moviedb.discoverTv(options);
        return discoverTvResponse;
    } catch (error) {
        console.error(error);
    }
};

exports.search = async (options = {}) => {
    try {
        const searchResponse = await moviedb.searchMulti(options);
        return searchResponse;
    } catch (error) {
        console.error(error);
    }
};

exports.itemDetails = async (id, media_type) => {
    try {
        let details;
        if (media_type == 'movie') {
            details = await moviedb.movieInfo({ id: id, append_to_response: 'watch/providers,videos,credits' });
            details['media_type'] = 'movie';
        } else {
            details = await moviedb.tvInfo({ id: id, append_to_response: 'watch/providers,videos,credits' });
            details['media_type'] = 'tv';
        }
        return details;
    } catch (error) {
        console.log('nothing');
    }
};

exports.mixAndSortItems = async (items, sort_by) => {
    const sort_key = sort_by.split('.')[0];
    if (sort_by.includes('.desc')) {
        items.sort((a, b) => b[sort_key] - a[sort_key]);
    } else {
        items.sort((a, b) => a[sort_key] - b[sort_key]);
    }
    return items;
};