var cellSize = 1,
    cluePos = [ // as fraction of cellSize
      [[.5, .5, .8]],
      [[.3, .7, .5], [.7, .3, .5]],
      [[.25, .3, .5], [.5, .7, .5], [.75, .3, .5]],
      [[.25, .5, .4], [.75, .5, .4], [.5, .25, .4], [.5, .75, .4]]
    ],
    contourStyle = "stroke:black; stroke-width:3; fill:none",
    gridStyle = "stroke:black; stroke-width:1",
    svg,
    currentCell = null,
    grid = "b,c14/,b,b,c3/,b,b,b,b,c31/,b;b,,rb,rw,dw,c31/,c4/,c14/3,rwdb,,b;c/3,rw,,c3/31,,,,,,,c14/;c/14,rb,,db,c14/,,,,c14/3,rw,;b,b,c31/,,rw,,c31/,,rw,,db;c/3,rb,,c4/,rw,,,c3/,rw,,;c/14,,,,c14/14,,,dw,c14/,rw,;c/14,,db,,,c3/14,rb,,,b,b;b,rw,,c3/14,,db,,c/14,rb,,;b,c/31,,dw,,,rw,,c/3,rw,;b,c/4,,,b,b,b,rb,,rb,"
/*
    grid = [
      [['b'],['c14'],['b'],['b'],['c3'],['b'],['b'],['b'],['b'],['c31'],['b']],
      [['b'],[],[],[],[],['c31'],['c4'],['c14','c3'],[],[],['b']],
      [['','c3'],[],[],['c3','c31'],[],[],[],[],[],[],['c14']],
      [['','c14'],[],[],[],['c14'],[],[],[],['c14','c3'],[],[]],
      [['b'],['b'],['c31'],[],[],[],['c31'],[],[],[],[]],
      [['','c3'],[],[],['c4'],[],[],[],['c3'],[],[],[]],
      [['','c14'],[],[],[],['c14','c14'],[],[],[],['c14'],[],[]],
      [['','c14'],[],[],[],[],['c3','c14'],[],[],[],['b'],['b']],
      [['b'],[],[],['c3','c14'],[],[],[],['','c14'],[],[],[]],
      [['b'],['','c31'],[],[],[],[],[],[],['','c3'],[],[]],
      [['b'],['','c4'],[],[],['b'],['b'],['b'],[],[],[],[]],
    ]

/* 12x12 Tapa Grid
    [
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
*/

// TODO clean all constants !!


// TODO should probably have a library of comportments (mouse or keyboard interactions or whatever) and apply them by giving css classes to cells, or any other attribute, or any other element

// i <=> line <=> y & j <=> colums <=> x        Counter Intuitive ?

