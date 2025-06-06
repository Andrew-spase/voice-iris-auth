const video = document.getElementById("video");
const scanIrisBtn = document.getElementById("scanIrisBtn");
const irisStatus = document.getElementById("irisStatus");
const recordBtn = document.getElementById("recordBtn");
const voiceStatus = document.getElementById("voiceStatus");
const audioPlayer = document.getElementById("audioPlayer");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

let scanCount = 0;
let irisRecognized = false;
let voiceRecordCount = 0;
let voiceRecorded = false;
let audioBlob = null;
let videoStream = null;

async function startCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = videoStream;
        irisStatus.textContent = "";
    } catch (err) {
        irisStatus.textContent = "Помилка доступу до камери: " + err.message;
    }
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        videoStream = null;
    }
}

startCamera();

scanIrisBtn.onclick = function () {
    scanCount++;

    if (scanCount < 3) {
        irisStatus.textContent = "Дані райдужки збережено (" + scanCount + "/3). Продовжуйте.";
    } else {
        irisRecognized = true;
        irisStatus.textContent = "Райдужку розпізнано!";
        scanIrisBtn.style.display = "none";

        stopCamera();

        recordBtn.style.display = "inline-block";
        resetBtn.style.display = "inline-block";
    }
};

resetBtn.onclick = function () {
    scanCount = 0;
    voiceRecordCount = 0;
    irisRecognized = false;
    voiceRecorded = false;
    audioBlob = null;

    scanIrisBtn.style.display = "inline-block";
    recordBtn.style.display = "none";
    submitBtn.style.display = "none";
    resetBtn.style.display = "none";

    irisStatus.textContent = "";
    voiceStatus.textContent = "";
    audioPlayer.style.display = "none";
    audioPlayer.src = "";

    startCamera();
};

recordBtn.onclick = function () {
    recordBtn.disabled = true;
    voiceStatus.textContent = "Запис голосу...";

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);

        mediaRecorder.onstop = () => {
            audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayer.src = audioUrl;
            audioPlayer.style.display = "block";

            voiceRecordCount++;

            if (voiceRecordCount === 1) {
                voiceStatus.textContent = "Голос збережено. Запишіть ще раз для підтвердження.";
                submitBtn.style.display = "none";
            } else {
                voiceRecorded = true;
                voiceStatus.textContent = "Голос підтверджено!";
                submitBtn.style.display = "inline-block";
            }

            stream.getTracks().forEach(track => track.stop());
            recordBtn.disabled = false;
        };

        mediaRecorder.start();

        setTimeout(() => {
            mediaRecorder.stop();
        }, 2000);
    }).catch(err => {
        voiceStatus.textContent = "Помилка доступу до мікрофону: " + err.message;
        recordBtn.disabled = false;
    });
};

submitBtn.onclick = function () {
    if (irisRecognized && voiceRecorded) {
        window.location.href = "success.html";
    }
};
