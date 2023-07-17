import Peer from "peerjs";
Peer.debug = true;
const peerId = 'Zach'
const peer2 = new Peer(peerId, {
    host: "localhost",
    port: 9000,
    path: "/",
})

//Peer (sending messages)
// 'open' = when connection to PeerServer is established
peer2.on('open', (id) => console.log(`${id} connected to PeerServer`))
peer2.on("error", (error) => {
    console.error(error)
})
const msgBtn = document.querySelector('.msg-btn')
//Connect to a remote peer
const conn = peer2.connect('Philipp')
//DataConnection (receiving messages)
conn.on('open', () => {
    console.log(`%c[connection]: connection with ${conn.peer} established`, 'color:#35ce35;')
})
conn.on('close', () => {
    console.log(`%c[connection]: connection with ${conn.peer} lost`, 'color:red;')
})

conn.on('data', data => console.log(`[message from ${conn.peer}]: ${data}`))

//When a remote peer is connected to you
peer2.on('connection', dataConnection => {
    console.log('[log]: ' + dataConnection.peer + " connected")
    dataConnection.on('close', () => console.log(`%c[connection]: connection closed for ${dataConnection.peer}`, 'color:red;'))
    dataConnection.on('data', data => console.log(`[message from ${dataConnection.peer}]: ${data}`))

})

msgBtn.addEventListener('click', () => {
    conn.send('Hello Philipp, its me Zach')
})


peer2.on('call', (mediaConnection) => {
    console.log('call')
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            mediaConnection.answer(stream);
            mediaConnection.on('stream', stream => {
                const videoEl = document.getElementById('video')
                videoEl.srcObject = stream
                videoEl.play()
            })
            mediaConnection.on('close', () => console.log('Video call ended'))
        })
})


