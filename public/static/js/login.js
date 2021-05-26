$('form').submit( async(event) => {
    event.preventDefault();
    $('#failed-attempt').text('');
    $('.spinner').addClass('enabled');

    const array = $('form').serializeArray();
    const data = {
        user: array[0].value,
        password: array[1].value
    }

    const response = await fetch('/auth/login', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {'Content-Type': 'application/json'},
        redirect: 'manual', // manual, *follow, error
        referrerPolicy: 'origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    if(response.status === 200){
        $('.spinner').removeClass('enabled');
        displayLoginToast();
    } else {
        const result = await response.json();
        $('#loading-spinner').removeClass('enabled');
        $('#failed-attempt').text(result.msg);
    }
    
});