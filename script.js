/* =========================================================
   MOBILE MENU (HAMBURGER)
========================================================= */

const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");
const navItems = document.querySelectorAll(".nav_link");
const navbar = document.getElementById("navbar");

function setMenu(open) {
    navMenu.classList.toggle("active", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.innerHTML = open
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
}

menuBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    setMenu(!navMenu.classList.contains("active"));
});

navItems.forEach(function (link) {
    link.addEventListener("click", function () {
        setMenu(false);
    });
});

// Close when clicking outside
document.addEventListener("click", function (e) {
    if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        setMenu(false);
    }
});

// Close with Escape
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
});

// Reset when returning to desktop size
window.addEventListener("resize", function () {
    if (window.innerWidth > 1000) setMenu(false);
});


/* =========================================================
   TYPING EFFECT (ROLES)
========================================================= */

const typedEl = document.getElementById("typed");
const roles = [
    "Front End Developer",
    "React Developer",
    "Responsive Web Designer",
    "UI Enthusiast"
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function typeTick() {
    const word = roles[roleIndex];
    typedEl.textContent = word.slice(0, charIndex);

    let delay = deleting ? 45 : 90;

    if (!deleting && charIndex === word.length) {
        deleting = true;
        delay = 1500;
    } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 350;
    } else {
        charIndex += deleting ? -1 : 1;
    }

    setTimeout(typeTick, delay);
}

if (reduceMotion) {
    typedEl.textContent = roles[0];
} else {
    typeTick();
}


/* =========================================================
   CODE WINDOW (TYPES ITSELF)
========================================================= */

(function () {
    const codeEl = document.getElementById("codeText");
    if (!codeEl) return;

    // Colored code (spans are written as tokens so we can type them safely)
    const lines = [
        [["t-com", "// Welcome to my portfolio"]],
        [["t-key", "const "], ["t-var", "developer"], ["", " = {"]],
        [["", "  "], ["t-prop", "name"], ["", ": "], ["t-str", "'Rana Gamal'"], ["", ","]],
        [["", "  "], ["t-prop", "role"], ["", ": "], ["t-str", "'Front End Developer'"], ["", ","]],
        [["", "  "], ["t-prop", "skills"], ["", ": ["], ["t-str", "'HTML'"], ["", ", "], ["t-str", "'CSS'"], ["", ", "], ["t-str", "'JS'"], ["", ", "], ["t-str", "'React'"], ["", "],"]],
        [["", "  "], ["t-prop", "passion"], ["", ": "], ["t-str", "'Clean & responsive UI'"], ["", ","]],
        [["", "};"]],
        [["", ""]],
        [["t-key", "function "], ["t-fn", "hireMe"], ["", "() {"]],
        [["", "  "], ["t-key", "return "], ["t-str", "'Let\\'s build something great!'"], ["", ";"]],
        [["", "}"]]
    ];

    // Flatten into list of characters with their class
    const chars = [];
    lines.forEach(function (line, i) {
        line.forEach(function (part) {
            for (const ch of part[1]) chars.push({ cls: part[0], ch: ch });
        });
        if (i < lines.length - 1) chars.push({ cls: "", ch: "\n" });
    });

    function render(count) {
        let html = "";
        let currentCls = null;

        for (let i = 0; i < count; i++) {
            const c = chars[i];
            const safe = c.ch === "&" ? "&amp;" : c.ch === "<" ? "&lt;" : c.ch === ">" ? "&gt;" : c.ch;

            if (c.cls !== currentCls) {
                if (currentCls) html += "</span>";
                if (c.cls) html += '<span class="' + c.cls + '">';
                currentCls = c.cls;
            }
            html += safe;
        }
        if (currentCls) html += "</span>";

        codeEl.innerHTML = html;
    }

    if (reduceMotion) {
        render(chars.length);
        return;
    }

    let n = 0;

    function typeCode() {
        n++;
        render(n);

        if (n < chars.length) {
            setTimeout(typeCode, chars[n - 1].ch === "\n" ? 220 : 32);
        } else {
            // Wait, then restart
            setTimeout(function () {
                n = 0;
                typeCode();
            }, 5000);
        }
    }

    setTimeout(typeCode, 900);
})();


