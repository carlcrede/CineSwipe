const fetchSessionErrors = async () => {
    const response = await fetch('/session/errors');
    const result = await response.json();
    return result
}

const displayInputErrors = async () => {
    const result = await fetchSessionErrors();
    const errors = result.errors;
    if(errors){
        errors.forEach(error => {
            if(error.param === "email"){
                $('#email-error-label').text('*' + error.msg);
            }
            else if(error.param === "username"){
                $('#username-error-label').text('*' + error.msg);
            }
            else if(error.param === "password"){
                $('#password-error-label').text('*' + error.msg);
            }
        });
    }
}

displayInputErrors();