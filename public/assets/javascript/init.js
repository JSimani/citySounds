var markers = [];
var infoWindow = null;
var curloc = null;
var params = null;
var device = null;
var playing = false;

function initialize()
{
    map = initMap();
    
    addLoginButton(map);
    addControlsButton(map);
    addSearchButton(map);
    infoWindow = addOverlay();
    getCurrentLocation();
    markers = createMarkers();
    if (hasAccess()) {
        initSpotify();
    }
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
    setTimeout(function(){ 
        document.getElementById("closebtn").style.position = "fixed";
    }, 500);
    
}

function closeOverlay() {
    document.getElementById("closebtn").style.position = "absolute";
    document.getElementById("overlay").style.width = "0%";
}

function initializeInfoWindow(marker) {
    var info = "<p id='iw-title'>" + marker.title + "</p>";
    if (!hasAccess()) {
        info += "<p><a href='/login'>Login to Spotify to View Songs</a></p>"; 
    } else {
        if (marker.songs.length > 0) {
            info += "<p id='iw-subtitle'>Songs: </p>";

            for (var i = 0; i < marker.songs.length; i++) {
                var curTrack = marker.songs[i];
                info += "<p><a class='link' onclick='playMedia(\"" + curTrack.uri + "\");'>" + curTrack.name + " by " + curTrack.artists[0].name + "</a></p>";
            }
        }

        if (marker.albums.length > 0) {
            if (marker.songs.length > 0) {
                info += "<br>";
            }

            info += "<p id='iw-subtitle'>Albums: </p>";

            for (var i = 0; i < marker.albums.length; i++) {
                var curAlbum = marker.albums[i];
                    
                info += "<p><a class='link' onclick='playMedia(\"" + curAlbum.uri + "\");'>" + curAlbum.name + " by " + curAlbum.artists[0].name + "</a></p>";
            }
        }

        if (marker.artists.length > 0) {
            if (marker.songs.length > 0 || marker.albums.length > 0) {
                info += "<br>";
            }

            info += "<p id='iw-subtitle'>Artists: </p>";

            for (var i = 0; i < marker.artists.length; i++) {
                var curArtist = marker.artists[i];
                
                info += "<p><a class='link' onclick='playMedia(\"" + curArtist.uri + "\");'>" + curArtist.name + "</a></p>";
            }
        }

        if (!(marker.songs.length > 0 || marker.albums.length > 0 || marker.artists.length > 0)) {
            info += "<p>No Results</p>";
        }
    }

    marker.addListener('click', function() {
        infoWindow.innerHTML = info;
        openOverlay();
    });
}

function getEmbeddedURL(spotify_uri) {
    var embedURL = "https://open.spotify.com/embed/";
    spotify_uri = spotify_uri.substring(8, spotify_uri.length);

    if (spotify_uri.substring(0, 5) == 'album') {
        spotify_uri = spotify_uri.substring(6, spotify_uri.length);
        embedURL += "album/" + spotify_uri;
    } else if (spotify_uri.substring(0, 5) == 'track') {
        spotify_uri = spotify_uri.substring(6, spotify_uri.length);
        embedURL += "track/" + spotify_uri;
    } else if (spotify_uri.substring(0, 6) == 'artist') {
        spotify_uri = spotify_uri.substring(7, spotify_uri.length);
        embedURL += "artist/" + spotify_uri;
    } else {
        embedURL = "parsing error";
    }

    return embedURL;
}


