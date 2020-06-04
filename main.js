//information on the US GDP being attached to info
let info
let req = new XMLHttpRequest
req.open('GET', 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', false)
req.onload = () => {
  if(req.status == 200) {
    let json = JSON.parse(req.responseText)
    info = json.data
  }
}
req.send()

//dimensions of svg
const padding = 50
const width = 1280
const height = 720

const barWidth = (width - (2 * padding)) / info.length

const xScale = d3.scaleLinear()
  .domain([d3.min(info, (d) => parseInt(d[0].slice(0, 4))), d3.max(info, (d) => parseInt(d[0].slice(0, 4)))])
  .range([padding, width - padding])

const yScale = d3.scaleLinear()
  .domain([0, d3.max(info, (d) => d[1])])
  .range([padding, height - padding])

//scale specifically for left axis
const yScaleAxis = d3.scaleLinear()
  .domain([d3.max(info, (d) => d[1]), 0])
  .range([padding, height - padding])

const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisLeft(yScaleAxis)

let svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'container')
  .attr('fill', 'black')

let toolTip = d3.select('svg')
  .append('div')
  .attr('height', 40)
  .attr('width', 100)
  .attr('class', 'toolTip')
  .style('opacity', 0)

svg.selectAll('rect')
  .data(info)
  .enter()
  .append('rect')
  .attr('x', (d, i) => padding + i * barWidth)
  .attr('y', (d) => height - yScale(d[1]))
  .attr('width', 5)
  .attr('height', (d) => yScale(d[1]) - padding)
  .attr('fill', (d, i) => i % 2 === 0 ? 'orange' : '#ffc680')
  .attr('class', 'bar')
  .append('title')
  .html((d) => 'Date: ' + d[0] + '&#013;' + 'GDP: $' + d[1] + ' billion')
  //Couldn't get mouseover to work for some reason
  /*
  .on('mouseover', (d, i) => {
    toolTip.transition()
      .duration(200)
      .style('opacity', 0.9)
      .attr('transform', 'translate(' + padding + i * barWidth + 25 + ', ' + height / 4 * 3 + ')')
      .text('Year: ' + d[0] + ' GDP: ' + d[1])
  })
  .on('mouseout', (d) => {
    toolTip.transition()
      .duration(200)
      .style('opacity', 0)
  })
  */

svg.append('g')
  .attr('transform', 'translate(0,' + (height - padding) + ')')
  .call(xAxis)

svg.append('g')
  .attr('transform', 'translate(' + padding + ',0)')
  .call(yAxis)

svg.append('text')
  .attr('x', width / 2)
  .attr('y', 40)
  .attr('text-anchor', 'middle')
  .attr('font-size', '40px')
  .text('United States GDP')

svg.append('text')
  .attr('x', width / 2)
  .attr('y', height - 10)
  .attr('text-anchor', 'middle')
  .attr('font-size', '20px')
  .text('Years')

svg.append('text')
  .attr('x', -(height / 2))
  .attr('y', padding + 20)
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
  .attr('font-size', '20px')
  .text('GDP in billions of dollars')
