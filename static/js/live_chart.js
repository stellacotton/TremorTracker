data = [];
 
var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = 800 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
 
var x = d3.scale.linear()
    .domain([1, 100])
    .range([0, width]);
 
var y = d3.scale.linear()
    .domain([-15, 15])
    .range([height, 0]);

// var now = new Date();

// var x = d3.time.scale().range([0, width])
//     .domain([new Date(+(now)-(10*1000)), new Date(+(now))]);

// var xAxis = d3.svg.axis().scale(x)
//     .tickPadding(6).ticks(5).orient("bottom");
 
var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d, i) { return x(i); })
    .y(function(d, i) { return y(d); });
 
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
 
svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);
 
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + y(0) + ")")
    .call(d3.svg.axis().scale(x).orient("bottom"));
 
svg.append("g")
    .attr("class", "y axis")
    .call(d3.svg.axis().scale(y).orient("left"));
 
var path = svg.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);


function tick() {
    if (buffer.length) {
        data.push(buffer.shift());

    }

    // redraw the line, and slide it to the left
    path
        .attr("d", line)
        .attr("transform", null)
      .transition()
        .duration(500)
        .ease("linear")
        .attr("transform", "translate(" + x(0) + ",0)");

    // pop the old data point off the front

    if (data.length > 100) {
          data.shift();
      }
    }

// Websocket calls push() every second when in recording mode, returns 20 samples every second
var buffer = [];
function push(x_coord) {

    if (buffer.length) {
      data.push.apply(data, buffer);
    }

    buffer = x_coord;
//adds each point to the master dataset and runs tick()

    //timers to clear tick() when websocket closes
    clearTimeout(window.countdown);

    window.countdown = setTimeout(function () {
      clearInterval(window.timer);
    },2000);
    
    clearInterval(window.timer);

    //tick() redraws the line every 50ms
    window.timer = setInterval(tick,50);
    

}
