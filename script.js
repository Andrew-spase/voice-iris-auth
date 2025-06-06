let scanCount = 0;
let irisRecognized = false;
let voiceRecorded = false;
let audioBlob;
let voiceRecordCount = 0;

const video = document.getElementById("video");
const startIrisBtn = document.getElementById("startIrisBtn");
const scanIrisBtn = document.getElementById("scanIrisBtn");
const irisStatus = document.getElementById("irisStatus");
const retryBtn = document.getElementById("retryBtn");
const recordBtn = document.getElementById("recordBtn");
const voiceStatus = document.getElementById("voiceStatus");
const audioPlayer = document.getElementById("audioPlayer");
const submitBtn = document.getElementById("submitBtn");

let videoStream = null;
let audioStream = null;

// Починаємо сканування райдужки — вмикаємо камеру і показуємо кнопку "Сканувати"
startIrisBtn.onclick = async function () {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = videoStream;
        irisStatus.textContent = "";
        startIrisBtn.style.display = "none";
        scanIrisBtn.style.display = "inline-block";
        recordBtn.style.display = "none";
        voiceStatus.textContent = "";
        audioPlayer.style.display = "none";
        submitBtn.style.display = "none";
        scanCount = 0;
        irisRecognized = false;
        voiceRecorded = false;
        voiceRecordCount = 0;
    } catch (err) {
        irisStatus.textContent = "Помилка при запуску камери: " + err.message;
    }
};

// Кнопка "Сканувати райдужку"
scanIrisBtn.onclick = function () {
    scanCount++;

    if (scanCount === 1) {
        irisStatus.textContent = "Дані об'єкта збережено.";
        // Наступний крок — ще раз сканувати
    } else {
        irisRecognized = true;
        irisStatus.textContent = "Райдужку розпізнано!";
        scanIrisBtn.style.display = "none";
        // Завершуємо відеопотік
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;

        // Показуємо кнопку запису голосу
        recordBtn.style.display = "inline-block";
    }
};

// Кнопка "Записати голос"
recordBtn.onclick = async function () {
    try {
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(audioStream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            audioPlayer.src = audioUrl;
            audioPlayer.style.display = "block";

            voiceRecordCount++;

            if (voiceRecordCount === 1) {
                voiceStatus.textContent = "Голос збережено.";
                submitBtn.style.display = "none";
            } else {
                voiceRecorded = true;
                voiceStatus.textContent = "Голос підтверджено!";
                submitBtn.style.display = "inline-block";
            }

            // Зупиняємо аудіо потік
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
        };

        mediaRecorder.start();

        // Запис 2 секунди
        setTimeout(() => {
            mediaRecorder.stop();
        }, 2000);

    } catch (err) {
        voiceStatus.textContent = "Помилка при записі голосу: " + err.message;
    }
};

// Кнопка "Надіслати"
submitBtn.onclick = function () {
    if (irisRecognized && voiceRecorded) {
        window.location.href = "success.html";
    } else {
        alert("Будь ласка, пройдіть автентифікацію повністю.");
    }
};
