document.addEventListener("DOMContentLoaded", () => {
  // Element references
  const luxuryNav = document.getElementById("luxuryNav");
  const navMenu = document.getElementById("navMenu");
  const mobileToggle = document.getElementById("mobileToggle");
  const scrollToTopBtn = document.getElementById("scrollToTop");
  const loadingScreen = document.getElementById("loadingScreen");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");
  const contactForm = document.getElementById("contactForm");

  // 1. Loading Screen
  window.addEventListener("load", () => {
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
      // Ensure loading screen is fully removed after transition
      loadingScreen.addEventListener("transitionend", () => {
        loadingScreen.style.display = "none";
      });
    }
  });

  // 2. Scrolled Navigation & Scroll-to-Top Button Visibility
  const handleScroll = () => {
    if (!luxuryNav || !scrollToTopBtn) return;

    // Navigation style
    if (window.scrollY > 50) {
      luxuryNav.classList.add("scrolled");
    } else {
      luxuryNav.classList.remove("scrolled");
    }

    // Scroll-to-Top button
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add("visible");
    } else {
      scrollToTopBtn.classList.remove("visible");
    }

    // Active nav link highlighting
    updateActiveNavLink();
  };

  window.addEventListener("scroll", handleScroll);

  // 3. Mobile Menu Toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      mobileToggle.classList.toggle("active");
    });
  }

  // Function to close mobile menu
  const closeMobileMenu = () => {
    if (navMenu && mobileToggle) {
      navMenu.classList.remove("active");
      mobileToggle.classList.remove("active");
    }
  };

  // 4. Smooth Scrolling for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement && luxuryNav) {
        const headerOffset = luxuryNav.offsetHeight;
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });

        // Close the mobile menu after clicking a link
        closeMobileMenu();
      }
    });
  });

  // 5. Scroll-to-Top Button Action
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // 6. Custom Intersection Observer for Entrance Animations (AOS-like effect)
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = Number.parseInt(entry.target.getAttribute("data-aos-delay")) || 0;
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, delay);
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -80px 0px",
    }
  );

  // Observe all elements with a 'data-aos' attribute
  document.querySelectorAll("[data-aos]").forEach((el) => observer.observe(el));

  // 7. Service Cards Animation Observer
  const serviceObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const serviceCards = entry.target.querySelectorAll(".service-card");
          serviceCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("animate-in");
            }, index * 150); // Stagger by 150ms
          });
          serviceObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // 8. Contact Cards Animation Observer
  const contactObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const contactCards = entry.target.querySelectorAll(".contact-card");
          contactCards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add("animate-in");
            }, index * 200); // Stagger by 200ms
          });
          contactObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Observe services and contact sections
  const servicesSection = document.querySelector(".services-section");
  const contactSection = document.querySelector(".contact-section");

  if (servicesSection) {
    serviceObserver.observe(servicesSection);
  }

  if (contactSection) {
    contactObserver.observe(contactSection);
  }

  // 9. Active Nav Link on Scroll Logic
  function updateActiveNavLink() {
    if (!luxuryNav) return;
    let currentSectionId = "";
    const navHeight = luxuryNav.offsetHeight;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - navHeight - 50;
      if (window.scrollY >= sectionTop) {
        currentSectionId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === currentSectionId) {
        link.classList.add("active");
      }
    });
  }

  // 10. Contact Form Handler with Basic Validation
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Basic form validation
      const name = contactForm.querySelector("#name").value.trim();
      const email = contactForm.querySelector("#email").value.trim();

      if (!name || !email) {
        alert("Please fill in all required fields (Name and Email).");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Add loading state to submit button
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission delay
        setTimeout(() => {
          alert("Thank you for your message! We will get in touch shortly.");
          contactForm.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 1500);
      }
    });
  }

  // 11. Smooth Parallax Effect for Hero Section
  const heroSection = document.querySelector(".hero-section");
  if (heroSection) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      heroSection.style.transform = `translateY(${rate}px)`;
    });
  }

  // Initial scroll check
  handleScroll();
});