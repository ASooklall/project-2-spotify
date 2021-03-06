///////////////////////////////////////////////////////////////////
///////////////// Top Spotify Songs Visualization /////////////////
/////////////////// Interactive Sunburst Chart ////////////////////
///////////////////////////////////////////////////////////////////

///////////////////////////////////
////////// Sunburst Chart /////////
///////////////////////////////////

// Sunburst Function
dataURL = '/top_data';

function generateSunburst(selectedYear) {
  d3.select('.sunburst').html('');
  d3.json(dataURL).then(dataBurst => {
    let filteredBurst = dataBurst.filter(x => x.year == selectedYear);

    console.log(filteredBurst);

    let dataTree = {
      type: 'sunburstTitle',
      name: 'Spotify',
      children: []
    };
    
    filteredBurst.forEach(song => {
      if (!dataTree.children.some(c => c.name == song.genre)) {
        dataTree.children.push({
          type: 'sunburstGenre',
          name: song.genre,
          children: [] 
        });
      };

      dataTree.children.forEach(childGenre => {
        if (!childGenre.children.some(c => c.name == song.artists) && childGenre.name == song.genre) {
          childGenre.children.push({
            type: 'sunburstArtist',
            name: song.artists,
            children: []
          });
        };

        childGenre.children.forEach(childArtists => {
          if (childArtists.name == song.artists) {
            childArtists.children.push({
              type: 'sunburstSong',
              name: song.name,
              id: song.id,
              value: song.popularity
            });
          };
        });
      });
    });
    
    console.log(dataTree);

    // Organize Function
  partition = data => {
    let root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => a.value - b.value);
    return d3.partition()
        .size([2 * Math.PI, root.height + 1])
      (root);
  };

  // Format Attributes
  color = d3.scaleOrdinal(d3.quantize(d3.interpolateSpectral, dataTree.children.length + 1));
  console.log(color);

  format = d3.format(",d");

  width = 570;

  radius = width / 6;

  arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius * 1.5)
    .innerRadius(d => d.y0 * radius)
    .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));

  // d3 = require("d3@5");

    let root = partition(dataTree);

    root.each(d => d.current = d); 

    width = 800;

    var svgSunburst = d3.select('.sunburst').append("svg")
      .attr("viewBox", [0, 0, width, width])
      .style("font", "10px sans-serif");

    var g = svgSunburst.append("g")
      .attr("transform", `translate(${width / 2},${width / 2.5})`);

    var path = g.append("g")
      .selectAll("path")
      .data(root.descendants().slice(1))
      .enter().append("path")
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.8 : 0.6) : 0)
      .attr("d", d => arc(d.current))
      .attr('class', d => d.data.type)
      .attr('id', d => d.data.id);

    path.filter(d => d.children)
      .style("cursor", "pointer")
      .on("click", clicked);

    path.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    let label = g.append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .enter().append("text")
      .attr("dy", "0.35em")
      .attr("fill-opacity", d => +labelVisible(d.current))
      .attr("transform", d => labelTransform(d.current))
      .text(d => d.data.name)
      .attr('class', 'sunburst-title-text');

    let parent = g.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    function clicked(p) {
      parent.datum(p.parent || root);

      root.each(d => d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth)
      });

      let t = g.transition().duration(750);

      // Transition the data on all arcs, even the ones that aren’t visible,
      // so that if this transition is interrupted, entering arcs will start
      // the next transition from the desired position.
      path.transition(t)
        .tween("data", d => {
          const i = d3.interpolate(d.current, d.target);
          return t => d.current = i(t);
        })
        .filter(function(d) {
          return +this.getAttribute("fill-opacity") || arcVisible(d.target);
        })
        .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
        .attrTween("d", d => () => arc(d.current));

      label.filter(function(d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      }).transition(t)
      .attr("fill-opacity", d => +labelVisible(d.target))
      .attrTween("transform", d => () => labelTransform(d.current));
    }
    
    function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
      let x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      let y = (d.y0 + d.y1) / 2 * radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    return svgSunburst.node();
  });
};

