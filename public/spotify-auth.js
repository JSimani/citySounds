function addLoginButton(map) {
    var loginControlDiv = document.createElement('div');
    var centerControl = new LoginControl(loginControlDiv, map);
    loginControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(loginControlDiv);
}

function hasAccess() {
    return !(access_token == "null" || access_token == "undefined" || !access_token);
}

function getAccessToken() {
    var params = {};
    var e, 
        r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        params[e[1]] = decodeURIComponent(e[2]);
    }

    access_token = params.access_token || localStorage.access_token;
    refresh_token = params.refresh_token || localStorage.refresh_token;
    error = params.error;

    localStorage.access_token = access_token;
    localStorage.refresh_token = refresh_token;
}

function LoginControl(controlDiv, map) {
    var controlUI = document.createElement('div');
    controlUI.setAttribute("id", "loginControlUI");

    getAccessToken();

    access_token = localStorage.access_token;
    refresh_token = localStorage.refresh_token;

    if (!hasAccess()) {
        controlUI.title = 'Click to login to Spotify';
    } else {
        controlUI.title = 'Already logged into Spotify';
    }
    controlDiv.appendChild(controlUI);

    var controlText = document.createElement('div');
    controlText.setAttribute("id", "loginControlText");

    if (!hasAccess()) {
        controlText.innerHTML = "Login to Spotify <img id='spotify' src='spotify.png'/>";

    } else {
        controlText.innerHTML = "Logout <img id='spotify' src='spotify.png'/>";
    }
    
    controlUI.appendChild(controlText);

    if (!hasAccess()) {
        controlUI.addEventListener('click', function() {
            window.location = "/login";
        });
    } else {
        controlUI.addEventListener('click', function() {
            localStorage.clear();

            window.location = "/";
        });
    }
}