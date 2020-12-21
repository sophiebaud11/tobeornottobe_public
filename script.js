window.onscroll = function() {
  growShrinkCorners()
};

function growShrinkCorners() {
  var corners = document.getElementsByClassName("corner")
  var pageHeight = window.innerHeight;

  var scrollPercent = (pageHeight - window.scrollY)/pageHeight;
  console.log(scrollPercent)
  if (scrollPercent < 1 && scrollPercent > 0) {
    Array.prototype.forEach.call(corners, function(corner) {
      if (corner.id == "corner0" | corner.id == "corner2") {
        corner.style.borderWidth = scrollPercent*250;
      }
      else if (corner.id == "corner1" | corner.id == "corner3"){
        corner.style.borderWidth = 50 + scrollPercent*250;
      }

    })};
  if (scrollPercent < -12 && scrollPercent > -13) {
    var neg_scrollPercent = 1-(13+((pageHeight - window.scrollY)/pageHeight));
    console.log("hi")
    console.log(neg_scrollPercent)
    Array.prototype.forEach.call(corners, function(corner) {
      if (corner.id == "corner4" | corner.id == "corner6") {
        corner.style.borderWidth = neg_scrollPercent*250;
      }
      else if (corner.id == "corner5" | corner.id == "corner7"){
        corner.style.borderWidth = 50 + neg_scrollPercent*250;
      }
    })};
  };
function generateFullVolumeGraph () {
  var margin = ({top: 30, right: 40, bottom: 30, left: 40});
  var height = 500;
  var width = 960;
  var x = d3.scaleLinear().range([0, 800]);
  var y = d3.scaleLinear().range([400, 0]);
  var z = d3.scaleOrdinal(d3.schemeCategory10);
  var line = d3.line()
    .x(function(d) { return x(d.timestamp); })
    .y(function(d) { return y(d.mean_rms); });
  function type (d, _, columns) {
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
  }
  var data = d3.csv("linegraph_vol.csv".text(), type);
  var actors = data.columns.slice(1).map(function(timestamp) {
    return {
      actor: timestamp,
      values: data.map(function(d) {
        return {timestamp: d.timestamp, mean_rms: d[timestamp]};
      })
    }});
  var actors_list = data.columns.slice(1);
  x.domain([1, 234]);
  y.domain([
    d3.min(actors, function(c) { return d3.min(c.values, function(d) { return d.mean_rms; }); }),
    d3.max(actors, function(c) { return d3.max(c.values, function(d) { return d.mean_rms; }); })
  ]);
  z.domain(actors.map(function(c) { return c.actor; }));
  var xAxis = g => g
    .attr("transform", "translate(" + margin.left + ", 470)")
    .style("font-family", "PT Sans")
    .style("font-size", "12")
    .call(d3.axisBottom(x).ticks(null, data.format));
  var yAxis = g => g
    .attr("transform", `translate(${margin.left},70)`)
    .style("font-family", "PT Sans")
    .call(d3.axisLeft(y).ticks(null, data.format));

  const svg = d3.create("svg")
         .attr("viewBox", [0, 0, 960, 500]);

    svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .call(xAxis)

    svg.append("g")
        .call(yAxis)

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", `0 – margin.left`)
      .attr("x", -250)
      .attr("dy", "0.7em")
      .style("font-size", "15")
      .style("font-family", "PT Sans")
      .style("text-anchor", "middle")
      .text("Mean RMS Level");

     svg.append("text")
        .attr("x", width / 2 )
        .attr("y", 20)
        .style("font-size", "20")
        .style("font-weight", "bold")
        .style("font-family", "PT Sans")
        .style("text-anchor", "middle")
        .text("Volume Throughout the Soliloquy");

    svg.append("text")
      .attr("x", width / 2 )
      .attr("y", 500)
      .style("font-size", "15")
      .style("font-family", "PT Sans")
      .style("text-anchor", "middle")
      .text("Second");

    var actorLines = svg.selectAll(".actor")
        .data(actors)
        .enter().append("g")
          .attr("class", "actor");

    actorLines.append("path")
        .attr("class", "line")
        .attr("id", function(d) {return d.actor + "line"})
        .attr("transform", "translate(" + margin.left + ",70)")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.actor); })
        .style("fill","none")

    var size = 20
    svg.selectAll("lineLegend")
      .data(actors)
      .enter()
      .append("circle")
        .attr("cx", width - 110)
        .attr("cy", function(d,i){ return 70 + i*(size+5)})
        .attr("r", size / 2)
        .style("fill", function(d){ return z(d.actor)})
        .attr("class", "circle")
        .attr("id", function(d) {return d.actor + "circle"})



    svg.selectAll("circle").on("click", function() {
      d3.select(this).classed("active", d3.select(this).classed("active") ? false : true);
      console.log(d3.select(this).classed("active"));
  		var thisID = "#" + d3.select(this).attr("id");
  		console.log(thisID);
      var lineID = thisID.replace("circle", "line")
      console.log(lineID);
      if (d3.select(this).classed("active")) {
        d3.select(lineID).style("stroke-width", "2");
        d3.selectAll(".line:not(lineID)").style("opacity", "0.25");
        d3.selectAll(".circle:not(thisID)").style("opacity", "0.25");
        d3.select(lineID).style("opacity", "1");
        d3.select(thisID).style("opacity", "1");
      }
      else {
        d3.select(lineID).style("stroke-width", "1");
        d3.selectAll(".line").style("opacity", "1");
        d3.selectAll(".circle").style("opacity", "1");
      }
  	});




    svg.selectAll("mylabels")
      .data(actors)
      .enter()
      .append("text")
        .attr("x", width - 90)
        .attr("y", function(d,i){ return 71 + i*(size+5)})
        .text(function(d) {return d.actor})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "15")
        .style("font-family", "PT Sans");

}


