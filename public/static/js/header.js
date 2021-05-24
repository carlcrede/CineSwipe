const fetchUserId = async() => {
    const response = await fetch('/session/id');
    const result = await response.json();
    return result;
}

const setup = async() => {
    const leftNav = $('#left-nav-section');
    const result = await fetchUserId();
    const userId = result.userId;
    if (userId){
        const logoutNavItem = $(
            `<a class="nav-item logout" href="/logout" id=logout>
                <h3>
                    Logout
                </h3>
            </a>`
        );
        const userNavItem = $(
            `<a class="nav-item user" href="/user/${userId}">
                <h3>
                    ${userId}
                </h3>
            </a>`
        );
        leftNav.append(userNavItem, logoutNavItem);
        displayToaster(
            `<div class=toast-icon>
                <img class="success-icon"></img>
            </div>
            <div class="toast-text">
                <div>
                    Successfully logged in!
                </div>
                <div>
                    Welcome ${userId}
                </div>
            </div>`
        );
    } else {
        const loginNavItem = $(
            `<a class="nav-item login" href="/login">
                <h3>
                    Login
                </h3>
            </a>`
        );
        const registerNavItem = $(
            `<a class="nav-item register" href="/register">
                <h3>
                    Sign Up
                </h3>
            </a>`
        );
        leftNav.append(loginNavItem, registerNavItem);
    }
}

const displayToaster = (text) => {
    toastr.options = {
        closeButton: false,
        debug: false,
        newestOnTop: false,
        progressBar: false,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        onclick: null,
        showDuration: 500,
        hideDuration: 1000,
        timeOut: 3500,
        extendedTimeOut: 500000,
        showEasing: 'swing',
        hideEasing: 'swing',
        showMethod: 'show',
        hideMethod: 'fadeOut'
    };
    toastr.success(text);
}

$( document ).ready(() => {
    setup();
});