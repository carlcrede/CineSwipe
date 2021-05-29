$( document).ready(() => {
    document.title = "Sign up"
});

$('form').submit( async (event) => {
    event.preventDefault();
    $('#email-error-label').text('');
    $('#username-error-label').text('');
    $('#password-error-label').text('');
    $('.spinner').addClass('enabled');

    const array = $('form').serializeArray();
    const data = {
        email: array[0].value,
        username: array[1].value,
        password: array[2].value
    };

    const response = await fetch('/auth/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
    if(response.status === 200){
        $('.spinner').removeClass('enabled');
        displaySignupToast();
    } else {
        const result = await response.json();
        $('.spinner').removeClass('enabled');
        const errors = result.errors;
        if(errors){
            errors.forEach(error => {
                if(error.param === "email"){
                    $('#email-error-label').text('*' + error.msg);
                } else if (error.param === "username"){
                    $('#username-error-label').text('*' + error.msg);
                } else if (error.param === "password"){
                    $('#password-error-label').text('*' + error.msg);
                };
            });
        };
    };
});