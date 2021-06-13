const CardBuilder = (() => {
    const img_url = 'https://image.tmdb.org/t/p/';
    const tmdb_logo = 'https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg';

    const buildItemCard = (item, swipecard = true) => {
        const itemData = buildItemData(item);
        
        let card = $(`<div id="${item.id}" data-type="movie" class="card">`);
        let top = $(`<div class="card-top"></div>`);
        let middle = $(`<div class="card-info">`);

        top.append(itemData.trailer, itemData.providers);
        middle.append(itemData.vote_avg, itemData.release, itemData.genres, itemData.episodesOrSeasons, itemData.runtime);
        card.append(top);
        card.append(itemData.title);
        card.append(middle);
        card.append(itemData.overview);
        if (swipecard) {
            itemData['buttons'] = buildButtons(item);
            card.append(itemData.buttons); 
        }
        if (!swipecard) {
            // collect data about watch providers, and display aditional data on match-card.
            itemData['providerDetails'] = buildProviderDetails(item);
            card.append(itemData.providerDetails);
        }

        if (item.backdrop_path) {
            card.css({'background-image': `linear-gradient(1deg, rgba(62,54,54,0.98) 31%, rgba(255,255,255,0) 80%), url('${img_url}w780${item.backdrop_path}')`});
        }
        return card;
    }

    const buildItemData = (item) => {
        const data = {
            trailer: buildTrailer(item),
            providers: buildProviderLogos(item),
            title: buildTitle(item),
            vote_avg: buildVoteAvg(item),
            release: buildRelease(item),
            genres: buildGenres(item),
            episodesOrSeasons: buildEpisodesOrSeasons(item),
            runtime: buildRuntime(item),
            overview: buildOverview(item)
        };
        return data;
    }

    const buildProviderDetails = (item) => {
        const { watch_region } = Filtering.getFilters();
        const providers = item['watch/providers'].results[watch_region];
        if (providers) {
            const { link, buy = null, rent = null, flatrate = null, ads = null, free = null } = providers;
            let div = $(`<div class="card-providers-details"></div>`);
            if (flatrate) {
                let flatRateDiv = $('<div class="list"><div class="label">Stream</div></div>');
                flatrate.forEach((value, index) => {
                    flatRateDiv.append(`<img loading="lazy" width="30px" src="${img_url}original${value.logo_path}">`);
                });
                div.append(flatRateDiv);
            }
            if (buy) {
                let buyDiv = $('<div class="list"><div class="label">Buy</div></div>');
                buy.forEach((value, index) => {
                    buyDiv.append(`<img loading="lazy" width="30px" src="${img_url}original${value.logo_path}">`);
                });
                div.append(buyDiv);
            }
            if (rent) {
                let rentDiv = $('<div class="list"><div class="label">Rent</div></div>');
                rent.forEach((value, index) => {
                    rentDiv.append(`<img loading="lazy" width="30px" src="${img_url}original${value.logo_path}">`);
                });
                div.append(rentDiv);
            }
            div.append(`<a target='_blank' href="${link}">See more</a>`);
            return div;
        } else {
            return '<div class="card-provider-details">No providers offer this movie/tv</div>';
        }
    }

    const buildTitle = (item) => {
        const title = (item.media_type == 'movie') ? item.title : item.name;
        return `<div class="card-title"><h2>${title}</h2></div>`;
    }

    const buildRuntime = (item) => {
        if (!item.runtime) {
            return '';
        }
        const runtime = convertTime(item.runtime);
        return `<a>${runtime}</a>`;
    }

    const buildEpisodesOrSeasons = (item) => {
        if (!item.number_of_episodes && !item.number_of_episodes) {
            return '';
        }
        const seasons = item.number_of_seasons;
        const episodes = item.number_of_episodes;
        const episodesOrSeasons = seasons > 1 ? seasons + ' Seasons' : episodes + ' Episodes';
        return `<a>${episodesOrSeasons}</a>`;
    }

    const buildRelease = (item) => {
        if (item.media_type == 'movie' && item.release_date) {
            return `<a>${item.release_date.split('-')[0]}</a>`;
        } else if (item.first_air_date) {
            let first_aired = `${item.first_air_date.split('-')[0]}`;
            if (item.status == 'Ended') { 
                first_aired += ` - ${item.last_air_date.split('-')[0]}`; 
            } else {
                first_aired += ' - Present';
            }
            return `<a>${first_aired}</a>`;
        }
        return '';
    }

    const buildOverview = (item) => {
        if (!item.overview) {
            return '<div class="card-overview"></div>';
        }
        return `<div class="card-overview">${item.overview}</div>`;
    }

    const buildVoteAvg = (item) => {
        if (item.vote_average) {
            return `<img loading="lazy" src="${tmdb_logo}"/><a><i class="fas fa-star"></i> ${item.vote_average} <small>/ 10</small></a>`;
        }
        return '';
    }

    const convertTime = (time) => {
        const hours = Math.floor(time / 60);
        const minutes = time % 60;
        const runtime = (hours) ? `${hours} h ${minutes} min` : `${minutes} min`;
        return runtime;
    }

    const buildTrailer = (item) => {
        let trailerDiv = $(`<div class="card-trailer"></div>`);
        if (!item.videos) { return trailerDiv; }
        let trailer;
        if (item.videos.results.length > 0) {
            trailer = item.videos.results.find((item) => {
                return item.site == 'YouTube' && item.type == 'Trailer';
            });
            if (trailer) {
                let trailerLink = $(`<a target="_blank" draggable="false"></a>`);
                trailerLink.html('<i class="fas fa-play"></i><p>Trailer</p>');
                trailerLink.attr('href', `https://youtu.be/${trailer.key}`);
                trailerDiv.append(trailerLink);
            }
        }
        return trailerDiv;
    }

    const buildGenres = (item) => {
        if (!item.genres.length) {
            return '';
        }
        let genresDiv = $(`<div></div>`);
        genresDiv.append(`<a>${item.genres[0].name}</a>`);
        if (item.genres.length > 1) {
            genresDiv.append(`<a>, ${item.genres[1].name}</a>`);
        }
        return genresDiv;
    }

    const buildButtons = (item) => {
        let btnDiv = $(`<div class="card-buttons"></div>`);
        const dislikebtn = $(`<div class="dislike" id="dislikeBtn">👎</div>`);
        btnDiv.append(dislikebtn);
        const likebtn = $(`<div class="like" id="likeBtn">👍</div>`);
        btnDiv.append(likebtn);

        btnDiv.children().map((index, element) => {
            const btnHammer = new Hammer(element);
            btnHammer.on('tap pressup', (ev) => {
                btnHammer.set({enable: false});

                const itemId = item.id;
                const parent = $(`#${itemId}`);
                parent.css('pointer-events', 'none');

                if (ev.target.id == 'dislikeBtn') {
                    parent.css('transition', 'all .4s ease-in-out');
                    parent.css('transform', 'translate3d(-2000px, 0, 0)');
                } else {
                    parent.css('transition', 'all .4s ease-in-out');
                    parent.css('transform', 'translate3d(2000px, 0, 0)');
                    clientLikedItem(item);
                }
                CardManager.addCard();
                setTimeout(() => {
                    parent.remove();
                }, 1000);
            });
        });
        return btnDiv;
    }

    // watch providers per country filtering should maybe be done server-side
    const getDistrinctProviders = (item, watch_region) => {
        let watchProviders = item['watch/providers'].results[watch_region];
        if (watchProviders) {
            let list = Object.values(watchProviders);
            list.shift();
            let result = new Set();
            list.forEach(value => {
                value.forEach(val => {
                    result.add(val.logo_path);
                });
            });
            return [...new Set(result)];
        };
    }

    const buildProviderLogos = (item) => {
        let providers = $('<div class="card-providers"></div>');
        const { watch_region } = Filtering.getFilters();
        const logopaths = getDistrinctProviders(item, watch_region);
        if (logopaths) {
            logopaths.forEach((value, index) => {
                providers.append(`<img loading="lazy" src="${img_url}original${value}">`);
            });
        }
        return providers;
    }

    return {
        buildItemCard
    }

})();