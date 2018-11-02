function initMap()
{
				myOptions = {
				zoom: 13, 
				center: {lat: 42.3583333, lng: -71.0602778},
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
				
				map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
}