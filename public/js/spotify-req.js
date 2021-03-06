function addSongs(marker, open) {
    if (hasAccess()) {
        var query = 'https://api.spotify.com/v1/search?q=track:' + marker.search + '&type=track&limit=5';
        var request = new XMLHttpRequest();
        request.open("GET", query, true);
        request.setRequestHeader('Authorization', 'Bearer '+ access_token);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var rawData = request.responseText;
                var parsedData = JSON.parse(rawData);

                marker.songs = [];
                if (!parsedData.tracks) {
                    return;
                }
                for (var i = 0; i < parsedData.tracks.items.length; i++) {
                    marker.songs.push(parsedData.tracks.items[i]);
                }

                initializeInfoWindow(marker, open);
            }
        }
        request.send();

    }
}

function addAlbums(marker, open) {
    if (hasAccess()) {
        var query = 'https://api.spotify.com/v1/search?q=album:' + marker.search + '&type=album&limit=5';
        var request = new XMLHttpRequest();
        request.open("GET", query, true);
        request.setRequestHeader('Authorization', 'Bearer '+ access_token);
        request.onload = function() {
            var rawData = request.responseText;
            var parsedData = JSON.parse(rawData);

            marker.albums = [];
            if (!parsedData.albums) {
                return;
            }
            for (var i = 0; i < parsedData.albums.items.length; i++) {
                marker.albums.push(parsedData.albums.items[i]);
            }
            
            initializeInfoWindow(marker, open);
        }
        request.send();

    } 
}

function addArtists(marker, open) {
    if (hasAccess()) {
        var query = 'https://api.spotify.com/v1/search?q=artist:' + marker.search + '&type=artist&limit=5';
        var request = new XMLHttpRequest();
        request.open("GET", query, true);
        request.setRequestHeader('Authorization', 'Bearer '+ access_token);
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var rawData = request.responseText;
                var parsedData = JSON.parse(rawData);

                if (!parsedData.artists) {
                    return;
                }

                marker.artists = [];
                for (var i = 0; i < parsedData.artists.items.length; i++) {
                    marker.artists.push(parsedData.artists.items[i]);
                }
                
                initializeInfoWindow(marker, open);
            }
        }
        request.send();

    } 
}

function currentSong() {
    if (hasAccess()) {
        var query = 'https://api.spotify.com/v1/me/player/currently-playing';
        var request = new XMLHttpRequest();
        request.open("GET", query, true);
        request.setRequestHeader('Authorization', 'Bearer '+ access_token);
        request.onreadystatechange = function() {
            if (request.readyState == 4) {
                var rawData = request.responseText;
                var parsedData = JSON.parse(rawData);

                console.log(parsedData);
            }
        }
        request.send();

    } 
}