(async function(){
    document.title = 'Your preferences'

    const userPreferences = $('.user-preferences');
    const result = await fetchUserId();
    const userId = result.userId;
    userPreferences.append(
        `<a href="/user/${userId}/preferences/likes">
            <h3>
                All your liked media
            </h3>
        </a>`
    );
})();