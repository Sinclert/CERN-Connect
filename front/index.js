
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


function loadEvents() {

	// HTTP request to initiate the streaming process
	$.ajax({
		type: "POST",
		url: "/events",
		success: function(events) {

			var events = JSON.parse(events);
		}
	});
}