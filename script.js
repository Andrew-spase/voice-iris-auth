// Завантаження моделей face-api.js
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models')
]).then(startCamera);

const video = document.getElementById("video");
const scanFaceBtn = document.getElementById("scanIrisBtn");
const faceStatus = document.getElementById("irisStatus");
const recordBtn = document.getElementById("recordBtn");
const voiceStatus = document.getElementById("voiceStatus");
const audioPlayer = document.getElementById("audioPlayer");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

let faceRecognized = false;
let voiceRecordCount = 0;
let voiceRecorded = false;
let audioBlob = null;
let videoStream = null;

async function startCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = videoStream;
        faceStatus.textContent = "";
    } catch (err) {
        faceStatus.textContent = "Помилка доступу до камери: " + err.message;
    }
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        videoStream = null;
    }
}

scanFaceBtn.onclick = async function () {
    faceStatus.textContent = "Сканування обличчя військовослужбовця. Будь ласка, дивіться прямо в камеру.";

    const detection = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();

    if (detection) {
        faceRecognized = true;
        faceStatus.textContent = "Ідентифікація завершена. Обличчя розпізнано.";
        scanFaceBtn.style.display = "none";

        stopCamera();

        recordBtn.style.display = "inline-block";
        resetBtn.style.display = "inline-block";
    } else {
        faceStatus.textContent = "Обличчя не розпізнано. Спробуйте ще раз.";
    }
};

resetBtn.onclick = function () {
    faceRecognized = false;
    voiceRecordCount = 0;
    voiceRecorded = false;
    audioBlob = null;

    scanFaceBtn.style.display = "inline-block";
    recordBtn.style.display = "none";
    submitBtn.style.display = "none";
    resetBtn.style.display = "none";

    faceStatus.textContent = "";
    voiceStatus.textContent = "";
    audioPlayer.style.display = "none";
    audioPlayer.src = "";

    startCamera();
};

recordBtn.onclick = function () {
    recordBtn.disabled = true;
    voiceStatus.textContent = "Йде запис голосового підтвердження...";

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
                voiceStatus.textContent = "Зразок збережено. Повторіть голосовий код для верифікації.";
                submitBtn.style.display = "none";
            } else {
                voiceRecorded = true;
                voiceStatus.textContent = "Голосовий код підтверджено. Доступ дозволено.";
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
    if (faceRecognized && voiceRecorded) {
        const formData = new FormData();
        formData.append("faceRecognized", faceRecognized);
        formData.append("voiceBlob", audioBlob);

        fetch("https://your-military-server.example.com/auth", {
            method: "POST",
            body: formData
        }).then(response => {
            if (response.ok) {
                window.location.href = "success.html";
            } else {
                alert("Помилка верифікації на сервері.");
            }
        }).catch(err => {
            alert("З'єднання з сервером неможливе: " + err.message);
        });
    }
};
