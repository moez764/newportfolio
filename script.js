// Dynamic Application State & Default Data Store
const DEFAULT_AWARDS_DATA = [
  {
    id: '1',
    title: "Principal's Award",
    tag: "ACADEMIC EXCELLENCE",
    desc: "Highest institutional distinction awarded for top overall academic achievement and leadership.",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: '2',
    title: "GEMS Core Value Award",
    tag: "LEADERSHIP & INTEGRITY",
    desc: "Recognized for driving student initiative, global citizenship, and community support.",
    img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: '3',
    title: "General Proficiency Award",
    tag: "ACADEMIC STANDING",
    desc: "Honored for sustained first-rank performance across secondary mathematics and physical sciences.",
    img: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: '4',
    title: "CAT4 High Distinction",
    tag: "COGNITIVE MASTERY",
    desc: "Achieved top percentile scores in spatial reasoning, quantitative analysis, and non-verbal logic.",
    img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: '5',
    title: "Progress Test Award",
    tag: "BENCHMARK EXCELLENCE",
    desc: "Awarded for exceptional progress indicators in standardized science and mathematical benchmarks.",
    img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: '6',
    title: "Student Leadership Badge Design",
    tag: "INNOVATION & CREATIVITY",
    desc: "Won the institutional competition for designing official badging assets for student leaders.",
    img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
  }
];

let appState = {
  profileTitle: "Academic Achiever & STEM Researcher",
  profileBio: "Dedicated student focusing on secondary-level mathematics, physics wave dynamics, and biological conservation. Recipient of multiple institutional awards for outstanding general proficiency, spatial reasoning (CAT4), and peer leadership.",
  awards: [...DEFAULT_AWARDS_DATA]
};

// 150 BPM Beat Timings (Kidwild - Redemption)
// 150 BPM = 0.4s per beat. Measure (4 beats) = 1.6s. 3-measure phrase = 4.8s.
const BPM = 150;
const BEAT_INTERVAL_MS = (60 / BPM) * 1000; // 400ms per beat
const CARD_CHANGE_EVERY_BEATS = 12; // 4.8 seconds per card (Exact tempo match)

let audioCtx, analyser, dataArray;
let beatTimer = null;
let currentMontageIndex = 0;
let isMontageRunning = false;

// DOM Elements
const audio = document.getElementById('redemption-audio');
const introScreen = document.getElementById('intro-screen');
const launchAnimScreen = document.getElementById('launch-animation-screen');
const montageScreen = document.getElementById('montage-screen');
const mainContent = document.getElementById('main-content');
const montageContainer = document.getElementById('montage-container');
const montageCounter = document.getElementById('montage-counter');
const adminModal = document.getElementById('admin-modal');

document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  renderHomepageContent();
  setupEventListeners();
});

function loadSavedState() {
  const saved = localStorage.getItem('flight_deck_portfolio_data');
  if (saved) {
    try {
      appState = JSON.parse(saved);
    } catch(e) {
      console.error("Failed to parse saved state", e);
    }
  }
}

function saveState() {
  localStorage.setItem('flight_deck_portfolio_data', JSON.stringify(appState));
  renderHomepageContent();
}

// RENDER SYSTEM CONTENT
function renderHomepageContent() {
  // Update Profile
  document.getElementById('about-name-display').innerText = appState.profileTitle;
  document.getElementById('about-bio-display').innerText = appState.profileBio;

  // Render "6 Awards, 1 Day" Section
  const awardsContainer = document.getElementById('awards-6-container');
  awardsContainer.innerHTML = appState.awards.map(award => `
    <div class="award-card-item">
      <div class="award-img-wrap">
        <img src="${award.img}" alt="${award.title}">
      </div>
      <div class="award-card-body">
        <div class="badge-highlight">${award.tag}</div>
        <h3>${award.title}</h3>
        <p>${award.desc}</p>
      </div>
    </div>
  `).join('');

  // Render STEM Projects
  const stemContainer = document.getElementById('stem-projects-container');
  stemContainer.innerHTML = `
    <div class="award-card-item">
      <div class="award-img-wrap">
        <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" alt="STEM Focus">
      </div>
      <div class="award-card-body">
        <div class="badge-highlight">MATHEMATICS & PHYSICS</div>
        <h3>Wave Dynamics & Electrolysis Research</h3>
        <p>Advanced studies exploring Snell's Law, kinetic theory, reaction rate acceleration, and quadratic modeling.</p>
      </div>
    </div>
    <div class="award-card-item">
      <div class="award-img-wrap">
        <img src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80" alt="Arabian Oryx">
      </div>
      <div class="award-card-body">
        <div class="badge-highlight">CONSERVATION SCIENCE</div>
        <h3>Arabian Oryx Preservation Project</h3>
        <p>Digital StoryMap detailing captive breeding techniques, habitat monitoring, and population restoration.</p>
      </div>
    </div>
  `;

  // Render Montage Layout dynamically based on current awards
  montageContainer.innerHTML = appState.awards.map((item, i) => `
    <div class="montage-card ${i === 0 ? 'active' : ''}" id="montage-slide-${i}">
      <div class="montage-media">
        <img src="${item.img}" alt="${item.title}">
      </div>
      <div class="montage-details">
        <div class="hud-tag">ACHIEVEMENT ${String(i + 1).padStart(2, '0')} // 06</div>
        <h2 class="montage-title">${item.title}</h2>
        <p class="montage-desc">${item.desc}</p>
      </div>
    </div>
  `).join('');

  // Admin list setup
  renderAdminList();
}

