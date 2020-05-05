const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

let dataset = {
   'date':[],
   'gdp':[]
};

function drawgraph() {
   const margin = 60,
         width = 800,
         height= 400

   const yScale = d3.scaleLinear()
                    .domain([0, d3.max(dataset.gdp)])
                    .range([height-margin, 0]);

   const xScale = d3.scaleLinear()
                    .domain([d3.min(dataset.date).getFullYear(), d3.max(dataset.date).getFullYear()])
                    .range([0, width-margin])
                  //   .padding(0.2);  
   

   const svg = d3.select("#barChart")
                 .append("svg")
                 .attr("width", width)
                 .attr("height", height);


   svg.selectAll("rect")
       .data(dataset.gdp)
       .enter()
       .append("rect")
       .attr("x", (d, i) => i * 15)
       .attr("y", (d, i) => height - 3 * d)
       .attr("width", 5)
       .attr("height", (d, i) => yScale(d))
       .attr("fill", "navy")
       .attr("class", "bar")
       .attr("transform", "translate(40, " + (height-10)  +")")
       .append("title")
       .text((d)=>d)

// const x_axis = d3.axisBottom()
//         .scale(xScale);

// const y_axis = d3.axisLeft()
//         .scale(yScale);

// svg.append("g")
//        .attr("transform", "translate("+ margin +", 10)")
//        .call(y_axis);

// svg.append("g")
//       .attr("transform", "translate(40, " + (height-45)  +")")
//       .call(x_axis)

}

function testes() {
   console.log(d3.max(dataset.date).getFullYear())
}

d3.json(url).then( data => {
   data.data.forEach(element => {
      dataset.date.push(new Date(element[0]))
      dataset.gdp.push(element[1])
   });
   // testes()
   drawgraph()
})

