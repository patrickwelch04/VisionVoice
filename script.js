const openWebcamBtn = document.getElementById('openWebcamBtn');
const webcamContainer = document.getElementById('webcamContainer');
const webcamVideo = document.getElementById('webcamVideo');
const captureBtn = document.getElementById('captureBtn');
const snapshotCanvas = document.getElementById('snapshotCanvas');
const uploadInput = document.getElementById('uploadInput');
const aiResponse = document.getElementById('aiResponse');
const speechBtn = document.getElementById('speechBtn');

let isProcessing = false;
let currentText = '';
let isSpeaking = false;

// Open webcam
openWebcamBtn.addEventListener('click', async () => {
  webcamContainer.style.display = 'flex';
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    webcamVideo.srcObject = stream;
  } catch (err) {
    alert('Could not access webcam: ' + err);
  }
});

// Capture webcam image
captureBtn.addEventListener('click', () => {
  captureAndSendImage(webcamVideo);
});

// Upload image
uploadInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => captureAndSendImage(img);
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});

// Capture image from video or uploaded image and send to AI
function captureAndSendImage(source) {
  snapshotCanvas.width = 512;
  snapshotCanvas.height = 512;
  const ctx = snapshotCanvas.getContext('2d');
  ctx.drawImage(source, 0, 0, 512, 512);
  snapshotCanvas.style.display = 'block';
  const base64Image = snapshotCanvas.toDataURL('image/jpeg', 0.8).split(',')[1];
  sendToAI(base64Image);
}

// Speak text using Web Speech API
function speakText(text) {
  if (!('speechSynthesis' in window)) {
    console.warn("This browser does not support speech synthesis.");
    return;
  }

  // Stop any ongoing speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.pitch = 1;
  utterance.rate = 1;
  utterance.volume = 1;

  utterance.onend = () => {
    isSpeaking = false;
    speechBtn.textContent = '▶️ Play';
  };

  speechSynthesis.speak(utterance);
  isSpeaking = true;
  speechBtn.textContent = '⏹ Stop';
}

// Toggle speech on button click
speechBtn.addEventListener('click', () => {
  if (!currentText) return;
  if (isSpeaking) {
    speechSynthesis.cancel();
    isSpeaking = false;
    speechBtn.textContent = '▶️ Play';
  } else {
    speakText(currentText);
  }
});

// Send image to backend
async function sendToAI(base64Image) {
  if (isProcessing) {
    aiResponse.innerHTML = "⚠️ Please wait, still processing the last image...";
    return;
  }
  isProcessing = true;
  aiResponse.innerHTML = "🔍 Analysing the image...";
  speechBtn.style.display = 'none'; // Hide button while processing

  try {
    const response = await fetch("http://localhost:3000/api/describe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ images: [base64Image] })
    });

    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    const data = await response.json();

    currentText = data.description; // Store current description
    aiResponse.innerHTML = `<p><strong>AI says:</strong> ${data.description}</p>`;
    speechBtn.style.display = 'inline-block'; // Show button
    speakText(currentText); // Automatically speak

  } catch (err) {
    console.error(err);
    aiResponse.innerHTML = "❌ Could not generate description. Try again.";
  } finally {
    isProcessing = false;
  }
}