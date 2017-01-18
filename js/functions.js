var map;
var markersInfo = [];
var radius = 3; // 3 kilometres
var radiusInKm = radius * 1000;
var apiURL = "https://data.gov.uk/data/api/service/transport/naptan_coach_stations/postcode?postcode=WC1E7BL&distance=" + radius;

// getJSON function
function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
	            var res = xhr.responseText;
                callback(JSON.parse(res));
            } else {
                console.error(xhr.statusText);
            } 
        } 
    };
    // Handle an error with the request
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    }; // End of error handling
    
    // Send the request to the server
    xhr.send(null);
} // End of getJSON function

// Using the getJSON function
getJSON(apiURL, function(data) {
    console.log(data);


	// Loop through the results array 
    for (var i = 0; i < data.result.length; i++) {

  	var name = data.result[i].name;
  	var distance = data.result[i].distance.toFixed(1);

  	//Create List
  	var listElement = document.createElement("li");
	    listElement.innerHTML = '<button type="button" class="btn btn-lg btn-default">' + name + '</button>';
    
    document.getElementById("list").appendChild(listElement);


    // Create Markers
    var coords = data.result[i].latlong.coordinates;
    var latLng = new google.maps.LatLng(coords[1],coords[0]);
    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      animation: google.maps.Animation.DROP
    });
	

	// Create Highlight
	function addInfoWindow(marker, message) {

	    var infoWindow = new google.maps.InfoWindow({
	        content: message
	    });

	    google.maps.event.addListener(marker, 'click', function () {  
            closeMarkersInfo();
	        infoWindow.open(map, marker);
            markersInfo[0]=infoWindow;
	    });

	    listElement.onclick = function(){
            closeMarkersInfo();
	        infoWindow.open(map, marker);
            markersInfo[0]=infoWindow;
	    }

	}	

	addInfoWindow(marker, name + '<br>' + distance + 'km from Imagination');
}

    // Create Imagination marker 
    var marker = new google.maps.Marker({
    map: map,
    icon: 'http://wantedwebdeveloper.co.uk/imagination/imagination.png',
    position: new google.maps.LatLng(51.51923, -0.131882),
    title: 'Imagination'
    });

    // Add circle overlay and bind to marker
    var circle = new google.maps.Circle({
    map: map,
    radius: radiusInKm,   
    fillColor: '#AA0000'
    });
    circle.bindTo('center', marker, 'position');

}); // End of request

function closeMarkersInfo(){
 
   if(markersInfo.length > 0){
      markersInfo[0].set("marker", null); 
      markersInfo[0].close();
      markersInfo.length = 0;
   }
}

function initMap() {

	var imLatlng = new google.maps.LatLng(51.51923, -0.131882);

 	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 13,              
    	center: imLatlng
  	});	

}

