// Theme Toggle Functionality
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(theme) {
    if (theme === 'light') {
        body.classList.add('light-theme');
        toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

toggleBtn.addEventListener('click', () => {
    const newTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
    setTheme(newTheme);
});

// Animate skill bars when they scroll into view
const skillBars = document.querySelectorAll('.progress');

const animateSkills = () => {
  skillBars.forEach(bar => {
    const rect = bar.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom >= 0;
    if (inView && !bar.classList.contains('animated')) {
      bar.style.width = bar.dataset.width;
      bar.classList.add('animated'); 
    }
  });
};

window.addEventListener('scroll', animateSkills);
window.addEventListener('load', animateSkills);


// Section scroll animation & Nav highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');
const navBar = document.querySelector('nav');

window.addEventListener('scroll', () => {
  let current = '';
  const navHeightOffset = navBar.offsetHeight + 10; 

  sections.forEach(sec => {
    const top = sec.offsetTop;
    if (window.scrollY >= top - navHeightOffset) {
         current = sec.getAttribute('id'); 
    }
  });

  navLinks.forEach(a => {
    a.classList.remove('active');
    a.removeAttribute('aria-current');
    if (a.getAttribute('href').includes(current)) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
});

// Intersection Observer for Section Entrance Animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.2 });
sections.forEach(sec => observer.observe(sec));

// Modal open/close with animation - UPDATED for A11y
function openModal(id) {
  const modal = document.getElementById(id);
  const nav = document.querySelector('nav');
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
  nav.classList.add('hide');
  body.setAttribute('aria-hidden', 'true');
  modal.querySelector('.modal-content').focus();
}

// Modal close with animation - UPDATED for A11y
function closeModal(id) {
  const modal = document.getElementById(id);
  const nav = document.querySelector('nav');
  modal.classList.remove('show');
  modal.classList.add('closing');
  
  setTimeout(() => {
    modal.classList.remove('closing');
    modal.style.display = 'none';
    nav.classList.remove('hide');
    body.removeAttribute('aria-hidden');
  }, 350);
}

// Close modal if clicked outside - UPDATED for A11y
window.onclick = e => {
  if (e.target.classList.contains('modal')) {
    const nav = document.querySelector('nav');
    e.target.classList.remove('show');
    e.target.classList.add('closing');
    setTimeout(() => {
      e.target.classList.remove('closing');
      e.target.style.display = 'none';
      nav.classList.remove('hide');
      body.removeAttribute('aria-hidden');
    }, 350);
  }
};

// ===== MOBILE NAVIGATION TOGGLE (UX/A11y) =====
const menuToggle = document.getElementById('menu-toggle');
const navLinksList = document.getElementById('nav-links-list');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isExpanded = navBar.classList.toggle('nav-open');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });

    // Close mobile menu when a link is clicked
    navLinksList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navBar.classList.contains('nav-open')) {
                navBar.classList.remove('nav-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// ===== SMOOTH SCROLL ANIMATION (using sticky offset) =====
const navLinksSmooth = document.querySelectorAll('nav a');
const stickyNav = document.querySelector('nav');

navLinksSmooth.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    const navHeightOffset = stickyNav.offsetHeight; 

    if (targetSection) {
      const targetPosition = targetSection.offsetTop - navHeightOffset + 10;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ===== SCROLL PROGRESS BAR & BACK TO TOP LOGIC =====
const progressBar = document.getElementById('scroll-progress');
const backToTopBtn = document.getElementById('back-to-top');

function updateScrollElements() {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = window.scrollY;
    
    // 1. Update Progress Bar
    const progress = (scrolled / totalHeight) * 100;
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }

    // 2. Back to Top Button visibility
    if (backToTopBtn) {
        if (scrolled > window.innerHeight / 2) { 
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    }
}

window.addEventListener('scroll', updateScrollElements);
window.addEventListener('load', updateScrollElements);

// 3. Back to Top Button Click Handler
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== PROJECT SLIDER MANUAL SCROLL LOGIC =====
const projectSlider = document.getElementById('project-slider');
const sliderTrack = document.getElementById('slider-track');
const slideLeftBtn = document.getElementById('slide-left');
const slideRightBtn = document.getElementById('slide-right');

const CARD_WIDTH = 400; // Estimated card width + gap (approx 400px, adjust if necessary)
const SCROLL_DISTANCE = 430; // Amount to scroll per click (e.g., one card width + gap)
let scrollTimeout;

if (projectSlider && sliderTrack && slideLeftBtn && slideRightBtn) {
    
    // Function to stop the CSS animation and start manual control
    const startManualScroll = () => {
        sliderTrack.classList.add('no-animation');
        clearTimeout(scrollTimeout);
    };

    // Function to check if the user is idle and resume the CSS animation
    const resumeInfiniteScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            sliderTrack.classList.remove('no-animation');
        }, 3000); // Resume after 3 seconds of inactivity
    };

    const scrollProjects = (direction) => {
        startManualScroll();

        // Calculate the new scroll position
        let newScrollLeft = projectSlider.scrollLeft + (direction * SCROLL_DISTANCE);

        // Calculate the maximum scroll (to handle the duplicated content for the 'infinite' effect)
        const trackWidth = sliderTrack.scrollWidth / 2;
        const visibleWidth = projectSlider.clientWidth;
        
        // This logic simulates the infinite loop:
        // 1. If scrolling past the start (or before 0), snap to the middle clone.
        if (direction < 0 && newScrollLeft < 0) {
            // Find the position where the original content starts
            const jumpPosition = trackWidth - visibleWidth;
            // Immediate snap to the start of the original (middle) content
            projectSlider.scrollLeft = jumpPosition; 
            // Calculate the actual target scroll position from there
            newScrollLeft = projectSlider.scrollLeft + (direction * SCROLL_DISTANCE);
        }
        // 2. If scrolling past the end (of the original content), snap to the start clone.
        if (direction > 0 && newScrollLeft >= trackWidth) {
            // Immediate snap back to the start of the cloned content (scroll position 0)
            projectSlider.scrollLeft = 0;
            // Calculate the actual target scroll position from there
            newScrollLeft = projectSlider.scrollLeft + (direction * SCROLL_DISTANCE);
        }
        
        // Perform the smooth scroll
        projectSlider.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });

        resumeInfiniteScroll();
    };

    // Attach event listeners to buttons
    slideLeftBtn.addEventListener('click', () => scrollProjects(-1)); // Scroll left
    slideRightBtn.addEventListener('click', () => scrollProjects(1));  // Scroll right
    
    // Initial setup: Center the slider to show the middle section (original cards)
    window.addEventListener('load', () => {
        const trackWidth = sliderTrack.scrollWidth / 2;
        const visibleWidth = projectSlider.clientWidth;
        // Start scroll position roughly in the middle, adjusted for one card width for a better starting view
        projectSlider.scrollLeft = trackWidth - (visibleWidth / 2) - CARD_WIDTH; 
    });
}
