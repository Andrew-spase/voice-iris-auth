let startAuthBtn = document.getElementById("startAuthBtn");
let faceStatus = document.getElementById("faceStatus");
let video = document.getElementById("video");
let successSound = document.getElementById("successSound");
let stream;

startAuthBtn.onclick = async () => {
    faceStatus.textContent = "Зберігання даних обличчя...";
    startAuthBtn.disabled = true;

    try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        video.srcObject = stream;

        setTimeout(() => {
            faceStatus.textContent = "Авторизація користувача...";
        }, 3000);

        setTimeout(() => {
            successSound.play();
            faceStatus.textContent = "Користувача авторизовано!";
            stopStream();
        }, 6000);
    } catch (err) {
        faceStatus.textContent = "Не вдалося отримати доступ до камери.";
        startAuthBtn.disabled = false;
    }
};

function stopStream() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
    }
}