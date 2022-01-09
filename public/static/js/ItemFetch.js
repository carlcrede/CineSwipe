const ItemFetch = (() => {

    const fetchIpData = async () => {
        const response = await fetch('/items/ipinfo');
        const ipdata = await response.json();
        return ipdata;
    };

    const fetchInitialItems = async() => {
        const { countryCode } = await fetchIpData();
        const response = await fetch(`/items/initial/${ countryCode }`);
        const result = await response.json();
        return [...result];
    };

    const fetchItems = async (filters) => {
        const response = await fetch(`/items?${$.param(filters)}`);
        const result = await response.json();
        return [...result];
    };

    const fetchItemDetails = async (item) => {
        const response = await fetch(`/items/${item.media_type}/${item.id}`);
        const result = await response.json();
        return result;
    };

    const fetchGenres = async (media_type) => {
        const genres = await fetch(`/items/genres/${media_type}`);
        return genres.json();
    };

    const fetchProviders = async (watch_region) => {
        const response = await fetch('/items/providers?watch_region=' + watch_region);
        const result = await response.json();
        return result;
    };

    return {
        fetchIpData, 
        fetchInitialItems, 
        fetchItemDetails, 
        fetchGenres, 
        fetchItems, 
        fetchProviders
    };
})();