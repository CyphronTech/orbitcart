const header = document.querySelector("[data-header]");
const toggle = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const form = document.querySelector("[data-contact-form]");
const status = document.querySelector("[data-form-status]");
const carousel = document.querySelector("[data-carousel]");
const carouselTrack = document.querySelector("[data-carousel-track]");
const carouselSlides = carouselTrack ? [...carouselTrack.querySelectorAll("[data-carousel-slide]")] : [];
const carouselPrev = document.querySelector("[data-carousel-prev]");
const carouselNext = document.querySelector("[data-carousel-next]");
const carouselDots = document.querySelector("[data-carousel-dots]");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("is-open", !isOpen);
  });

  menu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
    }
  });
}

if (header) {
  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

if (carousel && carouselTrack && carouselSlides.length && carouselDots) {
  let currentSlide = 0;
  let autoAdvanceId = 0;
  const autoAdvanceDelay = 5200;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const carouselRegion = carousel.closest(".case-studies") || carousel;

  const dots = carouselSlides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "carousel-dot";
    dot.setAttribute("aria-label", `Show case study ${index + 1}`);
    dot.addEventListener("click", () => {
      updateCarousel(index);
      restartAutoAdvance();
    });
    carouselDots.appendChild(dot);
    return dot;
  });

  const setSlideFocus = (slide, enabled) => {
    slide.querySelectorAll("a, button, input, select, textarea").forEach((element) => {
      if (enabled) {
        element.removeAttribute("tabindex");
      } else {
        element.setAttribute("tabindex", "-1");
      }
    });
  };

  const updateCarousel = (nextIndex) => {
    currentSlide = (nextIndex + carouselSlides.length) % carouselSlides.length;
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    carouselSlides.forEach((slide, index) => {
      const isActive = index === currentSlide;
      slide.setAttribute("aria-hidden", String(!isActive));
      setSlideFocus(slide, isActive);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentSlide);
      dot.setAttribute("aria-current", index === currentSlide ? "true" : "false");
    });
  };

  const stopAutoAdvance = () => {
    window.clearInterval(autoAdvanceId);
    autoAdvanceId = 0;
  };

  const startAutoAdvance = () => {
    if (reduceMotion || autoAdvanceId || carouselSlides.length < 2) {
      return;
    }

    autoAdvanceId = window.setInterval(() => {
      updateCarousel(currentSlide + 1);
    }, autoAdvanceDelay);
  };

  const restartAutoAdvance = () => {
    stopAutoAdvance();
    startAutoAdvance();
  };

  carouselPrev?.addEventListener("click", () => {
    updateCarousel(currentSlide - 1);
    restartAutoAdvance();
  });
  carouselNext?.addEventListener("click", () => {
    updateCarousel(currentSlide + 1);
    restartAutoAdvance();
  });
  carouselRegion.addEventListener("mouseenter", stopAutoAdvance);
  carouselRegion.addEventListener("mouseleave", startAutoAdvance);
  carouselRegion.addEventListener("focusin", stopAutoAdvance);
  carouselRegion.addEventListener("focusout", (event) => {
    if (!carouselRegion.contains(event.relatedTarget)) {
      startAutoAdvance();
    }
  });
  updateCarousel(0);
  startAutoAdvance();
}

if (form && status) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "Brief captured. Connect this form to cyphrontechllp@gmail.com or your CRM to send submissions.";
    form.reset();
  });
}
