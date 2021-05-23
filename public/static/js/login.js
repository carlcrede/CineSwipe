//login success toaster display
$( document ).ready(function() {
    if(document.cookie){
        const splitCookies = document.cookie.split(';');
        const findCookie = splitCookies.find(cookie => {
            return cookie === 'registration_success=true';
        });
        if(findCookie){
            toastr.options = {
                closeDuration: 10000,
                positionClass: 'toast-top-center',
                preventDuplicates: false
            }
            toastr.success('Successfully registered, please log in');
        }
    }
});

$('form').submit( async(event) => {
    event.preventDefault();
    console.log('form submitted');
    const array = $('form').serializeArray();
    const data = {
        user: array[0].value,
        password: array[1].value
    }
    const response = await fetch('/login', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'same-origin', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'manual', // manual, *follow, error
        referrerPolicy: 'origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    if(response.status === 200){
        location.assign('/login')
    } else {
        const result = await response.json();
        $('#failed-attempt').text(result.msg);
    }
});

// const displayLoginError = (message) => {
//     toastr.options = {
//         closeDuration: 10000,
//         positionClass: 'toast-top-center' 
//     }
//     toastr.error(message);
// }