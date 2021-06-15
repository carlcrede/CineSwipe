$(() => {
    document.title = "Log in"
});

$('form').on('submit', async(event) => {
    event.preventDefault();
    $('.failed-attempt').removeClass('show');
    $('.failed-attempt').text('&nbsp;');
    $('.spinner').addClass('enabled');

    const array = $('form').serializeArray();
    const data = {
        user: array[0].value,
        password: array[1].value
    };

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    switch (response.status) {
        case 200:
            $('.spinner').removeClass('enabled');
            displayLoginToast();
            break;
        case 401:
            const result = await response.json();
            $('.spinner').removeClass('enabled');
            $('.failed-attempt').text(result.msg);
            $('.failed-attempt').addClass('show');
            break;
        default:
            location.assign('/error/500');
    }

});