// TODO now draw and loadSave serve the same purpose
function draw() {
  var save = checkSave(grid)
  if (!save.tab) return save // TODO should be exception handling
  
  svg = document.getElementsByTagName('svg')[0]

  svg.style = [
    "width:",
    save.width * cellSize,
    "cm; height:",
    save.height * cellSize,
    "cm"
  ].join('')

  document.body.onkeypress = function(e) { //console.log(e.key, e.code)
    if (!currentCell) return
    
    var coord = currentCell.id.split(',').map((v,i,a)=>parseInt(v))
    
    if (!currentCell.filled) {
      currentCell.filled = currentCell.number = true // TODO indicators for cell content could be a bool array => bitwise ops

      var number = document.createElementNS(svg.namespaceURI, "text")
      number.style = [ // TODO could be aligned to the corner borders instead of centered on predefined coordinates
        "fill:black; alignment-baseline:central; text-anchor:middle; ",
        "font-weight:bold; font-family:Helvetica; ",
        "pointer-events:none; cursor:context-menu; ",
        "user-select: none; -webkit-user-select:none; -moz-user-select:none"
      ].join('  ')

      number.setAttribute('x', (coord[1] + .5) * cellSize + "cm")
      number.setAttribute('y', (coord[0] + .5) * cellSize + "cm")
      number.setAttribute('font-size', .8 * cellSize + "cm")
      number.id = "number" + currentCell.id
      number.appendChild(document.createTextNode(e.key))
      svg.appendChild(number)
    }
    else if (currentCell.number) {
      currentCell.number = false
      currentCell.hint = 1
      var hint = document.getElementById("number" + currentCell.id)
      hint.setAttribute('x', (coord[1] + .2) * cellSize + "cm")
      hint.setAttribute('y', (coord[0] + .2) * cellSize + "cm")
      hint.setAttribute('font-size', .25 * cellSize + "cm")
      hint.id = "hint" + currentCell.id + ',' + currentCell.hint
    }
    if (currentCell.hint && currentCell.hint < 8) {
      var hint = document.createElementNS(svg.namespaceURI, "text")
      hint.style = [
        "fill:black; alignment-baseline:central; text-anchor:middle; ",
        "font-weight:bold; font-family:Helvetica; ",
        "pointer-events:none; cursor:context-menu; ",
        "user-select: none; -webkit-user-select:none; -moz-user-select:none"
      ].join('  ')
      hint.setAttribute('x', (coord[1] + .2 + .2 * (currentCell.hint % 4)) * cellSize + "cm")
      hint.setAttribute('y', (coord[0] + .2 + .6 * Math.floor(currentCell.hint / 4)) * cellSize + "cm")
      hint.setAttribute('font-size', .25 * cellSize + "cm")
      hint.id = "hint" + currentCell.id + ',' + ++currentCell.hint
      hint.appendChild(document.createTextNode(e.key))
      svg.appendChild(hint)
    }
  }

  var rect = document.createElementNS(svg.namespaceURI, "rect")
  rect.style = contourStyle + ";x:0;y:0;width:100%;height:100%"
  svg.appendChild(rect)

  for (var i = 0 ; i < save.height ; i++) {
    for (var j = 0 ; j < save.width ; j++) {
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
      cell.onmouseover = function() {
        if (!this.black) this.style.fillOpacity = .2
        currentCell = this
        
      }
      cell.onmouseout = function() {
        if (!this.black) this.style.fillOpacity = 0
        currentCell = null
      }
      cell.onclick = function() {
        if (!this.filled) this.style.fillOpacity = 1, this.black = this.filled = true
        else if (this.black) this.style.fillOpacity = .2, this.black = this.filled = false
        else if (this.number) document.getElementById("number" + this.id).remove(), this.number = this.filled = false
      }
      svg.appendChild(cell)
    }
  }

  loadSave(save)
  return "YaY!!"
}

function checkSave(save) {
  var t = save.split(';').map(v => v.split(','))
  if (!t.every(v => {return v.length == t[0].length})) return ["Different line lengths", t.map(v => v.length)]
  
  t = t.map(v => v.map(s => 
  {
    var r = {}
    
    switch(s[0]) { // TODO check existence of censtants for JS
        
      case 'b':
        r.type = "Border"
        break;
        
      case 'c':
        r.type = "Clue"
        if (s.includes('/')) {
          r.subtype = "Kakuro"
          r.vals = s.slice(1).split('/')
        }
        break;
        
      case 'r':
        var c = "BUG"
        if (s[1] == 'b') c = "Black"
        else if (s[1] == 'w') c = "White"
        // TODO else throw an exception ?
        r.right = c
      case 'd':
        var c = "BUG"
        if (s[1] == 'b') c = "Black"
        else if (s[1] == 'w') c = "White"
        // TODO else throw an exception ?
        r.down = c
      default:
        r.type = "Cell"
    }
    
    return r
  }))
  
  var s =
    {
      tab: t,
      height: t.length,
      width: t[0].length
    }
  
  
  return s
}

