const ItemFetch = (() => {

    const initialItems = async() => {
        const response = await fetch(`/items/initial`);
        const result = await response.json();
        return [...result];
    }

    const popularMovies = async(page) => {
        const response = await fetch(`/movie/popular/${page}`);
        const result = await response.json();
        return [...result];
    }

    const popularTv = async (page) => {
        const response = await fetch(`/tv/popular/${page}`);
        const result = await response.json();
        return [...result];
    }

    const combinedMoviesAndTv = async (page) => {
        if (!filters.media_types.tv) {
            const movies = await popularMovies(page);
            movies.sort((a, b) => b.popularity - a.popularity);
            return movies;
        } else if (!filters.media_types.movie) {
            const tv = await popularTv(page);
            tv.sort((a, b) => b.popularity - a.popularity);
            return tv;
        } else {
            const movies = popularMovies(page);
            const tv = popularTv(page);
            const promises = await Promise.all([movies, tv]);
            const combined = [...promises[0], ...promises[1]];
            combined.sort((a, b) => b.popularity - a.popularity);
            return [...combined];
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