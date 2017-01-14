var gridSize = [12, 12],
    cellSize = 1,
    contourStyle = "stroke:black; stroke-width:3; fill:none",
    gridStyle = "stroke:black; stroke-width:1",
    svg,
    grid = [
      [[],[1,1],[],[],[],[],[1],[],[],[],[],[1,1]],
      [],
      [[],[1,1],[],[1,1,1],[],[],[],[],[1,1,1,1],[],[],[1,1]],
      [[],[],[],[],[1,1,1],[],[],[],[],[],[],[]],
      [[1],[],[1],[],[],[],[],[1,1,1],[],[],[],[]],
      [[],[],[],[],[1,1,1],[],[],[],[],[],[1,1,1],[]],
      [[],[1,1],[],[],[],[],[],[1,1,1],[],[],[],[]],
      [[],[],[],[],[1,1],[],[],[],[],[1],[],[1,1]],
      [[],[],[],[],[],[],[],[1,1],[],[],[],[]],
      [[1],[],[],[1,1,1],[],[],[],[],[1,1,1],[],[1],[]],
      [],
      [[1],[],[],[],[],[1],[],[],[],[],[1],[]]
    ]

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

  console.log(checkSave(grid))

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

function checkSave(save) {
  if (save.length != gridSize[1]) return "wrong number of lines"
  for (var i = 0 ; i < save.length ; i++) {
    if (save[i].length != gridSize[0] && save[i].length != 0) {
      return "wrong number of cells in line " + (i+1)
    }
  }
  return "save checked"
}
