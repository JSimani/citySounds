var markers = [];
var infoWindow = null;
var curloc = null;
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

function initialize()
{
	myOptions = {
		zoom: 4.75, 
		center: {lat: 39.8283, lng: -98.5795},
		mapTypeId: "roadmap"
	};   
				
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    
    addLoginButton(map);
    infoWindow = addOverlay();
    getCurrentLocation();
    createMarkers(markers);
}

function initSpotify() {
    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = '[My Spotify Web API access token]';
        const player = new Spotify.Player({
            name: 'Web Playback SDK Quick Start Player',
            getOAuthToken: cb => { cb(token); }
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        // Playback status updates
        player.addListener('player_state_changed', state => { console.log(state); });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        player.connect();
    };

}

function addOverlay() {
    var closebtn = document.createElement('a');
    closebtn.setAttribute("href", "javascript:void(0)");
    closebtn.setAttribute("id", "closebtn");
    closebtn.setAttribute("onclick", "closeOverlay()");
    closebtn.innerHTML = "<a>&times;</a>";

    var overlayContent = document.createElement('div');
    overlayContent.setAttribute("id", "overlay-content");
    overlayContent.innerHTML = "<p>How'd you get here?!</p>";

    var mapObject = document.getElementById("map_canvas");

    var overlay = document.createElement('div');
    overlay.setAttribute("id", "overlay");

    overlay.appendChild(closebtn);
    overlay.appendChild(overlayContent);

    mapObject.appendChild(overlay);

    return document.getElementById("overlay-content");
}

function openOverlay() {
    document.getElementById("overlay").style.width = "100%";
}

function closeOverlay() {
    document.getElementById("overlay").style.width = "0%";
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

function initializeInfoWindow(marker) {
    var info = "<p id='iw-title'>" + marker.title + "</p>";
    if (!hasAccess()) {
        info += "<p><a href='/login'>Login to Spotify to View Songs</a></p>"; 
    } else {
        if (marker.songs) {
            info += "<p id='iw-subtitle'>Songs: </p>";

            for (var i = 0; i < marker.songs.length; i++) {
                var curTrack = marker.songs[i];
                info += "<p><a href='" + curTrack.external_urls.spotify + "'>" + curTrack.name + " by " + curTrack.artists[0].name + "</a></p>";
            }
        }

        if (marker.albums) {
            if (marker.songs) {
                info += "<br>";
            }

            info += "<p id='iw-subtitle'>Albums: </p>";

            for (var i = 0; i < marker.albums.length; i++) {
                var curAlbum = marker.albums[i];
                info += "<p><a href='" + curAlbum.external_urls.spotify + "'>" + curAlbum.name + " by " + curAlbum.artists[0].name + "</a></p>";
            }
        }

        if (marker.artists) {
            if (marker.songs || marker.albums) {
                info += "<br>";
            }

            info += "<p id='iw-subtitle'>Artists: </p>";

            for (var i = 0; i < marker.artists.length; i++) {
                var curArtist = marker.artists[i];
                info += "<p><a href='" + curArtist.external_urls.spotify + "'>" + curArtist.name + "</a></p>";
            }
        }
    }

    marker.addListener('click', function() {
        infoWindow.innerHTML = info;
        openOverlay();
    });
}



