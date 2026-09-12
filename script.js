let audioCtx, analyser, dataArray;
const audio = document.getElementById('redemption-audio');
const introScreen = document.getElementById('intro-screen');
const montageScreen = document.getElementById('montage-screen');
const mainContent = document.getElementById('main-content');
const pulseRing = document.getElementById('pulse-ring');

let currentSlideIndex = 0;
const totalSlides = 4;
let montageActive = false;

// Timings matched to Redemption (Kidwild):
// 15.0s: Vocal drop beat
// 22.5s: Buildup accent
// 30.0s: THE MAIN DROP (128 BPM Bass Drop)
// 42.0s: Montage ends and smoothly lands into main page
const slideTimings = [15.0, 22.5, 30.0, 42.0];

function initAudioAndTakeoff() {
  // Web Audio API setup for bass frequency reading
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64; 

  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  audio.play().catch(() => {
    console.log("Audio file missing. Ensure redemption.mp3 is in the root directory.");
  });

  // Fade intro overlay out
  introScreen.style.opacity = '0';
  setTimeout(() => {
    introScreen.style.display = 'none';
    montageScreen.style.display = 'flex';
    montageActive = true;

    showSlide(0);
    scheduleSlideTransitions();
    analyzeBeats();
  }, 800);
}

function scheduleSlideTransitions() {
  slideTimings.forEach((timestamp, index) => {
    if (index < totalSlides - 1) {
      setTimeout(() => {
        currentSlideIndex = index + 1;
        showSlide(currentSlideIndex);
      }, timestamp * 1000);
    } else {
      // Final timestamp transitions to the full website landing
      setTimeout(() => {
        endMontage();
      }, timestamp * 1000);
    }
  });
}

function showSlide(index) {
  document.querySelectorAll('.montage-card').forEach(card => card.classList.remove('active'));
  const activeCard = document.getElementById(`slide-${index}`);
  if (activeCard) activeCard.classList.add('active');
}

function analyzeBeats() {
  if (!montageActive) return;

  requestAnimationFrame(analyzeBeats);
  analyser.getByteFrequencyData(dataArray);

  // Sub-bass Kick Detection (first 4 FFT frequency bins)
  let bassEnergy = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4;

  // Scale pulse ring on every kick beat hit
  let scaleValue = 1 + (bassEnergy / 255) * 0.5;
  pulseRing.style.transform = `scale(${scaleValue})`;
  pulseRing.style.opacity = (bassEnergy / 255).toString();

  // Trigger high-intensity cyan flash on heavy bass drops
  const activeCard = document.querySelector('.montage-card.active');
  if (activeCard) {
    if (bassEnergy > 190) {
      activeCard.classList.add('beat-flash');
    } else {
      activeCard.classList.remove('beat-flash');
    }
  }
}

function endMontage() {
  montageActive = false;
  montageScreen.style.opacity = '0';
  montageScreen.style.transition = 'opacity 1s ease';

  setTimeout(() => {
    montageScreen.style.display = 'none';
    mainContent.style.opacity = '1';
  }, 1000);
}
