const ItemFetch = (() => {

    const initialItems = async() => {
        const response = await fetch(`/items/initial`);
        const result = await response.json();
        return [...result];
    }

    const popularMovies = async(page, filters) => {
        const response = await fetch(`/movie/popular/${page}/?${$.param(filters)}`);
        const result = await response.json();
        return [...result];
    }

    const popularTv = async (page, filters) => {
        const response = await fetch(`/tv/popular/${page}/?${$.param(filters)}`);
        const result = await response.json();
        return [...result];
    }

    const combinedMoviesAndTv = async (page, filters) => {
        if (filters.media.length > 1) {
            const movies = popularMovies(page, filters);
            const tv = popularTv(page, filters);
            const promises = await Promise.all([movies, tv]);
            const combined = [...promises[0], ...promises[1]];
            combined.sort((a, b) => b.popularity - a.popularity);
            return [...combined];
        } else if (filters.media[0] == 'movie') {
            const movies = await popularMovies(page, filters);
            movies.sort((a, b) => b.popularity - a.popularity);
            return movies;
        } else {
            const tv = await popularTv(page, filters);
            tv.sort((a, b) => b.popularity - a.popularity);
            return tv;
        }
    }

    const details = async (item) => {
        const response = await fetch(`/${item.media_type}/${item.id}/details`);
        const result = await response.json();
        return result;
    }

    const genres = async (media_type) => {
        const genres = await fetch(`/genre/${media_type}`);
        return genres.json();
    }

    return {
        initialItems, popularMovies, popularTv, combinedMoviesAndTv, details, genres
    }
})();