/* ============================================
   雨宮凪 - AMAMIYA NAGI Official Site
   Main Script
   ============================================ */

(function () {
  "use strict";

  /* --- UA Detection & Device Classes --- */
  var ua = navigator.userAgent.toLowerCase();
  var html = document.documentElement;
  var isDesktop =
    !(/iphone|ipod|ipad|android/i.test(ua)) &&
    !("ontouchstart" in window);

  if (/iphone|ipod/.test(ua)) html.classList.add("iphone", "mobile");
  else if (/ipad/.test(ua)) html.classList.add("ipad", "tablet");
  else if (/android/.test(ua)) {
    html.classList.add("android");
    if (/mobile/.test(ua)) html.classList.add("mobile");
    else html.classList.add("tablet");
  }

  /* --- Dynamic Viewport Control --- */
  function setViewport() {
    var viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) return;

    if (html.classList.contains("tablet")) {
      viewport.setAttribute("content", "width=1200");
    } else if (html.classList.contains("mobile")) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0"
      );
    }
  }
  setViewport();

  /* --- Reduced Motion Check --- */
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =============================================
     1. ENHANCED LOADING SCREEN
     ============================================= */
  document.body.classList.add("is-loading");

  (function initEnhancedLoader() {
    var loaderPercentage = document.getElementById("loaderPercentage");
    var loaderProgressFill = document.getElementById("loaderProgressFill");
    var currentPercent = 0;
    var targetPercent = 0;
    var loadComplete = false;
    var animFrameId = null;

    // Simulate loading progress (fast at start, slows near end)
    function simulateProgress() {
      if (loadComplete) return;
      if (targetPercent < 70) {
        targetPercent += Math.random() * 8 + 2;
      } else if (targetPercent < 90) {
        targetPercent += Math.random() * 2 + 0.5;
      }
      targetPercent = Math.min(targetPercent, 92);
      setTimeout(simulateProgress, 80 + Math.random() * 120);
    }
    simulateProgress();

    // Animate the counter smoothly
    function animateCounter() {
      if (currentPercent < targetPercent) {
        currentPercent += (targetPercent - currentPercent) * 0.15 + 0.3;
        currentPercent = Math.min(currentPercent, targetPercent);
      }
      var displayVal = Math.round(currentPercent);
      if (loaderPercentage) {
        loaderPercentage.innerHTML = displayVal + "<span>%</span>";
      }
      if (loaderProgressFill) {
        loaderProgressFill.style.width = displayVal + "%";
      }

      if (displayVal < 100 || !loadComplete) {
        animFrameId = requestAnimationFrame(animateCounter);
      } else {
        // Counter reached 100 - trigger reveal
        revealSite();
      }
    }
    animFrameId = requestAnimationFrame(animateCounter);

    window.addEventListener("load", function () {
      loadComplete = true;
      targetPercent = 100;
    });

    // Fallback: if load event doesn't fire quickly
    setTimeout(function () {
      if (!loadComplete) {
        loadComplete = true;
        targetPercent = 100;
      }
    }, 5000);

    function revealSite() {
      if (animFrameId) cancelAnimationFrame(animFrameId);

      var loader = document.getElementById("loader");
      var curtainLeft = document.getElementById("curtainLeft");
      var curtainRight = document.getElementById("curtainRight");

      // Fade out the loader content first
      if (loader) {
        loader.classList.add("is-hidden");
      }

      // After loader fades, trigger curtain wipe
      setTimeout(function () {
        if (curtainLeft) curtainLeft.classList.add("is-revealed");
        if (curtainRight) curtainRight.classList.add("is-revealed");
        document.body.classList.remove("is-loading");
        initHeroAnimation();
      }, 400);

      // Clean up curtain elements after animation
      setTimeout(function () {
        if (curtainLeft) curtainLeft.style.display = "none";
        if (curtainRight) curtainRight.style.display = "none";
      }, 1800);
    }
  })();

  /* =============================================
     2. RAIN EFFECT IN HERO (Canvas)
     ============================================= */
  function initRainEffect() {
    if (prefersReducedMotion) return;

    var canvas = document.getElementById("rainCanvas");
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    var drops = [];
    var isVisible = true;
    var isMobile = window.innerWidth < 768;
    var dropCount = isMobile ? 40 : 80;

    function resizeCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();

    // Debounced resize
    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resizeCanvas();
        isMobile = window.innerWidth < 768;
        dropCount = isMobile ? 40 : 80;
        initDrops();
      }, 200);
    });

    function createDrop() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        length: Math.random() * 18 + 8,
        speed: Math.random() * 2.5 + 1.5,
        opacity: Math.random() * 0.15 + 0.03,
        wind: 0.3 + Math.random() * 0.4
      };
    }

    function initDrops() {
      drops = [];
      for (var i = 0; i < dropCount; i++) {
        var drop = createDrop();
        drop.y = Math.random() * canvas.height;
        drops.push(drop);
      }
    }
    initDrops();

    function draw() {
      if (!isVisible) {
        requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.wind * d.length * 0.5, d.y + d.length);
        ctx.strokeStyle = "rgba(160, 175, 230, " + d.opacity + ")";
        ctx.lineWidth = 0.8;
        ctx.stroke();

        d.y += d.speed;
        d.x += d.wind * 0.3;

        if (d.y > canvas.height + d.length) {
          drops[i] = createDrop();
        }
      }

      requestAnimationFrame(draw);
    }

    // Only run rain when hero is in viewport
    var heroSection = document.getElementById("hero");
    if (heroSection && typeof IntersectionObserver !== "undefined") {
      var observer = new IntersectionObserver(
        function (entries) {
          isVisible = entries[0].isIntersecting;
        },
        { threshold: 0 }
      );
      observer.observe(heroSection);
    }

    draw();
  }
  initRainEffect();

  /* =============================================
     3. TEXT REVEAL ANIMATION (Character-by-character)
     ============================================= */
  function splitTextToChars(element) {
    if (!element) return [];
    var text = element.textContent;
    var dataText = element.getAttribute("data-text");
    element.innerHTML = "";

    var chars = text.split("");
    var spans = [];

    for (var i = 0; i < chars.length; i++) {
      var wrap = document.createElement("span");
      wrap.className = "char-wrap";

      var inner = document.createElement("span");
      inner.className = "char-inner";
      inner.textContent = chars[i] === " " ? "\u00A0" : chars[i];

      wrap.appendChild(inner);
      element.appendChild(wrap);
      spans.push(inner);
    }

    // Preserve data-text attribute for the ::before pseudo-element
    if (dataText) {
      element.setAttribute("data-text", dataText);
    }

    return spans;
  }

  /* =============================================
     4. HERO ANIMATION (GSAP) - Enhanced with text reveal
     ============================================= */
  function initHeroAnimation() {
    if (typeof gsap === "undefined") return;

    var titleJp = document.querySelector(".hero-title-jp");
    var titleEn = document.querySelector(".hero-title-en");

    // Split text into characters
    var jpChars = splitTextToChars(titleJp);
    var enChars = splitTextToChars(titleEn);

    var tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // First make the title wrap visible (without its normal animation)
    tl.set(".hero-title-wrap", { opacity: 1, y: 0 });

    // Animate JP characters one by one
    if (jpChars.length > 0) {
      tl.to(jpChars, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.2
      });
    }

    // Animate EN characters
    if (enChars.length > 0) {
      tl.to(
        enChars,
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.025,
          ease: "power3.out"
        },
        "-=0.3"
      );
    }

    // Tagline
    tl.to(
      ".hero-tagline",
      {
        opacity: 1,
        y: 0,
        duration: 0.8
      },
      "-=0.2"
    );

    // Scroll indicator
    tl.to(
      ".hero-scroll-indicator",
      {
        opacity: 1,
        duration: 0.6
      },
      "-=0.2"
    );
  }

  /* --- Hero Particles --- */
  function createParticles() {
    var container = document.getElementById("particles");
    if (!container) return;

    var count = window.innerWidth < 768 ? 20 : 40;

    for (var i = 0; i < count; i++) {
      var particle = document.createElement("div");
      particle.classList.add("particle");

      var size = Math.random() * 3 + 1;
      var x = Math.random() * 100;
      var y = Math.random() * 100;
      var duration = Math.random() * 20 + 15;
      var delay = Math.random() * 10;
      var opacity = Math.random() * 0.4 + 0.1;

      particle.style.cssText =
        "width:" + size + "px;height:" + size + "px;left:" + x +
        "%;top:" + y + "%;opacity:" + opacity +
        ";animation:particleFloat " + duration + "s ease-in-out " +
        delay + "s infinite alternate;";

      container.appendChild(particle);
    }

    // Inject particle animation
    if (!document.getElementById("particle-keyframes")) {
      var style = document.createElement("style");
      style.id = "particle-keyframes";
      style.textContent =
        "@keyframes particleFloat {" +
        "0% { transform: translate(0, 0) scale(1); }" +
        "33% { transform: translate(" + rand(-30, 30) + "px, " + rand(-40, 40) + "px) scale(" + (Math.random() * 0.5 + 0.8) + "); }" +
        "66% { transform: translate(" + rand(-20, 20) + "px, " + rand(-30, 30) + "px) scale(" + (Math.random() * 0.3 + 0.9) + "); }" +
        "100% { transform: translate(" + rand(-25, 25) + "px, " + rand(-35, 35) + "px) scale(1); }" +
        "}";
      document.head.appendChild(style);
    }
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  createParticles();

  /* =============================================
     5. MAGNETIC CURSOR EFFECT (Desktop only)
     ============================================= */
  function initMagneticEffect() {
    if (!isDesktop || prefersReducedMotion) return;

    var magneticElements = document.querySelectorAll(
      ".nav-link, .social-icon, .about-link, .contact-email, .back-to-top, .footer-nav a, .footer-social a"
    );

    magneticElements.forEach(function (el) {
      el.classList.add("magnetic-target");

      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var centerX = rect.left + rect.width / 2;
        var centerY = rect.top + rect.height / 2;

        var deltaX = e.clientX - centerX;
        var deltaY = e.clientY - centerY;

        // Magnetic pull strength (subtle)
        var strength = 0.25;
        var maxDist = 8;

        var moveX = Math.max(-maxDist, Math.min(maxDist, deltaX * strength));
        var moveY = Math.max(-maxDist, Math.min(maxDist, deltaY * strength));

        el.style.transform = "translate(" + moveX + "px, " + moveY + "px)";
      });

      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  // Initialize magnetic after DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMagneticEffect);
  } else {
    initMagneticEffect();
  }

  /* =============================================
     6. SMOOTH COUNTER ANIMATION
     ============================================= */
  function initSmoothCounters() {
    if (typeof IntersectionObserver === "undefined") return;

    // Target timeline years and any elements with data-count attribute
    var countElements = document.querySelectorAll(
      ".timeline-year, [data-count]"
    );

    if (countElements.length === 0) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounterEl(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    countElements.forEach(function (el) {
      var text = el.textContent.trim();
      var numVal = parseInt(text, 10);

      if (!isNaN(numVal)) {
        el.setAttribute("data-target-count", numVal);
        el.classList.add("count-up");
        // Start from a value near the target for years, 0 for other numbers
        if (numVal > 1000) {
          el.textContent = String(numVal - 5);
        } else {
          el.textContent = "0";
        }
        observer.observe(el);
      }
    });

    function animateCounterEl(el) {
      var target = parseInt(el.getAttribute("data-target-count"), 10);
      var isYear = target > 1000;
      var start = isYear ? target - 5 : 0;
      var duration = isYear ? 800 : 1500;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);

        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        var current = Math.round(start + (target - start) * eased);
        el.textContent = String(current);

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      requestAnimationFrame(step);
    }
  }

  /* =============================================
     7. PARALLAX DEPTH (Multi-layer hero)
     ============================================= */
  function initParallaxDepth() {
    if (prefersReducedMotion) return;
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined")
      return;

    var layers = document.querySelectorAll(".hero-parallax-layer");
    if (layers.length === 0) return;

    layers.forEach(function (layer) {
      var speed = parseFloat(layer.getAttribute("data-speed")) || 0.2;

      gsap.to(layer, {
        y: function () {
          return window.innerHeight * speed;
        },
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    });

    // Hero content moves at its own parallax speed
    gsap.to(".hero-content", {
      y: 120,
      opacity: 0.2,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Rain canvas parallax (slower)
    var rainCanvas = document.getElementById("rainCanvas");
    if (rainCanvas) {
      gsap.to(rainCanvas, {
        y: function () {
          return window.innerHeight * 0.1;
        },
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }

  /* =============================================
     8. SOUND VISUALIZER DECORATION
     ============================================= */
  function initSoundVisualizer() {
    var container = document.getElementById("soundVisualizer");
    if (!container) return;

    var barCount = 16;

    for (var i = 0; i < barCount; i++) {
      var bar = document.createElement("div");
      bar.className = "sound-bar";

      var minH = 3 + Math.random() * 5;
      var maxH = 12 + Math.random() * 18;
      var duration = 0.4 + Math.random() * 0.8;
      var delay = Math.random() * 0.6;

      bar.style.setProperty("--bar-min", minH + "px");
      bar.style.setProperty("--bar-max", maxH + "px");
      bar.style.setProperty("--bar-duration", duration + "s");
      bar.style.setProperty("--bar-delay", delay + "s");

      container.appendChild(bar);
    }
  }
  initSoundVisualizer();

  /* --- Header Scroll Behavior --- */
  var header = document.getElementById("header");
  var lastScroll = 0;

  function onScroll() {
    var scrollY = window.scrollY;

    // Header background
    if (scrollY > 50) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }

    // Scroll progress bar
    var scrollProgress = document.getElementById("scrollProgress");
    if (scrollProgress) {
      var docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      var scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = scrollPercent + "%";
    }

    // Back to top button
    var backToTop = document.getElementById("backToTop");
    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    }

    lastScroll = scrollY;
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- Back to Top --- */
  var backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* --- Active Nav Highlight --- */
  function updateActiveNav() {
    var sections = document.querySelectorAll(".section[id]");
    var navLinks = document.querySelectorAll(".nav-link");
    var scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute("id");

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
  var hamburger = document.getElementById("hamburger");
  var mobileOverlay = document.getElementById("mobileNavOverlay");
  var mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener("click", function () {
      var isOpen = hamburger.classList.contains("is-active");

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
    document.querySelectorAll(".section-header").forEach(function (hdr) {
      var label = hdr.querySelector(".section-label");
      var title = hdr.querySelector(".section-title");
      var bar = hdr.querySelector(".section-bar");

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: hdr,
          start: "top 80%",
          once: true
        }
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
    var newsItems = document.querySelectorAll(".news-item");
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
          once: true
        }
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
          once: true
        }
      });
    });

    // Discography items - stagger
    var discoItems = document.querySelectorAll(".disco-item");
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
          once: true
        }
      });
    }

    // Initialize parallax depth (uses ScrollTrigger)
    initParallaxDepth();

    // Initialize smooth counters (uses IntersectionObserver)
    initSmoothCounters();
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
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;

      var target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      var headerHeight = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--header-height"
        )
      );
      var targetPos = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPos,
        behavior: "smooth"
      });
    });
  });

  /* --- Mouse Trail Effect (Desktop Only) --- */
  if (isDesktop) {
    var mouseX = 0;
    var mouseY = 0;
    var trailTimeout;

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
      var hero = document.querySelector(".hero");
      if (!hero) return;

      var rect = hero.getBoundingClientRect();
      if (y < rect.top || y > rect.bottom) return;

      var dot = document.createElement("div");
      dot.style.cssText =
        "position:fixed;left:" + x + "px;top:" + y +
        "px;width:4px;height:4px;border-radius:50%;background:rgba(123,140,222,0.3);pointer-events:none;z-index:1;transition:opacity 1s ease,transform 1s ease;";

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
    var copyright = document.querySelector(".footer-copyright");
    if (copyright) {
      var year = new Date().getFullYear();
      copyright.innerHTML =
        "&copy; " + year + " AMAMIYA NAGI. All Rights Reserved.";
    }
  })();
})();
