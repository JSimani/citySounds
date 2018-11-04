var map = null;
var markers = [];

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
    ['New Orleans', 29.9511, -90.0715]
];

function initMap()
{
	myOptions = {
		zoom: 4.75, 
		center: {lat: 39.8283, lng: -98.5795},
		mapTypeId: "roadmap"
	};   
				
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
    createMarkers();
}


function createMarkers() {
    for (var i = 0; i < cities.length; i++) {
        city = cities[i];

        var marker = new google.maps.Marker({
            position: {lat: city[1], lng: city[2]},
            map: map,
            title: city[0]
        });

        markers.push(marker);
    }
}