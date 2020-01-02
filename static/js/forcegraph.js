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


// var tooltip = appSelect
// 	.append("div")
// 	.attr("class", "tooltip")
// 	.style("opacity", 0);


// d3.json(dataURL).then(data => {
//     console.log(data)


// var width = 960;
// var height = 500;
// var maxRadius = 12;

// var n = 250; // total number of circles
// var m = 10; // number of distinct clusters

// var color = d3.scaleOrdinal(d3.schemeCategory10)
//     .domain(d3.range(m));

// var div = appSelect.append("div") 
// .attr("class", "tooltip")       
// .style("opacity", 0);


// // The largest node for each cluster.
// var clusters = new Array(m);

// var nodes = d3.range(n).map(function() {
//   var i = Math.floor(Math.random() * m),
//       r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
//       d = {cluster: i, radius: r};
//   if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
//   return d;
// });

// var forceCollide = d3.forceCollide()
//     .radius(function(d) { return d.radius + 1.5; })
//     .iterations(1);

// var force = d3.forceSimulation()
//     .nodes(nodes)
//     .force("center", d3.forceCenter())
//     .force("collide", forceCollide)
//     .force("cluster", forceCluster)
//     .force("gravity", d3.forceManyBody(30))
//     .force("x", d3.forceX().strength(.7))
//     .force("y", d3.forceY().strength(.7))
//     .on("tick", tick);

// var svg = appSelect.append("svg")
//     .attr("width", width)
//     .attr("height", height)
//     .append('g')
//     .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

// var circle = svg.selectAll("circle")
//     .data(nodes)
//     .enter()
//     .append("circle")
//     .attr("r", function(d) { return d.radius; })
//     .style("fill", function(d) { return color(d.cluster); })
//     .on("mouseover", function(d) {
//         div.transition()    
//             .duration(200)    
//             .style("opacity", .9);    
//         div.html( "hi")  
//             .style("left", (d3.event.pageX) + "px")   
//             .style("top", (d3.event.pageY - 28) + "px");  
//         })          
//     .on("mouseout", function(d) {   
//         div.transition()    
//             .duration(500)    
//             .style("opacity", 0); 
//     });







// var margin = {top: 100, right: 100, bottom: 100, left: 100};

var width = window.innerWidth,
    height = 700,
    padding = 1.5, // separation between same-color circles
    clusterPadding = 6, // separation between different-color circles
    maxRadius = 25;

var n = 200; // total number of nodes
var m = 10; // number of distinct clusters
// let z = d3.scaleOrdinal(d3.schemeCategory10);
var z = d3.scaleOrdinal(d3.schemeCategory10).domain(d3.range(m));
var clusters = new Array(m);

var svg = appSelect
    .append('svg')
    .attr('height', height)
    .attr('width', width)
    .append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

// Define the div for the tooltip
var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

//load college major data
d3.json(dataURL).then(d => {
  var radiusScale = d3.scaleLinear()
    .domain(d3.extent(d, function(d) { return +d.energy*100;} ))
    .range([4, maxRadius]);

console.log(radiusScale(300000));

  var nodes = d.map((d) => {
    // scale radius to fit on the screen
    var scaledRadius  = radiusScale(+d.energy*100),
        forcedCluster = +d.genre;

    // add cluster id and radius to array
    d = {
      cluster     : forcedCluster,
      r           : scaledRadius,
      name        : d.name,
      genre       : d.genre,
      id          : d.id,
      popularity  : d.popularity
    };
    // add to clusters array if it doesn't exist or the radius is larger than another radius in the cluster
    if (!clusters[forcedCluster] || (scaledRadius > clusters[forcedCluster].r)) clusters[forcedCluster] = d;

    return d;
  });
  

  // append the circles to svg then style
  // add functions for interaction
  var circles = svg.append('g')
        .datum(nodes)
      .selectAll('.circle')
        .data(d => d)
      .enter().append('circle')
        .attr('r', (d) => d.r)
        .attr('fill', (d) => z(d.cluster))
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        // add tooltips to each circle
        .on("mouseover", function(d) {
            div.transition()    
                .duration(200)    
                .style("opacity", .9);    
            div .html( "<b>Song: </b>" + d.name + "<br/><b>Genre: </b>" + d.genre + "<br/><b>Popularity: </b>" + d.popularity)  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        })
        .on("click", function(d) {
          console.log(d.id)
        })
        ;

  // create the clustering/collision force simulation
  var simulation = d3.forceSimulation(nodes)
      .velocityDecay(0.2)
      .force("x", d3.forceX().strength(.0005))
      .force("y", d3.forceY().strength(.0005))
      .force("collide", collide)
      .force("cluster", clustering)
      .on("tick", ticked);

  function ticked() {
      circles
          .attr('cx', (d) => d.x)
          .attr('cy', (d) => d.y);
  }

  // Drag functions used for interactivity
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  // These are implementations of the custom forces.
  function clustering(alpha) {
      nodes.forEach(function(d) {
        var cluster = clusters[d.cluster];
        if (cluster === d) return;
        var x = d.x - cluster.x,
            y = d.y - cluster.y,
            l = Math.sqrt(x * x + y * y),
            r = d.r + cluster.r;
        if (l !== r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          cluster.x += x;
          cluster.y += y;
        }
      });
  }

  function collide(alpha) {
    var quadtree = d3.quadtree()
        .x((d) => d.x)
        .y((d) => d.y)
        .addAll(nodes);

    nodes.forEach(function(d) {
      var r = d.r + maxRadius + Math.max(padding, clusterPadding),
          nx1 = d.x - r,
          nx2 = d.x + r,
          ny1 = d.y - r,
          ny2 = d.y + r;
      quadtree.visit(function(quad, x1, y1, x2, y2) {

        if (quad.data && (quad.data !== d)) {
          var x = d.x - quad.data.x,
              y = d.y - quad.data.y,
              l = Math.sqrt(x * x + y * y),
              r = d.r + quad.data.r + (d.cluster === quad.data.cluster ? padding : clusterPadding);
          if (l < r) {
            l = (l - r) / l * alpha;
            d.x -= x *= l;
            d.y -= y *= l;
            quad.data.x += x;
            quad.data.y += y;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
    });
  }


});




































// function tick() {
//   circle
//       .attr("cx", function(d) { return d.x; })
//       .attr("cy", function(d) { return d.y; });
// }

// function forceCluster(alpha) {
//   for (var i = 0, n = nodes.length, node, cluster, k = alpha * 1; i < n; ++i) {
//     node = nodes[i];
//     cluster = clusters[node.cluster];
//     node.vx -= (node.x - cluster.x) * k;
//     node.vy -= (node.y - cluster.y) * k;
//   }
// }


// })



///////////////////////////////////
////////// SDK Play Music /////////
///////////////////////////////////












console.log("end app.js here!!")












///////////////////////////////////////////////////////////////////
///////////////// Top Spotify Songs Visualization /////////////////
//////////////////// End Visualization Script /////////////////////
///////////////////////////////////////////////////////////////////