function generateVolumeGraph() {
  var margin = ({top: 30, right: 40, bottom: 30, left: 40});
  var width = 960 - margin.left - margin.right;
  var height = 500 - margin.top - margin.bottom;
  var x = d3.scaleLinear().range([0, 800]);
  var y = d3.scaleLinear().range([400, 0]);
  var z = d3.scaleOrdinal(d3.schemeCategory10);
  var line = d3.line()
    .x(function(d) { return x(d.ids); })
    .y(function(d) { return y(d.mean_rms); });

  function type (d, columns) {
    for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
    return d;
  }
  var raw_data = [
    {ids: "1", Scott: -45.42014174, Lester: -35.09798467, Hiddleston: -37.56592703, Hawke: -33.1158505, Glover: -29.38750548, Essiedu: -42.45678668, Cumberbatch: -34.52624697, Branagh: -70.20374046},
    {ids: "2", Scott: -45.42014174, Lester: -35.09798467, Hiddleston: -37.56592703, Hawke: -33.1158505, Glover: -19.07570324, Essiedu: -38.10843458, Cumberbatch: -34.52624697, Branagh: -70.20374046},
    {ids: "3", Scott: -50.55734224, Lester: -38.49834171, Hiddleston: -37.56592703, Hawke: -33.1158505, Glover: -19.07570324, Essiedu: -40.87613461, Cumberbatch: -34.52624697, Branagh: -66.90199737},
    {ids: "4", Scott: -46.15761979, Lester: -36.37355792, Hiddleston: -50.81639021, Hawke: -35.5682249, Glover: -19.07570324, Essiedu: -40.87613461, Cumberbatch: -34.52624697, Branagh: -68.86191082},
    {ids: "5", Scott: -46.15761979, Lester: -36.37355792, Hiddleston: -50.81639021, Hawke: -35.5682249, Glover: -19.07570324, Essiedu: -40.92524862, Cumberbatch: -50.58385766, Branagh: -68.86191082},
    {ids: "6", Scott: -49.61213061, Lester: -41.87794028, Hiddleston: -50.81639021, Hawke: -35.5682249, Glover: -25.23867276, Essiedu: -40.92524862, Cumberbatch: -50.58385766, Branagh: -68.38006695},
    {ids: "7", Scott: -47.81410608, Lester: -41.45150108, Hiddleston: -74.86161536, Hawke: -39.5606469, Glover: -25.23867276, Essiedu: -43.70828258, Cumberbatch: -54.24270995, Branagh: -68.16761568},
    {ids: "8", Scott: -47.81410608, Lester: -41.72915311, Hiddleston: -26.8206855, Hawke: -39.5606469, Glover: -18.50604819, Essiedu: -40.32823859, Cumberbatch: -41.59849132, Branagh: -70.96109195},
    {ids: "9", Scott: -47.81410608, Lester: -41.72915311, Hiddleston: -26.8206855, Hawke: -40.42968888, Glover: -18.50604819, Essiedu: -40.32823859, Cumberbatch: -41.59849132, Branagh: -70.96109195},
    {ids: "10", Scott: -47.81410608, Lester: -41.72915311, Hiddleston: -26.8206855, Hawke: -40.42968888, Glover: -18.50604819, Essiedu: -42.18216082, Cumberbatch: -41.59849132, Branagh: -70.96109195},
  ]
  var columns = ["ids", "Scott", "Lester", "Hiddleston", "Hawke", "Glover", "Essiedu", "Cumberbatch", "Branagh"]
  var data = Object.assign(raw_data, type(raw_data, columns))
  console.log(data)
  var actors = columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {ids: d.ids, mean_rms: d[id]};
      })
    }});
  x.domain([1, 10]);
  y.domain([
    d3.min(actors, function(c) { return d3.min(c.values, function(d) { return d.mean_rms; }); }),
    d3.max(actors, function(c) { return d3.max(c.values, function(d) { return d.mean_rms; }); })
  ]);
  z.domain(actors.map(function(c) { return c.id; }));
  var tickValuesArray = ["To", "be", "or", "not", "to", "be", "that", "is", "the", "question."];
  var myTickValues = tickValuesArray.map(function(d){return (d)});
  var xAxis = g => g
    .attr("transform", "translate(50, 470)")
    .style("font-family", "PT Sans")
    .style("font-size", "15px")
    .call(d3.axisBottom(x).tickValues([1,2,3,4,5,6,7,8,9,10])
    .tickFormat(function(d,i){ return myTickValues[i] }));
  var yAxis = g => g
    .attr("transform", `translate(50,70)`)
    .style("font-family", "PT Sans")
    .style("font-size", "12px")
    .call(d3.axisLeft(y).ticks(null, data.format));

  const svg = d3.select("#volume_chart")
         .attr("viewBox", [0, 0, 990, 505]);

    svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .call(xAxis)

    svg.append("g")
        .call(yAxis)

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", `–margin.left`)
      .attr("x", -250)
      .attr("dy", "0.7em")
      .style("font-size", "20px")
      .style("font-family", "PT Sans")
      .style("text-anchor", "middle")
      .text("Mean RMS Level");

     svg.append("text")
        .attr("x", width / 2 )
        .attr("y", 25)
        .style("font-size", "30px")
        .style("font-weight", "bold")
        .style("font-family", "PT Sans")
        .style("text-anchor", "middle")
        .text("Volume Throughout the First Line");

    svg.append("text")
      .attr("x", width / 2 )
      .attr("y", 505)
      .style("font-size", "20px")
      .style("font-family", "PT Sans")
      .style("text-anchor", "middle")
      .text("Actor");

    var actorLines = svg.selectAll(".actor")
        .data(actors)
        .enter().append("g")
          .attr("class", "actor");

    actorLines.append("path")
        .attr("class", "line")
        .attr("transform", "translate(50,70)")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.id); })
        .style("fill","none")

    var size = 20
    svg.selectAll("lineLegend")
      .data(actors)
      .enter()
      .append("circle")
        .attr("cx", width - 20)
        .attr("cy", function(d,i){ return 70 + i*(size+5)})
        .attr("r", size / 2)
        .style("fill", function(d){ return z(d.id)})

    svg.selectAll("mylabels")
      .data(actors)
      .enter()
      .append("text")
        .attr("x", width)
        .attr("y", function(d,i){ return 71 + i*(size+5)})
        .text(function(d){ return d.id})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .style("font-size", "15")
        .style("font-family", "PT Sans")
}