///////////////////////////////////
/////////// Bullet Chart //////////
///////////////////////////////////

(function() {
  d3.bullet = function() {
    var orient = "left", // TODO top & bottom
        reverse = false,
        duration = 0,
        ranges = bulletRanges,
        markers = bulletMarkers,
        measures = bulletMeasures,
        width = 380,
        height = 30,
        tickFormat = null;
  
    // For each small multiple…
    function bullet(g) {
      g.each(function(d, i) {
        var rangez = ranges.call(this, d, i).slice().sort(d3.descending),
            markerz = markers.call(this, d, i).slice().sort(d3.descending),
            measurez = measures.call(this, d, i).slice().sort(d3.descending),
            g = d3.select(this);
  
        // Compute the new x-scale.
        var x1 = d3.scaleLinear()
            .domain([0, Math.max(rangez[0], markerz[0], measurez[0])])
            .range(reverse ? [width, 0] : [0, width]);
  
        // Retrieve the old x-scale, if this is an update.
        var x0 = this.__chart__ || d3.scaleLinear()
            .domain([0, Infinity])
            .range(x1.range());
  
        // Stash the new scale.
        this.__chart__ = x1;
  
        // Derive width-scales from the x-scales.
        var w0 = bulletWidth(x0),
            w1 = bulletWidth(x1);
  
        // Update the range rects.
        var range = g.selectAll("rect.range")
            .data(rangez);
  
        range.enter().append("rect")
            .attr("class", function(d, i) { return "range s" + i; })
            .attr("width", w0)
            .attr("height", height)
            .attr("x", reverse ? x0 : 0)
          .transition()
            .duration(duration)
            .attr("width", w1)
            .attr("x", reverse ? x1 : 0);
  
        range.transition()
            .duration(duration)
            .attr("x", reverse ? x1 : 0)
            .attr("width", w1)
            .attr("height", height);
  
        // Update the measure rects.
        var measure = g.selectAll("rect.measure")
            .data(measurez);
  
        measure.enter().append("rect")
            .attr("class", function(d, i) { return "measure s" + i; })
            .attr("width", w0)
            .attr("height", height / 3)
            .attr("x", reverse ? x0 : 0)
            .attr("y", height / 3)
          .transition()
            .duration(duration)
            .attr("width", w1)
            .attr("x", reverse ? x1 : 0);
  
        measure.transition()
            .duration(duration)
            .attr("width", w1)
            .attr("height", height / 3)
            .attr("x", reverse ? x1 : 0)
            .attr("y", height / 3);
  
        // Update the marker lines.
        var marker = g.selectAll("line.marker")
            .data(markerz);
  
        marker.enter().append("line")
            .attr("class", "marker")
            .attr("x1", x0)
            .attr("x2", x0)
            .attr("y1", height / 6)
            .attr("y2", height * 5 / 6)
          .transition()
            .duration(duration)
            .attr("x1", x1)
            .attr("x2", x1);
  
        marker.transition()
            .duration(duration)
            .attr("x1", x1)
            .attr("x2", x1)
            .attr("y1", height / 6)
            .attr("y2", height * 5 / 6);
  
        // Compute the tick format.
        var format = tickFormat || x1.tickFormat(8);
  
        // Update the tick groups.
        var tick = g.selectAll("g.tick")
            .data(x1.ticks(8), function(d) {
              return this.textContent || format(d);
            });
  
        // Initialize the ticks with the old scale, x0.
        var tickEnter = tick.enter().append("g")
            .attr("class", "tick")
            .attr("transform", bulletTranslate(x0))
            .style("opacity", 1e-6);
  
        tickEnter.append("line")
            .attr("y1", height)
            .attr("y2", height * 7 / 6);
  
        tickEnter.append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1em")
            .attr("y", height * 7 / 6)
            .text(format);
  
        // Transition the entering ticks to the new scale, x1.
        tickEnter.transition()
            .duration(duration)
            .attr("transform", bulletTranslate(x1))
            .style("opacity", 1);
  
        // Transition the updating ticks to the new scale, x1.
        var tickUpdate = tick.transition()
            .duration(duration)
            .attr("transform", bulletTranslate(x1))
            .style("opacity", 1);
  
        tickUpdate.select("line")
            .attr("y1", height)
            .attr("y2", height * 7 / 6);
  
        tickUpdate.select("text")
            .attr("y", height * 7 / 6);
  
        // Transition the exiting ticks to the new scale, x1.
        tick.exit().transition()
            .duration(duration)
            .attr("transform", bulletTranslate(x1))
            .style("opacity", 1e-6)
            .remove();
      });
      // d3.timer.flush();
    };
  
    // left, right, top, bottom
    bullet.orient = function(x) {
      if (!arguments.length) return orient;
      orient = x;
      reverse = orient == "right" || orient == "bottom";
      return bullet;
    };
  
    // ranges (bad, satisfactory, good)
    bullet.ranges = function(x) {
      if (!arguments.length) return ranges;
      ranges = x;
      return bullet;
    };
  
    // markers (previous, goal)
    bullet.markers = function(x) {
      if (!arguments.length) return markers;
      markers = x;
      return bullet;
    };
  
    // measures (actual, forecast)
    bullet.measures = function(x) {
      if (!arguments.length) return measures;
      measures = x;
      return bullet;
    };
  
    bullet.width = function(x) {
      if (!arguments.length) return width;
      width = x;
      return bullet;
    };
  
    bullet.height = function(x) {
      if (!arguments.length) return height;
      height = x;
      return bullet;
    };
  
    bullet.tickFormat = function(x) {
      if (!arguments.length) return tickFormat;
      tickFormat = x;
      return bullet;
    };
  
    bullet.duration = function(x) {
      if (!arguments.length) return duration;
      duration = x;
      return bullet;
    };
  
    return bullet;
  };
  
  function bulletRanges(d) {
    return d.ranges;
  }
  
  function bulletMarkers(d) {
    return d.markers;
  }
  
  function bulletMeasures(d) {
    return d.measures;
  }
  
  function bulletTranslate(x) {
    return function(d) {
      return "translate(" + x(d) + ",0)";
    };
  }
  
  function bulletWidth(x) {
    var x0 = x(0);
    return function(d) {
      return Math.abs(x(d) - x0);
    };
  }
  
  })();

