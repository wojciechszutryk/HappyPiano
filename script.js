const video = document.getElementById('video')

var currentHappyLevel = 0.4;
var soundToPlay = null;
const b = new Audio('./sounds/B3.mp3');
const as = new Audio('./sounds/A3S.mp3');
const a = new Audio('./sounds/A3.mp3');
const gs = new Audio('./sounds/G3S.mp3');
const g = new Audio('./sounds/G3.mp3');
const fs = new Audio('./sounds/F3S.mp3');
const f = new Audio('./sounds/F3.mp3');
const e = new Audio('./sounds/E3.mp3');
const ds = new Audio('./sounds/D3S.mp3');
const d = new Audio('./sounds/D3.mp3');
const cs = new Audio('./sounds/C3S.mp3');
const c = new Audio('./sounds/C3.mp3');

const calibrationButton = document.getElementById('calibrationButton');

const B = document.getElementById('b');
B.addEventListener('mouseover', () => onKayHover(b));
B.addEventListener('mouseout', cleanSound);
const As = document.getElementById('as');
As.addEventListener('mouseover', () => onKayHover(as));
As.addEventListener('mouseout', cleanSound);
const A = document.getElementById('a');
A.addEventListener('mouseover', () => onKayHover(a));
A.addEventListener('mouseout', cleanSound);
const GS = document.getElementById('gs');
GS.addEventListener('mouseover', () => onKayHover(gs));
GS.addEventListener('mouseout', cleanSound);
const G = document.getElementById('g');
G.addEventListener('mouseover', () => onKayHover(g));
G.addEventListener('mouseout', cleanSound);
const FS = document.getElementById('fs');
FS.addEventListener('mouseover', () => onKayHover(fs));
FS.addEventListener('mouseout', cleanSound);
const F = document.getElementById('f');
F.addEventListener('mouseover', () => onKayHover(f));
F.addEventListener('mouseout', cleanSound);
const E = document.getElementById('e');
E.addEventListener('mouseover', () => onKayHover(e));
E.addEventListener('mouseout', cleanSound);
const DS = document.getElementById('ds');
DS.addEventListener('mouseover', () => onKayHover(ds));
DS.addEventListener('mouseout', cleanSound);
const D = document.getElementById('d');
D.addEventListener('mouseover', () => onKayHover(d));
D.addEventListener('mouseout', cleanSound);
const CS = document.getElementById('cs');
CS.addEventListener('mouseover', () => onKayHover(cs));
CS.addEventListener('mouseout', cleanSound);
const C = document.getElementById('c');
C.addEventListener('mouseover', () => onKayHover(c));
C.addEventListener('mouseout', cleanSound);

function onKayHover(sound) {
  soundToPlay = sound;
  // sound.play()
}

function cleanSound() {
  soundToPlay = null;
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
  faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
  navigator.getWebcam = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => video.srcObject = stream)
   }
  else {
    navigator.getWebcam({video: true })
        .then(stream => video.srcObject = stream)
  }
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    detections.forEach(detection => {
      calibrationButton.addEventListener('click', () => {currentHappyLevel = detection.expressions.happy});
      console.log(currentHappyLevel)
      if (detection.expressions.happy > currentHappyLevel) {
        if (soundToPlay) soundToPlay.play();
        console.log('happy')
      }
    })
  }, 500)
})

startVideo()