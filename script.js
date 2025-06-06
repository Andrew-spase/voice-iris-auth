let irisScanned = false;
let voiceRecorded = false;
let accessGranted = false;

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    document.getElementById('video').srcObject = stream;
  });

function scanIris() {
  irisScanned = true;
  document.getElementById('irisResult').innerText = "Райдужку розпізнано!";
  checkReady();
}

let recorder, audioChunks = [];

function startRecording() {
  audioChunks = [];
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    recorder = new MediaRecorder(stream);
    recorder.start();
    recorder.ondataavailable = e => audioChunks.push(e.data);
    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks);
      const audioUrl = URL.createObjectURL(audioBlob);
      document.getElementById('audio').src = audioUrl;
      document.getElementById('voiceResult').innerText = "Голос записано!";
      voiceRecorded = true;
      checkReady();
    };
  });

  document.getElementById('recordBtn').disabled = true;
  document.getElementById('stopBtn').disabled = false;
}

function stopRecording() {
  recorder.stop();
  document.getElementById('stopBtn').disabled = true;
}

function checkReady() {
  if (irisScanned && voiceRecorded) {
    document.getElementById('submitBtn').style.display = 'inline-block';
  }
}

function submitAuthentication() {
  const messageEl = document.getElementById('finalResult');

  if (!accessGranted) {
    messageEl.innerText = "Об'єкт не розпізнано!";
    messageEl.style.color = "red";
    accessGranted = true;
  } else {
    messageEl.innerText = "Об'єкт розпізнано! Переадресація...";
    messageEl.style.color = "green";
    setTimeout(() => {
      window.location.href = "authenticated.html"; // 👉 створиш цю сторінку для "успішного входу"
    }, 2000);
  }
}