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
const FIREBASE_SDK_VERSION = "12.7.0";
const CONTACT_PROJECT_OPTIONS = [
  "Website or SaaS platform",
  "Mobile app",
  "Automation workflow",
  "AI feature or workflow",
  "UI/UX design",
];
let contactServicePromise;

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

const setFormStatus = (message, tone = "neutral") => {
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.remove("is-success", "is-error");

  if (tone === "success" || tone === "error") {
    status.classList.add(`is-${tone}`);
  }
};

const normalizeInput = (value, maxLength) => String(value || "").trim().slice(0, maxLength);

const buildMailtoUrl = (payload) => {
  const subject = encodeURIComponent(`New website inquiry from ${payload.name || "CyphronTech site"}`);
  const body = encodeURIComponent([
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Project type: ${payload.project}`,
    `Page: ${payload.page}`,
    "",
    "Brief:",
    payload.brief,
  ].join("\n"));

  return `mailto:cyphrontechllp@gmail.com?subject=${subject}&body=${body}`;
};

const getContactPayload = () => {
  const formData = new FormData(form);
  const honeypot = normalizeInput(formData.get("company_website"), 120);

  if (honeypot) {
    return null;
  }

  const payload = {
    name: normalizeInput(formData.get("name"), 80),
    email: normalizeInput(formData.get("email"), 120).toLowerCase(),
    project: normalizeInput(formData.get("project"), 80),
    brief: normalizeInput(formData.get("brief"), 2000),
    page: `${window.location.origin}${window.location.pathname}`.slice(0, 300),
    source: "website-contact-form",
    status: "new",
  };

  if (!payload.name || !payload.email || !CONTACT_PROJECT_OPTIONS.includes(payload.project) || !payload.brief) {
    throw new Error("missing-fields");
  }

  return payload;
};

const hasFirebaseConfig = (config) => {
  const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];
  return requiredKeys.every((key) => typeof config?.[key] === "string" && config[key].trim());
};

const getContactService = async () => {
  if (!contactServicePromise) {
    contactServicePromise = (async () => {
      const { firebaseConfig, contactFormSettings } = window.cyphronContactFirebase || {};

      if (!contactFormSettings?.enabled || !hasFirebaseConfig(firebaseConfig)) {
        throw new Error("firebase-not-configured");
      }

      const [{ initializeApp }, firestoreModule] = await Promise.all([
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app.js`),
        import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-firestore.js`),
      ]);

      const app = initializeApp(firebaseConfig);

      if (!contactFormSettings.appCheck?.enabled || !contactFormSettings.appCheck.siteKey) {
        throw new Error("app-check-not-configured");
      }

      const { initializeAppCheck, ReCaptchaV3Provider } = await import(`https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app-check.js`);
      initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(contactFormSettings.appCheck.siteKey),
        isTokenAutoRefreshEnabled: true,
      });

      const db = firestoreModule.getFirestore(app);
      const collectionName = contactFormSettings.collectionName || "contactSubmissions";

      return {
        addSubmission: (payload) => firestoreModule.addDoc(firestoreModule.collection(db, collectionName), {
          ...payload,
          createdAt: firestoreModule.serverTimestamp(),
        }),
      };
    })();
  }

  try {
    return await contactServicePromise;
  } catch (error) {
    contactServicePromise = undefined;
    throw error;
  }
};

if (form && status) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    let payload;
    submitButton?.setAttribute("disabled", "true");
    form.setAttribute("aria-busy", "true");
    setFormStatus("Sending your message...", "neutral");

    try {
      payload = getContactPayload();

      if (!payload) {
        form.reset();
        setFormStatus("Message sent. We will get back to you soon.", "success");
        return;
      }

      const contactService = await getContactService();
      const submissionRef = await contactService.addSubmission(payload);
      console.info("Contact submission saved", { path: submissionRef.path });
      form.reset();
      setFormStatus("Message sent. We will get back to you soon.", "success");
    } catch (error) {
      console.error("Contact form submission failed", error);
      if (payload) {
        window.location.href = buildMailtoUrl(payload);
      }
      const message = error?.message === "firebase-not-configured" || error?.message === "app-check-not-configured"
        ? "Contact form is not configured yet. Open an email draft to cyphrontechllp@gmail.com."
        : "Could not save to Firebase. Open an email draft to cyphrontechllp@gmail.com.";
      setFormStatus(message, "error");
    } finally {
      submitButton?.removeAttribute("disabled");
      form.removeAttribute("aria-busy");
    }
  });
}
