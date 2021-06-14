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