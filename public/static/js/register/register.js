$(() => {
    document.title = "Sign up"
});

$('form').on('submit', async (event) => {
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

    $('.spinner').removeClass('enabled');
    switch(response.status){
        case 200:
            displaySignupToast();
            break;
        case 401:
            const result = await response.json();
            displayErrors(result.errors);
            break;
        default:
            location.assign('/error/500');
    }
});

const displayErrors = (errors) => {
    const labels = {
        email: $('#email-error-label'),
        username: $('#username-error-label'),
        password: $('#password-error-label')
    }
    errors.forEach(error => {
        if(error.msg){
            displayErrorOnLabel(labels[error.param], error.msg);
        }
    });
};

const resetLabels = () => {
    const allLabels = $('.error-label');
    allLabels.removeClass('show');
    allLabels.text('&nbsp;');
};

const displayErrorOnLabel = (label, error) => {
    label.text('*' + error);
    label.addClass('show');
};