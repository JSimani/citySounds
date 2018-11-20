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
    infoWindow = new google.maps.InfoWindow();
    
    getAccessToken();
    addLoginButton();

    getCurrentLocation();
    createMarkers();

    for (var i = 0; i < markers.length; i++) {
        addSongs(markers[i]);
    }
}

function getAccessToken() {
    var params = {};
    var e, 
        r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
        params[e[1]] = decodeURIComponent(e[2]);
    }

    access_token = params.access_token || localStorage.access_token,
    refresh_token = params.refresh_token || localStorage.refresh_token,
    error = params.error;

    localStorage.access_token = access_token;
    localStorage.refresh_token = refresh_token;
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
    }
}

function addSongs(marker) {
    if (access_token) {
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
                    var curTrack = parsedData.tracks.items[i];
                    marker.songs.push(curTrack.name + " by " + curTrack.artists[0].name);
                }

                initializeInfoWindow(marker);
            }
        }
        request.send();

    } else {
        console.log("Access denied");
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
    var innerHTML = "<div id='InfoWindow'><p>" + city.title + "</p>";
    if (city.songs) {
        for (var i = 0; i < city.songs.length; i++) {
            innerHTML += "<p>" + city.songs[i] + "</p>";
        }
    }
    innerHTML += "</div>";

    city.addListener('click', function() {
        infoWindow.setContent(innerHTML);
        infoWindow.open(map, city);
    });
}

function LoginControl(controlDiv, map) {
    var controlUI = document.createElement('div');
    controlUI.setAttribute("id", "loginControlUI");
    if (access_token == null) {
        controlUI.title = 'Click to login to Spotify';
    } else {
        controlUI.title = 'Already logged into Spotify';
    }
    controlDiv.appendChild(controlUI);

    var controlText = document.createElement('div');
    controlText.setAttribute("id", "loginControlText");
    if (!access_token) {
        controlText.innerHTML = "Login to Spotify <img id='spotify' src='spotify.png'/>";

    } else {
        controlText.innerHTML = controlText.innerHTML = "Logout <img id='spotify' src='spotify.png'/>";
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

