var gridSize = [11, 11],
    cellSize = 1,
    contourStyle = "stroke:black; stroke-width:3; fill:none",
    gridStyle = "stroke:black; stroke-width:1",
    svg

function draw() {
  svg = document.getElementsByTagName('svg')[0]

  svg.style = [
    "width:",
    gridSize[0]*cellSize,
    "cm; height:",
    gridSize[1]*cellSize,
    "cm"
  ].join('')

  var rect = document.createElementNS(svg.namespaceURI, "rect")
  rect.style = contourStyle + ";x:0;y:0;width:100%;height:100%"
  svg.appendChild(rect)

  for (var i = 0 ; i < gridSize[0] ; i++) {
    for (var j = 0 ; j < gridSize[1] ; j++) {
      var cell = document.createElementNS(svg.namespaceURI, "rect")
      cell.style = [
        gridStyle,
        "; x:",
        i * cellSize,
        "cm; y:",
        j * cellSize,
        "cm; width:",
        cellSize,
        "cm; height:",
        cellSize,
        "cm; fill:white"
      ].join('')
      cell.id = i + ',' + j
      /*
      cell.onmouseover = function() {
        console.log("over", this.id)
      }
      cell.onmouseout = function() {
        console.log("out", this.id)
      }
      */
      cell.onclick = function() {
        console.log("click", this.id)
        this.style.fill = 'black'
      }
      svg.appendChild(cell)
    }
  }
}
