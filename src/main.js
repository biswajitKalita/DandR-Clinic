import './style.css';

// Nav scroll effect
const nav = document.getElementById('mainNav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      mobileMenu.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
    }
  });
}

const closeMenu = () => {
  if (mobileMenu && hamburger) {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }
};

if (mobileClose) {
  mobileClose.addEventListener('click', closeMenu);
}

mobileLinks.forEach(l => l.addEventListener('click', closeMenu));

// FAQ accordion toggles
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    if (!item) return;
    const isOpen = item.classList.contains('open');
    
    // Close other FAQ items
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      const q = i.querySelector('.faq-question');
      if (q) q.setAttribute('aria-expanded', 'false');
    });
    
    // Toggle clicked item
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// Scroll reveal animations
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  
  revealEls.forEach(el => observer.observe(el));
}

// Contact form mock submission
const form = document.querySelector('.contact-form');
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
if (submitBtn) {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;
    setTimeout(() => {
      submitBtn.textContent = '✓ Request Received';
      submitBtn.style.background = 'var(--success)';
    }, 1200);
  });
}

// Respect reduced motion settings
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.transition = 'none';
  });
}

// ── SERVICES MODAL LOGIC ──
const servicesData = {
  services: [
    "Dental & Oral X-ray",
    "Oral cleaning",
    "Braces Removal",
    "Laser Dentistry",
    "Alignment",
    "Routine Examination",
    "Computerized Check-Up",
    "Gum care",
    "Advanced Preventive Dental Care",
    "Regular Clean Up",
    "Composite(Laser) Filing",
    "Patient Counselling",
    "Blood Pressure Check-Up",
    "Preventive Health Checkup"
  ],
  treatment: [
    "Post & Core Crown",
    "Straightening Teeth",
    "RCT (Root Canal)",
    "Dental Implant Fixing",
    "Tooth Reshaping"
  ],
  surgery: [
    "Oral And Maxillofacial",
    "Surgical Tooth Extraction"
  ],
  procedures: [
    "Fixed Prosthodontics",
    "Impacted Tooth Extraction",
    "Composite Bondings"
  ]
};

function renderServices(searchQuery = '') {
  const query = searchQuery.toLowerCase().trim();
  const categories = Object.keys(servicesData);
  
  categories.forEach(category => {
    const grid = document.getElementById(`grid-${category}`);
    const tab = document.getElementById(`tab-${category}`);
    if (!grid) return;
    
    const items = servicesData[category];
    const filtered = items.filter(item => item.toLowerCase().includes(query));
    
    // Update count in tab
    if (tab) {
      const displayName = category.charAt(0).toUpperCase() + category.slice(1);
      tab.textContent = `${displayName} (${filtered.length})`;
      
      // Hide tab if no search matches
      tab.style.display = (filtered.length === 0 && query !== '') ? 'none' : '';
    }
    
    // Hide section if no search matches
    const section = document.getElementById(`sec-${category}`);
    if (section) {
      section.style.display = (filtered.length === 0 && query !== '') ? 'none' : '';
    }
    
    // Render list
    grid.innerHTML = filtered.map(item => {
      let displayText = item;
      if (query !== '') {
        const index = item.toLowerCase().indexOf(query);
        if (index >= 0) {
          const matchText = item.substring(index, index + query.length);
          displayText = item.replace(new RegExp(escapeRegExp(matchText), 'i'), `<span class="highlight">${matchText}</span>`);
        }
      }
      return `
        <div class="service-item">
          <svg viewBox="0 0 24 24" class="check-icon" fill="none" stroke-width="2.5" stroke="currentColor" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>${displayText}</span>
        </div>
      `;
    }).join('');
  });
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Modal Toggle and Navigation Handlers
const modal = document.getElementById('servicesModal');
const closeBtn = document.getElementById('closeServicesModal');
const openBtns = [];

// Intercept all links targeting #services (excluding mobile close / simple scroll links if they should open modal)
document.querySelectorAll('a[href="#services"]').forEach(link => {
  openBtns.push(link);
});

// View all services CTA button
const viewAllBtn = document.getElementById('viewAllServicesBtn');
if (viewAllBtn) {
  openBtns.push(viewAllBtn);
}

// Select home page service cards to trigger modal opening with focused category
document.querySelectorAll('.service-card').forEach((card, index) => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
    
    // Focus appropriate category based on the clicked card index
    let category = 'sec-services';
    if (index === 1 || index === 2) {
      category = 'sec-treatment';
    } else if (index === 4 || index === 5) {
      category = 'sec-procedures';
    }
    
    const tab = document.querySelector(`.category-tab[data-target="${category}"]`);
    if (tab) tab.click();
  });
});

