$( document).ready(() => {
    document.title = "Sign up"
});

$('form').submit( async (event) => {
    event.preventDefault();
    $('.spinner').addClass('enabled');
    resetLabels();

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
    } else if (response.status === 401){
        const result = await response.json();
        const errors = result.errors;
        if(errors){
            displayErrors(errors);
        };
    }
    $('.spinner').removeClass('enabled');
});

const displayErrors = (errors) => {
    const labels = {
        email: $('#email-error-label'),
        username: $('#username-error-label'),
        password: $('#password-error-label')
    }
    errors.forEach(error => {
        if(error.msg){
            console.log({'error had a msg': error.msg});
            displayErrorOnLabel(labels[error.param], error.msg);
        }
    });
}

const resetLabels = () => {
    const allLabels = $('.error-label');
    allLabels.removeClass('show');
    allLabels.text('&nbsp;');
}

const displayErrorOnLabel = (label, error) => {
    console.log(label, error);
    label.text('*' + error);
    label.addClass('show');
}