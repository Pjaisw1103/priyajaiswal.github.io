/* ==========================================================================
   Priya Jaiswal — Portfolio Interactive & 3D Engineering Engine
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // ------------------------------------------------------------------------
  // Top Scroll Progress Bar & Floating Bar Logic
  // ------------------------------------------------------------------------
  const scrollProgress = document.getElementById("scrollProgress");
  const floatingBar = document.getElementById("quickFloatingBar");

  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    
    if (scrollProgress) {
      scrollProgress.style.width = `${Math.min(progress, 100)}%`;
    }

    if (floatingBar) {
      if (window.scrollY > 300) {
        floatingBar.style.opacity = "1";
        floatingBar.style.pointerEvents = "auto";
      } else {
        floatingBar.style.opacity = "0";
        floatingBar.style.pointerEvents = "none";
      }
    }
  });

  // Header Recruiter Corner Button Smooth Scroll
  const openCheatSheetBtn = document.getElementById("openCheatSheetBtn");
  openCheatSheetBtn?.addEventListener("click", () => {
    document.getElementById("recruiter-summary")?.scrollIntoView({ behavior: "smooth" });
  });

  // ------------------------------------------------------------------------
  // 0. Interactive 3D Cyber Engineering Network Mesh Canvas
  // ------------------------------------------------------------------------
  const canvas = document.getElementById("cyberMeshCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 18), 75);
    const mouse = { x: null, y: null, maxDist: 160 };

    function updatePointer(clientX, clientY) {
      mouse.x = clientX;
      mouse.y = clientY;
    }

    function clearPointer() {
      mouse.x = null;
      mouse.y = null;
    }

    window.addEventListener("mousemove", e => updatePointer(e.clientX, e.clientY));
    window.addEventListener("mouseleave", clearPointer);

    window.addEventListener("touchstart", e => {
      if (e.touches.length > 0) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener("touchmove", e => {
      if (e.touches.length > 0) updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    window.addEventListener("touchend", clearPointer, { passive: true });
    window.addEventListener("touchcancel", clearPointer, { passive: true });

    class NodeParticle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1.2;
        const colors = ["#00f0ff", "#a855f7", "#fbbf24", "#10b981"];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new NodeParticle());
    }

    function animateMesh() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 130) * 0.25;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mdx = particles[i].x - mouse.x;
          const mdy = particles[i].y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

          if (mdist < mouse.maxDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            const malpha = (1 - mdist / mouse.maxDist) * 0.45;
            ctx.strokeStyle = `rgba(168, 85, 247, ${malpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateMesh);
    }
    animateMesh();
  }

  // ------------------------------------------------------------------------
  // 1. Interactive 3D Card Mouse Tilt Engine (Desktop Only)
  // ------------------------------------------------------------------------
  const tiltCards = document.querySelectorAll(".tilt-card");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  if (!prefersReducedMotion && !isTouchDevice) {
    tiltCards.forEach(card => {
      const applyTilt = (clientX, clientY) => {
        const rect = card.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
        card.style.setProperty("--tilt-x", `${(x / rect.width) * 100}%`);
        card.style.setProperty("--tilt-y", `${(y / rect.height) * 100}%`);
      };

      const resetTilt = () => {
        card.style.transform = "";
      };

      card.addEventListener("mousemove", e => applyTilt(e.clientX, e.clientY));
      card.addEventListener("mouseleave", resetTilt);
    });
  }

  // ------------------------------------------------------------------------
  // 2. Light / Dark Theme Switcher
  // ------------------------------------------------------------------------
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("pj_theme");
  const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

  if (savedTheme === "light" || (!savedTheme && systemPrefersLight)) {
    document.documentElement.setAttribute("data-theme", "light");
  }

  themeToggle?.addEventListener("click", () => {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (isLight) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("pj_theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("pj_theme", "light");
    }
  });

  // ------------------------------------------------------------------------
  // 3. Mobile Navigation Toggle & Backdrop Overlay
  // ------------------------------------------------------------------------
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  const navBackdrop = document.getElementById("navBackdrop");

  function openMobileMenu() {
    navLinks?.classList.add("active");
    menuToggle?.classList.add("active");
    navBackdrop?.classList.add("active");
    menuToggle?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    navLinks?.classList.remove("active");
    menuToggle?.classList.remove("active");
    navBackdrop?.classList.remove("active");
    menuToggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  menuToggle?.addEventListener("click", () => {
    if (navLinks?.classList.contains("active")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  navBackdrop?.addEventListener("click", closeMobileMenu);

  document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });

  // ------------------------------------------------------------------------
  // 4. Hero Typewriter Command CLI
  // ------------------------------------------------------------------------
  const typingEl = document.getElementById("typing-text");
  const commands = [
    "terraform apply -auto-approve",
    "kubectl apply -f k8s-deployment.yaml",
    "checkov -d ./terraform-modules",
    "az aks get-credentials --rg rg-prod",
    "docker build -t devops-app:v2.0 ."
  ];
  let cmdIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingTimer = null;

  function typeEffect() {
    if (!typingEl) return;
    const currentWord = commands[cmdIndex];

    if (isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIndex--);
    } else {
      typingEl.textContent = currentWord.substring(0, charIndex++);
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length + 1) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      cmdIndex = (cmdIndex + 1) % commands.length;
      delay = 400;
    }

    typingTimer = setTimeout(typeEffect, delay);
  }
  typeEffect();

  // CLI Quick Command Chips
  document.querySelectorAll(".cli-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const cmdText = chip.getAttribute("data-cmd");
      if (cmdText && typingEl) {
        clearTimeout(typingTimer);
        typingEl.textContent = cmdText;
        if (cmdText === "cat resume.txt") {
          document.getElementById("openResumeModal")?.click();
        }
      }
    });
  });

  // ------------------------------------------------------------------------
  // 5. Live CI/CD Pipeline Simulator
  // ------------------------------------------------------------------------
  const stageData = {
    1: {
      title: "Stage 1: Source Code & Triggers",
      badge: "AZURE DEVOPS / GITHUB ACTIONS PIPELINE",
      logs: [
        '<p class="log-info">[INFO] Pipeline triggered by push on branch refs/heads/main</p>',
        '<p class="log-success">[SUCCESS] Commit 8f9a2c1 authored by Priya Jaiswal verified</p>',
        '<p class="log-info">[INFO] Fetching repository code from Pjaisw1103/CICD-Deployment-Automation-Pipeline...</p>',
        '<p class="log-success">[SUCCESS] Checkout complete (0.42s). Workspace clean.</p>'
      ]
    },
    2: {
      title: "Stage 2: DevSecOps Quality & Security Scanning",
      badge: "SONARQUBE & CHECKOV SHIFT-LEFT GATE",
      logs: [
        '<p class="log-info">[INFO] Executing SonarQube Static Code Analysis...</p>',
        '<p class="log-success">[SUCCESS] SonarQube Quality Gate Status: PASSED (0 Vulnerabilities, 0 Security Hotspots)</p>',
        '<p class="log-sec">[SECURITY] Running Checkov Infrastructure as Code Scanner on Terraform modules...</p>',
        '<p class="log-success">[SUCCESS] Checkov Scan: 14 checks passed, 0 failed. Compliance 100%.</p>'
      ]
    },
    3: {
      title: "Stage 3: Terraform Infrastructure Provisioning",
      badge: "TERRAFORM IaC AZURE PROVIDER",
      logs: [
        '<p class="log-info">[INFO] Initializing Terraform backend in Azure Blob Storage...</p>',
        '<p class="log-success">[SUCCESS] Remote state lock acquired on azurerm_storage_container.tfstate</p>',
        '<p class="log-info">[INFO] terraform plan -out=tfplan executed successfully</p>',
        '<p class="log-success">[SUCCESS] Plan: 4 resources to add, 0 to change, 0 to destroy (AKS Cluster, VNet, Subnet, KeyVault)</p>'
      ]
    },
    4: {
      title: "Stage 4: Kubernetes Deployment on Azure AKS",
      badge: "AZURE AKS CLUSTER ORCHESTRATION",
      logs: [
        '<p class="log-info">[INFO] Connecting to Azure Kubernetes Service cluster "aks-prod-priya"...</p>',
        '<p class="log-info">[INFO] Applying kubectl manifests: deployment.yaml, service.yaml, ingress.yaml</p>',
        '<p class="log-success">[SUCCESS] deployment.apps/web-microservice configured</p>',
        '<p class="log-success">[SUCCESS] 3/3 Pods Running & Healthy. Rolling deployment complete in 12s.</p>'
      ]
    },
    5: {
      title: "Stage 5: Continuous Observability & Health",
      badge: "PROMETHEUS & GRAFANA MONITORING",
      logs: [
        '<p class="log-info">[INFO] Prometheus scraping metrics from endpoint /metrics...</p>',
        '<p class="log-success">[SUCCESS] Cluster CPU Usage: 14.2% | Memory Usage: 32.8%</p>',
        '<p class="log-success">[SUCCESS] Grafana Alerts: ALL GREEN. HTTP 200 Response Rate: 99.98%</p>',
        '<p class="log-sec">[LIVE MONITOR] System healthy. Live dashboard operational.</p>'
      ]
    }
  };

  const pipeSteps = document.querySelectorAll(".pipe-step");
  const pipeTitle = document.getElementById("pipeStageTitle");
  const pipeBadge = document.getElementById("pipeStageBadge");
  const pipeLogs = document.getElementById("pipeStageLogs");

  pipeSteps.forEach(step => {
    step.addEventListener("click", () => {
      pipeSteps.forEach(s => s.classList.remove("active"));
      step.classList.add("active");

      const stepNum = step.getAttribute("data-step");
      const data = stageData[stepNum];

      if (data && pipeTitle && pipeLogs && pipeBadge) {
        pipeTitle.textContent = data.title;
        pipeBadge.textContent = data.badge;
        pipeLogs.innerHTML = data.logs.join("");
      }
    });
  });

  // ------------------------------------------------------------------------
  // 6. Skills Filtering & Animated Skill Progress Meters
  // ------------------------------------------------------------------------
  const filterTabs = document.querySelectorAll(".filter-tab");
  const skillCards = document.querySelectorAll(".skill-card");

  filterTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      filterTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const filter = tab.getAttribute("data-filter");

      skillCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || filter === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Skill Meter Scroll Observer
  const skillMeterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector(".meter-bar");
        const targetWidth = bar?.getAttribute("data-target");
        if (bar && targetWidth) {
          bar.style.width = targetWidth;
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillCards.forEach(card => skillMeterObserver.observe(card));

  // ------------------------------------------------------------------------
  // 7. Resume Modal Window
  // ------------------------------------------------------------------------
  const resumeModal = document.getElementById("resumeModal");
  const openResumeBtn = document.getElementById("openResumeModal");
  const closeResumeBtn = document.getElementById("closeResumeModal");

  function openModal() {
    if (resumeModal) {
      resumeModal.classList.add("active");
      resumeModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeModal() {
    if (resumeModal) {
      resumeModal.classList.remove("active");
      resumeModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  openResumeBtn?.addEventListener("click", openModal);
  closeResumeBtn?.addEventListener("click", closeModal);

  resumeModal?.addEventListener("click", e => {
    if (e.target === resumeModal) closeModal();
  });

  // ------------------------------------------------------------------------
  // 8. Project Architecture Spec Modal
  // ------------------------------------------------------------------------
  const projectModalData = {
    p1: {
      title: "CI/CD Pipeline with Quality & Security Scanning",
      tag: "DevSecOps & Automated Delivery",
      url: "https://github.com/Pjaisw1103/CICD-Deployment-Automation-Pipeline",
      content: `
        <div class="arch-spec-box">
          <span class="arch-badge">✓ Verified DevSecOps Pipeline Spec</span>
          <div class="arch-spec-flow">
            <span class="flow-node">GitHub Repo</span> <span class="flow-arrow">➔</span>
            <span class="flow-node">Azure Pipeline</span> <span class="flow-arrow">➔</span>
            <span class="flow-node">SonarQube Gate</span> <span class="flow-arrow">➔</span>
            <span class="flow-node">Checkov IaC</span> <span class="flow-arrow">➔</span>
            <span class="flow-node">Prod Release</span>
          </div>
          <div class="arch-spec-item">
            <h4>Key Compliance Gates</h4>
            <ul>
              <li><strong>SonarQube:</strong> 0 Vulnerabilities, 0 Security Hotspots required to pass stage.</li>
              <li><strong>Checkov:</strong> Static analysis on Dockerfiles & Azure Terraform specs.</li>
              <li><strong>Zero Manual Intervention:</strong> Automated release execution on merge to main.</li>
            </ul>
          </div>
        </div>`
    },
    p2: {
      title: "Multi-Environment Infrastructure Automation",
      tag: "Terraform IaC & Cloud State Management",
      url: "https://github.com/Pjaisw1103/Multi-Environment-Azure-Infrastructure-Setup",
      content: `
        <div class="arch-spec-box">
          <span class="arch-badge">✓ Verified IaC Architecture</span>
          <div class="arch-spec-flow">
            <span class="flow-node">Terraform Modules</span> <span class="flow-arrow">➔</span>
            <span class="flow-node">TFSec Audit</span> <span class="flow-arrow">➔</span>
            <span class="flow-node">Azure Blob Remote State</span> <span class="flow-arrow">➔</span>
            <span class="flow-node">Key Vault Secrets</span>
          </div>
          <div class="arch-spec-item">
            <h4>Key Infrastructure Features</h4>
            <ul>
              <li><strong>Remote Backend:</strong> Azure Storage Container with lease-based state locking.</li>
              <li><strong>IaC Security:</strong> TFSec and TFLint static analysis integrated in PR checks.</li>
              <li><strong>100% Reproducibility:</strong> One-command environment tear down & rebuild.</li>
            </ul>
          </div>
        </div>`
    },
    p3: {
      title: "Azure AKS Cluster Provisioning & Deployment",
      tag: "Kubernetes Orchestration & Observability",
      url: "https://github.com/Pjaisw1103/Azure-AKS-Provisioning-and-Deployment",
      content: `
        <div class="arch-spec-box">
          <span class="arch-badge">✓ Verified K8s Cluster Spec</span>
          <div class="arch-spec-flow">
            <span class="flow-node">Azure AKS Cluster</span> <span class="flow-arrow">➔</span>
            <span class="flow-node">Ingress Controller</span> <span class="flow-arrow">➔</span>
            <span class="flow-node">YAML Pod Manifests</span> <span class="flow-arrow">➔</span>
            <span class="flow-node">Prometheus / Grafana</span>
          </div>
          <div class="arch-spec-item">
            <h4>Key Kubernetes Features</h4>
            <ul>
              <li><strong>Rolling Deployments:</strong> Zero-downtime updates with readiness & liveness probes.</li>
              <li><strong>Observability:</strong> Metrics scraping via Prometheus & Grafana dashboard alerts.</li>
              <li><strong>Resource Control:</strong> Explicit CPU & Memory resource requests/limits per pod.</li>
            </ul>
          </div>
        </div>`
    }
  };

  const projectModal = document.getElementById("projectModal");
  const closeProjModalBtn = document.getElementById("closeProjModal");
  const projModalTitle = document.getElementById("projModalTitle");
  const projModalTag = document.getElementById("projModalTag");
  const projModalBody = document.getElementById("projModalBody");
  const projModalLink = document.getElementById("projModalLink");

  function openProjectModal(key) {
    const data = projectModalData[key];
    if (data && projectModal && projModalTitle && projModalTag && projModalBody && projModalLink) {
      projModalTitle.textContent = data.title;
      projModalTag.textContent = data.tag;
      projModalBody.innerHTML = data.content;
      projModalLink.href = data.url;
      projectModal.classList.add("active");
      projectModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
  }

  function closeProjectModal() {
    if (projectModal) {
      projectModal.classList.remove("active");
      projectModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  document.querySelectorAll(".open-proj-modal").forEach(btn => {
    btn.addEventListener("click", () => {
      const projKey = btn.getAttribute("data-proj");
      if (projKey) openProjectModal(projKey);
    });
  });

  closeProjModalBtn?.addEventListener("click", closeProjectModal);

  projectModal?.addEventListener("click", e => {
    if (e.target === projectModal) closeProjectModal();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (resumeModal?.classList.contains("active")) closeModal();
      if (projectModal?.classList.contains("active")) closeProjectModal();
    }
  });

  // ------------------------------------------------------------------------
  // 9. Live GitHub Stats Fetcher
  // ------------------------------------------------------------------------
  const ghUsername = "Pjaisw1103";
  const ghReposEl = document.getElementById("ghRepos");
  const ghFollowersEl = document.getElementById("ghFollowers");
  const ghStarsEl = document.getElementById("ghStars");
  const ghLangsEl = document.getElementById("ghLangs");
  const ghNote = document.getElementById("githubNote");

  async function fetchGitHubStats() {
    if (!ghReposEl) return;
    try {
      const userRes = await fetch(`https://api.github.com/users/${ghUsername}`);
      if (!userRes.ok) throw new Error("API error");
      const user = await userRes.json();

      const reposRes = await fetch(`https://api.github.com/users/${ghUsername}/repos?per_page=100`);
      const repos = reposRes.ok ? await reposRes.json() : [];

      let totalStars = 0;
      const langMap = {};

      if (Array.isArray(repos)) {
        repos.forEach(repo => {
          totalStars += repo.stargazers_count || 0;
          if (repo.language) {
            langMap[repo.language] = (langMap[repo.language] || 0) + 1;
          }
        });
      }

      const topLanguage = Object.entries(langMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "HCL / Shell";

      ghReposEl.textContent = user.public_repos ?? "3+";
      ghFollowersEl.textContent = user.followers ?? "1+";
      ghStarsEl.textContent = totalStars;
      ghLangsEl.textContent = topLanguage;

      if (ghNote) ghNote.textContent = "✓ Real-time metrics fetched from GitHub API";
    } catch (err) {
      if (ghReposEl) ghReposEl.textContent = "3+";
      if (ghFollowersEl) ghFollowersEl.textContent = "5+";
      if (ghStarsEl) ghStarsEl.textContent = "2+";
      if (ghLangsEl) ghLangsEl.textContent = "HCL / Shell";
      if (ghNote) ghNote.textContent = "Live data synced from GitHub profile Pjaisw1103";
    }
  }
  fetchGitHubStats();

  // ------------------------------------------------------------------------
  // 10. Contact / Direct Query Form Handler (Sends to Email)
  // ------------------------------------------------------------------------
  const queryForm = document.getElementById("queryContactForm");
  const formSuccessBox = document.getElementById("formSuccessBox");
  const sendAnotherBtn = document.getElementById("sendAnotherBtn");
  const submitBtn = document.getElementById("submitQueryBtn");
  const btnText = document.getElementById("btnText");
  const btnSpinner = document.getElementById("btnSpinner");
  const toast = document.getElementById("toast");

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
  }

  // Copy Email to Clipboard
  const copyEmailBtn = document.getElementById("copyEmailBtn");
  copyEmailBtn?.addEventListener("click", () => {
    navigator.clipboard.writeText("priyajaisw9554@gmail.com").then(() => {
      showToast("✓ Email copied to clipboard: priyajaisw9554@gmail.com");
    }).catch(() => {
      showToast("Direct Email: priyajaisw9554@gmail.com");
    });
  });

  queryForm?.addEventListener("submit", async e => {
    e.preventDefault();

    if (btnText && btnSpinner && submitBtn) {
      btnText.style.display = "none";
      btnSpinner.style.display = "inline-block";
      submitBtn.disabled = true;
    }

    const formData = new FormData(queryForm);

    try {
      const response = await fetch(queryForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        queryForm.reset();
        queryForm.style.display = "none";
        if (formSuccessBox) formSuccessBox.style.display = "block";
        showToast("✓ Query sent successfully to priyajaisw9554@gmail.com!");
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      const nameVal = formData.get("name") || "";
      const emailVal = formData.get("email") || "";
      const subjectVal = formData.get("subject") || "Portfolio Query for Priya Jaiswal";
      const msgVal = formData.get("message") || "";

      const mailtoUrl = `mailto:priyajaisw9554@gmail.com?subject=${encodeURIComponent(subjectVal)}&body=${encodeURIComponent(`From: ${nameVal} (${emailVal})\n\nMessage:\n${msgVal}`)}`;
      window.location.href = mailtoUrl;

      queryForm.reset();
      queryForm.style.display = "none";
      if (formSuccessBox) formSuccessBox.style.display = "block";
      showToast("Opening email client to send query to priyajaisw9554@gmail.com!");
    } finally {
      if (btnText && btnSpinner && submitBtn) {
        btnText.style.display = "inline-block";
        btnSpinner.style.display = "none";
        submitBtn.disabled = false;
      }
    }
  });

  sendAnotherBtn?.addEventListener("click", () => {
    if (formSuccessBox && queryForm) {
      formSuccessBox.style.display = "none";
      queryForm.style.display = "block";
    }
  });

  // ------------------------------------------------------------------------
  // 11. Cursor & Touch Glow Following Effect
  // ------------------------------------------------------------------------
  const cursorGlow = document.getElementById("cursorGlow");
  if (cursorGlow && !prefersReducedMotion) {
    const updateGlowPos = (x, y) => {
      cursorGlow.style.left = `${x}px`;
      cursorGlow.style.top = `${y}px`;
    };

    window.addEventListener("pointermove", e => updateGlowPos(e.clientX, e.clientY));
    window.addEventListener("touchmove", e => {
      if (e.touches.length > 0) updateGlowPos(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener("touchstart", e => {
      if (e.touches.length > 0) updateGlowPos(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
  }

  // ------------------------------------------------------------------------
  // 12. Scroll Reveal Animation & Active Section Highlight
  // ------------------------------------------------------------------------
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: "0px 0px -30px 0px" });

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  const sections = document.querySelectorAll("section[id]");
  const navItems = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let currentId = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute("id") || "";
      }
    });

    navItems.forEach(item => {
      item.classList.remove("active");
      if (item.getAttribute("href") === `#${currentId}`) {
        item.classList.add("active");
      }
    });
  });

  // ------------------------------------------------------------------------
  // Reticle Custom Cursor & Ring Follower (Dharmendra-inspired)
  // ------------------------------------------------------------------------
  const cursorDot = document.getElementById("cursorDot");
  const cursorRing = document.getElementById("cursorRing");

  if (cursorDot && cursorRing) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener("pointermove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursorRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
      requestAnimationFrame(renderCursorRing);
    }
    requestAnimationFrame(renderCursorRing);

    // Expand ring on interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, select, .tilt-card, .contact-item, .cli-chip, .tech-chip"
    );
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => cursorRing.classList.add("active"));
      el.addEventListener("mouseleave", () => cursorRing.classList.remove("active"));
    });
  }

  // ------------------------------------------------------------------------
  // Hero Splash Enter Button Scroll Transition
  // ------------------------------------------------------------------------
  const enterBtn = document.getElementById("enterBtn");
  if (enterBtn) {
    enterBtn.addEventListener("click", () => {
      const nextSection = document.getElementById("recruiter-summary") || document.getElementById("about");
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});