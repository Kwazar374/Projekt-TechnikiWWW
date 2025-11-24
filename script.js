// Simple JS for mobile slide-out menu and newsletter popup
document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupNewsletterForm();
});

/* ========== OVERLAY HELPERS ========== */

// Get overlay element
function getOverlay() {
  return document.querySelector("[data-overlay]");
}

function showOverlay() {
  const overlay = getOverlay();
  if (!overlay) return;
  overlay.classList.add("is-visible");
}

function hideOverlay() {
  const overlay = getOverlay();
  if (!overlay) return;
  overlay.classList.remove("is-visible");
}

/* ========== MOBILE MENU ========== */

function setupMobileMenu() {
  const menu = document.getElementById("mobile-nav");
  const openBtn = document.getElementById("menu-open");
  const closeBtn = document.getElementById("menu-close");
  const overlay = getOverlay();

  if (!menu || !openBtn || !closeBtn || !overlay) return;

  const openMenu = () => {
    menu.setAttribute("aria-hidden", "false");
    openBtn.setAttribute("aria-expanded", "true");
    showOverlay();
  };

  const closeMenu = () => {
    menu.setAttribute("aria-hidden", "true");
    openBtn.setAttribute("aria-expanded", "false");
    hideOverlay();
  };

  openBtn.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);

  overlay.addEventListener("click", () => {
    const isOpen = menu.getAttribute("aria-hidden") === "false";
    if (isOpen) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const isOpen = menu.getAttribute("aria-hidden") === "false";
      if (isOpen) {
        closeMenu();
      }
    }
  });
}

/* ========== NEWSLETTER POPUP ========== */

function setupNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  const emailInput = document.getElementById("newsletter-email");
  const errorElement = document.getElementById("newsletter-error");
  const popup = document.getElementById("newsletter-popup");
  const popupCloseButtons = document.querySelectorAll("[data-popup-close]");
  const overlay = getOverlay();

  if (!form || !emailInput || !errorElement || !popup || !overlay) return;

  let lastFocusedElement = null;

  const openPopup = () => {
    lastFocusedElement = document.activeElement;
    popup.setAttribute("aria-hidden", "false");
    showOverlay();

    const focusable = popup.querySelector(
      'button, [href], input, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable) {
      focusable.focus();
    }
  };

  const closePopup = () => {
    popup.setAttribute("aria-hidden", "true");
    hideOverlay();
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorElement.textContent = "";
    emailInput.removeAttribute("aria-invalid");

    const value = emailInput.value.trim();
    if (!value) {
      errorElement.textContent = "Podaj adres e-mail.";
      emailInput.setAttribute("aria-invalid", "true");
      emailInput.focus();
      return;
    }

    if (!isValidEmail(value)) {
      errorElement.textContent = "Podany adres e-mail jest nieprawidłowy.";
      emailInput.setAttribute("aria-invalid", "true");
      emailInput.focus();
      return;
    }

    // Clear and show thank-you popup
    emailInput.value = "";
    openPopup();
  });

  popupCloseButtons.forEach((btn) => {
    btn.addEventListener("click", closePopup);
  });

  overlay.addEventListener("click", () => {
    const isVisible = popup.getAttribute("aria-hidden") === "false";
    if (isVisible) {
      closePopup();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const isVisible = popup.getAttribute("aria-hidden") === "false";
      if (isVisible) {
        closePopup();
      }
    }
  });
}

// Simple email validation for demo
function isValidEmail(value) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(value);
}
