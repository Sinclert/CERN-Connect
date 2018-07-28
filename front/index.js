var map = L.map('mapid', {
    maxZoom: 18,
    minZoom: 16,
    maxBounds: [
        //south west
        [46.18, 6.1],
        //north east
        [46.3, 5.95]
        ]
}).setView([46.2363, 6.0412], 16);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);


var eventNames = [];
var colors = [
	"#00FF00",
	"#00FFFF",
	"#000080",
	"#800080",
	"#FFFF00",
]


function loadEvents() {

	var layer = $("#list");
	var string = "";

	$.ajax({
		type: "GET",
		url: "http://localhost:8080/events/",
		success: function(events) {

			var events = JSON.parse(events);
			events.forEach(function(event) {
				string += "<div class=\"item\">"
				+ "<div class=\"header\"><input type=\"checkbox\" name=\"" + event.name
				+ " value=\"" + event.name + "\" />&nbsp&nbsp&nbsp"
				+ event.name + "</div>"
				+ event.time + "</div>";
			})
			document.getElementById("list").innerHTML = string
		}
	});

}

function fetchEvents() {

	$.ajax({
		type: "GET",
		url: "http://localhost:8080/fetch/",
		success: function(events) {
			clearMap();
			var events = JSON.parse(events);
			eventNames = [];
			
			events.forEach( function(element, index) {
				eventNames.push({title: element.name})
				paintBuilding(element.location, colors[index]);
				paintMembers(element.members, colors[index]);
			});

			$('.ui.search').search({
				source: eventNames
			});
			
		}
	});
}


/** Clears the map from circles and popups */
function clearMap() {

    for (i in map._layers) {

        if (map._layers[i]._path != undefined || map._layers[i]._icon != undefined) {
            try {
                map.removeLayer(map._layers[i]);
            }
            catch(e) {
                console.log("problem with " + e + map._layers[i]);
            }
        }
    }
}


function paintBuilding(coordinates, color) {
	L.rectangle(coordinates, {color: color, weight: 10}).addTo(map);
}


function paintMembers(members, color) {

	members.forEach( function(element, index) {
		L.circleMarker(element.coordinates, {color: color, title: element.username}).addTo(map).on('click', function(e) {
			onClick(e);
		});
	});
}

function onClick(e) {
	alert(e.target.options.title);
}



// ####################################################################

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

function onLocationFound(e) {
	var radius = e.accuracy / 2;

	L.marker(e.latlng).addTo(map)
		.bindPopup("You are within " + radius + " meters from this point").openPopup();

	L.circle(e.latlng, radius).addTo(map);

	console.log(e.latlng)
	//TODO send this to server
	sendLocation(e)
}

$("#submitData").on("click", function(e) {
    console.log(e);
    // e.preventDefault();
    var formData = new FormData(e);
    console.log(formData);
    var obj = {};
    obj['event_ids'] = JSON.stringify(formData);
    obj['username'] = "Batman" ;
    obj['coordinates'] = [1,2];
    $.ajax({
        type: "POST",
        dataType: 'json',
        url: "http://localhost:8080/upload/",
        contentType: 'application/json',
        data: JSON.stringify(obj),
        success: function(data){
            console.log("DATA POSTED SUCCESSFULLY"+data);
        },
        // data: {
        //     "username": "my_username",
        //     "coordinates": [1,2],
        //     "event_ids": [1]
        // },
    });
});


// Leaflet style get location:
map.locate({setView: false, maxZoom: 16}); // setView: true if we want to set the map to the user position

map.on('locationfound', onLocationFound);

loadEvents();
var fetchInterval = setInterval(fetchEvents, 3000);

