// 웹 소켓 관련 기능
class Websocket_func {
    // 메세지 전송
    sendchat(webSocket) {
        const chatinput = document.getElementById('chat_input')
        const message = chatinput.value
        webSocket.send(JSON.stringify({
            'message': message,
            'testmessage': 'hyeongseok'
            }))
            chatinput.value = ''
            chatinput.focus()
        }

    // room 1 을 사용한 메세지
    makeroom(webSocket, room_id) {
        const chatinput = document.getElementById('room_id_input')
        const message = chatinput.value
        
        // webSocket.onopen = () =>
        webSocket.send(JSON.stringify({
            'room_id': room_id,
            'message': message,
            }))
            chatinput.value = ''
            chatinput.focus()
    }
}

function sumit_message_Enterkey() {
    if (window.event.keyCode == 13) {
        send_chat_button();
    }
}

function sumit_make_room_Enterkey() {
    if (window.event.keyCode == 13) {
        send_message_each_room_button();
    }
}

async function check_is_chat_user_room(user_id) {
    formData = {"user_id": "1"}
    const response = await fetch('http://127.0.0.1:8000/chats/', {
        // headers:{
        //     "Authorization":"Bearer "+localStorage.getItem("access")
        // },
        headers: {
            "Content-Type": "application/json",
            "Authorization":"Bearer " + temp_access_token
        },
        method:'POST',
        // body: formData
        body: JSON.stringify({
            "user_id": "1"
        })
    }).then(response => {
        return response.json()
    }).then(data => {
        return data
    })

    // room_id 를 보내줌 ex) 5
    return response
}