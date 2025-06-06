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

// Функція запуску камери
async function startCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = videoStream;
        irisStatus.textContent = "";
    } catch (err) {
        irisStatus.textContent = "Помилка доступу до камери: " + err.message;
    }
}

// Функція зупинки камери
function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        videoStream = null;
    }
}

// Початковий запуск камери
startCamera();

// Обробник натискання кнопки "Сканувати райдужку"
scanIrisBtn.onclick = function () {
    scanCount++;

    if (scanCount <= 2) {
        irisStatus.textContent = "Дані об'єкта збережено.";
        // Зелені кружечки залишаються
    } else if (scanCount === 3) {
        irisRecognized = true;
        irisStatus.textContent = "Райдужку розпізнано!";
        scanIrisBtn.style.display = "none";

        // Ховаємо зелені кружечки
        document.querySelectorAll('.eye').forEach(el => el.style.display = 'none');

        // Зупиняємо камеру
        stopCamera();

        // Показуємо кнопку запису голосу
        recordBtn.style.display = "inline-block";

        // Кнопка скидання
        resetBtn.style.display = "inline-block";
    }
};

// Обробник кнопки скидання
resetBtn.onclick = function () {
    // Скидаємо стани
    scanCount = 0;
    voiceRecordCount = 0;
    irisRecognized = false;
    voiceRecorded = false;
    audioBlob = null;

    // Показуємо/ховаємо кнопки
    scanIrisBtn.style.display = "inline-block";
    recordBtn.style.display = "none";
    submitBtn.style.display = "none";
    resetBtn.style.display = "none";

    // Очищаємо статуси
    irisStatus.textContent = "";
    voiceStatus.textContent = "";
    audioPlayer.style.display = "none";
    audioPlayer.src = "";

    // Показуємо зелені кружечки
    document.querySelectorAll('.eye').forEach(el => el.style.display = 'block');

    // Запускаємо камеру знову
    startCamera();
};

// Обробник запису голосу
recordBtn.onclick = function () {
    recordBtn.disabled = true;
    voiceStatus.textContent = "Запис голосу...";

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
            } else if (voiceRecordCount >= 2) {
                voiceStatus.textContent = "Голос підтверджено!";
                voiceRecorded = true;
                submitBtn.style.display = "inline-block";
            }

            // Вимикаємо мікрофон
            stream.getTracks().forEach(track => track.stop());
            recordBtn.disabled = false;
        };

        setTimeout(() => {
            mediaRecorder.stop();
        }, 2000); // запис 2 секунди
    }).catch(err => {
        voiceStatus.textContent = "Помилка доступу до мікрофону: " + err.message;
        recordBtn.disabled = false;
    });
};

// Обробник кнопки "Надіслати"
submitBtn.onclick = function () {
    if (irisRecognized && voiceRecorded) {
        window.location.href = "success.html";
    }
};
