const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const irisStatus = document.getElementById('iris-status');
const scanIrisBtn = document.getElementById('scan-iris');

const startRecordBtn = document.getElementById('start-record');
const stopRecordBtn = document.getElementById('stop-record');
const voiceStatus = document.getElementById('voice-status');
const audioPlayback = document.getElementById('audio-playback');

let mediaRecorder;
let audioChunks = [];

// Старт камери
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(error => {
        irisStatus.textContent = "Помилка доступу до камери.";
        console.error(error);
    });

// Імітація сканування райдужки
scanIrisBtn.onclick = () => {
    irisStatus.textContent = "Сканування...";
    setTimeout(() => {
        irisStatus.textContent = "Райдужку розпізнано!";
        document.getElementById('voice-auth').style.display = 'block';
    }, 3000);
};

// Запис голосу
startRecordBtn.onclick = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks);
        const audioUrl = URL.createObjectURL(audioBlob);
        audioPlayback.src = audioUrl;
        voiceStatus.textContent = "Голос записано!";
    };

    mediaRecorder.start();
    startRecordBtn.disabled = true;
    stopRecordBtn.disabled = false;
    voiceStatus.textContent = "Запис...";
};

stopRecordBtn.onclick = () => {
    mediaRecorder.stop();
    startRecordBtn.disabled = false;
    stopRecordBtn.disabled = true;
};