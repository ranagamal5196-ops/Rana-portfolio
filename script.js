const menuButton = document.querySelector(".menu_btn");
const navLinks = document.querySelector(".nav_links");
const navItems = document.querySelectorAll(".nav_link");

if (menuButton && navLinks) {
  const menuIcon = menuButton.querySelector("i");

  // فتح / قفل المنيو
  function setMenu(open) {
    navLinks.classList.toggle("active", open);
    menuButton.classList.toggle("active", open);
    menuButton.setAttribute("aria-expanded", String(open));

    // تغيير شكل الأيقونة: هامبورجر <-> X
    if (menuIcon) {
      menuIcon.classList.toggle("fa-bars", !open);
      menuIcon.classList.toggle("fa-xmark", open);
    }
  }

  // الضغط على زرار الهامبورجر
  menuButton.addEventListener("click", function (e) {
    e.stopPropagation();
    setMenu(!navLinks.classList.contains("active"));
  });

  // قفل المنيو لما أدوس على أي لينك
  navItems.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  // قفل المنيو لما أدوس برا المنيو
  document.addEventListener("click", function (e) {
    if (
      navLinks.classList.contains("active") &&
      !navLinks.contains(e.target) &&
      !menuButton.contains(e.target)
    ) {
      setMenu(false);
    }
  });

  // قفل المنيو بزرار Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  // قفل المنيو لو الشاشة كبرت (ديسكتوب)
  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) setMenu(false);
  });
}

// تمييز اللينك بتاع السيكشن اللي ظاهر دلوقتي
const sections = document.querySelectorAll("section[id]");

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navItems.forEach(function (link) {
            link.classList.toggle(
              "current",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}