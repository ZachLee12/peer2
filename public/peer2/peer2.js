import Peer from "peerjs";
Peer.debug = true;
const peerId = 'Zach'
const peer2 = new Peer(peerId, {
    host: "localhost",
    port: 9000,
    path: "/",
})

peer2.on('open', (id) => console.log(`${id} connected to PeerServer`))
peer2.on("error", (error) => {
    console.error(error)
})
const conn = peer2.connect('Philipp')
conn.on('data', function (data) {
    console.log('Received:', data);
});


// peer2.on('connection', (conn) => {
//     conn.on('data', function (data) {
//         console.log('Received:', data);
//     });
// })

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

const msgBtn = document.querySelector('.msg-btn')
msgBtn.addEventListener('click', () => {
    conn.on('open', () => {
        conn.send('Hello Philipp, its me Zach')
        conn.on('error', (err) => console.error(err))
    })
})

