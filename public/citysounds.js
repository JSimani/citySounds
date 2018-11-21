var map = null;
var markers = [];
var infoWindow = null;
var curloc = null;
var access_token = null;
var params = null;

var cities = [
    ['New York', 40.7128, -74.0060],
    ['Los Angeles', 34.0522, -118.2437],
    ['Chicago', 41.8781, -87.6298],
    ['Houston', 29.7604, -95.3698],
    ['Philadelphia', 39.9526, -75.1652],
    ['Phoenix', 33.4484, -112.0740],
    ['San Antonio', 29.4241, -98.4936],
    ['San Diego', 32.7157, -117.1611],
    ['Dallas', 32.7767, -96.7970],
    ['Austin', 30.2672, -97.7431],
    ['San Francisco', 37.7749, -122.4194],
    ['Seattle', 47.6062, -122.3321],
    ['Denver', 39.7392, -104.9903],
    ['Washington', 38.9072, -77.0369],
    ['Boston', 42.3601, -71.0589],
    ['Memphis', 35.1495, -90.0490],
    ['Nashville', 36.1627, -86.7816],
    ['Las Vegas', 36.1699, -115.1398],
    ['Baltimore', 39.2904, -76.6122],
    ['Atlanta', 33.7490, -84.3880],
    ['Miami', 25.7617, -80.1918],
    ['New Orleans', 29.9511, -90.0715],
    ['Portland', 45.5122, -122.6587]
];

function initMap()
{
	myOptions = {
		zoom: 4.75, 
		center: {lat: 39.8283, lng: -98.5795},
		mapTypeId: "roadmap"
	};   
				
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    
    addLoginButton();
    addOverlay();
    getCurrentLocation();
    createMarkers();
}

function addOverlay() {
    var closebtn = document.createElement('a');
    closebtn.setAttribute("href", "javascript:void(0)");
    closebtn.setAttribute("class", "closebtn");
    closebtn.setAttribute("onclick", "closeOverlay()");
    closebtn.innerHTML = "&times;";

    var overlayContent = document.createElement('div');
    overlayContent.setAttribute("id", "overlay-content");
    overlayContent.innerHTML = "<p>How'd you get here?!</p>";

    var mapObject = document.getElementById("map_canvas");

    var overlay = document.createElement('div');
    overlay.setAttribute("id", "overlay");

    overlay.appendChild(closebtn);
    overlay.appendChild(overlayContent);

    mapObject.appendChild(overlay);

    infoWindow = document.getElementById("overlay-content");
}

function openOverlay() {
    document.getElementById("overlay").style.width = "100%";
}

function closeOverlay() {
    document.getElementById("overlay").style.width = "0%";
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

function hasAccess() {
    return !(access_token == "null" || access_token == "undefined" || !access_token);
}

function addLoginButton() {
    var loginControlDiv = document.createElement('div');
    var centerControl = new LoginControl(loginControlDiv, map);
    loginControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(loginControlDiv);
}

function createMarkers() {
    for (var i = 0; i < cities.length; i++) {
        city = cities[i];

        var marker = new google.maps.Marker({
            position: {lat: city[1], lng: city[2]},
            map: map,
            title: city[0]
        });

        initializeInfoWindow(marker);

        markers.push(marker);

        addSongs(marker);
        addAlbums(marker);
        addArtists(marker);
    }
}

function addSongs(marker) {
    if (hasAccess()) {
        var query = 'https://api.spotify.com/v1/search?q=track:' + marker.title + '&type=track&limit=5';
        var request = new XMLHttpRequest();
        request.open("GET", query, true);
        request.setRequestHeader('Authorization', 'Bearer '+ access_token);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var rawData = request.responseText;
                var parsedData = JSON.parse(rawData);

                marker.songs = [];
                for (var i = 0; i < parsedData.tracks.items.length; i++) {
                    marker.songs.push(parsedData.tracks.items[i]);
                }

                initializeInfoWindow(marker);
            }
        }
        request.send();

    }
}

function addAlbums(marker) {
    if (hasAccess()) {
        var query = 'https://api.spotify.com/v1/search?q=album:' + marker.title + '&type=album&limit=5';
        var request = new XMLHttpRequest();
        request.open("GET", query, true);
        request.setRequestHeader('Authorization', 'Bearer '+ access_token);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var rawData = request.responseText;
                var parsedData = JSON.parse(rawData);

                marker.albums = [];
                for (var i = 0; i < parsedData.albums.items.length; i++) {
                    marker.albums.push(parsedData.albums.items[i]);
                }
                
                initializeInfoWindow(marker);
            }
        }
        request.send();

    } 
}

function addArtists(marker) {
    if (hasAccess()) {
        var query = 'https://api.spotify.com/v1/search?q=artist:' + marker.title + '&type=artist&limit=5';
        var request = new XMLHttpRequest();
        request.open("GET", query, true);
        request.setRequestHeader('Authorization', 'Bearer '+ access_token);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var rawData = request.responseText;
                var parsedData = JSON.parse(rawData);

                marker.artists = [];
                for (var i = 0; i < parsedData.artists.items.length; i++) {
                    marker.artists.push(parsedData.artists.items[i]);
                }
                
                initializeInfoWindow(marker);
            }
        }
        request.send();

    } 
}

function getCurrentLocation() {
    var options = {
        enableHighAccuracy: true
    };

    var success = function (pos) {
        var coordinates = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
        };

        var currentLocation = new google.maps.Marker({
                position: coordinates,
                map: map,
                icon: {
                    url: "curloc.png",
                    scaledSize: new google.maps.Size(30, 30), 
                    origin: new google.maps.Point(0,0), 
                    anchor: new google.maps.Point(15, 15) 
                },
                title: "Current Location"
        });

        curloc = currentLocation;
    }

    var error = function(err) {
        console.warn('ERROR(${err.code}): ${err.message}');
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}

function initializeInfoWindow(city) {
    var info = "<p id='iw-title'>" + city.title + "</p>";
    if (!hasAccess()) {
        info += "<p><a href='/login'>Login to Spotify to View Songs</a></p>"; 
    } else {
        if (city.songs) {
            info += "<p id='iw-subtitle'>Songs: </p>";
            for (var i = 0; i < city.songs.length; i++) {
                var curTrack = city.songs[i];
                info += "<p><a href='" + curTrack.external_urls.spotify + "'>" + curTrack.name + " by " + curTrack.artists[0].name + "</a></p>";
            }
        }

        if (city.albums) {
            info += "<p id='iw-subtitle'>Albums: </p>";
            for (var i = 0; i < city.albums.length; i++) {
                var curAlbum = city.albums[i];
                info += "<p><a href='" + curAlbum.external_urls.spotify + "'>" + curAlbum.name + " by " + curAlbum.artists[0].name + "</a></p>";
            }
        }

        if (city.artists) {
            info += "<p id='iw-subtitle'>Artists: </p>";
            for (var i = 0; i < city.artists.length; i++) {
                var curArtist = city.artists[i];
                info += "<p><a href='" + curArtist.external_urls.spotify + "'>" + curArtist.name + "</a></p>";
            }
        }
    }

    city.addListener('click', function() {
        infoWindow.innerHTML = info;
        openOverlay();
    });
}

function LoginControl(controlDiv, map) {
    var controlUI = document.createElement('div');
    controlUI.setAttribute("id", "loginControlUI");

    getAccessToken();

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

    if (!access_token) {
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

