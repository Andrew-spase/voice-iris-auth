let scanCount = 0;
let irisRecognized = false;
let voiceRecorded = false;
let voiceRecordCount = 0;
let audioBlob;
let videoStream = null;

const video = document.getElementById("video");
const scanIrisBtn = document.getElementById("scanIrisBtn");
const irisStatus = document.getElementById("irisStatus");
const retryBtn = document.getElementById("retryBtn");
const recordBtn = document.getElementById("recordBtn");
const voiceStatus = document.getElementById("voiceStatus");
const audioPlayer = document.getElementById("audioPlayer");
const submitBtn = document.getElementById("submitBtn");

// Запускаємо камеру одразу, щоб було відео для сканування райдужки
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
    videoStream = stream;
    video.srcObject = stream;
}).catch(err => {
    irisStatus.textContent = "Помилка доступу до камери: " + err.message;
});

// Логіка сканування райдужки
scanIrisBtn.onclick = function () {
    scanCount++;

    if (scanCount === 1) {
        irisStatus.textContent = "Дані об'єкта збережено.";
        // Зелені кружечки залишаються
    } else if (scanCount === 2) {
        irisStatus.textContent = "Дані об'єкта збережено.";
        // Зелені кружечки залишаються
    } else {
        irisRecognized = true;
        irisStatus.textContent = "Райдужку розпізнано!";
        scanIrisBtn.style.display = "none";

        // Приховуємо зелені кружечки
        document.querySelectorAll('.eye').forEach(el => el.style.display = 'none');

        // Вимикаємо камеру
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
        }
        video.srcObject = null;

        // Показуємо кнопку запису голосу
        recordBtn.style.display = "inline-block";
    }
};

// Логіка запису голосу
recordBtn.onclick = function () {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

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
                voiceStatus.textContent = "Голос підтверджено!";
                voiceRecorded = true;
                submitBtn.style.display = "inline-block";
            }

            // Зупиняємо аудіо стрім
            stream.getTracks().forEach(track => track.stop());
        };

        setTimeout(() => {
            mediaRecorder.stop();
        }, 2000); // 2 секунди запису
    }).catch(err => {
        voiceStatus.textContent = "Помилка доступу до мікрофона: " + err.message;
    });
};

// Логіка кнопки "Надіслати"
submitBtn.onclick = function () {
    if (irisRecognized && voiceRecorded) {
        window.location.href = "success.html";
    }
};
