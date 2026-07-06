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

// Reservation form → relay to the Novallem inbox via the shared Cloudflare Worker
const CONTACT_RELAY_URL = "https://novallem-contact-relay.nealechristian4.workers.dev";
const form = document.getElementById("reserveForm");
const success = document.getElementById("reserveSuccess");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const data = new FormData(form);
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Sending…";

  try {
    const res = await fetch(CONTACT_RELAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        site: "whisker",
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        business: "Lounge reservation",
        message:
          `Reservation request\n` +
          `Date: ${data.get("date") || "—"}\n` +
          `Time: ${data.get("time") || "—"}\n` +
          `Guests: ${data.get("guests") || "—"}\n\n` +
          `Notes: ${data.get("notes") || "None"}`,
      }),
    });
    if (!res.ok) throw new Error("relay error");
    success.hidden = false;
    button.textContent = "Reservation Requested 🐾";
    form.reset();
    success.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch {
    button.disabled = false;
    button.textContent = "Try Again";
    success.hidden = false;
    success.textContent = "Something went wrong — please email hello@novallem.com or try again.";
  }
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