function openModal() {
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Disable background scrolling
    const searchVal = document.getElementById('modalSearchInput') ? document.getElementById('modalSearchInput').value : '';
    renderServices(searchVal);
  }
}

function closeModal() {
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore background scrolling
    const searchInput = document.getElementById('modalSearchInput');
    if (searchInput) {
      searchInput.value = '';
    }
    renderServices('');
  }
}

openBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  });
});

if (closeBtn) {
  closeBtn.addEventListener('click', closeModal);
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

// Tabs switching scroll handler
document.querySelectorAll('.category-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    const targetId = tab.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);
    const panel = document.getElementById('modalItemsPanel');
    if (targetSection && panel) {
      panel.scrollTop = targetSection.offsetTop - panel.offsetTop;
    }
  });
});

// Scroll synchronizer (updates active sidebar tab based on which section is visible)
const panel = document.getElementById('modalItemsPanel');
if (panel) {
  panel.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.modal-items-section');
    let currentSectionId = '';
    
    sections.forEach(sec => {
      if (sec.style.display === 'none') return;
      const rect = sec.getBoundingClientRect();
      const panelRect = panel.getBoundingClientRect();
      if (rect.top - panelRect.top <= 40) {
        currentSectionId = sec.id;
      }
    });
    
    if (currentSectionId) {
      document.querySelectorAll('.category-tab').forEach(tab => {
        const isCurrent = tab.getAttribute('data-target') === currentSectionId;
        tab.classList.toggle('active', isCurrent);
      });
    }
  });
}

// Search input listener
const searchInput = document.getElementById('modalSearchInput');
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    renderServices(e.target.value);
  });
}

// Initialize rendering on window load
window.addEventListener('DOMContentLoaded', () => {
  renderServices();
});

// ── WHATSAPP CHAT WIDGET LOGIC ──
const whatsappTriggerBtn = document.getElementById('whatsappTriggerBtn');
const whatsappChatCard = document.getElementById('whatsappChatCard');
const closeWhatsappChat = document.getElementById('closeWhatsappChat');
const chatTimeEl = document.getElementById('chatTime');

if (whatsappTriggerBtn && whatsappChatCard) {
  whatsappTriggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    whatsappChatCard.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!whatsappChatCard.contains(e.target) && e.target !== whatsappTriggerBtn) {
      whatsappChatCard.classList.remove('open');
    }
  });

  if (closeWhatsappChat) {
    closeWhatsappChat.addEventListener('click', (e) => {
      e.stopPropagation();
      whatsappChatCard.classList.remove('open');
    });
  }
}

// Dynamically set time in WhatsApp chat bubble
if (chatTimeEl) {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  chatTimeEl.textContent = `${hours}:${minutes} ${ampm}`;
}

// ── INTERACTIVE BOOKING SCHEDULER LOGIC ──
const doctorData = {
  pathak: {
    name: "Dr. Jayashree Pathak",
    title: "Dental Surgeon & Founder",
    exp: "13+ Years Exp",
    img: "/src/assets/images/doctor-jayashree.png"
  },
  himanta: {
    name: "Dr. Himanta Pathak",
    title: "Oral Surgery & Implantology",
    exp: "18 Years Exp",
    img: "/src/assets/images/doctor-marcus.png"
  },
  rupjyoti: {
    name: "Dr. Rupjyoti Kalita",
    title: "Orthodontics & Pediatric",
    exp: "11 Years Exp",
    img: "/src/assets/images/doctor-priya.png"
  }
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let calendarDate = new Date();
let selectedDate = null;
let selectedTime = null;

const calendarMonthYear = document.getElementById('calendarMonthYear');
const calendarDays = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');

function initCalendar() {
  if (!calendarDays) return;
  renderCalendar();
  
  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      calendarDate.setMonth(calendarDate.getMonth() - 1);
      renderCalendar();
    });
  }
  
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      calendarDate.setMonth(calendarDate.getMonth() + 1);
      renderCalendar();
    });
  }
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  
  if (calendarMonthYear) {
    calendarMonthYear.textContent = `${monthNames[month]} ${year}`;
  }
  
  calendarDays.innerHTML = '';
  
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevLastDay = new Date(year, month, 0).getDate();
  
  // Previous month filler days
  for (let i = firstDayIndex; i > 0; i--) {
    const dayBtn = document.createElement('button');
    dayBtn.type = 'button';
    dayBtn.className = 'calendar-day disabled';
    dayBtn.textContent = prevLastDay - i + 1;
    calendarDays.appendChild(dayBtn);
  }
  
  // Current month days
  const today = new Date();
  for (let day = 1; day <= totalDays; day++) {
    const dayBtn = document.createElement('button');
    dayBtn.type = 'button';
    dayBtn.className = 'calendar-day';
    dayBtn.textContent = day;
    
    const dateObj = new Date(year, month, day);
    const todayCompare = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    if (dateObj < todayCompare) {
      dayBtn.classList.add('disabled');
    }
    
    if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
      dayBtn.classList.add('today');
    }
    
    if (selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
      dayBtn.classList.add('selected');
    }
    
    dayBtn.addEventListener('click', () => {
      document.querySelectorAll('.calendar-day.selected').forEach(el => el.classList.remove('selected'));
      dayBtn.classList.add('selected');
      selectedDate = dateObj;
      const dateValInput = document.getElementById('selectedDateVal');
      if (dateValInput) dateValInput.value = dateObj.toDateString();
      updateBookingSummary();
      
      // Auto-advance to time selection step on mobile
      if (window.innerWidth <= 768 && typeof updateBookingStepperCurrentStep === 'function') {
        setTimeout(() => {
          updateBookingStepperCurrentStep(2);
        }, 250);
      }
    });
    
    calendarDays.appendChild(dayBtn);
  }
}

