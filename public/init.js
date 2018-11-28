var markers = [];
var infoWindow = null;
var curloc = null;
var params = null;

function initialize()
{
	map = initMap();
    
    addLoginButton(map);
    infoWindow = addOverlay();
    getCurrentLocation();
    markers = createMarkers();
    initSpotify();
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



