const width = 1200,
  height = 800,
  center = [width / 2, height / 2];

const svg = d3.select("#graph").append("svg")
  .attr('width', width)
  .attr('height', height);

// svg.attr("viewBox", [-width / 2, -height / 2, width, height]);

color = (function () {
  const scale = d3.scaleOrdinal(d3.schemeSet2);
  return d => scale(d.ofensiva);
})();

chart = function chart(data) {
  data = data.data
  const radiusScale = d3.scaleLinear()
    .domain(d3.extent(data, (d) => d.value))
    .range([5, 50])

  const xCenters = {
    0: { x: width / 3, y: height / 2 },
    1: { x: width / 2, y: height / 2 }
  };

  const simulation = d3.forceSimulation(data)
    .velocityDecay(0.2)
    .force('x', d3.forceX().strength(0.03).x(center[0]))
    .force('y', d3.forceY().strength(0.03).y(center[1]))
    .force('charge', d3.forceManyBody().strength((d) => -Math.pow(radiusScale(d.value), 2.0) * 0.03))
    .on('tick', () => {
      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    });

  function nodeYearPos(d) {
    return xCenters[d.ofensiva].x;
  }
  splitBubbles()
  function groupBubbles() {

    // @v4 Reset the 'x' force to draw the bubbles to the center.
    simulation.force('x', d3.forceX().strength(0.03).x(center[0]));
  
    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }
  
  function splitBubbles() {
  
    // @v4 Reset the 'x' force to draw the bubbles to their year centers
    simulation.force('x', d3.forceX().strength(0.03).x(nodeYearPos));
  
    // @v4 We can reset the alpha value and restart the simulation
    simulation.alpha(1).restart();
  }

  const node = svg.append("g")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("r", 0)
    .attr("fill", color)
    .attr("fill-opacity", 0.7)
  // .on("mouseout", mouseOut)

  node.transition()
    .duration(3000)
    .attr('r', (d) => radiusScale(d.value));
  
  return chart

}

d3.json("./olavo>4.json").then((data) => draw(data));

function draw(data) {
  chart = chart(data)

}