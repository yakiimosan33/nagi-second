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

  /* --- Enhanced Loading Screen with Percentage Counter --- */
  document.body.classList.add("is-loading");

  (function () {
    var percentEl = document.getElementById("loaderPercentage");
    var fillEl = document.getElementById("loaderProgressFill");
    var loader = document.getElementById("loader");
    var curtainLeft = document.getElementById("curtainLeft");
    var curtainRight = document.getElementById("curtainRight");
    var currentPercent = 0;
    var targetPercent = 0;

    // Simulate load progress
    var progressInterval = setInterval(function () {
      targetPercent = Math.min(targetPercent + Math.random() * 15 + 5, 90);
    }, 200);

    function animatePercent() {
      if (currentPercent < targetPercent) {
        currentPercent += (targetPercent - currentPercent) * 0.15 + 0.5;
        currentPercent = Math.min(currentPercent, targetPercent);
        var display = Math.floor(currentPercent);
        if (percentEl) percentEl.innerHTML = display + "<span>%</span>";
        if (fillEl) fillEl.style.width = display + "%";
      }
      if (currentPercent < 100) {
        requestAnimationFrame(animatePercent);
      }
    }
    animatePercent();

    window.addEventListener("load", function () {
      clearInterval(progressInterval);
      targetPercent = 100;

      setTimeout(function () {
        currentPercent = 100;
        if (percentEl) percentEl.innerHTML = "100<span>%</span>";
        if (fillEl) fillEl.style.width = "100%";

        setTimeout(function () {
          if (loader) loader.classList.add("is-hidden");
          if (curtainLeft) curtainLeft.classList.add("is-revealed");
          if (curtainRight) curtainRight.classList.add("is-revealed");
          document.body.classList.remove("is-loading");
          initHeroAnimation();

          // Clean up curtains
          setTimeout(function () {
            if (curtainLeft) curtainLeft.style.display = "none";
            if (curtainRight) curtainRight.style.display = "none";
          }, 1200);
        }, 400);
      }, 300);
    });
  })();

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

  /* --- Back to Top Button --- */
  (function () {
    var backToTop = document.getElementById("backToTop");
    if (!backToTop) return;

    function toggleBackToTop() {
      if (window.scrollY > 400) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    }

    window.addEventListener("scroll", toggleBackToTop, { passive: true });

    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  })();

  /* --- Scroll Progress Bar --- */
  (function () {
    var progressBar = document.getElementById("scrollProgress");
    if (!progressBar) return;

    function updateProgress() {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + "%";
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  })();

  /* --- Keyboard Navigation: Escape to Close Mobile Menu --- */
  (function () {
    var hamburgerBtn = document.getElementById("hamburger");
    var overlay = document.getElementById("mobileNavOverlay");
    if (!hamburgerBtn || !overlay) return;

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("is-open")) {
        hamburgerBtn.classList.remove("is-active");
        overlay.classList.remove("is-open");
        document.body.style.overflow = "";
        hamburgerBtn.setAttribute("aria-expanded", "false");
        hamburgerBtn.focus();
      }
    });

    // Update aria-expanded on hamburger toggle
    var origClick = hamburgerBtn.onclick;
    hamburgerBtn.addEventListener("click", function () {
      var isOpen = hamburgerBtn.classList.contains("is-active");
      hamburgerBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  })();

  /* --- IntersectionObserver Fallback for Scroll Animations --- */
  (function () {
    // Only use fallback if ScrollTrigger is NOT available
    if (typeof ScrollTrigger !== "undefined" || typeof gsap !== "undefined") return;

    if (!("IntersectionObserver" in window)) return;

    var animatedElements = document.querySelectorAll(
      "[data-animate], .section-label, .section-title, .section-bar, .news-item, .disco-item"
    );

    if (animatedElements.length === 0) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  })();

  /* --- Rain Effect (Canvas) --- */
  (function () {
    var canvas = document.getElementById("rainCanvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var drops = [];
    var dropCount = window.innerWidth < 768 ? 40 : 80;

    function resizeCanvas() {
      var hero = canvas.parentElement.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    function initDrops() {
      drops = [];
      for (var i = 0; i < dropCount; i++) {
        drops.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          length: Math.random() * 20 + 10,
          speed: Math.random() * 3 + 1.5,
          opacity: Math.random() * 0.15 + 0.03,
          wind: Math.random() * 0.5 + 0.3,
        });
      }
    }

    function drawRain() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.wind * d.length * 0.3, d.y + d.length);
        ctx.strokeStyle = "rgba(160, 180, 240, " + d.opacity + ")";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        d.y += d.speed;
        d.x += d.wind * 0.3;

        if (d.y > canvas.height) {
          d.y = -d.length;
          d.x = Math.random() * canvas.width;
        }
      }

      requestAnimationFrame(drawRain);
    }

    resizeCanvas();
    initDrops();
    drawRain();

    window.addEventListener("resize", function () {
      resizeCanvas();
      initDrops();
    });
  })();

  /* --- Sound Wave Visualizer --- */
  (function () {
    var container = document.getElementById("soundVisualizer");
    if (!container) return;

    var barCount = 12;
    for (var i = 0; i < barCount; i++) {
      var bar = document.createElement("div");
      bar.classList.add("sound-bar");
      var minH = Math.random() * 6 + 3;
      var maxH = Math.random() * 18 + 10;
      var dur = Math.random() * 0.6 + 0.5;
      var delay = Math.random() * 0.5;
      bar.style.setProperty("--bar-min", minH + "px");
      bar.style.setProperty("--bar-max", maxH + "px");
      bar.style.setProperty("--bar-duration", dur + "s");
      bar.style.setProperty("--bar-delay", delay + "s");
      bar.style.height = minH + "px";
      container.appendChild(bar);
    }
  })();

  /* --- Live Cards Stagger Animation --- */
  (function () {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

    var liveCards = document.querySelectorAll(".live-card");
    if (liveCards.length > 0) {
      gsap.to(liveCards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".live-list",
          start: "top 80%",
          once: true,
        },
      });
    }
  })();

  /* --- Copyright Year Auto Update --- */
  (function () {
    const copyright = document.querySelector(".footer-copyright");
    if (copyright) {
      const year = new Date().getFullYear();
      copyright.innerHTML = "&copy; " + year + " AMAMIYA NAGI. All Rights Reserved.";
    }
  })();
})();
