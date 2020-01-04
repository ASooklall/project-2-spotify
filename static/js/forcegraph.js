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

// set initial variables
var width = window.innerWidth,
    height = 700,
    padding = 1.5, // separation between same-color circles
    clusterPadding = 6, // separation between different-color circles
    maxRadius = 25;

var n = 200; // total number of nodes
var m = 10; // number of distinct clusters
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

//load data
d3.json(dataURL).then(d => {


  // set radius scale
  var radiusScale = d3.scaleLinear()
    .domain(d3.extent(d, function(d) { return +d.popularity*d.popularity*d.popularity/100;} ))
    .range([4, maxRadius]);


  // add placeholder variables for genre chromatic code
  var genreCode = {}
  var genreCounter = 1
  
  // map each node
  var nodes = d.map((d) => {

      // match genre to an integer code for the chromatic scale
      if (!(d.genre in genreCode)) {
        genreCode[d.genre] = genreCounter
        genreCounter++
      }

    // scale radius to fit on the screen
    var scaledRadius  = radiusScale(+d.popularity*d.popularity*d.popularity/100),
        forcedCluster = +genreCode[d.genre];

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
  
  // import play from "playback.js"
  
  
  var circles = svg.append('g')
        .datum(nodes)
      .selectAll('.circle')
        .data(d => d)
      .enter().append('circle')
        .attr('r', (d) => d.r)
        .attr('fill', (d) => z(d.cluster))
        .attr('fill-opacity',0.65)
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
            div.html( "<b>Song: </b>" + d.name + "<br/><b>Genre: </b>" + d.genre + "<br/><b>Popularity: </b>" + d.popularity)  
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px");  
            })          
        .on("mouseout", function(d) {   
            div.transition()    
                .duration(500)    
                .style("opacity", 0); 
        })
        .on("click", function(d) {
           uri_id = d.id;
            
           console.log(uri_id)
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

  // Populate Legend with keys and colors

var legendRow = d3.select(".legend-container").append("div").attr("class","row legendRow offset-1")

  Object.keys(genreCode).forEach(color => {
    // console.log(color, z(genreCode[color]))
    var legendCol = legendRow.append("div").attr("class","col-md-1 legendCol")
    var legendText = legendCol.append("p")  .attr("class","legendText")
    legendText
    .html(`${color}`)
    .attr("style", `color:${z(genreCode[color])};`)
  })

});






///////////////////////////////////
////////// SDK Play Music /////////
///////////////////////////////////

console.log("----------------------------")
console.log("begin SDK Here")










console.log("end app.js here!!")
console.log("----------------------------")











///////////////////////////////////////////////////////////////////
///////////////// Top Spotify Songs Visualization /////////////////
//////////////////// End Visualization Script /////////////////////
///////////////////////////////////////////////////////////////////