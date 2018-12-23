function initPlayer() {
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

        // Ready
        player.addListener('ready', ({ device_id }) => {
            device = device_id;
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
    controlDiv.innerHTML = '<iframe src=\"' + getEmbeddedURL(spotify_uri) + '\" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>';
    closeOverlay();
}

function addControlsButton(map) {
    if (!hasAccess()) {
        return;
    }

    var playerControlDiv = document.createElement('div');
    var centerControl = new PlayerControl(playerControlDiv, map);
    playerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(playerControlDiv);
}

function PlayerControl(controlDiv, map) {
    var controlUI = document.createElement('div');
    controlUI.setAttribute("id", "playerControlUI");

    controlDiv.appendChild(controlUI);

    var controlText = document.createElement('div');
    controlText.setAttribute("id", "playerControlText");    
    controlUI.appendChild(controlText);
}

function supportedPlayback() {
    var config = [
        {
            "initDataTypes": ["cenc"],
            "audioCapabilities": [
                {
                    "contentType": "audio/mp4;codecs=\"mp4a.40.2\""
                }
            ],
            "videoCapabilities": [
                {
                    "contentType": "video/mp4;codecs=\"avc1.42E01E\""
                }
            ]
        }
    ];
    try {
        navigator.
        requestMediaKeySystemAccess("com.widevine.alpha", config).
        then(function(mediaKeySystemAccess) {
            return true;
        }).catch(function(e) {
            return false;
        });
    } catch (e) {
        return false;
    }
    return true;
}



