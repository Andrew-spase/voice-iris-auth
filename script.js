let scanCount = 0;
let irisRecognized = false;
let voiceRecorded = false;
let audioBlob;
let voiceRecordCount = 0;

document.getElementById("scanIrisBtn").onclick = function () {
    const irisStatus = document.getElementById("irisStatus");
    const retryBtn = document.getElementById("retryBtn");
    scanCount++;

    if (scanCount === 1) {
        irisStatus.textContent = "Дані об'єкта збережено.";
        retryBtn.style.display = "inline-block";
    } else {
        irisRecognized = true;
        irisStatus.textContent = "Райдужку розпізнано!";
        retryBtn.style.display = "none";
    }
};

document.getElementById("retryBtn").onclick = function () {
    document.getElementById("irisStatus").textContent = "";
    this.style.display = "none";
};

document.getElementById("recordBtn").onclick = function () {
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
            const audio = document.getElementById("audioPlayer");
            audio.src = audioUrl;
            audio.style.display = "block";

            voiceRecordCount++;

            if (voiceRecordCount === 1) {
                document.getElementById("voiceStatus").textContent = "Голос збережено.";
                document.getElementById("submitBtn").style.display = "none";
            } else {
                document.getElementById("voiceStatus").textContent = "Голос підтверджено!";
                voiceRecorded = true;
                // Якщо райдужка теж розпізнана - показати кнопку
                if (irisRecognized) {
                    document.getElementById("submitBtn").style.display = "inline-block";
                }
            }
        };

        setTimeout(() => {
            mediaRecorder.stop();
        }, 2000); // Запис 2 секунди
    });
};

document.getElementById("submitBtn").onclick = function () {
    if (irisRecognized && voiceRecorded) {
        window.location.href = "success.html";
    }
};