// Time Slots Selection
const slotBtns = document.querySelectorAll('.slot-btn');
slotBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.slot-btn.active').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    selectedTime = btn.getAttribute('data-time');
    const timeValInput = document.getElementById('selectedTimeVal');
    if (timeValInput) timeValInput.value = selectedTime;
    updateBookingSummary();
    
    // Auto-scroll to confirm form on mobile devices (so patient information form is visible)
    const bookingConfirmForm = document.getElementById('bookingConfirmForm');
    if (bookingConfirmForm) {
      bookingConfirmForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});

// Doctor Selector Switcher
const doctorSelect = document.getElementById('bookingDoctor');
if (doctorSelect) {
  doctorSelect.addEventListener('change', (e) => {
    const docKey = e.target.value;
    const doc = doctorData[docKey];
    if (doc) {
      const nameEl = document.getElementById('bookingDoctorName');
      const titleEl = document.getElementById('bookingDoctorTitle');
      const expEl = document.getElementById('bookingDoctorExp');
      const imgEl = document.getElementById('bookingDoctorImg');
      
      if (nameEl) nameEl.textContent = doc.name;
      if (titleEl) titleEl.textContent = doc.title;
      if (expEl) expEl.textContent = doc.exp;
      if (imgEl) imgEl.src = doc.img;
      updateBookingSummary();
    }
  });
}

function updateBookingSummary() {
  const summaryBanner = document.getElementById('bookingSummaryBanner');
  const confirmBtn = document.getElementById('confirmBookingBtn');
  if (!summaryBanner) return;
  
  if (selectedDate && selectedTime) {
    const docSelect = document.getElementById('bookingDoctor');
    const doctorName = docSelect ? docSelect.options[docSelect.selectedIndex].text : "Dentist";
    const formattedDate = selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    summaryBanner.className = "booking-summary-banner valid";
    summaryBanner.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
      <span>Selected: ${doctorName} on ${formattedDate} at ${selectedTime}.</span>
    `;
    if (confirmBtn) confirmBtn.removeAttribute('disabled');
  } else {
    summaryBanner.className = "booking-summary-banner";
    summaryBanner.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      <span>Please select date &amp; time slot.</span>
    `;
    if (confirmBtn) confirmBtn.setAttribute('disabled', 'true');
  }
}

