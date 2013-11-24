var x_samples = [];
var y_samples = [];
var z_samples = [];

var totalSamples = {};


function gather_samples () {
	var timestamp = Date.now();
	key = String(timestamp);

	totalSamples[key] = ({
        "x" : x_samples,
        "y" : y_samples,
        "z" : z_samples
    });

	x_samples = [];
	y_samples = [];
	z_samples = [];
}

var x_dom = $('.x');
var y_dom = $('.y');
var z_dom = $('.z');

var startTracking = function () {

	window.ondevicemotion = function(event) {
		var x = event.acceleration.x;
		var y = event.acceleration.y;
		var z = event.acceleration.z;
		x_dom.html(x);
		y_dom.html(y);
		z_dom.html(z);

		x_samples.push(x);
		y_samples.push(y);
		z_samples.push(z);
		
	};

	window.gatherTimer = setInterval(gather_samples,1000);
};
   
 $(document).ready(function() {
				console.log('ready!');
			});

 $("#submit").click(function (e) {
	console.log("Things finished");
	e.preventDefault(); //Overrides submit button defaults
	clearInterval(window.gatherTimer);
	window.ondevicemotion = undefined;
	$('.results').html("Loading...");
	$.post('/send_pkg', {samples: JSON.stringify(totalSamples)},
                        function(response){
                        $('.results').html(response);
        });

});