/* =========================================================
   REVEAL ON SCROLL + SKILL BARS
========================================================= */

const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("show");

        // Animate skill bar inside this element
        const bar = entry.target.querySelector(".progress_bar");
        if (bar) bar.style.width = bar.dataset.width + "%";

        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".reveal").forEach(function (el) {
    revealObserver.observe(el);
});


/* =========================================================
   ACTIVE LINK (SCROLL SPY)
========================================================= */

const sections = document.querySelectorAll("section[id]");

const spyObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        navItems.forEach(function (link) {
            link.classList.toggle(
                "active",
                link.getAttribute("href") === "#" + entry.target.id
            );
        });
    });
}, { rootMargin: "-45% 0px -50% 0px" });

sections.forEach(function (sec) {
    spyObserver.observe(sec);
});


/* =========================================================
   SCROLL PROGRESS + NAVBAR STATE + BACK TO TOP
========================================================= */

const progress = document.getElementById("scrollProgress");
const toTop = document.getElementById("toTop");

function onScroll() {
    const scrollTop = window.scrollY;
    const height = document.documentElement.scrollHeight - window.innerHeight;

    progress.style.width = (height > 0 ? (scrollTop / height) * 100 : 0) + "%";
    toTop.classList.toggle("show", scrollTop > 500);
    navbar.classList.toggle("scrolled", scrollTop > 40);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();


/* =========================================================
   CARD GLOW THAT FOLLOWS THE MOUSE
========================================================= */

document.querySelectorAll(".glow").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--x", e.clientX - rect.left + "px");
        card.style.setProperty("--y", e.clientY - rect.top + "px");
    });
});


/* =========================================================
   HERO PARTICLES
========================================================= */

(function () {
    const canvas = document.getElementById("particles");
    if (!canvas || reduceMotion) return;

    const ctx = canvas.getContext("2d");
    let w, h, particles = [], running = true;

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;

        const count = w < 600 ? 35 : 75;
        particles = [];

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                r: Math.random() * 2 + 0.8
            });
        }
    }

    function draw() {
        if (running) {
            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(0, 212, 255, 0.8)";
                ctx.fill();

                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = "rgba(139, 92, 246," + (1 - dist / 120) * 0.35 + ")";
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        requestAnimationFrame(draw);
    }

    // Pause animation when hero is not visible (saves battery)
    new IntersectionObserver(function (entries) {
        running = entries[0].isIntersecting;
    }).observe(canvas);

    window.addEventListener("resize", resize);
    resize();
    draw();
})();


/* =========================================================
   CONTACT FORM
========================================================= */

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("formStatus");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("cName");
    const email = document.getElementById("cEmail");
    const msg = document.getElementById("cMsg");

    [name, email, msg].forEach(function (f) {
        f.classList.remove("error");
    });

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    let valid = true;

    if (!name.value.trim()) { name.classList.add("error"); valid = false; }
    if (!emailOk) { email.classList.add("error"); valid = false; }
    if (!msg.value.trim()) { msg.classList.add("error"); valid = false; }

    if (!valid) {
        statusEl.textContent = "Please fill in all fields correctly.";
        statusEl.classList.add("err");
        return;
    }

    statusEl.classList.remove("err");
    statusEl.textContent = "Opening your email app...";

    const subject = encodeURIComponent("Portfolio message from " + name.value.trim());
    const body = encodeURIComponent(
        msg.value.trim() + "\n\nFrom: " + name.value.trim() + " (" + email.value.trim() + ")"
    );

    window.location.href = "mailto:rana.gamal5196@gmail.com?subject=" + subject + "&body=" + body;

    form.reset();
});


/* =========================================================
   FOOTER YEAR
========================================================= */

document.getElementById("year").textContent = new Date().getFullYear();