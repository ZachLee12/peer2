import Peer from "peerjs";
Peer.debug = true;
const peerId = 'Zach'
const peer2 = new Peer(peerId, {
    host: "srldev.enterpriselab.ch",
    port: 9000,
    path: '/'
})

//Peer (sending messages)
// 'open' = when connection to PeerServer is established
peer2.on('open', (id) => console.log(`${id} connected to PeerServer`))
peer2.on("error", (error) => {
    console.error(error)
})

//DOM elements
const videoEl = document.getElementById('video')
const msgBtn = document.querySelector('.msg-btn')
//Connect to a remote peer

//must wait for awhile for it connect successfully..
setTimeout(() => {
    const conn = peer2.connect('Philipp')
    //DataConnection (receiving messages)
    conn.on('open', () => {
        console.log(`%c[connection]: connection with ${conn.peer} established`, 'color:#35ce35;')
    })
    conn.on('close', () => {
        console.log(`%c[connection]: connection with ${conn.peer} lost`, 'color:red;')
    })

    conn.on('data', data => console.log(`[message from ${conn.peer}]: ${data}`))

    conn.on('error', (err) => console.error(err))

    msgBtn.addEventListener('click', () => {
        conn.send('Hello Philipp, its me Zach')
    })
}, 500)

//When a remote peer is connected to you
peer2.on('connection', dataConnection => {
    console.log('[log]: ' + dataConnection.peer + " connected")
    dataConnection.on('close', () => console.log(`%c[connection]: connection closed for ${dataConnection.peer}`, 'color:red;'))
    dataConnection.on('data', data => console.log(`[message from ${dataConnection.peer}]: ${data}`))

})


//Call (Video-stream)
peer2.on('call', (mediaConnection) => {
    console.log(`[call]: ${mediaConnection.peer} called.`)
    mediaConnection.answer()
    mediaConnection.on('stream', stream => {
        videoEl.srcObject = stream
        videoEl.play()
        console.log(`[log]: Video stream started.`)
    })

    //PeerJS bug: https://github.com/peers/peerjs/issues/636
    //'close' from mediaConnection is never fired.
    mediaConnection.on('close', () => {
        videoEl.pause();
        videoEl.style.display = 'none'
        console.log(`[log]: Video stream ended.`)
    })
    mediaConnection.on('error', (err) => {
        console.error(err)
    })

})




