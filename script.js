// Global variables
let mouseX = 0
let mouseY = 0
let targetX = 0
let targetY = 0

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initMouseFollower()
  initScrollProgress()
  initFloatingNav()
  initMobileMenu()
  initHeroAnimation()
  initScrollAnimations()
  initSkillBars()
  initSmoothScrolling()
  initAccessibility()
})

document.addEventListener("DOMContentLoaded", () => {
  const texts = ["Developer", "Data Analyst", "Computer Science Tutor", "Programmer", "AI & ML Enthusiast"]
  const target = document.getElementById("typing-text")
  let textIndex = 0
  let charIndex = 0

  function type() {
    if (charIndex < texts[textIndex].length) {
      target.textContent += texts[textIndex].charAt(charIndex)
      charIndex++
      setTimeout(type, 100)
    } else {
      setTimeout(erase, 1500)
    }
  }

  function erase() {
    if (charIndex > 0) {
      target.textContent = texts[textIndex].substring(0, charIndex - 1)
      charIndex--
      setTimeout(erase, 50)
    } else {
      textIndex = (textIndex + 1) % texts.length
      setTimeout(type, 500)
    }
  }
  type()
})

// Mouse Follower
function initMouseFollower() {
  const mouseFollower = document.querySelector(".mouse-follower")
  const mouseDot = document.querySelector(".mouse-dot")

  if (!mouseFollower || !mouseDot) return

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (prefersReducedMotion) return

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX
    targetY = e.clientY

    mouseDot.style.left = e.clientX + "px"
    mouseDot.style.top = e.clientY + "px"
  })

  document.addEventListener("mouseenter", () => {
    mouseFollower.style.opacity = "1"
    mouseDot.style.opacity = "1"
  })

  document.addEventListener("mouseleave", () => {
    mouseFollower.style.opacity = "0"
    mouseDot.style.opacity = "0"
  })

  function animateMouseFollower() {
    mouseX += (targetX - mouseX) * 0.1
    mouseY += (targetY - mouseY) * 0.1

    mouseFollower.style.left = mouseX + "px"
    mouseFollower.style.top = mouseY + "px"

    requestAnimationFrame(animateMouseFollower)
  }

  animateMouseFollower()
}

// Scroll Progress
function initScrollProgress() {
  const scrollProgress = document.querySelector(".scroll-progress")
  if (!scrollProgress) return

  const throttledScroll = throttle(() => {
    const scrollTop = window.pageYOffset
    const docHeight = document.body.scrollHeight - window.innerHeight
    const scrollPercent = scrollTop / docHeight

    scrollProgress.style.transform = `scaleX(${scrollPercent})`

    if (scrollTop > 100) {
      scrollProgress.classList.add("visible")
    } else {
      scrollProgress.classList.remove("visible")
    }
  }, 16)

  window.addEventListener("scroll", throttledScroll)
}

// Floating Navigation
function initFloatingNav() {
  const floatingNav = document.querySelector(".floating-nav")
  if (!floatingNav) return

  const throttledScroll = throttle(() => {
    if (window.scrollY > 100) {
      floatingNav.classList.add("visible")
    } else {
      floatingNav.classList.remove("visible")
    }
  }, 16)

  window.addEventListener("scroll", throttledScroll)
}

// Mobile Menu
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn")
  const mobileMenu = document.querySelector(".mobile-menu")
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu-content a")

  if (!mobileMenuBtn || !mobileMenu) return

  mobileMenuBtn.addEventListener("click", () => {
    const isActive = mobileMenu.classList.contains("active")
    mobileMenu.classList.toggle("active")

    const icon = mobileMenuBtn.querySelector("i")
    if (!isActive) {
      icon.className = "fas fa-times"
      mobileMenuBtn.setAttribute("aria-expanded", "true")
      document.body.style.overflow = "hidden"
    } else {
      icon.className = "fas fa-bars"
      mobileMenuBtn.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    }
  })

  mobileMenuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active")
      mobileMenuBtn.querySelector("i").className = "fas fa-bars"
      mobileMenuBtn.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    })
  })

  mobileMenu.addEventListener("click", (e) => {
    if (e.target === mobileMenu) {
      mobileMenu.classList.remove("active")
      mobileMenuBtn.querySelector("i").className = "fas fa-bars"
      mobileMenuBtn.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
    }
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenu.classList.contains("active")) {
      mobileMenu.classList.remove("active")
      mobileMenuBtn.querySelector("i").className = "fas fa-bars"
      mobileMenuBtn.setAttribute("aria-expanded", "false")
      document.body.style.overflow = ""
      mobileMenuBtn.focus()
    }
  })
}

