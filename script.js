document.addEventListener("DOMContentLoaded", () => {
    // 1. Scroll-Triggered Reveal Animations using IntersectionObserver
    const observerOptions = {
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active-reveal");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right").forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Skill Category Filtering
    const tabBtns = document.querySelectorAll(".tab-btn");
    const skillCards = document.querySelectorAll(".skill-card");

    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            tabBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const category = btn.getAttribute("data-category");

            skillCards.forEach(card => {
                if (category === "all" || card.getAttribute("data-category") === category) {
                    card.style.display = "block";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});