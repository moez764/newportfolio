let audioCtx, analyser, dataArray;
const audio = document.getElementById('redemption-audio');
const introScreen = document.getElementById('intro-screen');
const launchAnimScreen = document.getElementById('launch-animation-screen');
const montageScreen = document.getElementById('montage-screen');
const mainContent = document.getElementById('main-content');

let currentSlideIndex = 0;
const totalSlides = 4;
let montageActive = false;

// EXACT TIMING MAP FOR "REDEMPTION" BY BESOMORPH, K3VR & KIDWILD:
// 0.0s - 12.0s: Intro buildup (Runway warp animation)
// 12.0s: Slide 1 transition (vocal beat drop)
// 19.0s: Slide 2 transition
// 26.0s: Slide 3 transition
// 33.0s: Slide 4 transition (MAIN BASS DROP)
// 45.0s: Montage ends -> Fade audio out & load landing portfolio
const slideTimings = [12.0, 19.0, 26.0, 33.0];
const montageEndTime = 45.0;

function initTakeoffSequence() {
  // Web Audio API setup for live beat detection
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();
  const source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 64; 

  source.connect(analyser);
  analyser.connect(audioCtx.destination);
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  // Start music
  audio.play().catch(() => console.log("Place redemption.mp3 in your directory."));

  // 1. Fade out intro button screen
  introScreen.style.opacity = '0';

  setTimeout(() => {
    introScreen.style.display = 'none';
    
    // 2. Play jet warp launch animation for the intro buildup (0s to 12s)
    launchAnimScreen.style.display = 'flex';
    setTimeout(() => { launchAnimScreen.style.opacity = '1'; }, 50);

    // 3. Switch from launch animation to Montage Screen right on the first beat drop (12.0s)
    setTimeout(() => {
      launchAnimScreen.style.opacity = '0';
      setTimeout(() => {
        launchAnimScreen.style.display = 'none';
        montageScreen.style.display = 'flex';
        montageActive = true;

        showSlide(0);
        scheduleSlideTransitions();
        analyzeBeats();
      }, 500);
    }, 12000);

  }, 800);
}

function scheduleSlideTransitions() {
  // Schedule transitions based on Redemption's timestamps
  slideTimings.slice(1).forEach((timestamp, index) => {
    setTimeout(() => {
      currentSlideIndex = index + 1;
      showSlide(currentSlideIndex);
    }, (timestamp - 12.0) * 1000);
  });

  // End montage & start smooth fade out at 45.0s
  setTimeout(() => {
    endMontageAndFadeAudio();
  }, (montageEndTime - 12.0) * 1000);
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

  // Sub-bass Kick Detection (first 4 FFT bins)
  let bassEnergy = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4;

  // Visual card flash on heavy bass hits
  const activeCard = document.querySelector('.montage-card.active');
  if (activeCard) {
    if (bassEnergy > 190) {
      activeCard.classList.add('beat-flash');
    } else {
      activeCard.classList.remove('beat-flash');
    }
  }
}

function endMontageAndFadeAudio() {
  montageActive = false;

  // Smooth Audio Fade Out over 2.5 seconds
  let fadeInterval = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      audio.volume = 0;
      audio.pause();
      clearInterval(fadeInterval);
    }
  }, 100);

  // Fade out montage and reveal landing page
  montageScreen.style.opacity = '0';
  montageScreen.style.transition = 'opacity 1.2s ease';

  setTimeout(() => {
    montageScreen.style.display = 'none';
    mainContent.style.opacity = '1';
  }, 1200);
}