function setupEventListeners() {
  document.getElementById('takeoff-btn').addEventListener('click', () => startTakeoffSequence(true));
  document.getElementById('skip-intro-btn').addEventListener('click', skipToHomepage);
  document.getElementById('exit-montage-btn').addEventListener('click', endMontageToHomepage);

  // Admin Panel triggers
  document.getElementById('open-admin-btn').addEventListener('click', () => {
    document.getElementById('input-profile-title').value = appState.profileTitle;
    document.getElementById('input-profile-bio').value = appState.profileBio;
    adminModal.classList.add('active');
  });

  document.getElementById('close-admin-btn').addEventListener('click', () => {
    adminModal.classList.remove('active');
  });

  document.getElementById('add-award-btn').addEventListener('click', addAwardFromAdmin);
  document.getElementById('reset-default-btn').addEventListener('click', () => {
    appState.awards = [...DEFAULT_AWARDS_DATA];
    saveState();
    adminModal.classList.remove('active');
  });

  document.getElementById('admin-form').addEventListener('submit', (e) => {
    e.preventDefault();
    appState.profileTitle = document.getElementById('input-profile-title').value;
    appState.profileBio = document.getElementById('input-profile-bio').value;
    saveState();
    adminModal.classList.remove('active');
  });
}

// BEAT-MATCHED MONTAGE ENGINE
async function startTakeoffSequence(withAudio = true) {
  if (withAudio) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!audioCtx) audioCtx = new AudioContext();
      if (audioCtx.state === 'suspended') await audioCtx.resume();

      const source = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      dataArray = new Uint8Array(analyser.frequencyBinCount);

      audio.play().catch(e => console.warn("Audio play blocked", e));
    } catch (e) {
      console.warn("Audio context bypass engaged", e);
    }
  }

  introScreen.style.opacity = '0';
  setTimeout(() => {
    introScreen.style.display = 'none';
    launchAnimScreen.style.display = 'flex';
    setTimeout(() => { launchAnimScreen.style.opacity = '1'; }, 50);

    // Sync transition exactly on beat drop at 4.8 seconds
    setTimeout(() => {
      launchAnimScreen.style.opacity = '0';
      setTimeout(() => {
        launchAnimScreen.style.display = 'none';
        montageScreen.style.display = 'flex';
        runBeatSyncedMontage();
      }, 400);
    }, 4800);
  }, 600);
}

function runBeatSyncedMontage() {
  isMontageRunning = true;
  currentMontageIndex = 0;
  showMontageSlide(0);

  let beatCounter = 0;

  // Continuous 150 BPM pulse clock (Every 400ms)
  beatTimer = setInterval(() => {
    if (!isMontageRunning) return;

    beatCounter++;

    // Pulse card border on every 4th beat (Every measure)
    if (beatCounter % 4 === 0) {
      const currentCard = document.getElementById(`montage-slide-${currentMontageIndex}`);
      if (currentCard) {
        currentCard.classList.add('beat-pulse');
        setTimeout(() => currentCard.classList.remove('beat-pulse'), 200);
      }
    }

    // Advance slide every 12 beats (~4.8 seconds, precisely matched to phrase boundary)
    if (beatCounter % CARD_CHANGE_EVERY_BEATS === 0) {
      currentMontageIndex++;
      if (currentMontageIndex < appState.awards.length) {
        showMontageSlide(currentMontageIndex);
      } else {
        endMontageToHomepage();
      }
    }
  }, BEAT_INTERVAL_MS);
}

function showMontageSlide(index) {
  document.querySelectorAll('.montage-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById(`montage-slide-${index}`);
  if (card) card.classList.add('active');
  montageCounter.innerText = `BEAT SYNC ACTIVE // ${index + 1}/${appState.awards.length}`;
}

function endMontageToHomepage() {
  isMontageRunning = false;
  if (beatTimer) clearInterval(beatTimer);

  // Fade Audio
  let fade = setInterval(() => {
    if (audio.volume > 0.05) audio.volume -= 0.05;
    else { audio.volume = 0; audio.pause(); clearInterval(fade); }
  }, 80);

  montageScreen.style.opacity = '0';
  setTimeout(() => {
    montageScreen.style.display = 'none';
    mainContent.style.opacity = '1';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 600);
}

function skipToHomepage() {
  introScreen.style.display = 'none';
  montageScreen.style.display = 'none';
  mainContent.style.opacity = '1';
}

// ADMIN PANEL OPERATIONS
function addAwardFromAdmin() {
  const title = document.getElementById('input-award-title').value;
  const tag = document.getElementById('input-award-tag').value || 'HONOR';
  const desc = document.getElementById('input-award-desc').value;
  const img = document.getElementById('input-award-img').value || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80';

  if (!title || !desc) {
    alert('Please enter a title and description.');
    return;
  }

  appState.awards.push({ id: Date.now().toString(), title, tag, desc, img });
  saveState();
  renderAdminList();

  document.getElementById('input-award-title').value = '';
  document.getElementById('input-award-desc').value = '';
  document.getElementById('input-award-img').value = '';
}

function deleteAward(id) {
  appState.awards = appState.awards.filter(a => a.id !== id);
  saveState();
  renderAdminList();
}

function renderAdminList() {
  const container = document.getElementById('admin-awards-list');
  container.innerHTML = appState.awards.map(award => `
    <div class="admin-item-row">
      <span><strong>${award.title}</strong> (${award.tag})</span>
      <button type="button" class="apple-btn micro-btn" onclick="deleteAward('${award.id}')">Delete</button>
    </div>
  `).join('');
}
