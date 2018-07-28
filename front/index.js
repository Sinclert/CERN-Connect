var mymap = L.map('mapid').setView([46.2363, 6.0412], 16);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
			'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox.streets'
	}).addTo(mymap);

	// ####################################################################
	// Leaflet style get location:
	mymap.locate({setView: false, maxZoom: 16}); // setView: true if we want to set the map to the user position

	function onLocationFound(e) {
		var radius = e.accuracy / 2;
	
		L.marker(e.latlng).addTo(mymap)
			.bindPopup("You are within " + radius + " meters from this point").openPopup();
	
		L.circle(e.latlng, radius).addTo(mymap);

		console.log(e.latlng)
		//TODO send this to server
		sendLocation(e)
	}
	
	mymap.on('locationfound', onLocationFound);

	// Not working
	function sendLocation(location) {
		var xhr = new XMLHttpRequest();
		var url = "http://127.0.0.1:5000/";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var json = JSON.parse(xhr.responseText);
				console.log(json);
			}
		};
		console.log(location.latlng);
		var data = JSON.stringify({"username": "myusername", "coordinates": [location.latlng.lat, location.latlng.lng], "events": []  });
		xhr.send(data);
	}
