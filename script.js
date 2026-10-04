const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const goalField = document.querySelector("[data-goal-field]");
const form = document.querySelector("[data-form]");
const formStatus = document.querySelector("[data-form-status]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImg = document.querySelector("[data-lightbox-img]");
const lightboxClose = document.querySelector("[data-lightbox-close]");

const setScrolledHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

setScrolledHeader();
window.addEventListener("scroll", setScrolledHeader, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  header.classList.toggle("is-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    header.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
});

document.querySelectorAll("[data-trial]").forEach((link) => {
  link.addEventListener("click", () => {
    if (goalField) goalField.value = "Book a Trial";
  });
});

document.querySelectorAll("[data-goal]").forEach((link) => {
  link.addEventListener("click", () => {
    if (goalField) goalField.value = link.dataset.goal;
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -6% 0px", threshold: 0.01 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const revealAnchoredSection = () => {
  const target = document.querySelector(window.location.hash);
  if (!target) return;
  target.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("is-visible");
    revealObserver.unobserve(element);
  });
  window.setTimeout(() => {
    target.scrollIntoView({ block: "start" });
  }, 150);
};

window.addEventListener("hashchange", revealAnchoredSection);
window.addEventListener("load", revealAnchoredSection);

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const imageUrl = item.dataset.full;
    const imageAlt = item.querySelector("img")?.alt || "Expanded gym gallery image";
    lightboxImg.src = imageUrl;
    lightboxImg.alt = imageAlt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    lightboxClose.focus();
  });
});

const closeLightbox = () => {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
};

lightboxClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
    closeLightbox();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get("name")?.toString().trim();
  const phone = data.get("phone")?.toString().trim();

  if (!name || !phone) {
    formStatus.textContent = "Please add your name and phone number so the team can call you back.";
    return;
  }

  formStatus.textContent =
    "Thanks. Please call 091676 84926 to share these details with the Fitness Hub team.";
  form.reset();
});
