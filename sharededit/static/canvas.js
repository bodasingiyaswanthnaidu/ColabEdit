let eraseMode = false
let pos
let toggleBtn, clearBtn
let cnvHeight, cnvWidth
let bgColor = [0, 0, 0]
let cnv
let redDisplay = 'rgba(255, 0, 0, 0.5)'
let red = 'rgb(255, 0, 0)'
let greenDisplay = 'rgba(0, 255, 0, 0.5)'
let green = 'rgb(0, 255, 0)'
let whiteDisplay = 'rgba(255, 255, 255, 0.5)'
let white = 'rgb(255, 255, 255)'
let colorPicker

function setup(){
    let canvasDiv = document.getElementById('sketch-holder')
    let chatAndCanvasDiv = document.getElementById('chatbox')
    cnvHeight = canvasDiv.clientHeight
    cnvWidth = chatAndCanvasDiv.clientWidth
    cnv = createCanvas(cnvWidth, cnvHeight)
    background(bgColor)
    cnv.parent('sketch-holder')

    toggleBtn = createButton("Erase")
    toggleBtn.position(0, 0)
    toggleBtn.parent("sketch-holder")

    clearBtn = createButton("Clear")
    clearBtn.position(60, 0)
    clearBtn.parent("sketch-holder")
    toggleBtn.mouseClicked(() => {
        eraseMode = !eraseMode
        if(eraseMode)
            toggleBtn.html('Draw')
        else
            toggleBtn.html('Erase')
    })

    clearBtn.mouseClicked(() => {
        resetSketch()
        chatSocket.onopen=()=>chatSocket.send(JSON.stringify({
        'type': 'canvas',
        'data': {
            'clear': true
        }
    }))
    })
    colorPicker = createColorPicker('#ed225d')
    colorPicker.position(10, 50)
    colorPicker.parent("sketch-holder")

}

function resetSketch(){
    background(bgColor)
    stroke(0, 0, 0)
}

function addStyleToButton(btn, style) {
    btn.addClass("btn")
    btn.addClass("btn-sm")
    btn.addClass(style)
}

function windowResized() {
    let canvasDiv = document.getElementById('sketch-holder')
    let chatAndCanvasDiv = document.getElementById('chatbox')
    cnvHeight = canvasDiv.clientHeight
    cnvWidth = chatAndCanvasDiv.clientWidth
    resizeCanvas(cnvWidth, cnvHeight)
}

function inside(){
    return (mouseX <= width && mouseX >= 0 && mouseY <= height && mouseY >= 0);
}

function getMappedValue(dimensions, x, y){
    let [w, h] = dimensions
    let myX = (width * x)/w
    let myY = (height * y)/h
    return [myX, myY]
}

function draw(){
    frameRate(60)
    strokeWeight(3)
    if(eraseMode && inside()){
        cursor('grab');
    }
    else{
        cursor(CROSS)
    }
    if(drawQueue.length != 0){
        //draw then set to null, received data from socket mouse position
        let data = drawQueue.shift()
        // console.log(data)
        if(data['clear']){
            resetSketch()
            return
        }
        let dimensions = data['dimensions']
        // console.log(dimensions)
        let pos = data['mousePos']
        let [mappedMouseX, mappedMouseY] = getMappedValue(dimensions, pos['mouseX'], pos['mouseY'])
        let [mappedPMouseX, mappedPMouseY] = getMappedValue(dimensions, pos['pmouseX'], pos['pmouseY'])
        if(data.eraseMode){
            strokeWeight(20)
            stroke(bgColor)
        }
        else{
            stroke(data.color.levels)
        }
        line(mappedMouseX, mappedMouseY, mappedPMouseX, mappedPMouseY)
    }
    if(mouseIsPressed){
        if(!inside()){
            return
        }
        if(eraseMode){
            stroke(bgColor)
        }
        else{
            stroke(colorPicker.color())
        }
        line(mouseX, mouseY, pmouseX, pmouseY);
         chatSocket.onopen=()=>chatSocket.send(JSON.stringify({'type': 'canvas',
            'data': {    
                'mousePos': {
                    mouseX, mouseY, pmouseX, pmouseY
                },
                'color': colorPicker.color(),
                eraseMode,
                'dimensions': [width, height],
                'clear': false
            }
        }))
    }
}