( async function setupHeader(){
    const response = await fetch('/session/userid');
    const result = await response.json();
    const leftNav = $('#left-nav-section');
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
            `<div class="nav-item user">
                <h3>
                    ${userId}
                </h3>
            </div>`
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
})();