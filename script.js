let audioCtx, analyser, dataArray;
const audio = document.getElementById('redemption-audio');
const introScreen = document.getElementById('intro-screen');
const launchAnimScreen = document.getElementById('launch-animation-screen');
const montageScreen = document.getElementById('montage-screen');
const mainContent = document.getElementById('main-content');
const takeoffBtn = document.getElementById('takeoff-btn');

let currentSlideIndex = 0;
const totalSlides = 4;
let montageActive = false;

// Timings for Redemption (Kidwild version)
const slideTimings = [12.0, 19.0, 26.0, 33.0];
const montageEndTime = 45.0;

document.addEventListener('DOMContentLoaded', () => {
  takeoffBtn.addEventListener('click', startTakeoffSequence);
});

async function startTakeoffSequence() {
  // 1. Initialize and unlock Web Audio API Context on user click
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    
    // Explicitly resume context (Fixes browser autoplay block)
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }

    // Connect analyzer node
    const source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
  } catch (err) {
    console.warn("Audio Context setup limited, falling back to timer-only mode:", err);
  }

  // Play audio track
  audio.play().catch(e => {
    console.error("Audio playback error: Check that redemption.mp3 is in the root directory.", e);
  });

  // 2. Hide Intro
  introScreen.style.opacity = '0';

  setTimeout(() => {
    introScreen.style.display = 'none';
    
    // 3. Thruster / Warp drive intro animation (0s to 12s)
    launchAnimScreen.style.display = 'flex';
    setTimeout(() => { launchAnimScreen.style.opacity = '1'; }, 50);

    // 4. Transition to Montage right on the first beat drop (12s)
    setTimeout(() => {
      launchAnimScreen.style.opacity = '0';
      setTimeout(() => {
        launchAnimScreen.style.display = 'none';
        montageScreen.style.display = 'flex';
        montageActive = true;

        showSlide(0);
        scheduleSlideTransitions();
        if (analyser) analyzeBeats();
      }, 500);
    }, 12000);

  }, 800);
}

function scheduleSlideTransitions() {
  // Slide transitions synced to music timestamps
  slideTimings.slice(1).forEach((timestamp, index) => {
    setTimeout(() => {
      currentSlideIndex = index + 1;
      showSlide(currentSlideIndex);
    }, (timestamp - 12.0) * 1000);
  });

  // End montage & fade audio out at 45s
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

  // Measure low-end bass kick energy
  let bassEnergy = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4;

  const activeCard = document.querySelector('.montage-card.active');
  if (activeCard) {
    if (bassEnergy > 180) {
      activeCard.classList.add('beat-flash');
    } else {
      activeCard.classList.remove('beat-flash');
    }
  }
}

function endMontageAndFadeAudio() {
  montageActive = false;

  // Fade audio out smoothly over 2.5s
  let fadeInterval = setInterval(() => {
    if (audio.volume > 0.05) {
      audio.volume -= 0.05;
    } else {
      audio.volume = 0;
      audio.pause();
      clearInterval(fadeInterval);
    }
  }, 100);

  // Hide montage & reveal landing page
  montageScreen.style.opacity = '0';
  montageScreen.style.transition = 'opacity 1.2s ease';

  setTimeout(() => {
    montageScreen.style.display = 'none';
    mainContent.style.opacity = '1';
  }, 1200);
}
