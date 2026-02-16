/* ============================================
   雨宮凪 - AMAMIYA NAGI Official Site
   Main Script
   ============================================ */

(function () {
  "use strict";

  /* --- UA Detection & Device Classes --- */
  const ua = navigator.userAgent.toLowerCase();
  const html = document.documentElement;

  if (/iphone|ipod/.test(ua)) html.classList.add("iphone", "mobile");
  else if (/ipad/.test(ua)) html.classList.add("ipad", "tablet");
  else if (/android/.test(ua)) {
    html.classList.add("android");
    if (/mobile/.test(ua)) html.classList.add("mobile");
    else html.classList.add("tablet");
  }

  /* --- Dynamic Viewport Control --- */
  function setViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;

    if (html.classList.contains("tablet")) {
      viewport.setAttribute("content", "width=1200");
    } else if (html.classList.contains("mobile")) {
      viewport.setAttribute("content", "width=device-width, initial-scale=1.0");
    }
  }
  setViewport();

  /* --- Loading Screen --- */
  document.body.classList.add("is-loading");

  window.addEventListener("load", function () {
    setTimeout(function () {
      const loader = document.getElementById("loader");
      if (loader) loader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
      initHeroAnimation();
    }, 800);
  });

  /* --- Hero Particles --- */
  function createParticles() {
    const container = document.getElementById("particles");
    if (!container) return;

    const count = window.innerWidth < 768 ? 20 : 40;

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const duration = Math.random() * 20 + 15;
      const delay = Math.random() * 10;
      const opacity = Math.random() * 0.4 + 0.1;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        opacity: ${opacity};
        animation: particleFloat ${duration}s ease-in-out ${delay}s infinite alternate;
      `;

      container.appendChild(particle);
    }

    // Inject particle animation
    if (!document.getElementById("particle-keyframes")) {
      const style = document.createElement("style");
      style.id = "particle-keyframes";
      style.textContent = `
        @keyframes particleFloat {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(${rand(-30, 30)}px, ${rand(-40, 40)}px) scale(${Math.random() * 0.5 + 0.8}); }
          66% { transform: translate(${rand(-20, 20)}px, ${rand(-30, 30)}px) scale(${Math.random() * 0.3 + 0.9}); }
          100% { transform: translate(${rand(-25, 25)}px, ${rand(-35, 35)}px) scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createParticles();

  /* --- Hero Animation (GSAP) --- */
  function initHeroAnimation() {
    if (typeof gsap === "undefined") return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(".hero-title-wrap", {
      opacity: 1,
      y: 0,
      duration: 1.2,
      delay: 0.3,
    })
      .to(
        ".hero-tagline",
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        "-=0.4"
      )
      .to(
        ".hero-scroll-indicator",
        {
          opacity: 1,
          duration: 0.6,
        },
        "-=0.2"
      );
  }

  /* --- Header Scroll Behavior --- */
  const header = document.getElementById("header");
  let lastScroll = 0;

  function onScroll() {
    const scrollY = window.scrollY;

    // Header background
    if (scrollY > 50) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    lastScroll = scrollY;
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- Active Nav Highlight --- */
  function updateActiveNav() {
    const sections = document.querySelectorAll(".section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(function (section) {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove("is-active");
          if (link.getAttribute("data-section") === id) {
            link.classList.add("is-active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  /* --- Mobile Navigation --- */
  const hamburger = document.getElementById("hamburger");
  const mobileOverlay = document.getElementById("mobileNavOverlay");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener("click", function () {
      const isOpen = hamburger.classList.contains("is-active");

      if (isOpen) {
        hamburger.classList.remove("is-active");
        mobileOverlay.classList.remove("is-open");
        document.body.style.overflow = "";
      } else {
        hamburger.classList.add("is-active");
        mobileOverlay.classList.add("is-open");
        document.body.style.overflow = "hidden";
      }
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        hamburger.classList.remove("is-active");
        mobileOverlay.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* --- Scroll Animations with GSAP ScrollTrigger --- */
  function initScrollAnimations() {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    gsap.registerPlugin(ScrollTrigger);

    // Section headers
    document.querySelectorAll(".section-header").forEach(function (header) {
      const label = header.querySelector(".section-label");
      const title = header.querySelector(".section-title");
      const bar = header.querySelector(".section-bar");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: header,
          start: "top 80%",
          once: true,
        },
      });

      if (label) {
        tl.to(label, { opacity: 1, y: 0, duration: 0.6 });
      }
      if (title) {
        tl.to(title, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3");
      }
      if (bar) {
        tl.to(bar, { scaleX: 1, duration: 0.8 }, "-=0.4");
      }
    });

    // News items - stagger effect
    const newsItems = document.querySelectorAll(".news-item");
    if (newsItems.length > 0) {
      gsap.to(newsItems, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".news-list",
          start: "top 80%",
          once: true,
        },
      });
    }

    // Generic animated elements
    document.querySelectorAll("[data-animate]").forEach(function (el) {
      gsap.to(el, {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    });

    // Discography items - stagger
    const discoItems = document.querySelectorAll(".disco-item");
    if (discoItems.length > 0) {
      gsap.to(discoItems, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".disco-grid",
          start: "top 80%",
          once: true,
        },
      });
    }

    // Parallax effect on hero
    gsap.to(".hero-content", {
      y: 100,
      opacity: 0.3,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }

  // Initialize scroll animations after a brief delay
  if (document.readyState === "complete") {
    initScrollAnimations();
  } else {
    window.addEventListener("load", function () {
      setTimeout(initScrollAnimations, 100);
    });
  }

  /* --- Smooth Scroll for Anchor Links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height"
        )
      );
      const targetPos = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPos,
        behavior: "smooth",
      });
    });
  });

  /* --- Mouse Trail Effect (Desktop Only) --- */
  if (!html.classList.contains("mobile") && !html.classList.contains("tablet")) {
    let mouseX = 0;
    let mouseY = 0;
    let trailTimeout;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      clearTimeout(trailTimeout);
      trailTimeout = setTimeout(function () {
        createMouseTrail(mouseX, mouseY);
      }, 50);
    });

    function createMouseTrail(x, y) {
      // Only create trail in the hero section
      const hero = document.querySelector(".hero");
      if (!hero) return;

      const rect = hero.getBoundingClientRect();
      if (y < rect.top || y > rect.bottom) return;

      const dot = document.createElement("div");
      dot.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: rgba(123, 140, 222, 0.3);
        pointer-events: none;
        z-index: 1;
        transition: opacity 1s ease, transform 1s ease;
      `;

      document.body.appendChild(dot);

      requestAnimationFrame(function () {
        dot.style.opacity = "0";
        dot.style.transform = "scale(3)";
      });

      setTimeout(function () {
        dot.remove();
      }, 1200);
    }
  }

  /* --- Copyright Year Auto Update --- */
  (function () {
    const copyright = document.querySelector(".footer-copyright");
    if (copyright) {
      const year = new Date().getFullYear();
      copyright.innerHTML = "&copy; " + year + " AMAMIYA NAGI. All Rights Reserved.";
    }
  })();
})();
