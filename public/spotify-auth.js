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
    expires_on = params.expires_on || localStorage.expires_on;
    error = params.error;

    localStorage.access_token = access_token;
    localStorage.refresh_token = refresh_token;
    localStorage.expires_on = expires_on;

    var time = new Date();
    console.log("Expires on: " + expires_on);
    if (hasAccess() && time.getTime() > expires_on) {
        refreshToken();
    }
}

function refreshToken() {
    var request = new XMLHttpRequest();
    var query = "/refresh_token?refresh_token=" + refresh_token;
    request.open("GET", query, true);
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var rawData = request.responseText;
            var parsedData = JSON.parse(rawData);

            var old_access = access_token;
            access_token = parsedData.access_token;
            localStorage.access_token = access_token;
            var time = new Date();
            expires_on = time.getTime() + (3600 * 1000);
            localStorage.expires_on = expires_on;
            markers = createMarkers();
        }
    }
    request.send();
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