function initSpotify() {
    var script = document.createElement("script"); 
    script.src = "https://sdk.scdn.co/spotify-player.js"; 

    document.head.appendChild(script);  

    window.onSpotifyWebPlaybackSDKReady = () => {
        const token = access_token;
        player = new Spotify.Player({
            name: 'citySounds Player',
            getOAuthToken: cb => { cb(token); }
        });

        // Error handling
        player.addListener('initialization_error', ({ message }) => { console.error(message); });
        player.addListener('authentication_error', ({ message }) => { console.error(message); });
        player.addListener('account_error', ({ message }) => { console.error(message); });
        player.addListener('playback_error', ({ message }) => { console.error(message); });

        // Playback status updates
        // player.addListener('player_state_changed', state => { console.log(state); });

        // Ready
        player.addListener('ready', ({ device_id }) => {
            console.log('Ready with Device ID', device_id);
            device = device_id;
            // console.log("device: " + device);
            // playMedia("spotify:album:78yPA5hNyDnuTF42jJyblN");
        });

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
        });

        // Connect to the player!
        player.connect();
    };
}

function playMedia(spotify_uri) {
    var controlDiv = document.getElementById("playerControlText");
    controlDiv.innerHTML = "<img id='player-button' src='assets/images/pause.png' onclick='pauseMedia();' alt='pause'/>";

    if (!spotify_uri) {
        player.resume();
        return;
    }

    var currentState = player.getCurrentState();
    // console.log("currentState: ", currentState);

    var query = "https://api.spotify.com/v1/me/player/play?device_id=" + device;
    var request = new XMLHttpRequest();
    request.open("PUT", query, true);
    request.setRequestHeader('Authorization', 'Bearer '+ access_token);
    var data = {
        context_uri: spotify_uri
    };
    var body = JSON.stringify(data);

    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {

        }
    }
    request.send(body);
}

function pauseMedia() {
    player.pause();
    var controlDiv = document.getElementById("playerControlText");
    controlDiv.innerHTML = "<img id='player-button' src='assets/images/play.png' onclick='playMedia(null);' alt='play'/>";
}

function addControlsButton(map) {
    if (!hasAccess() || localStorage.account_type != "premium") {
        return;
    }

    var playerControlDiv = document.createElement('div');
    var centerControl = new PlayerControl(playerControlDiv, map);
    playerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(playerControlDiv);
}

function PlayerControl(controlDiv, map) {
    var controlUI = document.createElement('div');
    controlUI.setAttribute("id", "playerControlUI");

    controlDiv.appendChild(controlUI);

    var controlText = document.createElement('div');
    controlText.setAttribute("id", "playerControlText");    
    controlUI.appendChild(controlText);
}





