const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll("#navbar a");
const contactForm = document.getElementById("contact-form");
const message = document.getElementById("message");
const revealItems = document.querySelectorAll(".reveal");

menuBtn.addEventListener("click", () => {
  navbar.classList.toggle("open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navbar.classList.remove("open");
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  message.textContent = "Thank you. Your message is saved locally in this demo.";
  contactForm.reset();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));
