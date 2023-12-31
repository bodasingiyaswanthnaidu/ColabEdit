let drawQueue = [] //for canvas

var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
document.getElementById('editor').style.fontSize='14px';
editor.session.setMode("ace/mode/python");

console.log(userName, 'joined the chat')


let cursorPos = null;
let lock = false


//send updates from text editor to other people connected using websocket
//this will be done as soon as a keystroke is made
editor.session.on('change', function(delta) {
    if(lock) return;
chatSocket.onopen=()=>chatSocket.send(JSON.stringify({"type": "editor", "text": delta, "cursor": editor.selection.getCursor()}))
});


chatSocket.onmessage = function (e) {
    let data = JSON.parse(e.data);

    if(data['type']=='chat'){
        if(data.username){
            document.querySelector('#chat-text').innerHTML += ('<span class="text-danger">' + data.username + '</span>'+ ': ' + data.message + '<br/>')
        }
        else{
            document.querySelector('#chat-text').innerHTML += ('<span class="font-weight-bold">' + data.message + '</span>' + '<br/>') 
        }
        var xH = chatWindow.scrollHeight
        chatWindow.scrollTo(0, xH)
    }
    else if(data['type']=='editor'){
        if(userName!=data.username){
            cursorPos = editor.selection.getCursor();
            // console.log(cursorPos, 'is the cursor at')
            lock = true;
            if(data['sync']){
                editor.setValue(data['text'])
                editor.clearSelection() // This will remove the highlight over the text
            }
            else if(data['text']!=null){
                editor.getSession().getDocument().applyDeltas([data['text']])
            }
            lock = false;
            editor.moveCursorToPosition(cursorPos)
        }
    }
    else if(data['type']=='canvas'){
        // console.log('got canvas data')
        // console.log(data['data'])
        drawQueue.push(data['data'])
    }
    else if(data['type']=='output'){
        console.log("HERE")
        showOutput(data['data'])
        console.log(data)
    }
}

function changeFontSize(e) {
    let val = e.value
    let ele = document.getElementById('editor')
    ele.style.fontSize=`${val}px`
}


function runCode(e){
    let code = editor.getValue()
    let ele = document.getElementById('code-output')
    ele.classList = ['text-white']
    axios.post('/code/run/', {
        'code': code,
    }).then(res => {
        console.log(res)
        ele.innerHTML=res['data']['results']
        ele.classList.add('text-white')
        chatSocket.onopen=()=>chatSocket.send(JSON.stringify({
            type: "output",
            data: res,
        }));
    }).catch(err=>{
        ele.classList.add('text-danger')
        ele.innerHTML = 'Unexpected error occured'
    })
}



function showOutput(res) {
    let data = res.data
    let ele = document.getElementById('code-output')
    ele.classList = ['text-white']
    let text
    if(data.code == '0'){
        text = data.results
    }
    else if(data.code == '1'){
        ele.classList.add('text-danger')
        text = data.results
    }
    else if(data.code == '2'){
        ele.classList.add('text-danger')
        text = 'Compilation/Syntax errors!'
    }
    ele.innerHTML = text 
}

//also resynchronize the code for all clients connected through WS
//TODO
function saveCode(e) {
    console.log("pressed")
    let code = editor.getValue()
    //synchronizes the code for all clients with the code which is present with the user that presses the button
     chatSocket.onopen=()=>chatSocket.send(JSON.stringify({
        type: "editor",
        text: code,
        sync: true,
    }))
}