// Form Submission Success overlay
const bookingConfirmForm = document.getElementById('bookingConfirmForm');
if (bookingConfirmForm) {
  bookingConfirmForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const confirmBtn = document.getElementById('confirmBookingBtn');
    if (confirmBtn) {
      confirmBtn.textContent = 'Booking...';
      confirmBtn.disabled = true;
    }
    
    setTimeout(() => {
      const widget = document.getElementById('bookingWidget');
      const patientNameVal = document.getElementById('patientName') ? document.getElementById('patientName').value : "Patient";
      const docSelect = document.getElementById('bookingDoctor');
      const doctorName = docSelect ? docSelect.options[docSelect.selectedIndex].text : "Dentist";
      const dateString = selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "";
      
      if (widget) {
        widget.innerHTML = `
          <div class="booking-success-message" style="width: 100%; text-align: center; padding: 48px; background: var(--white); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
            <div class="success-icon-wrap" style="width: 64px; height: 64px; border-radius: 50%; background: #E8F5E9; color: #2E7D32; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:32px; height:32px;"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style="font-family: 'Manrope', sans-serif; font-size: 1.4rem; font-weight: 700; color: var(--navy); margin: 0;">Appointment Confirmed!</h3>
            <p style="font-size: 0.9rem; color: var(--muted); max-width: 420px; line-height: 1.6; margin: 0;">
              Thank you, <strong>${patientNameVal}</strong>. Your clinic visit with <strong>${doctorName}</strong> has been successfully booked for <strong>${dateString}</strong> at <strong>${selectedTime}</strong>.
            </p>
            <p style="font-size: 0.78rem; color: var(--muted); margin: 0;">A confirmation message has been scheduled. Please present this screen at reception.</p>
            <button type="button" class="btn-primary btn-teal" onclick="window.location.reload()" style="margin-top: 16px; padding: 10px 24px;">Book Another Appointment</button>
          </div>
        `;
      }
    }, 1200);
  });
}

// Initialize mobile carousels scroll indicators
function initMobileCarousels() {
  const grids = document.querySelectorAll('.services-grid, .doctors-grid, .testimonials-grid, .tech-grid');
  grids.forEach(grid => {
    // Create dots container
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    
    // Get all children that are cards
    const cards = grid.children;
    const count = cards.length;
    
    if (count <= 1) return; // No dots needed if 1 or 0 items
    
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'button');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseInt(window.getComputedStyle(grid).gap) || 0;
        grid.scrollTo({
          left: i * (cardWidth + gap),
          behavior: 'smooth'
        });
      });
      dotsContainer.appendChild(dot);
    }
    
    grid.parentNode.insertBefore(dotsContainer, grid.nextSibling);
    
    // Track scroll to update active dot
    grid.addEventListener('scroll', () => {
      const cardWidth = cards[0].offsetWidth;
      const gap = parseInt(window.getComputedStyle(grid).gap) || 0;
      const scrollLeft = grid.scrollLeft;
      const index = Math.min(count - 1, Math.max(0, Math.round(scrollLeft / (cardWidth + gap))));
      
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        if (idx === index) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }, { passive: true });
  });
}

// Let stepper function pointer be global/file-scoped so calendar click listener can access it
let updateBookingStepperCurrentStep = null;

// Initialize mobile multi-step booking stepper
function initBookingStepper() {
  const widget = document.getElementById('bookingWidget');
  if (!widget) return;
  
  const cols = widget.querySelectorAll('.booking-col');
  if (cols.length < 3) return;
  
  const nextBtns = widget.querySelectorAll('.next-step-btn');
  const prevBtns = widget.querySelectorAll('.prev-step-btn');
  const progressSteps = widget.querySelectorAll('.progress-step');
  const progressLines = widget.querySelectorAll('.progress-line');
  
  let currentStep = 0; // 0: Doctor, 1: Date, 2: Slots & Confirm
  
  function updateSteps(targetStep, shouldScroll = true) {
    if (window.innerWidth > 768) {
      cols.forEach(col => col.classList.remove('active'));
      return;
    }
    
    currentStep = targetStep;
    
    cols.forEach((col, idx) => {
      if (idx === currentStep) {
        col.classList.add('active');
      } else {
        col.classList.remove('active');
      }
    });
    
    // Update progress steps
    progressSteps.forEach((step, idx) => {
      if (idx < currentStep) {
        step.className = 'progress-step completed';
      } else if (idx === currentStep) {
        step.className = 'progress-step active';
      } else {
        step.className = 'progress-step';
      }
    });
    
    // Update progress lines
    progressLines.forEach((line, idx) => {
      if (idx < currentStep) {
        line.className = 'progress-line active';
      } else {
        line.className = 'progress-line';
      }
    });
    
    // Scroll to booking section smoothly only if requested
    if (shouldScroll) {
      const bookingSection = document.getElementById('contact');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }
  
  updateBookingStepperCurrentStep = updateSteps;
  
  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (currentStep < 2) {
        updateSteps(currentStep + 1, true);
      }
    });
  });
  
  prevBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        updateSteps(currentStep - 1, true);
      }
    });
  });
  
  // Set initial state (do not scroll on page load)
  if (window.innerWidth <= 768) {
    updateSteps(0, false);
  }
  
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      cols.forEach(col => col.classList.remove('active'));
    } else {
      // Do not scroll on window resize
      updateSteps(currentStep, false);
    }
  });
}

// Add initCalendar to DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  initCalendar();
  initMobileCarousels();
  initBookingStepper();
});



