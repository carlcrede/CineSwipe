const fetchUserId = async() => {
    const response = await fetch('/session/id');
    const result = await response.json();
    return result;
}

const setupHeader = async() => {
    const leftNav = $('#left-nav-section');
    const result = await fetchUserId();
    const userId = result.userId;
    if (userId){
        const logoutNavItem = $(
            `<a class="nav-item logout" href="/auth/logout" id=logout>
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
        const likesNavItem = $(
            `<a class="nav-item likes" href="/user/${userId}/preferences">
                <h3>Your preferences</h3>
            </a>`
        );
        leftNav.append(likesNavItem, userNavItem, logoutNavItem);
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

$( document ).ready(() => {
    setupHeader();
});