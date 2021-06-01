(async function(){
    const result = await fetchUserId();
    const userId = result.userId;

    document.title = `Profile: ${userId}`;

    const usernameHeader = $('#h1-username');
    usernameHeader.text(userId);
})();