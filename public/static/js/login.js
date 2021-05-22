$( document ).ready(function() {
    console.log(document.cookie);
});

displayFailedAttempt();
const fetchFailedLoginAttempt = async () => {
    const response = await fetch('/session/loginfailed');
    const result = await response.json();
    return result
}

const displayFailedLoginAttempt = async () => {
    const attempt = await fetchFailedLoginAttempt();
    if(attempt.msg){
        $('#failed-attempt').text(attempt.msg);
    }
}

console.log(document.cookie);
displayFailedLoginAttempt();