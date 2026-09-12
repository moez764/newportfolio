document.addEventListener('DOMContentLoaded', () => {
  
  // Default Data Store
  const defaultData = {
    profile: {
      title: "Academic Achiever & STEM Researcher",
      bio: "Dedicated research student practicing secondary-level mathematics, physics wave mechanics, and wildlife preservation models.",
      email: "student@westminster.edu"
    },
    skills: [
      { tool: "AutoHotkey", domain: "System Automation & Macro Scripts" },
      { tool: "LaTeX", domain: "Mathematical Formulation & Formal Papers" },
      { tool: "Snell's Law Optics", domain: "Physics Wave Mechanics" },
      { tool: "Stremio Extensions", domain: "Media Stream Architecture" }
    ],
    extracurriculars: [
      { name: "Arabian Oryx StoryMap", desc: "Digital conservation history and species recovery profile." },
      { name: "Sweet n' Schnack", desc: "Commercial culinary brand design and heat-safe container modeling." }
    ],
    projects: [
      { title: "Silverstone Track Circuit", desc: "Modular track construction using dual risers and support pillars." },
      { title: "Wave Diffraction Analysis", desc: "Quantitative measurement of secondary optical wave fronts." }
    ],
    academics: [
      { year: "2025-2026", term: "Term 2", gpa: "High Distinction", honors: "CAT4 & Progress Test Award" },
      { year: "2024-2025", term: "Term 3", gpa: "Principal Honor Roll", honors: "GEMS Core Value Award" }
    ],
    achievements: [
      { name: "Principal's Award", impact: "Recognized as top 1% academic performer in STEM cohort." },
      { name: "GEMS Genius Scholarship", impact: "Awarded funding for exemplary chemistry research." }
    ],
    certificates: [
      { title: "General Proficiency Award", issuer: "The Westminster School" },
      { title: "Student Leader Badge Design", issuer: "Student Council" }
    ]
  };

  // Sync Local Storage
  if (!localStorage.getItem('portfolio_data')) {
    localStorage.setItem('portfolio_data', JSON.stringify(defaultData));
  }
  const data = JSON.parse(localStorage.getItem('portfolio_data'));

  // Render Functions
  function renderAll() {
    document.getElementById('about-title').innerText = data.profile.title;
    document.getElementById('about-bio').innerText = data.profile.bio;
    document.getElementById('contact-email').innerText = data.profile.email;

    // Skills
    const skillsContainer = document.getElementById('skills-matrix-container');
    skillsContainer.innerHTML = data.skills.map(s => `
      <div style="padding:15px; background:#181820; border-radius:8px; margin-bottom:10px;">
        <strong style="color:var(--accent-green);">${s.tool}</strong> — <span style="color:#aaa;">${s.domain}</span>
      </div>
    `).join('');

    // Extra-Curriculars
    document.getElementById('extracurriculars-list').innerHTML = data.extracurriculars.map(e => `
      <div style="margin-top:15px;">
        <h4>${e.name}</h4>
        <p style="color:#aaa; font-size:13px;">${e.desc}</p>
      </div>
    `).join('');

    // Projects
    document.getElementById('projects-list').innerHTML = data.projects.map(p => `
      <div style="padding:15px; border-bottom:1px solid #222;">
        <h3>${p.title}</h3>
        <p style="color:#aaa; font-size:13px;">${p.desc}</p>
      </div>
    `).join('');

    // Academic Wallet
    document.getElementById('wallet-cards-container').innerHTML = data.academics.map(a => `
      <div class="credit-card-ui">
        <div style="font-size:10px; color:var(--accent-amber);">${a.year} RECORD</div>
        <h4>${a.gpa}</h4>
        <p style="font-size:12px; color:#aaa;">Distinction: ${a.honors}</p>
      </div>
    `).join('');

    // Achievements with Impact
    document.getElementById('achievements-list').innerHTML = data.achievements.map(a => `
      <div style="padding:15px; background:#14141d; border-radius:10px; margin-bottom:10px;">
        <h4 style="color:#fff;">${a.name}</h4>
        <p style="color:var(--accent-green); font-size:12px; margin-top:5px;">IMPACT: ${a.impact}</p>
      </div>
    `).join('');

    // Certificates
    document.getElementById('certificates-list').innerHTML = data.certificates.map(c => `
      <div style="padding:10px; border:1px solid #2a2a35; border-radius:8px; margin-bottom:8px;">
        <strong>${c.title}</strong> — <small style="color:#888;">${c.issuer}</small>
      </div>
    `).join('');
  }

  renderAll();

  // Landing Gear & Cockpit Execution
  const gearSwitch = document.getElementById('gear-switch');
  const throttleSlider = document.getElementById('throttle-slider');
  const landBtn = document.getElementById('land-plane-btn');
  const airpodFallback = document.getElementById('airpod-fallback');

  landBtn.addEventListener('click', () => {
    if (gearSwitch.checked && parseInt(throttleSlider.value) === 0) {
      document.getElementById('about-me').scrollIntoView({ behavior: 'smooth' });
    } else {
      // Trigger Airpod Fallback if requirements aren't met
      airpodFallback.classList.remove('hidden');
    }
  });

  document.getElementById('airpod-case').addEventListener('click', () => {
    document.getElementById('about-me').scrollIntoView({ behavior: 'smooth' });
  });

  // Screw Panel Unbolting Mechanism
  let unboltedScrews = 0;
  document.querySelectorAll('.screw').forEach(screw => {
    screw.addEventListener('click', () => {
      if (!screw.classList.contains('removed')) {
        screw.classList.add('removed');
        unboltedScrews++;
        if (unboltedScrews === 4) {
          document.getElementById('panel-cover').classList.add('unbolted');
        }
      }
    });
  });

  // Water Filter Animation
  document.getElementById('trigger-filter-btn').addEventListener('click', () => {
    const drop = document.getElementById('water-drop');
    drop.classList.remove('murky');
    drop.classList.add('clean');
    drop.style.transform = "translateY(120px)";
  });

  // Wallet Toggle
  document.getElementById('wallet-toggle').addEventListener('click', () => {
    document.getElementById('wallet').classList.toggle('open');
  });

  // Back to top
  document.getElementById('back-to-top-btn').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // HUD ScrollTracker Indicator
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.portfolio-section');
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < (sec.offsetTop + sec.offsetHeight)) {
        const id = sec.getAttribute('id');
        document.querySelectorAll('.hud-nav-dots .dot').forEach(dot => {
          dot.classList.toggle('active', dot.getAttribute('data-section') === id);
        });
        document.getElementById('alt-indicator').innerText = `FLT ${id.substring(0, 4).toUpperCase()}`;
      }
    });
  });
});
