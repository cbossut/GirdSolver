var gridSize = [12, 12],
    cellSize = 1,
    cluePos = [
      [[.5, .5]],
      [[.25, .25], [.75, .75]],
      [[.25, .25], [.5, .75], [.75, .25]],
      [[.25, .5], [.75, .5], [.5, .25], [.5, .75]]
    ],
    contourStyle = "stroke:black; stroke-width:3; fill:none",
    gridStyle = "stroke:black; stroke-width:1",
    svg,
    grid = [
      [[],['1','1'],[],[],[],[],['1'],[],[],[],[],['1','1']],
      [],
      [[],['1','1'],[],['1','1','1'],[],[],[],[],['1','1','1','1'],[],[],['1','1']],
      [[],[],[],[],['1','1','1'],[],[],[],[],[],[],[]],
      [['1'],[],['1'],[],[],[],[],['1','1','1'],[],[],[],[]],
      [[],[],[],[],['1','1','1'],[],[],[],[],[],['1','1','1'],[]],
      [[],['1','1'],[],[],[],[],[],['1','1','1'],[],[],[],[]],
      [[],[],[],[],['1','1'],[],[],[],[],['1'],[],['1','1']],
      [[],[],[],[],[],[],[],['1','1'],[],[],[],[]],
      [['1'],[],[],['1','1','1'],[],[],[],[],['1','1','1'],[],['1'],[]],
      [],
      [['1'],[],[],[],[],['1'],[],[],[],[],['1'],[]]
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

  for (var i = 0 ; i < gridSize[0] ; i++) {
    for (var j = 0 ; j < gridSize[1] ; j++) {
      var cell = document.createElementNS(svg.namespaceURI, "rect")
      cell.style = [
        gridStyle,
        "; x:",
        j * cellSize,
        "cm; y:",
        i * cellSize,
        "cm; width:",
        cellSize,
        "cm; height:",
        cellSize,
        "cm; fill-opacity:0"
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
        this.style.fillOpacity = 1
      }
      svg.appendChild(cell)
    }
  }

  if (checkSave(grid)[1]) loadSave(grid)
}

function checkSave(save) {
  if (save.length != gridSize[1]) return [false, "wrong number of lines"]
  for (var i = 0 ; i < save.length ; i++) {
    if (save[i].length != gridSize[0] && save[i].length != 0) {
      return [false, "wrong number of cells in line " + (i+1)]
    }
  }
  return [true, "save checked"]
}

function loadSave(save) {
  for (var i = 0 ; i < gridSize[0] ; i++) {
    if (!save[i]) break
    for (var j = 0 ; j < gridSize[1] ; j++) {
      if (!save[i][j]) break
      document.getElementById(i + ',' + j).onclick = function() {}

      var content = save[i][j],
          pos = cluePos[content.length - 1]
      for (var k = 0 ; k < content.length ; k++) {
        var clue = document.createElementNS(svg.namespaceURI, "text")
        clue.style = "fill:black;"
        clue.setAttribute('x', ((j + pos[k][0]) * cellSize) + "cm")
        clue.setAttribute('y', ((i + pos[k][1]) * cellSize) + "cm")
        /* TODO: Don't understand why it doesn't work
        clue.style = [
          "fill:black; x:",
          (j + pos[k][0]) * cellSize,
          "cm; y:",
          (i + pos[k][1]) * cellSize,
          "cm"
        ].join('')
        */
        clue.onclick = function() {
          this.opacity = .5
        }
        clue.appendChild(document.createTextNode(content[k]))
        svg.appendChild(clue)
      }
    }
  }
}
