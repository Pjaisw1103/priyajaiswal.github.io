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

// Cursor Glow Follow Effect
const cursorGlow = document.querySelector(".cursor-glow");
window.addEventListener("pointermove", e => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${e.clientX}px`;
  cursorGlow.style.top = `${e.clientY}px`;
});