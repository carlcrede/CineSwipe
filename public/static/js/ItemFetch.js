const ItemFetch = (() => {

    // maybe have this in utils
    const getIpData = async () => {
        // gotta check for valid country, else set some default value
        const response = await fetch('https://api.db-ip.com/v2/free/self');
        const ipdata = await response.json();
        return ipdata;
    }

    const initialItems = async() => {
        const { countryCode } = await getIpData();
        Filtering.setFilters({watch_region: countryCode});
        const response = await fetch(`/items/initial/${ countryCode }`);
        const result = await response.json();
        return [...result];
    }

    const fetchItems = async (page, filters) => {
        const response = await fetch(`/items/${page}/?${$.param(filters)}`);
        const result = await response.json();
        return [...result];
    }

    const details = async (item) => {
        const response = await fetch(`/${item.media_type}/${item.id}/details`);
        const result = await response.json();
        return result;
    }

    const genres = async (media_type) => {
        const genres = await fetch(`/genres/${media_type}`);
        return genres.json();
    }

    const providers = async (watch_region) => {
        const response = await fetch('/providers?watch_region=' + watch_region);
        const result = await response.json();
        return result;
    }

    return {
        getIpData, initialItems, details, genres, fetchItems, providers
    }
})();