// Hero Animation (Floating Bubbles Theme)
function initHeroAnimation() {
  const canvas = document.getElementById("heroCanvas")
  if (!canvas) return

  const ctx = canvas.getContext("2d")
  let particles = []
  let animationId

  function setCanvasDimensions() {
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
  }

  setCanvasDimensions()
  window.addEventListener("resize", setCanvasDimensions)

  class Particle {
    constructor() {
      this.reset()
    }

    reset() {
      this.x = Math.random() * canvas.width
      this.y = canvas.height + Math.random() * canvas.height
      this.size = Math.random() * 10 + 5
      this.speedY = Math.random() * -1.5 - 0.5
      this.opacity = Math.random() * 0.5 + 0.3
      this.color = `rgba(245, 40, 145, 0.8), ${this.opacity})`   // color for random circle
    }

    update() {
      this.y += this.speedY
      if (this.y + this.size < 0) this.reset()
    }

    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.fill()
    }
  }

  function initParticles() {
    particles = []
    const particleCount = Math.min(40, Math.floor((canvas.width * canvas.height) / 15000))
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle())
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach((particle) => {
      particle.update()
      particle.draw()
    })
    animationId = requestAnimationFrame(animate)
  }

  initParticles()
  animate()

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId)
    } else {
      animate()
    }
  })
}

// Scroll Animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")
      }
    })
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" })

  document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right, .scale-in, .skill-card, .project-card, .timeline-content").forEach((el) => observer.observe(el))
}

// Skill Bars Animation
function initSkillBars() {
  const skillCards = document.querySelectorAll(".skill-card")
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const skill = entry.target
        const level = skill.getAttribute("data-skill")
        skill.querySelector(".skill-progress").style.setProperty("--skill-width", level + "%")
        skill.classList.add("animate")
      }
    })
  }, { threshold: 0.5 })

  skillCards.forEach((card) => observer.observe(card))
}

// Smooth Scrolling
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const target = document.querySelector(link.getAttribute("href"))
      if (target) {
        window.scrollTo({ top: target.offsetTop - 100, behavior: "smooth" })
      }
    })
  })
}

// Accessibility
function initAccessibility() {
  const btn = document.querySelector(".mobile-menu-btn")
  if (btn) {
    btn.setAttribute("aria-label", "Toggle mobile menu")
    btn.setAttribute("aria-expanded", "false")
  }
  const menu = document.querySelector(".mobile-menu")
  const links = document.querySelectorAll(".mobile-menu-content a, .mobile-menu-content button")

  if (menu && links.length > 0) {
    new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class" && menu.classList.contains("active")) {
          links[0].focus()
        }
      })
    }).observe(menu, { attributes: true })

    links.forEach((link, index) => {
      link.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey && index === 0) {
            e.preventDefault()
            links[links.length - 1].focus()
          } else if (!e.shiftKey && index === links.length - 1) {
            e.preventDefault()
            links[0].focus()
          }
        }
      })
    })
  }

  const skipLink = document.createElement("a")
  skipLink.href = "#main"
  skipLink.textContent = "Skip to main content"
  Object.assign(skipLink.style, {
    position: "absolute", top: "10px", left: "10px", zIndex: "10000",
    background: "white", color: "black", padding: "8px 16px",
    textDecoration: "none", borderRadius: "4px"
  })
  document.body.insertBefore(skipLink, document.body.firstChild)

  const main = document.querySelector(".hero")
  if (main) {
    main.setAttribute("id", "main")
    main.setAttribute("role", "main")
  }
}

// Utility
function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const debouncedResize = debounce(() => {
  window.dispatchEvent(new Event("resize"))
}, 250)
window.addEventListener("resize", debouncedResize)

function preloadImages() {
  ["/placeholder.svg?height=600&width=600", "/placeholder.svg?height=400&width=600"].forEach((src) => {
    const img = new Image()
    img.src = src
  })
}
preloadImages()

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((reg) => console.log("SW registered:", reg))
      .catch((err) => console.log("SW registration failed:", err))
  })
}

window.addEventListener("error", (e) => {
  console.error("Global error:", e.error)
})

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason)
})
