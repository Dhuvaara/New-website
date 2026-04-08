const STORAGE_KEYS = {
  projects: "dm_projects",
  skills: "dm_skills",
};

const sections = {
  home: document.getElementById("section-home"),
  about: document.getElementById("section-about"),
  projects: document.getElementById("section-projects"),
  skills: document.getElementById("section-skills"),
  contact: document.getElementById("section-contact"),
  admin: document.getElementById("section-admin"),
};

const navLinks = Array.from(document.querySelectorAll(".nav-link[data-section]"));
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
const toastEl = document.getElementById("toast");

const projectsList = document.getElementById("projects-list");
const skillsList = document.getElementById("skills-list");

const projectForm = document.getElementById("project-form");
const projectIdInput = document.getElementById("project-id");
const projectTitleInput = document.getElementById("project-title");
const projectDescriptionInput = document.getElementById("project-description");
const projectStackInput = document.getElementById("project-stack");
const projectGithubInput = document.getElementById("project-github");
const projectLiveInput = document.getElementById("project-live");
const projectSubmitBtn = document.getElementById("project-submit");
const projectCancelBtn = document.getElementById("project-cancel");

const skillForm = document.getElementById("skill-form");
const skillIdInput = document.getElementById("skill-id");
const skillNameInput = document.getElementById("skill-name");
const skillLevelInput = document.getElementById("skill-level");
const skillCategoryInput = document.getElementById("skill-category");
const skillSubmitBtn = document.getElementById("skill-submit");
const skillCancelBtn = document.getElementById("skill-cancel");

let projects = [];
let skills = [];

function createId() {
  return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function showToast(message, isError = false) {
  toastEl.textContent = message;
  toastEl.style.color = isError ? "#ef4444" : "#16a34a";
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function loadFromStorage(key, fallback = []) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key));
    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    return fallback;
  }
}

function seedDataIfEmpty() {
  const existingProjects = loadFromStorage(STORAGE_KEYS.projects);
  const existingSkills = loadFromStorage(STORAGE_KEYS.skills);
  if (existingProjects.length === 0) {
    const seededProjects = [
      {
        id: createId(),
        title: "Portfolio CRUD Website",
        description: "A personal portfolio app with full CRUD using vanilla JS.",
        stack: "HTML, CSS, JavaScript",
        github: "",
        live: "",
      },
    ];
    saveToStorage(STORAGE_KEYS.projects, seededProjects);
  }
  if (existingSkills.length === 0) {
    const seededSkills = [
      { id: createId(), name: "JavaScript", level: "Intermediate", category: "Frontend" },
    ];
    saveToStorage(STORAGE_KEYS.skills, seededSkills);
  }
}

function switchSection(sectionName) {
  Object.keys(sections).forEach((key) => {
    sections[key].classList.toggle("active", key === sectionName);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.section === sectionName);
  });
}

function renderProjects() {
  if (projects.length === 0) {
    projectsList.innerHTML = '<div class="empty">No projects yet. Add one in Admin.</div>';
    return;
  }

  projectsList.innerHTML = projects
    .map(
      (project) => `
      <article class="card">
        <h4>${project.title}</h4>
        <p>${project.description}</p>
        <p><strong>Stack:</strong> ${project.stack}</p>
        ${project.github ? `<p><a href="${project.github}" target="_blank" rel="noreferrer">GitHub</a></p>` : ""}
        ${project.live ? `<p><a href="${project.live}" target="_blank" rel="noreferrer">Live Demo</a></p>` : ""}
        <div class="card-actions">
          <button type="button" class="secondary" onclick="editProject('${project.id}')">Edit</button>
          <button type="button" class="danger" onclick="deleteProject('${project.id}')">Delete</button>
        </div>
      </article>
    `
    )
    .join("");
}

