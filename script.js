// Dynamic Application State
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

/* 
  EXACT AUDIO TIMESTAMP MAPPING (Extended Intro Audio File)
  - 0.00s - 12.85s : Arabic Sample Intro / Thruster Overlay
  - 12.85s         : Main Drop 💥 ("In this life...") -> Slide 1
  - 19.29s         : 2nd Phrase -> Slide 2
  - 25.73s         : 3rd Phrase -> Slide 3
  - 32.17s         : 4th Phrase -> Slide 4
  - 38.61s         : 5th Phrase -> Slide 5
  - 45.05s         : 6th Phrase -> Slide 6
  - 51.49s         : Outro / Transition to Main Portfolio
*/
const OFFSET_SECONDS = 0.0; 

const TIMESTAMPS = [
  12.85,  // Drop 💥 ("In this life...")
  19.29,  // Card 2
  25.73,  // Card 3
  32.17,  // Card 4
  38.61,  // Card 5
  45.05,  // Card 6
  51.49   // End Montage -> Transition to Portfolio
];

let currentCardIndex = -1;
let animFrameId = null;

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
    try { appState = JSON.parse(saved); } catch(e) {}
  }
}

function saveState() {
  localStorage.setItem('flight_deck_portfolio_data', JSON.stringify(appState));
  renderHomepageContent();
}

function renderHomepageContent() {
  document.getElementById('about-name-display').innerText = appState.profileTitle;
  document.getElementById('about-bio-display').innerText = appState.profileBio;

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

  montageContainer.innerHTML = appState.awards.map((item, i) => `
    <div class="montage-card ${i === 0 ? 'active' : ''}" id="montage-slide-${i}">
      <div class="montage-media">
        <img src="${item.img}" alt="${item.title}">
      </div>
      <div class="montage-details">
        <div class="hud-tag">ACHIEVEMENT ${String(i + 1).padStart(2, '0')} // ${String(appState.awards.length).padStart(2, '0')}</div>
        <h2 class="montage-title">${item.title}</h2>
        <p class="montage-desc">${item.desc}</p>
      </div>
    </div>
  `).join('');

  renderAdminList();
}

function setupEventListeners() {
  document.getElementById('takeoff-btn').addEventListener('click', startAudioSyncEngine);
  document.getElementById('skip-intro-btn').addEventListener('click', skipToHomepage);
  document.getElementById('exit-montage-btn').addEventListener('click', endMontageToHomepage);

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

// EXACT AUDIO TIME HARD-SYNC ENGINE
function startAudioSyncEngine() {
  introScreen.style.opacity = '0';
  
  setTimeout(() => {
    introScreen.style.display = 'none';
    launchAnimScreen.style.display = 'flex';
    launchAnimScreen.style.opacity = '1';

    // Start Playback
    audio.currentTime = 0;
    audio.play().catch(e => console.warn("Playback error:", e));

    // Continuous high-precision loop
    syncLoop();
  }, 400);
}

function syncLoop() {
  const currentTime = audio.currentTime - OFFSET_SECONDS;

  // 1. Thruster launch animation plays during extended sample intro (0s -> 12.85s)
  if (currentTime < TIMESTAMPS[0]) {
    launchAnimScreen.style.display = 'flex';
    montageScreen.style.display = 'none';
  } 
  // 2. Main Montage Cards Trigger
  else if (currentTime >= TIMESTAMPS[0] && currentTime < TIMESTAMPS[TIMESTAMPS.length - 1]) {
    if (launchAnimScreen.style.display !== 'none') {
      launchAnimScreen.style.opacity = '0';
      setTimeout(() => { launchAnimScreen.style.display = 'none'; }, 200);
      montageScreen.style.display = 'flex';
      montageScreen.style.opacity = '1';
    }

    // Identify active slide based on current timestamp
    let targetIndex = 0;
    for (let i = 0; i < TIMESTAMPS.length - 1; i++) {
      if (currentTime >= TIMESTAMPS[i]) {
        targetIndex = i;
      }
    }

    targetIndex = targetIndex % appState.awards.length;

    if (targetIndex !== currentCardIndex) {
      currentCardIndex = targetIndex;
      showCard(currentCardIndex);
    }
  } 
  // 3. Audio reached montage end time -> transition to main portfolio
  else if (currentTime >= TIMESTAMPS[TIMESTAMPS.length - 1]) {
    endMontageToHomepage();
    return;
  }

  animFrameId = requestAnimationFrame(syncLoop);
}

function showCard(index) {
  document.querySelectorAll('.montage-card').forEach(c => c.classList.remove('active', 'beat-pulse'));
  const card = document.getElementById(`montage-slide-${index}`);
  if (card) {
    card.classList.add('active');
    card.classList.add('beat-pulse');
    setTimeout(() => card.classList.remove('beat-pulse'), 300);
  }
  montageCounter.innerText = `BEAT SYNC ACTIVE // ${index + 1}/${appState.awards.length}`;
}

function endMontageToHomepage() {
  if (animFrameId) cancelAnimationFrame(animFrameId);

  let fade = setInterval(() => {
    if (audio.volume > 0.05) audio.volume -= 0.05;
    else { audio.volume = 0; audio.pause(); clearInterval(fade); }
  }, 60);

  montageScreen.style.opacity = '0';
  setTimeout(() => {
    montageScreen.style.display = 'none';
    mainContent.style.opacity = '1';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 500);
}

function skipToHomepage() {
  if (animFrameId) cancelAnimationFrame(animFrameId);
  audio.pause();
  introScreen.style.display = 'none';
  montageScreen.style.display = 'none';
  launchAnimScreen.style.display = 'none';
  mainContent.style.opacity = '1';
}

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
