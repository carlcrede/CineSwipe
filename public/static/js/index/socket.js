const Socket = (() => {
    const socket = io();
    
    socket.emit('joinroom', location.pathname.substr(1));
    
    socket.on('session', (roomId) => {
        $('#session-copy-icon').removeClass('hidden');
        $("#session-url").text(location.host + '/' + roomId);
    });
    
    socket.on('match', (item) => {
        if (!$(`#match-${item.id}`).length) {
            CardManager.addCardToMatches(item);
        }
    });
    
    const clientLikedItem = async (item) => {
        socket.emit('clientLikedItem', { id: item.id, media_type: item.media_type});
        const liked = {like: {
            id: item.id,
            media_type: item.media_type,
            genres: item.genres
        }};
        const post = await fetch('/likes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(liked)
        });
    }
    
    socket.on('clientUpdatedFilters', async (filters, filterHtml) => {
        Filtering.setFilters(filters);
        $('#filtersModal').hide();
        $('#contentFilters').hide();
        $('#providerFilters').hide();
        $('#filtersModal').empty();
        $('#filtersModal').append($(filterHtml));
        Filtering.initFilterClickHandlers();
        displayFiltersUpdatedToast();
        await CardManager.updateCardsWithFilters(filters);
    });
    
    const clientUpdatedFilters = (filters, filterHtml) => {
        socket.emit('clientUpdatedFilters', filters, filterHtml);
    };

    $('#copy-session').on('click', () => {
        const texttocopy = $('#session-url').text();
        navigator.clipboard.writeText(texttocopy)
            .then(() => {
                displayCopyToast();
            });
        $('#copy-session').off();
        setTimeout(() => {
            $('#copy-session').on();
        }, 2000);
    });

    return {
        clientLikedItem, clientUpdatedFilters
    };

})();