function generateDurationGraph() {
  var cScale = d3.scaleSequential()
    .domain([11, 4])
    .interpolator(d3.interpolateViridis)

  var height = 575;
  var width = 960;

  var margin = ({top: 30, right: 0, bottom: 30, left: 40});

  var raw_data = [
    {name: "Scott", value: 11},
    {name: "Lester", value: 6},
    {name: "Hiddleston", value: 3},
    {name: "Hawke", value: 3},
    {name: "Glover", value: 3},
    {name: "Essiedu", value: 10},
    {name: "Cumberbatch", value: 5},
    {name: "Branagh", value: 6}
  ]

  var data = Object.assign(raw_data, ({name, value}) => ({name: name, value: +value})).sort((a, b) => d3.descending(a.value, b.value))

  var x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top]);

  var xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .style("font-family", "PT Sans")
      .style("font-size", "15px")
      .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0));

  var yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .style("font-family", "PT Sans")
    .call(d3.axisLeft(y).ticks(null, data.format))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .style("font-size", "15px")
        .text(data.y));

  const svg = d3.select("#duration_chart")
        .attr("viewBox", [0, 0, width, height +50]);

      svg.append("g")
        .selectAll("rect")
        .data(data)
        .join("rect")
          .attr("x", (d, i) => x(i))
          .attr("y", d => y(d.value))
          .attr("height", d => y(0) - y(d.value))
          .attr("width", x.bandwidth())
          .attr("fill", d => cScale(d.value));

      svg.append("g")
          .call(xAxis);

      svg.append("g")
          .call(yAxis);
        svg.append("text")
        .attr("x", width / 2 )
        .attr("y", 25)
        .style("font-size", "30px")
        .style("font-weight", "bold")
        .style("font-family", "PT Sans")
        .style("text-anchor", "middle")
        .text("Duration of First Line");

      svg.append("text")
        .attr("x", width / 2 )
        .attr("y", 585)
        .style("font-size", "20px")
        .style("font-family", "PT Sans")
        .style("text-anchor", "middle")
        .text("Actor");

      svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", `0 – ${margin.left}`)
        .attr("x", -250)
        .attr("dy", "1em")
        .style("font-size", "20px")
        .style("font-family", "PT Sans")
        .style("text-anchor", "middle")
        .text("Duration (Seconds)");

}
function generateLongestPause() {
  var cScale = d3.scaleSequential()
  .domain([9, 0])
  .interpolator(d3.interpolateViridis);
  var height = 500;
  var width = 1000;
  var margin = ({top: 30, right: 0, bottom: 40, left: 40});
  var raw_data = [
    {name: "Scott", value: 9},
    {name: "Branagh", value: 7},
    {name: "Lester", value: 7},
    {name: "Cumberbatch", value: 5},
    {name: "Essiedu", value: 5},
    {name: "Glover", value: 4},
    {name: "Hawke", value: 4},
    {name: "Hiddleston", value: 3}
  ];
  var data = Object.assign(raw_data, ({name, value}) => ({name: name, value: +value})).sort((a, b) => d3.descending(a.value, b.value))

  var x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)]).nice()
    .range([height - margin.bottom, margin.top]);

  var xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .style("font-family", "PT Sans")
    .style("font-size", "12px")
    .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0));

  var yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .style("font-family", "PT Sans")
    .call(d3.axisLeft(y).ticks(null, data.format))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", - margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data.y));

  const svg = d3.select("#longest_pause")
            .attr("viewBox", [0, 0, width, height]);

        svg.append("g")
          .selectAll("rect")
          .data(data)
          .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", d => y(d.value))
            .attr("height", d => y(0) - y(d.value))
            .attr("width", x.bandwidth())
            .attr("fill", d => cScale(d.value));

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);

        svg.append("text")
          .attr("x", width / 2 )
          .attr("y", 25)
          .style("font-size", "30px")
          .style("font-weight", "bold")
          .style("font-family", "PT Sans")
          .style("text-anchor", "middle")
          .text("Longest Pause (Seconds)");

        svg.append("text")
          .attr("x", width / 2 )
          .attr("y", 495)
          .style("font-size", "20px")
          .style("font-family", "PT Sans")
          .style("text-anchor", "middle")
          .text("Actor");

        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", `0 – margin.left`)
          .attr("x", -250)
          .attr("dy", "0.9em")
          .style("font-size", "20px")
          .style("font-family", "PT Sans")
          .style("text-anchor", "middle")
          .text("Duration (Seconds)");

}
function generateMedianRMS() {
  var cScale = d3.scaleSequential()
    .domain([-55, -15])
    .interpolator(d3.interpolateMagma);
  var height = 500;
  var width = 970;
  var margin = ({top: 30, right: 0, bottom: 40, left: 40});
  var raw_data = [
    {name: "Glover", value: -19.23048723},
    {name: "Hiddleston", value: -38.23283408},
    {name: "Lester", value: -39.5096787},
    {name: "Hawke", value: -39.57376455},
    {name: "Cumberbatch", value: -40.54824076},
    {name: "Branagh", value: -41.50606721},
    {name: "Essiedu", value: -43.26464449},
    {name: "Scott", value: -49.50380497}
  ];
  var data = Object.assign(raw_data, ({name, value}) => ({name: name, value: +value})).sort((a, b) => d3.descending(a.value, b.value))
  var x = d3.scaleBand()
    .domain(d3.range(data.length))
    .range([margin.left, width - margin.right])
    .padding(0.1);
  var y = d3.scaleLinear()
    .domain([-55, 0]).nice()
    .range([height - margin.top, margin.bottom]);
  var xAxis = g => g
    .attr("transform", `translate(5,${height - margin.bottom})`)
    .style("font-size", "13px")
    .style("font-family", "PT Sans")
    .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0));
  var yAxis = g => g
    .attr("transform", `translate(45,-10)`)
    .style("font-family", "PT Sans")
    .call(d3.axisLeft(y).ticks(null, data.format))
    .call(g => g.select(".domain").remove())
    .call(g => g.append("text")
        .attr("x", -margin.left)
        .attr("y", 15)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(data.y));

  const svg = d3.select("#volume_chart2")
    .attr("viewBox", [0, 0, 990, 505]);

        svg.append("g")
          .selectAll("rect")
          .data(data)
          .join("rect")
            .attr("x", (d, i) => x(i))
            .attr("y", d => margin.top)
            .attr("height", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("fill", d => cScale(d.value));

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);
          svg.append("text")
          .attr("x", width / 2 )
          .attr("y", 23)
          .style("font-size", "30px")
          .style("font-weight", "bold")
          .style("font-family", "PT Sans")
          .style("text-anchor", "middle")
          .text("Median RMS Level Per Actor");

        svg.append("text")
          .attr("x", width / 2 )
          .attr("y", 498)
          .style("font-size", "20px")
          .style("font-family", "PT Sans")
          .style("text-anchor", "middle")
          .text("Actor");

        svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", `0 – ${margin.left}`)
          .attr("x", -245)
          .attr("dy", "0.75em")
          .style("font-size", "20px")
          .style("font-family", "PT Sans")
          .style("text-anchor", "middle")
          .text("Median RMS Level");
}
