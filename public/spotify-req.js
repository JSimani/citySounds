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