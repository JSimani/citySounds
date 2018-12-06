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
    ['Portland', 45.5122, -122.6587],
    ['London', 51.5074, -0.1278],
    ['Paris', 48.8566, 2.3522],
    ['Madrid', 40.4168, -3.7038],
    ['Tokyo', 35.6895, 139.6917],
    ['Santa', 86, 0],
    ['Cape Town', -33.9249, 18.4241],
    ['Rio', -22.9068, -43.1729],
    ['Istanbul', 41.0082, 28.9784],
    ['Rome', 41.9028, 12.4964],
    ['Jerusalem', 31.7683, 35.2137],
    ['Cairo', 30.0444, 31.2357],
    []
];

function initMap() {
    myOptions = {
        zoom: 4.75, 
        center: {lat: 39.8283, lng: -98.5795},
        mapTypeId: "roadmap"
    };   
                
    return new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}

function createMarkers() {
    var markers = [];
    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

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

    return markers;
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
                    url: "assets/images/curloc.png",
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
