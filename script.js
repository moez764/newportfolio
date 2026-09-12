document.addEventListener('DOMContentLoaded', () => {

  // Initial Content State
  const defaultData = {
    profile: {
      name: "Mahmoud Ahmed Mobarak",
      title: "High-Achieving Student & STEM Explorer",
      bio: "Dedicated researcher practicing secondary-level physics, wave mechanics, and mathematical reasoning. Driven by curiosity and discipline to excel across Computer Science and Aerospace fields.",
      email: "mahmoud@portfolio.me"
    },
    skills: [
      { name: "Python", category: "Technical" },
      { name: "Artificial Intelligence", category: "Technical" },
      { name: "HTML & CSS", category: "Technical" },
      { name: "Analytical Thinking", category: "Academic" },
      { name: "Mathematical Reasoning", category: "Academic" },
      { name: "Leadership & Discipline", category: "Soft Skills" }
    ],
    certifications: [
      { title: "AI Level 1 - 4 Program", issuer: "Foundational & Advanced Model Training" },
      { title: "Python Proficiency", issuer: "Syntax, Data Structures & Problem Solving" },
      { title: "HTML & CSS Web Fundamentals", issuer: "Semantic Web & Modern Layouts" }
    ],
    projects: [
      { title: "Personal Portfolio Website", desc: "Responsive single-page architecture built with lightweight HTML, CSS, and interactive flip-book components." },
      { title: "Keyboard Concept Store", desc: "E-commerce web concept featuring custom product pages, dynamic storefront, and clean UI workflow." }
    ]
  };

  // Sync Data Store
  if (!localStorage.getItem('clean_portfolio_data')) {
    localStorage.setItem('clean_portfolio_data', JSON.stringify(defaultData));
  }
  const data = JSON.parse(localStorage.getItem('clean_portfolio_data'));

  // Render Page Content
  function render() {
    document.getElementById('dyn-headline').innerText = data.profile.title;
    document.getElementById('dyn-bio').innerText = data.profile.bio;
    
    const emailLink = document.getElementById('dyn-email-link');
    emailLink.innerText = data.profile.email;
    emailLink.href = `mailto:${data.profile.email}`;

    // Render Skills
    document.getElementById('skills-grid').innerHTML = data.skills.map(s => `
      <div class="skill-pill">
        <span>[${s.category}]</span>
        <strong>${s.name}</strong>
      </div>
    `).join('');

    // Render Certifications
    document.getElementById('cert-grid').innerHTML = data.certifications.map(c => `
      <div class="grid-card">
        <h3>${c.title}</h3>
        <p>${c.issuer}</p>
      </div>
    `).join('');

    // Render Projects
    document.getElementById('projects-grid').innerHTML = data.projects.map(p => `
      <div class="grid-card">
        <h3>${p.title}</h3>
        <p>${p.desc}</p>
      </div>
    `).join('');
  }

  render();

  // Flip-Book Logic
  let currentPage = 1;
  const totalPages = 3;

  const prevBtn = document.getElementById('prev-page');
  const nextBtn = document.getElementById('next-page');

  function updatePages() {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.toggle('active', parseInt(page.dataset.page) === currentPage);
    });
  }

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      updatePages();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      updatePages();
    }
  });
});
