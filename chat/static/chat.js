console.log(userName)
console.log(roomName)

let chatWindow = document.getElementById('chat-text');
const chatSocket = new WebSocket(
    'wss://127.0.0.1:8000/ws/chat/'+roomName+'/'
);

document.querySelector('#submit').onclick = function (e) {
    console.log('sending data')
    const messageInputDom = document.querySelector('#input');
    const message = messageInputDom.value;
    chatSocket.onopen=()=>chatSocket.send(JSON.stringify({
        'type': 'chat',
        'message': message,
    }));
    messageInputDom.value = '';
};



//stop reloading page when pressed enter in chatbox, but instead click the submit button
$("#input").on('keypress', (e) => {
    if(e.key == 'Enter'){
        $("#submit").click()
    }
})

chatSocket.onmessage = function (e) {
    const data = JSON.parse(e.data);
    if(data){
           console.log(data)
    }else{
            console.log('No data received')
    }
    if(data.username){
        document.querySelector('#chat-text').innerHTML += ('<span class="text-danger">' + data.username + '</span>'+ ': ' + data.message + '<br/>')
    }
    else{
        document.querySelector('#chat-text').innerHTML += ('<span class="font-weight-bold">' + data.message + '</span>' + '<br/>') 
    }
    var xH = chatWindow.scrollHeight; 
    chatWindow.scrollTo(0, xH);

}

$(document).ready(() => {
    $("#exit").click(() => {
        chatSocket.close()
        document.querySelector('#chat-text').innerHTML += ('<span class="font-weight-bold">' + 'Connection closed.' + '</span>' + '<br/>') 
        $("#exit").hide()
        $("#submit").hide()
        $("#reload").show()
    })
    $("#reload").click(() => {
        location.reload()
    })
})