// Light / Dark Theme Toggle
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("theme");
const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

if (savedTheme === "light" || (!savedTheme && prefersLight)) {
  document.documentElement.setAttribute("data-theme", "light");
}

themeToggle?.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  if (isLight) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
});

// Mobile Navigation Toggle
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

// Close mobile menu on link click
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

// Reveal Animation on Scroll
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Active Link Highlight on Scroll
const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll(".nav-links a")];

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    links.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-40% 0px -50% 0px" });

sections.forEach(section => activeObserver.observe(section));

// Terminal Typing Animation
const typingEl = document.getElementById("typing-text");
const commands = [
  "terraform plan",
  "docker build",
  "kubectl apply",
  "az deployment",
  "git push"
];
let commandIndex = 0;
let charIndex = 0;
let deleting = false;

function typeCommand() {
  if (!typingEl) return;
  const word = commands[commandIndex];

  if (!deleting) {
    typingEl.textContent = word.slice(0, ++charIndex);
    if (charIndex === word.length) {
      deleting = true;
      setTimeout(typeCommand, 1300);
      return;
    }
  } else {
    typingEl.textContent = word.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      commandIndex = (commandIndex + 1) % commands.length;
    }
  }
  setTimeout(typeCommand, deleting ? 45 : 80);
}
typeCommand();

// Copy Email & Toast Notification
const copyButton = document.getElementById("copyEmail");
const toast = document.getElementById("toast");
const email = "priyajaisw9554@gmail.com";

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(email);
  } catch {
    const input = document.createElement("input");
    input.value = email;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    input.remove();
  }

  toast?.classList.add("show");
  setTimeout(() => toast?.classList.remove("show"), 1800);
});

// Live GitHub Stats
const ghUsername = "Pjaisw1103";
const ghReposEl = document.getElementById("ghRepos");
const ghFollowersEl = document.getElementById("ghFollowers");
const ghStarsEl = document.getElementById("ghStars");
const ghLangsEl = document.getElementById("ghLangs");
const githubNote = document.getElementById("githubNote");

async function loadGithubStats() {
  if (!ghReposEl) return;
  try {
    const userRes = await fetch(`https://api.github.com/users/${ghUsername}`);
    if (!userRes.ok) throw new Error("user fetch failed");
    const user = await userRes.json();

    const reposRes = await fetch(`https://api.github.com/users/${ghUsername}/repos?per_page=100`);
    const repos = reposRes.ok ? await reposRes.json() : [];

    const totalStars = Array.isArray(repos)
      ? repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0)
      : 0;

    const langCount = {};
    if (Array.isArray(repos)) {
      repos.forEach(r => {
        if (r.language) langCount[r.language] = (langCount[r.language] || 0) + 1;
      });
    }
    const topLang = Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    ghReposEl.textContent = user.public_repos ?? "—";
    ghFollowersEl.textContent = user.followers ?? "—";
    ghStarsEl.textContent = totalStars;
    ghLangsEl.textContent = topLang;
    if (githubNote) githubNote.textContent = "Live data from GitHub public API";
  } catch (err) {
    [ghReposEl, ghFollowersEl, ghStarsEl, ghLangsEl].forEach(el => {
      if (el) el.textContent = "—";
    });
    if (githubNote) githubNote.textContent = "GitHub stats unavailable right now — view profile directly";
  }
}
loadGithubStats();

// Cursor Glow Follow Effect
const cursorGlow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", e => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});

// 3D Tilt Effect on Cards
const tiltEls = document.querySelectorAll(
  ".skill-card, .project-card, .metric, .experience-card, .github-card, .contact-card"
);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  tiltEls.forEach(el => {
    el.style.transformStyle = "preserve-3d";
    el.style.willChange = "transform";

    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;
      el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      el.style.setProperty("--tilt-x", `${(x / rect.width) * 100}%`);
      el.style.setProperty("--tilt-y", `${(y / rect.height) * 100}%`);
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });

  // Hero code window: subtle 3D parallax following cursor across whole hero
  const codeWindow = document.querySelector(".code-window");
  const heroSection = document.querySelector(".hero");
  if (codeWindow && heroSection) {
    heroSection.addEventListener("mousemove", e => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      codeWindow.style.transform = `perspective(1000px) rotateY(${-7 + x * 10}deg) rotateX(${3 - y * 8}deg)`;
    });
    heroSection.addEventListener("mouseleave", () => {
      codeWindow.style.transform = "";
    });
  }
}