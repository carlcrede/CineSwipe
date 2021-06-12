$( document).ready(() => {
    document.title = "Log in"
});

$('form').submit( async(event) => {
    event.preventDefault();
    $('.failed-attempt').removeClass('show');
    $('.failed-attempt').text('&nbsp;');
    $('.spinner').addClass('enabled');

    const array = $('form').serializeArray();
    const data = {
        user: array[0].value,
        password: array[1].value
    }

    const response = await fetch('/auth/login', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    if(response.status === 200){
        $('.spinner').removeClass('enabled');
        displayLoginToast();
    } else {
        const result = await response.json();
        $('.spinner').removeClass('enabled');
        $('.failed-attempt').text(result.msg);
        $('.failed-attempt').addClass('show');
    }
});