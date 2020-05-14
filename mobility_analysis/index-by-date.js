// Some base function from https://observablehq.com/@d3/choropleth

files = ["https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json",
  "https://pkgstore.datahub.io/core/covid-19/countries-aggregated_json/data/d48a9b7bf2464e93c8fee669a61f2c0e/countries-aggregated_json.json"];

Promise.all(files.map(url => d3.json(url))).then((values) => drawgraph(values));

function drawgraph(values) {
  const world = values[0],
    data = values[1]
  countries = topojson.feature(world, world.objects.countries);

  const width = 975,
    height = 610;

  const color = d3.scaleSequential()
    .domain(d3.extent(data, (d) => d.Confirmed))
    .interpolator(d3.interpolateYlGnBu)
    .unknown("#ccc")


  const svg = d3.select("#choro").append('svg')
    .style("display", "block")
    .attr("viewBox", [0, 0, width, height]);

  var dataTime = d3.range(0, data.length).map(function (d) {
    return new Date(data[d].Date);
  });

  data1 = new Date(2020, 04, 26);
  function updateValue(val) {
    b = data.filter((d) => d.Date == val.toISOString().slice(0, 10))
    draw(b)
  }

  var sliderTime = d3
    .sliderBottom()
    .min(d3.min(dataTime))
    .max(d3.max(dataTime))
    .step(24 * 24)
    .width(300)
    .tickFormat(d3.timeFormat('%d %b'))
    .tickValues(dataTime / 10)
    .default(new Date(2020, 01, 14))
    .on('onchange', val => {
      d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
      updateValue(val)
    });
  // console.log(document.getElementById('timerslide').value)
  // console.log(data[0].date, data2.toISOString().slice(0,10)) < works
  // console.log(data.filter((d)=>new Date(d.date)==new Date(2020,04,14)))
  var gTime = d3
    .select('div#slider-time')
    .append('svg')
    .attr('width', 500)
    .attr('height', 100)
    .append('g')
    .attr('transform', 'translate(30,30)');

  gTime.call(sliderTime);

  d3.select('p#value-time').text(d3.timeFormat('%Y')(sliderTime.value()));

  projection = d3.geoEqualEarth()
  const path = d3.geoPath(projection)

  const outline = ({ type: "Sphere" });

  const defs = svg.append("defs");

  defs.append("path")
    .attr("id", "outline")
    .attr("d", path(outline));

  defs.append("clipPath")
    .attr("id", "clip")
    .append("use")
    .attr("xlink:href", new URL("#outline", location));

  const gclip = svg.append("g")
    .attr("clip-path", `url(${new URL("#clip", location)})`);

  gclip.append("use")
    .attr("xlink:href", new URL("#outline", location))
    .attr("fill", "white");

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
      return (same[0] ? color(same[0].Confirmed) : "#69b3a2")
    })
    .attr("d", path)
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut);

  g.append("path")
    .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
    .attr("fill", "none")
    .attr("stroke-linejoin", "round")
    .attr("d", path);

  svg.append("use")
    .attr("xlink:href", new URL("#outline", location))
    .attr("fill", "none")
    .attr("stroke", "black");

  function draw(b) {
    g.append("g")
      .selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("fill", (d) => {
        same = b.filter((obj) => obj.Country == d.properties.name);
        return (same[0] ? color(same[0].Confirmed) : "#69b3a2")
      })
      .attr("d", path)
  }

  // FUNCIONA, NÃO MEXA ↓↓
  // const g = svg.append("g")

  // g.selectAll("path")
  //   .data(topojson.feature(world, world.objects.countries).features)
  //   .join("path")
  //   .attr("stroke", "#fff")
  //   .attr("fill", (d)=>"#69b3a2")
  //   .attr("d", path)
};
