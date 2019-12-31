///////////////////////////////////////////////////////////////////
///////////////// Top Spotify Songs Visualization /////////////////
////////////////////// Interactive Song Map ///////////////////////
///////////////////////////////////////////////////////////////////

///////////////////////////////////
/////// Spotify Access Token //////
///////////////////////////////////

// var accessToken = ""


///////////////////////////////////
/////// Interactive Song Map //////
///////////////////////////////////
var appSelect = d3.select(".force-graph")
var dataURL = '/top_data'
console.log(dataURL)


// var svgWidth = 960;
// var svgHeight = 500;
//     padding = 6, // separation between nodes
//     maxRadius = 12;

// var n = 200, // total number of nodes
//     m = 10; // number of distinct clusters

// var color = d3.scaleOrdinal(d3.schemeCategory10)
//     .domain(d3.range(m));

// var x = d3.scaleOrdinal()
//     .domain(d3.range(m))
//     .range([0, width], 1);

// var nodes = d3.range(n).map(function() {
//   var i = Math.floor(Math.random() * m),
//       v = (i + 1) / m * -Math.log(Math.random());
//   return {
//     radius: Math.sqrt(v) * maxRadius,
//     color: color(i),
//     cx: x(i),
//     cy: height / 2
//   };
// });

// var force = d3.forceSimulation()
//     .nodes(nodes)
//     .size([width, height])
//     .gravity(0)
//     .charge(0)
//     .on("tick", tick)
//     .start();

// var svg = appSelect.append("svg")
//     .attr("width", width)
//     .attr("height", height);

// var circle = svg.selectAll("circle")
//     .data(nodes)
//   .enter().append("circle")
//     .attr("r", function(d) { return d.radius; })
//     .style("fill", function(d) { return d.color; })
//     .call(force.drag);

// function tick(e) {
//   circle
//       .each(gravity(.2 * e.alpha))
//       .each(collide(.5))
//       .attr("cx", function(d) { return d.x; })
//       .attr("cy", function(d) { return d.y; });
// }

// // Move nodes toward cluster focus.
// function gravity(alpha) {
//   return function(d) {
//     d.y += (d.cy - d.y) * alpha;
//     d.x += (d.cx - d.x) * alpha;
//   };
// }

// // Resolve collisions between nodes.
// function collide(alpha) {
//   var quadtree = d3.geom.quadtree(nodes);
//   return function(d) {
//     var r = d.radius + maxRadius + padding,
//         nx1 = d.x - r,
//         nx2 = d.x + r,
//         ny1 = d.y - r,
//         ny2 = d.y + r;
//     quadtree.visit(function(quad, x1, y1, x2, y2) {
//       if (quad.point && (quad.point !== d)) {
//         var x = d.x - quad.point.x,
//             y = d.y - quad.point.y,
//             l = Math.sqrt(x * x + y * y),
//             r = d.radius + quad.point.radius + (d.color !== quad.point.color) * padding;
//         if (l < r) {
//           l = (l - r) / l * alpha;
//           d.x -= x *= l;
//           d.y -= y *= l;
//           quad.point.x += x;
//           quad.point.y += y;
//         }
//       }
//       return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
//     });
//   };
// }




var width = 960,
    height = 500,
    maxRadius = 12;

var n = 200, // total number of circles
    m = 10; // number of distinct clusters

var color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(d3.range(m));

// The largest node for each cluster.
var clusters = new Array(m);

var nodes = d3.range(n).map(function() {
  var i = Math.floor(Math.random() * m),
      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
      d = {cluster: i, radius: r};
  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
  return d;
});

var forceCollide = d3.forceCollide()
    .radius(function(d) { return d.radius + 1.5; })
    .iterations(1);

var force = d3.forceSimulation()
    .nodes(nodes)
    .force("center", d3.forceCenter())
    .force("collide", forceCollide)
    .force("cluster", forceCluster)
    .force("gravity", d3.forceManyBody(30))
    .force("x", d3.forceX().strength(.7))
    .force("y", d3.forceY().strength(.7))
    .on("tick", tick);

var svg = appSelect.append("svg")
    .attr("width", width)
    .attr("height", height)
  .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

var circle = svg.selectAll("circle")
    .data(nodes)
  .enter().append("circle")
    .attr("r", function(d) { return d.radius; })
    .style("fill", function(d) { return color(d.cluster); })
//    TODO: Update for v4
//    .call(force.drag);

function tick() {
  circle
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
}

function forceCluster(alpha) {
  for (var i = 0, n = nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
    node = nodes[i];
    cluster = clusters[node.cluster];
    node.vx -= (node.x - cluster.x) * k;
    node.vy -= (node.y - cluster.y) * k;
  }
}






///////////////////////////////////
////////// SDK Play Music /////////
///////////////////////////////////












console.log("end app.js here!!")












///////////////////////////////////////////////////////////////////
///////////////// Top Spotify Songs Visualization /////////////////
//////////////////// End Visualization Script /////////////////////
///////////////////////////////////////////////////////////////////