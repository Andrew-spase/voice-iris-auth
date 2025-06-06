let video = document.getElementById("video");
let faceStatus = document.getElementById("face-status");
let recordBtn = document.getElementById("record-btn");
let voiceStatus = document.getElementById("voice-status");
let attempts = 0;
let faceRecognized = false;
let voiceRecognized = false;

navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        simulateFaceRecognition();
    });

function simulateFaceRecognition() {
    setTimeout(() => {
        faceStatus.textContent = "Обличчя розпізнано!";
        faceRecognized = true;
        recordBtn.style.display = "inline-block";
    }, 3000);
}

recordBtn.onclick = function () {
    simulateVoiceRecognition();
};

function simulateVoiceRecognition() {
    voiceStatus.textContent = "Розпізнавання голосу...";
    setTimeout(() => {
        voiceRecognized = true;
        voiceStatus.textContent = "Голос розпізнано!";
        sendToGoogleSheets();
        window.location.href = "success.html";
    }, 3000);
}

function sendToGoogleSheets() {
    fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            status: "Успішна автентифікація"
        })
    });
}