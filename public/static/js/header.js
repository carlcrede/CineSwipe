const fetchUserId = async() => {
    const response = await fetch('/session/id');
    const result = await response.json();
    return result;
}

const setupLeftNav = async() => {
    const leftNav = $('.left-nav');
    const result = await fetchUserId();
    const userId = result.userId;
    // console.log(userId);
    if (userId){
        leftNav.append(
            `<div class="nav-item" id="logout">
                <a href="/logout">
                    <h3>
                        Logout
                    </h3>
                </a>
            </div>
            <div class="nav-item" id="user-tab">
                <a href="/user/${userId}">
                    <h3>
                        ${userId}
                    </h3>
                </a>
            </div>')`
        );
    } else {
        leftNav.append(
            `<div class="nav-item" id="register">
                <a href="/register">
                    <h3>
                        Sign Up
                    </h3>
                </a>
            </div>
            <div class="nav-item" id="login">
                <a href="/login">
                    <h3>
                        Login
                    </h3>
                </a>
            </div>')`
        );
    }
}

setupLeftNav().then(console.log('leftnav was set up'));