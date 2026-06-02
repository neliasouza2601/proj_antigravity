document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  lucide.createIcons();

  // Set Current Year in Footer
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // --- MOBILE TOGGLE MENU ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
      }
    });

    // Close menu when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // --- ACCENT COLOR THEME SWITCHER ---
  const themeDots = document.querySelectorAll('.theme-dot');
  themeDots.forEach(dot => {
    dot.addEventListener('click', () => {
      // Remove active from all dots
      themeDots.forEach(d => d.classList.remove('active'));
      // Add active to clicked dot
      dot.classList.add('active');
      
      // Get theme name
      const targetTheme = dot.getAttribute('data-theme');
      
      // Remove other theme classes from body
      document.body.className = '';
      document.body.classList.add(`theme-${targetTheme}`);
    });
  });

  // --- SCROLL ACTIVE LINK OBSERVER ---
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // --- INTERACTIVE HERO DASHBOARD SIMULATION ---
  const visitorCountEl = document.getElementById('visitorCount');
  const perfStatEl = document.getElementById('perfStat');
  
  if (visitorCountEl && perfStatEl) {
    let count = 1240;
    
    // Simulate minor traffic fluctuations
    setInterval(() => {
      const change = Math.floor(Math.random() * 7) - 3; // -3 to +3
      count += change;
      
      // Format number with dots
      visitorCountEl.textContent = count.toLocaleString('pt-BR');

      // Random performance fluctuate between 98 and 100
      const perfVal = 98 + Math.floor(Math.random() * 3);
      perfStatEl.textContent = `${perfVal}%`;
      const fillBar = document.querySelector('.progress-fill');
      if (fillBar) {
        fillBar.style.width = `${perfVal}%`;
      }
    }, 4000);
  }

  // --- CONTACT FORM VALIDATION & INTERACTIVES ---
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear errors
      const groups = contactForm.querySelectorAll('.form-group');
      groups.forEach(g => g.classList.remove('invalid'));
      formStatus.className = 'form-status';
      formStatus.textContent = '';
      
      // Validate
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const messageInput = document.getElementById('message');
      let isValid = true;

      if (!nameInput.value.trim()) {
        document.getElementById('nameError').parentElement.classList.add('invalid');
        isValid = false;
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        document.getElementById('emailError').parentElement.classList.add('invalid');
        isValid = false;
      }

      if (!messageInput.value.trim()) {
        document.getElementById('messageError').parentElement.classList.add('invalid');
        isValid = false;
      }

      if (isValid) {
        // Send state
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Enviando...</span> <i data-lucide="loader" class="animate-spin"></i>`;
        lucide.createIcons();

        // Simulate API call
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
          lucide.createIcons();

          // Clear inputs
          contactForm.reset();

          // Show success message
          formStatus.classList.add('success');
          formStatus.textContent = 'Mensagem enviada com sucesso! Obrigado pelo contato.';
          
          // Clear status after 5s
          setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
          }, 5000);
        }, 1800);
      }
    });
  }

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  }
});