function loadSave(save) {
  for (var i = 0 ; i < save.height ; i++) {
    for (var j = 0 ; j < save.width ; j++) {
      var content = save.tab[i][j]
      var cell = document.getElementById(i + ',' + j)
      
      if (content.type == 'Border') {
        cell.style.pointerEvents = 'none'
        cell.style.fillOpacity = 1
      }
      else if (content.type == 'Clue') {
        cell.style.pointerEvents = 'none'
        
        var color = content.subtype == "Kakuro" ? 'white' : 'black'
      
        var vals = content.vals
            pos = cluePos[vals.length - 1]
        for (var k = 0 ; k < vals.length ; k++) {
          if (!vals[k]) continue
          
          var point = [(j + pos[k][0]) * cellSize, (i + pos[k][1]) * cellSize],
              clueSize = pos[k][2] * cellSize

          var clueRect = document.createElementNS(svg.namespaceURI, "rect")
          clueRect.style = [
            "fill-opacity:0; fill:grey; x:",
            point[0] - clueSize/2,
            "cm; y:",
            point[1] - clueSize/2,
            "cm; width:",
            clueSize,
            "cm; height:",
            clueSize,
            "cm"
          ].join('')

          clueRect.id = i + ',' + j + ',' + k
          clueRect.onmouseover = function() {
            this.style.fillOpacity = 1
          }
          clueRect.onmouseout = function() {
            this.style.fillOpacity = 0
          }
          clueRect.onclick = function() {
            if (!this.clicked) this.clue.style.opacity = .5, this.clicked = true
            else this.clue.style.opacity = 1, this.clicked = false
          }
          svg.appendChild(clueRect)

          var clue = document.createElementNS(svg.namespaceURI, "text")
          clue.style = [ // TODO could be aligned to the corner borders instead of centered on predefined coordinates
            "fill:"+color+"; alignment-baseline:central; text-anchor:middle; ",
            /*"font-weight:bold; */"font-family:Helvetica; ",
            "pointer-events:none; cursor:context-menu; ",
            "user-select: none; -webkit-user-select:none; -moz-user-select:none"
          ].join('  ')
          clue.setAttribute('x', point[0] + "cm")
          clue.setAttribute('y', point[1] + "cm")
          clue.setAttribute('font-size', clueSize + "cm")
          clue.id = "clue" + i + ',' + j + ',' + k
          /* TODO: Don't understand why it doesn't work
          clue.style = [
            "fill:black; x:",
            (j + pos[k][0]) * cellSize,
            "cm; y:",
            (i + pos[k][1]) * cellSize,
            "cm"
          ].join('')
          */
          clue.appendChild(document.createTextNode(vals[k]))
          svg.appendChild(clue)

          clueRect.clue = clue // TODO:Bad coding design ? Unreadable ?
        }
        
        if (content.subtype == "Kakuro") {
          cell.style.fillOpacity = 1
          var diag = document.createElementNS(svg.namespaceURI, "line")
          diag.style = "stroke:white; stroke-width:1"
          diag.setAttribute('x1', j * cellSize + "cm")
          diag.setAttribute('y1', i * cellSize + "cm")
          diag.setAttribute('x2', (j + 1) * cellSize + "cm")
          diag.setAttribute('y2', (i + 1) * cellSize + "cm")
          svg.appendChild(diag)
        }
      }
      else if (content.right) {
        var dot = document.createElementNS(svg.namespaceURI, "circle")
        dot.style = "stroke:black; stroke-width:1; fill:" + content.right
        dot.setAttribute('cx', (j + 1) * cellSize + "cm")
        dot.setAttribute('cy', (i + .5) * cellSize + "cm")
        dot.setAttribute('r', .2 * cellSize + "cm")
        svg.appendChild(dot)
      }
      else if (content.down) {
        var dot = document.createElementNS(svg.namespaceURI, "circle")
        dot.style = "stroke:black; stroke-width:1; fill:" + content.down
        dot.setAttribute('cx', (j + .5) * cellSize + "cm")
        dot.setAttribute('cy', (i + 1) * cellSize + "cm")
        dot.setAttribute('r', .2 * cellSize + "cm")
        svg.appendChild(dot)
      }
    }
  }
}
