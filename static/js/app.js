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
// appSelect.html("");















// var width = 300, height = 300
// var numNodes = 100
// var nodes = d3.range(numNodes).map(function(d) {
//   return {radius: Math.random() * 25}
// })

// var simulation = d3.forceSimulation(nodes)
//   .force('charge', d3.forceManyBody().strength(5))
//   .force('center', d3.forceCenter(width / 2, height / 2))
//   .force('collision', d3.forceCollide().radius(function(d) {
//     return d.radius
//   }))




// function init() {
//     appSelect.html("")

//     var width = 300, height = 300
//     // var nodes = [{}, {}, {}, {}, {}]
//     var numNodes = 100
// var nodes = d3.range(numNodes).map(function(d) {
//   return {radius: Math.random() * 25}
// })
    
//     var simulation = d3.forceSimulation(nodes)
//       .force('charge', d3.forceManyBody())
//       .force('center', d3.forceCenter(width / 2, height / 2))
//       .on('tick', ticked);

//       function ticked() {
//         var z21 = appSelect.append('svg')
//         var u = z21.select('svg')
//           .selectAll('circle')
//           .data(nodes)
      
//         u.enter()
//           .append('circle')
//           .attr('r', 5)
//           .merge(u)
//           .attr('cx', function(d) {
//             return d.x
//           })
//           .attr('cy', function(d) {
//             return d.y
//           })
      
//         u.exit().remove()
//       }




// };


// init()




var dataURL = '/top_data'
console.log(dataURL)



// var svg = d3.select("canvas").append("svg")
//     .attr("width", width)
//     .attr("height", height);

d3.json(dataURL).then(data => {
    console.log("testdata")
    console.log(data)
});


function buildChart() {
    console.log("hi upper");
d3.json(dataURL).then(data => {
// function buildData(){
    console.log(data);
    console.log("hi");


const svg = d3.select('.force-graph').append('svg')
  .style('width', '100%')
  .style('height', '100%');

const group = svg.append('g')
  .attr('class', 'node')
  .attr('transform', 'translate(10,10)');

const foreignObject = group.append('foreignObject')
  .attr('width', 600)
  .attr('height', 600);

const canvas = foreignObject.append('xhtml:canvas')
  .attr('xmlns', 'http://www.w3.org/1999/xhtml');

const context = canvas.node().getContext('2d');

console.log(canvas.node().constructor.name);
    // var canvas = d3.select("canvas"),
    // context = canvas.getContext("2d"),
    // width = canvas.width,
    // height = canvas.height,
    var tau = 2 * Math.PI;

console.log(width)
console.log(data)
    var nodes = d3.range(1000).map(function(i) {
    return {
        r: Math.random() * 14 + 4
    };
    });



    // var node = svg.selectAll(".node")
    // .data(data.genre)
    // .enter().append("g")
    // .attr("class", "node")
    // .call(force.drag);


    // nodes = [];
    // var nodes = data.forEach(d => {nodes.append(d)})
    console.log(nodes)

    var simulation = d3.forceSimulation(nodes)
    .velocityDecay(0.2)
    .force("x", d3.forceX().strength(0.002))
    .force("y", d3.forceY().strength(0.002))
    .force("collide", d3.forceCollide().radius(function(d) { return d.r + 0.5; }).iterations(2))
    .on("tick", ticked);

    function ticked() {
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);

    context.beginPath();
    nodes.forEach(function(d) {
        context.moveTo(d.x + d.r, d.y);
        context.arc(d.x, d.y, d.r, 0, tau);
    });
    context.fillStyle = "#ddd";
    context.fill();
    context.strokeStyle = "#333";
    context.stroke();

    context.restore();
    }
    svg.text(simulation)
});
};
buildChart()
// };
// buildData()



// // var width = 960,
// //     height = 500

// // var svg = d3.select("body").append("svg")
// //     .attr("width", width)
// //     .attr("height", height);

// // var force = d3.layout.force()
// //     .gravity(0.05)
// //     .distance(100)
// //     .charge(-100)
// //     .size([width, height]);

// // d3.json(dataURL, function(error, json) {
// //   if (error) throw error;

// //   force
// //       .nodes(json.nodes)
// //       .links(json.links)
// //       .start();

// //   var link = svg.selectAll(".link")
// //       .data(json.links)
// //     .enter().append("line")
// //       .attr("class", "link");

// //   var node = svg.selectAll(".node")
// //       .data(json.nodes)
// //     .enter().append("g")
// //       .attr("class", "node")
// //       .call(force.drag);

// //   node.append("image")
// //       .attr("xlink:href", "https://github.com/favicon.ico")
// //       .attr("x", -8)
// //       .attr("y", -8)
// //       .attr("width", 16)
// //       .attr("height", 16);

// //   node.append("text")
// //       .attr("dx", 12)
// //       .attr("dy", ".35em")
// //       .text(function(d) { return d.name });

// //   force.on("tick", function() {
// //     link.attr("x1", function(d) { return d.source.x; })
// //         .attr("y1", function(d) { return d.source.y; })
// //         .attr("x2", function(d) { return d.target.x; })
// //         .attr("y2", function(d) { return d.target.y; });

// //     node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
// //   });
// // });





































//     // d3.select("canvas").text(simulation)





// // });

// // var canvas = document.querySelector("canvas"),
// //     context = canvas.getContext("2d"),
// //     width = canvas.width,
// //     height = canvas.height,
// //     tau = 2 * Math.PI;

// // var nodes = d3.range(1000).map(function(i) {
// // return {
// //     r: Math.random() * 14 + 4
// // };
// // });

// // var simulation = d3.forceSimulation(nodes)
// //     .velocityDecay(0.2)
// //     .force("x", d3.forceX().strength(0.002))
// //     .force("y", d3.forceY().strength(0.002))
// //     .force("collide", d3.forceCollide().radius(function(d) { return d.r + 0.5; }).iterations(2))
// //     .on("tick", ticked);

// // function ticked() {
// // context.clearRect(0, 0, width, height);
// // context.save();
// // context.translate(width / 2, height / 2);

// // context.beginPath();
// // nodes.forEach(function(d) {
// //     context.moveTo(d.x + d.r, d.y);
// //     context.arc(d.x, d.y, d.r, 0, tau);
// // });
// // context.fillStyle = "#ddd";
// // context.fill();
// // context.strokeStyle = "#333";
// // context.stroke();

// // context.restore();
// // }

///////////////////////////////////
////////// SDK Play Music /////////
///////////////////////////////////












console.log("end app.js here!!")












///////////////////////////////////////////////////////////////////
///////////////// Top Spotify Songs Visualization /////////////////
//////////////////// End Visualization Script /////////////////////
///////////////////////////////////////////////////////////////////