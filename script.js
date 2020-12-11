var cScale = d3.scaleSequential()
.domain([11, 4])
.interpolator(d3.interpolateViridis)

var height = 500;

var margin = ({top: 30, right: 0, bottom: 30, left: 40});

var data = d3.csv("/first_line_duration@1.csv", function(data) {
  var name = data[i].actor;
  var value = data[i].duration;
  value.sort(function(a, b){return b-a});
})

var x = d3.scaleBand()
  .domain(d3.range(data.length))
  .range([margin.left, width - margin.right])
  .padding(0.1)

var y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)]).nice()
  .range([height - margin.bottom, margin.top])

var xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .style("font-family", "PT Sans")
    .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0))

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
      .text(data.y))

const svg = d3.select("#duration_chart")
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
    .attr("y", 20)
    .style("font-size", "20")
    .style("font-weight", "bold")
    .style("font-family", "PT Sans")
    .style("text-anchor", "middle")
    .text("Duration of First Line");

  svg.append("text")
    .attr("x", width / 2 )
    .attr("y", 500)
    .style("font-size", "15")
    .style("font-family", "PT Sans")
    .style("text-anchor", "middle")
    .text("Actor");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", `0 – margin.left`)
    .attr("x", -250)
    .attr("dy", "1em")
    .style("font-size", "15")
    .style("font-family", "PT Sans")
    .style("text-anchor", "middle")
    .text("Duration (Seconds)");
