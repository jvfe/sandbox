// Some base function from https://observablehq.com/@d3/choropleth

files = ["https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json",
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"];

Promise.all(files.map(url => d3.json(url))).then((values) => drawgraph(values));

function drawgraph(values) {
  const world = values[0],
    data = values[1]
    countries = topojson.feature(world, world.objects.countries);

  const width = 975,
    height = 610;

  projection = d3.geoEqualEarth()
  path = d3.geoPath(projection)

  const svg = d3.select("#choro").append('svg')
    .style("display", "block")
    .attr("viewBox", [0, 0, width, height]);

  const g = svg.append("g")

  const mouseOver = function (d) {
    county = d3.select(this)
    county
      .style("fill", "#69b3a2")
  };

  const mouseOut = function (d) {
    d3.select(this)
      .style("fill", "black")
  };

  g.append("g")
    .selectAll("path")
    .data(countries.features)
    .join("path")
    // .attr("fill", d => color(data.get(d.properties.name)))
    .attr("d", path)
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut);

  g.append("path")
    .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  // FUNCIONA, NÃO MEXA ↓↓
  // const g = svg.append("g")

  // g.selectAll("path")
  //   .data(topojson.feature(world, world.objects.countries).features)
  //   .join("path")
  //   .attr("stroke", "#fff")
  //   .attr("fill", (d)=>"#69b3a2")
  //   .attr("d", path)
};
