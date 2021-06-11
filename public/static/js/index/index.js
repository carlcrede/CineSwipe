//self invoking function
(function handleSessionCopyEvent() {
    //enables clicklistener
    $("#copy-session").click(() => {
        //remove event listener
        $("#copy-session").off();
        const texttocopy = $('#session-url').text();
        navigator.clipboard.writeText(texttocopy)
            .then(() => {
                displayCopyToast();
            });
        //delayed recursiion
        setTimeout(() => handleSessionCopyEvent(), 2000);
    });
})();