function initMap()
{
	myOptions = {
		zoom: 4.75, 
		center: {lat: 39.8283, lng: -98.5795},
		mapTypeId: "roadmap"
	};   
				
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}