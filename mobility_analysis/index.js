// Some base function from https://observablehq.com/@d3/choropleth

rename = new Map([
  ["Antigua and Barbuda", "Antigua and Barb."],
  ["Bolivia (Plurinational State of)", "Bolivia"],
  ["Bosnia and Herzegovina", "Bosnia and Herz."],
  ["Brunei Darussalam", "Brunei"],
  ["Burma", "Myanmar"],
  ["Central African Republic", "Central African Rep."],
  ["Cook Islands", "Cook Is."],
  ["Democratic People's Republic of Korea", "North Korea"],
  ["Congo (Kinshasa)", "Dem. Rep. Congo"],
  ["Congo (Brazzaville)", "Congo"],
  ["Cote d'Ivoire", "Côte d'Ivoire"],
  ["Dominican Republic", "Dominican Rep."],
  ["Equatorial Guinea", "Eq. Guinea"],
  ["Iran (Islamic Republic of)", "Iran"],
  ["Lao People's Democratic Republic", "Laos"],
  ["Marshall Islands", "Marshall Is."],
  ["Micronesia (Federated States of)", "Micronesia"],
  ["Republic of Korea", "South Korea"],
  ["Republic of Moldova", "Moldova"],
  ["Russian Federation", "Russia"],
  ["Saint Kitts and Nevis", "St. Kitts and Nevis"],
  ["Saint Vincent and the Grenadines", "St. Vin. and Gren."],
  ["Sao Tome and Principe", "São Tomé and Principe"],
  ["Solomon Islands", "Solomon Is."],
  ["South Sudan", "S. Sudan"],
  ["Korea, South", "South Korea"],
  ["Swaziland", "eSwatini"],
  ["Syrian Arab Republic", "Syria"],
  ["North Macedonia", "Macedonia"],
  ['US', 'United States of America'],
  ['West Bank and Gaza', 'Palestine'],
  ["Taiwan*", "Taiwan"],
  ["Eswatini", "eSwatini"],
  ["United Republic of Tanzania", "Tanzania"],
  ["Venezuela (Bolivarian Republic of)", "Venezuela"],
  ["Viet Nam", "Vietnam"],
  ["Western Sahara", "W. Sahara"]
])

map = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json";
dados = "https://raw.githubusercontent.com/datasets/covid-19/master/data/countries-aggregated.csv";
mobilidade = "./mobility_all.json"

Promise.all([d3.json(map), d3.csv(dados), d3.csv(mobilidade)]).then((values) => drawgraph(values));

function drawgraph(values) {
  const world = values[0],
    all = values[1]
    mob = values[2];
    
  newest = d3.max(all, (d) => d.Date)
  data = all.filter((d) => d.Date == newest)
  data.forEach(element => {
    element.Country = (rename.get(element.Country)) ? rename.get(element.Country) : element.Country
  });

  countries = topojson.feature(world, world.objects.countries);

  const width = 975,
    height = 610;

  function zoomed() {
    g.attr("transform", d3.event.transform);
  }
  const zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

  const color = d3.scaleSequential()
    .domain(d3.extent(data, (d) => d.Recovered))
    .interpolator(d3.interpolateReds)
    .unknown("#ccc")


  const svg = d3.select("#choro").append('svg')
    .style("display", "block")
    .attr("viewBox", [0, 0, width, height])
    .call(zoom);

  projection = d3.geoEqualEarth()
  const path = d3.geoPath(projection)

  // const outline = ({ type: "Sphere" });

  // const defs = svg.append("defs");

  // defs.append("path")
  //   .attr("id", "outline")
  //   .attr("d", path(outline));

  // defs.append("clipPath")
  //   .attr("id", "clip")
  //   .append("use")
  //   .attr("xlink:href", new URL("#outline", location));

  // const gclip = svg.append("g")
  //   .attr("clip-path", `url(${new URL("#clip", location)})`);

  // gclip.append("use")
  //   .attr("xlink:href", new URL("#outline", location))
  //   .attr("fill", "white");

  const g = svg.append("g")

  const mouseOver = function (d) {
    county = d3.select(this)
    county
      .style("stroke", "black")
  };

  const mouseOut = function (d) {
    d3.select(this)
      .style("stroke", "none")
  };

  g.append("g")
    .selectAll("path")
    .data(countries.features)
    .join("path")
    .attr("fill", (d) => {
      same = data.filter((obj) => obj.Country == d.properties.name);
      return (same[0] ? color(same[0].Recovered) : "#ddd")
    })
    .attr("d", path)
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut)
    // .on("click", displayPlot)
    .append("title")
    .text(d => {
      same = data.filter((obj) => obj.Country == d.properties.name);
      return `${d.properties.name}\n${
        same[0] ? same[0].Recovered : "NA"
        }`
    });

  g.append("path")
    .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  svg.append("use")
    .attr("xlink:href", new URL("#outline", location))
    .attr("fill", "none")
    .attr("stroke", "black");

  // FUNCIONA, NÃO MEXA ↓↓
  // const g = svg.append("g")

  // g.selectAll("path")
  //   .data(topojson.feature(world, world.objects.countries).features)
  //   .join("path")
  //   .attr("stroke", "#fff")
  //   .attr("fill", (d)=>"#69b3a2")
  //   .attr("d", path)
};