var bulletMargin = {top: 5, right: 40, bottom: 20, left: 120},
    width = 480 - bulletMargin.left - bulletMargin.right,
    height = 50 - bulletMargin.top - bulletMargin.bottom;

var bulletChart = d3.bullet()
    .width(width)
    .height(height);

function generateBullet(selectedYear) {
  d3.select('.bullet-chart').html('');
  d3.json(dataURL).then(dataBullet => {
    let filteredBullet = dataBullet.filter(x => x.year == selectedYear);
    let bestSong = filteredBullet.reduce( (previous, current) => {
      return ( (previous.popularity) > (current.popularity) ? previous : current);
    });
    
    console.log(bestSong);

    function bulletRangeFinder(category) {
      let min = filteredBullet.reduce( (previous, current) => {
        return ( (previous[category]) < (current[category]) ? previous : current);
      });
      let max = filteredBullet.reduce( (previous, current) => {
        return ( (previous[category]) > (current[category]) ? previous : current);
      });
      let mean = filteredBullet.reduce( (total, next) => total + next[category], 0) / filteredBullet.length;
      return [min[category], mean, max[category]];
    };

    function artistAverage(artistName, category) {
      let selection = filteredBullet.filter(song => song.artists == artistName);
      let average = selection.reduce( (total, next) => total + next[category], 0) / selection.length;
      return [average];
    };
    
    function bulletFormat(x) {
      return [
        {
          "title":"Popularity",
          "subtitle":"play frequency",
          "ranges":bulletRangeFinder("popularity"),
          "measures":[x.popularity],
          "markers":artistAverage(x.artists, "popularity")
        },
        {
          "title":"Acousticness",
          "subtitle":"no electrial amplification",
          "ranges":bulletRangeFinder("acousticness"),
          "measures":[x.acousticness],
          "markers":artistAverage(x.artists, "acousticness")
        },
        {
          "title":"Danceability",
          "subtitle":"rhythm stability, regularity",
          "ranges":bulletRangeFinder("danceability"),
          "measures":[x.danceability],
          "markers":artistAverage(x.artists, "danceability")
        },
        {
          "title":"Duration",
          "subtitle":"seconds",
          "ranges":bulletRangeFinder("duration_ms").map(d => d/1000),
          "measures":[x.duration_ms].map(d => d/1000),
          "markers":artistAverage(x.artists, "duration_ms").map(d => d/1000)
        },
        {
          "title":"Energy",
          "subtitle":"level of intensity/activity",
          "ranges":bulletRangeFinder("energy"),
          "measures":[x.energy],
          "markers":artistAverage(x.artists, "energy")
        },
        {
          "title":"Speechiness",
          "subtitle":"presence of words",
          "ranges":bulletRangeFinder("speechiness"),
          "measures":[x.speechiness],
          "markers":artistAverage(x.artists, "speechiness")
        },
        {
          "title":"Tempo",
          "subtitle":"BPM",
          "ranges":bulletRangeFinder("tempo"),
          "measures":[x.tempo],
          "markers":artistAverage(x.artists, "tempo")
        },
        {
          "title":"Valence",
          "subtitle":"musical positiveness",
          "ranges":bulletRangeFinder("valence"),
          "measures":[x.valence],
          "markers":artistAverage(x.artists, "valence")
        }
      ];
    };

    let bestBullet = bulletFormat(bestSong);

    console.log(bestBullet);

    var bulletName = d3.select('#index-subtitle-bullet')
    bulletName.html('');
    bulletName.text(`Most Popular Song of the Year: ${bestSong.name} by ${bestSong.artists}`);

    var svgBullet = d3.select(".bullet-chart").selectAll("svg")
        .data(bestBullet)
      .enter().append("svg")
        .attr("class", "bullet")
        .attr("width", width + bulletMargin.left + bulletMargin.right)
        .attr("height", height + bulletMargin.top + bulletMargin.bottom)
      .append("g")
        .attr("transform", "translate(" + bulletMargin.left + "," + bulletMargin.top + ")")
        .call(bulletChart);

    let title = svgBullet.append("g")
        .style("text-anchor", "end")
        .attr("transform", "translate(-6," + height / 2 + ")");

    title.append("text")
        .attr("class", "title")
        .text(function(d) { return d.title; });

    title.append("text")
        .attr("class", "subtitle")
        .attr("dy", "1em")
        .text(function(d) { return d.subtitle; });

    d3.selectAll(".sunburstSong").on("click", function() {
      console.log(this.id);
      var newBullet = filteredBullet.filter(b => b.id == this.id)[0];
      console.log(bulletFormat(newBullet));
      bulletName.html('');
      bulletName.text(`${newBullet.name} by ${newBullet.artists}`);
      var newData = bulletFormat(newBullet);
      svgBullet.datum(function (d, i) {
        d.ranges = newData[i].ranges;
        d.measures = newData[i].measures;
        d.markers = newData[i].markers;
        return d;
      }).call(bulletChart.duration(1000)); // TODO automatic transition
    });
  });
};

///////////////////////////////////
////////// Year Dropdown //////////
///////////////////////////////////

generateSunburst('2019');
generateBullet('2019');

$('#sunburst-year').on('change', function() {
  console.log(this.value);
  generateSunburst(this.value);
  generateBullet(this.value);
});

///////////////////////////////////////////////////////////////////
///////////////// Top Spotify Songs Visualization /////////////////
////////////////////// End Sunburst Script ////////////////////////
///////////////////////////////////////////////////////////////////