function renderSkills() {
  if (skills.length === 0) {
    skillsList.innerHTML = '<div class="empty">No skills yet. Add one in Admin.</div>';
    return;
  }

  skillsList.innerHTML = skills
    .map(
      (skill) => `
      <article class="card">
        <h4>${skill.name}</h4>
        <p><strong>Level:</strong> ${skill.level}</p>
        <p><strong>Category:</strong> ${skill.category || "-"}</p>
        <div class="card-actions">
          <button type="button" class="secondary" onclick="editSkill('${skill.id}')">Edit</button>
          <button type="button" class="danger" onclick="deleteSkill('${skill.id}')">Delete</button>
        </div>
      </article>
    `
    .join("");
}

function resetProjectForm() {
  projectIdInput.value = "";
  projectForm.reset();
  projectSubmitBtn.textContent = "Add Project";
}

function resetSkillForm() {
  skillIdInput.value = "";
  skillForm.reset();
  skillSubmitBtn.textContent = "Add Skill";
}

function editProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) {
    showToast("Project not found.", true);
    return;
  }
  switchSection("admin");
  projectIdInput.value = project.id;
  projectTitleInput.value = project.title;
  projectDescriptionInput.value = project.description;
  projectStackInput.value = project.stack;
  projectGithubInput.value = project.github;
  projectLiveInput.value = project.live;
  projectSubmitBtn.textContent = "Update Project";
  showToast("Project loaded for editing.");
}

function deleteProject(id) {
  if (!window.confirm("Delete this project?")) {
    return;
  }
  projects = projects.filter((item) => item.id !== id);
  saveToStorage(STORAGE_KEYS.projects, projects);
  renderProjects();
  showToast("Project deleted.");
}

function editSkill(id) {
  const skill = skills.find((item) => item.id === id);
  if (!skill) {
    showToast("Skill not found.", true);
    return;
  }
  switchSection("admin");
  skillIdInput.value = skill.id;
  skillNameInput.value = skill.name;
  skillLevelInput.value = skill.level;
  skillCategoryInput.value = skill.category;
  skillSubmitBtn.textContent = "Update Skill";
  showToast("Skill loaded for editing.");
}

function deleteSkill(id) {
  if (!window.confirm("Delete this skill?")) {
    return;
  }
  skills = skills.filter((item) => item.id !== id);
  saveToStorage(STORAGE_KEYS.skills, skills);
  renderSkills();
  showToast("Skill deleted.");
}

function validateRequired(value) {
  return String(value || "").trim().length > 0;
}

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = {
    id: projectIdInput.value || createId(),
    title: projectTitleInput.value.trim(),
    description: projectDescriptionInput.value.trim(),
    stack: projectStackInput.value.trim(),
    github: projectGithubInput.value.trim(),
    live: projectLiveInput.value.trim(),
  };

  if (!validateRequired(payload.title) || !validateRequired(payload.description) || !validateRequired(payload.stack)) {
    showToast("Project title, description, and stack are required.", true);
    return;
  }

  const editing = Boolean(projectIdInput.value);
  if (editing) {
    projects = projects.map((item) => (item.id === payload.id ? payload : item));
  } else {
    projects.unshift(payload);
  }

  saveToStorage(STORAGE_KEYS.projects, projects);
  renderProjects();
  resetProjectForm();
  showToast(editing ? "Project updated." : "Project added.");
});

skillForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const payload = {
    id: skillIdInput.value || createId(),
    name: skillNameInput.value.trim(),
    level: skillLevelInput.value.trim(),
    category: skillCategoryInput.value.trim(),
  };

  if (!validateRequired(payload.name) || !validateRequired(payload.level)) {
    showToast("Skill name and level are required.", true);
    return;
  }

  const editing = Boolean(skillIdInput.value);
  if (editing) {
    skills = skills.map((item) => (item.id === payload.id ? payload : item));
  } else {
    skills.unshift(payload);
  }

  saveToStorage(STORAGE_KEYS.skills, skills);
  renderSkills();
  resetSkillForm();
  showToast(editing ? "Skill updated." : "Skill added.");
});

projectCancelBtn.addEventListener("click", () => {
  resetProjectForm();
  showToast("Project edit canceled.");
});

skillCancelBtn.addEventListener("click", () => {
  resetSkillForm();
  showToast("Skill edit canceled.");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    switchSection(link.dataset.section);
    mainNav.classList.remove("open");
  });
});

menuToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

// Expose handlers used by inline action buttons.
window.editProject = editProject;
window.deleteProject = deleteProject;
window.editSkill = editSkill;
window.deleteSkill = deleteSkill;

function init() {
  seedDataIfEmpty();
  projects = loadFromStorage(STORAGE_KEYS.projects);
  skills = loadFromStorage(STORAGE_KEYS.skills);
  renderProjects();
  renderSkills();
  switchSection("home");
  showToast("Portfolio loaded.");
}

init();
