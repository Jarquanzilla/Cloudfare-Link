// Mobile nav toggle
const toggle = document.querySelector(".nav__toggle");
const links = document.querySelector(".nav__links");

toggle.addEventListener("click", () => {
  const open = links.classList.toggle("open");
  toggle.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
});

// Close the menu when a link is tapped
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    links.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Reservation form (demo handler — no backend)
const form = document.getElementById("reserveForm");
const success = document.getElementById("reserveSuccess");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  success.hidden = false;
  form.querySelector("button[type=submit]").textContent = "Reservation Requested 🐾";
  form.reset();
  success.scrollIntoView({ behavior: "smooth", block: "center" });
});

// Set the date field's minimum to today
const dateInput = form.querySelector('input[name="date"]');
if (dateInput) dateInput.min = new Date().toISOString().split("T")[0];

// Subtle reveal on scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".card, .catcard, .menu__col").forEach((el) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(24px)";
  el.style.transition = "opacity .6s ease, transform .6s ease";
  observer.observe(el);
});
