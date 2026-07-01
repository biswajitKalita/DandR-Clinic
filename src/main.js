import './style.css';

// ── DATABASE INITIALIZATION (LOCAL STORAGE) ──
const DEFAULT_DOCTORS = [
  {
    id: "pathak",
    name: "Dr. Jayashree Pathak",
    title: "Dental Surgeon & Founder",
    exp: "13+ Years Exp",
    languages: "EN · AS · HI",
    img: "/src/assets/images/doctor-jayashree.png",
    fee: "₹ 500",
    isPresent: true
  },
  {
    id: "himanta",
    name: "Dr. Himanta Pathak",
    title: "Oral Surgery & Implantology",
    exp: "18 Years Exp",
    languages: "EN · ES",
    img: "/src/assets/images/doctor-marcus.png",
    fee: "₹ 500",
    isPresent: true
  },
  {
    id: "rupjyoti",
    name: "Dr. Rupjyoti Kalita",
    title: "Orthodontics & Pediatric",
    exp: "11 Years Exp",
    languages: "EN · HI",
    img: "/src/assets/images/doctor-priya.png",
    fee: "₹ 500",
    isPresent: true
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: "book-1",
    token: "DR-101",
    patientName: "Arunav Baruah",
    patientPhone: "+91 98640 12345",
    doctorKey: "pathak",
    doctorName: "Dr. Jayashree Pathak",
    date: new Date().toDateString(),
    time: "09:30 AM",
    type: "online",
    paymentStatus: "completed",
    status: "completed",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  },
  {
    id: "book-2",
    token: "DR-102",
    patientName: "Meenakshi Das",
    patientPhone: "+91 87654 32109",
    doctorKey: "himanta",
    doctorName: "Dr. Himanta Pathak",
    date: new Date().toDateString(),
    time: "11:00 AM",
    type: "offline",
    paymentStatus: "completed",
    status: "checked-in",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    id: "book-3",
    token: "DR-103",
    patientName: "Rahul Sharma",
    patientPhone: "+91 99540 67890",
    doctorKey: "rupjyoti",
    doctorName: "Dr. Rupjyoti Kalita",
    date: new Date().toDateString(),
    time: "04:30 PM",
    type: "online",
    paymentStatus: "pending",
    status: "pending",
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_CLINIC_DETAILS = {
  name: "D&R Oral & Dental Care",
  phone: "08147932737",
  address: "Room No - 07, Srimanta Sangha Marketing Complex, Haladhar Bhuyan Path, Near Nagaon DC Court, Old AT Road, Nagaon Morigaon Road, Nagaon, Assam - 782001",
  hours: "Mon–Sat: 9:15 am – 7:00 pm",
  heroSubtitle: "At D&R Clinic, every treatment plan begins with listening. We combine clinical expertise with modern technology to deliver care that's thorough, comfortable, and built to last.",
  footerAbout: "Comprehensive, technology-driven dental care in a calm, modern environment. Serving Nagaon since 2013."
};

const DEFAULT_CLINIC_PHOTOS = [
  {
    id: "photo-1",
    url: "/src/assets/images/hero-clinic.png",
    caption: "Our Modern Lobby Reception",
    category: "Interior"
  },
  {
    id: "photo-2",
    url: "/src/assets/images/why-choose-us.png",
    caption: "Advanced Diagnostic Suite",
    category: "Equipment"
  }
];

if (!localStorage.getItem('dr_dental_doctors')) {
  localStorage.setItem('dr_dental_doctors', JSON.stringify(DEFAULT_DOCTORS));
}
if (!localStorage.getItem('dr_dental_bookings')) {
  localStorage.setItem('dr_dental_bookings', JSON.stringify(DEFAULT_BOOKINGS));
}
if (!localStorage.getItem('dr_dental_next_number')) {
  localStorage.setItem('dr_dental_next_number', '104');
}
if (!localStorage.getItem('dr_dental_clinic_details')) {
  localStorage.setItem('dr_dental_clinic_details', JSON.stringify(DEFAULT_CLINIC_DETAILS));
}
if (!localStorage.getItem('dr_dental_clinic_photos')) {
  localStorage.setItem('dr_dental_clinic_photos', JSON.stringify(DEFAULT_CLINIC_PHOTOS));
}



// ── SPA HASH ROUTER ──
function checkRoute() {
  const hash = window.location.hash;
  const mainSite = document.getElementById('mainSiteContainer');
  const adminPanel = document.getElementById('adminPanelContainer');
  
  if (hash === '#admin') {
    const isAdminLoggedIn = localStorage.getItem('dr_dental_admin_logged_in') === 'true';
    if (isAdminLoggedIn) {
      if (mainSite) mainSite.style.display = 'none';
      if (adminPanel) adminPanel.style.display = 'block';
      if (typeof renderAdminDashboard === 'function') {
        renderAdminDashboard();
      }
    } else {
      const adminLoginModal = document.getElementById('adminLoginModal');
      if (adminLoginModal) {
        showAdminModal(adminLoginModal);
      }
    }
  } else {
    if (mainSite) mainSite.style.display = 'block';
    if (adminPanel) adminPanel.style.display = 'none';
    if (typeof populateBookingDoctors === 'function') {
      populateBookingDoctors();
    }
  }
}

function handleAdminLoginClose() {
  const isAdminLoggedIn = localStorage.getItem('dr_dental_admin_logged_in') === 'true';
  if (!isAdminLoggedIn && window.location.hash === '#admin') {
    window.location.hash = ''; // Return to landing page if cancelled
  }
}

window.addEventListener('hashchange', checkRoute);
window.addEventListener('DOMContentLoaded', checkRoute);

// Sync state across multiple tabs/windows in real time
window.addEventListener('storage', (e) => {
  if (e.key === 'dr_dental_bookings' || e.key === 'dr_dental_doctors' || e.key === 'dr_dental_next_number') {
    if (window.location.hash === '#admin') {
      renderAdminDashboard();
    } else if (typeof populateBookingDoctors === 'function') {
      populateBookingDoctors();
    }
  }
  if (e.key === 'dr_dental_clinic_details') {
    hydrateWebsiteContent();
    if (window.location.hash === '#admin') {
      renderAdminSettings();
    }
  }
  if (e.key === 'dr_dental_clinic_photos') {
    renderWebsiteClinicPhotos();
    if (window.location.hash === '#admin') {
      renderAdminPhotosCatalog();
    }
  }
});

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
    qualification: "BDS, MDS (Conservative Dentistry)",
    regNo: "Reg No: ASM-3482",
    exp: "13+ Years Exp",
    img: "/src/assets/images/doctor-jayashree.png"
  },
  himanta: {
    name: "Dr. Himanta Pathak",
    title: "Oral Surgery & Implantology",
    qualification: "BDS, MDS (Oral & Maxillofacial Surgery)",
    regNo: "Reg No: ASM-1974",
    exp: "18 Years Exp",
    img: "/src/assets/images/doctor-marcus.png"
  },
  rupjyoti: {
    name: "Dr. Rupjyoti Kalita",
    title: "Orthodontics & Pediatric",
    qualification: "BDS, MDS (Orthodontics & Dentofacial)",
    regNo: "Reg No: ASM-4122",
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
function populateBookingDoctors() {
  const select = document.getElementById('bookingDoctor');
  if (!select) return;
  
  const doctors = JSON.parse(localStorage.getItem('dr_dental_doctors') || '[]');
  
  select.innerHTML = doctors.map(doc => {
    const disabledAttr = doc.isPresent ? '' : ' disabled';
    const nameSuffix = doc.isPresent ? '' : ' (Absent Today)';
    return `<option value="${doc.id}" data-img="${doc.img}" data-title="${doc.title}" data-exp="${doc.exp}"${disabledAttr}>${doc.name}${nameSuffix}</option>`;
  }).join('');

  // Trigger change handler to update current visual card
  select.dispatchEvent(new Event('change'));
}

const doctorSelect = document.getElementById('bookingDoctor');
if (doctorSelect) {
  doctorSelect.addEventListener('change', (e) => {
    const docKey = e.target.value;
    const doctors = JSON.parse(localStorage.getItem('dr_dental_doctors') || '[]');
    const doc = doctors.find(d => d.id === docKey);
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
      const cleanDoctorName = doctorName.replace(' (Absent Today)', '');
      const dateString = selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "";
      
      // Save booking in local storage
      const nextNum = parseInt(localStorage.getItem('dr_dental_next_number') || '101');
      const token = `DR-${nextNum}`;
      localStorage.setItem('dr_dental_next_number', (nextNum + 1).toString());
      
      const newBooking = {
        id: 'book-' + Date.now(),
        token: token,
        patientName: patientNameVal,
        patientPhone: document.getElementById('patientPhone') ? document.getElementById('patientPhone').value : "",
        doctorKey: docSelect ? docSelect.value : "",
        doctorName: cleanDoctorName,
        date: selectedDate ? selectedDate.toDateString() : new Date().toDateString(),
        time: selectedTime || "09:00 AM",
        type: "online",
        paymentStatus: "pending",
        status: "pending",
        createdAt: new Date().toISOString()
      };
      
      const bookings = JSON.parse(localStorage.getItem('dr_dental_bookings') || '[]');
      bookings.push(newBooking);
      localStorage.setItem('dr_dental_bookings', JSON.stringify(bookings));

      if (widget) {
        widget.innerHTML = `
          <div class="booking-success-message" style="width: 100%; text-align: center; padding: 48px; background: var(--white); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;">
            <div class="success-icon-wrap" style="width: 64px; height: 64px; border-radius: 50%; background: #E8F5E9; color: #2E7D32; display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:32px; height:32px;"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style="font-family: 'Manrope', sans-serif; font-size: 1.4rem; font-weight: 700; color: var(--navy); margin: 0;">Appointment Confirmed!</h3>
            <div style="background: var(--teal-light); color: var(--navy); font-size: 1.25rem; font-weight: 700; padding: 8px 24px; border-radius: 8px; border: 1.5px dashed var(--teal); margin: 8px 0;">
              Token Number: ${token}
            </div>
            <p style="font-size: 0.9rem; color: var(--muted); max-width: 420px; line-height: 1.6; margin: 0;">
              Thank you, <strong>${patientNameVal}</strong>. Your clinic visit with <strong>${cleanDoctorName}</strong> has been successfully booked for <strong>${dateString}</strong> at <strong>${selectedTime}</strong>.
            </p>
            <p style="font-size: 0.78rem; color: var(--muted); margin: 0;">Please present your Token Number at the reception when you arrive.</p>
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

// Rebuild Carousel Dots dynamically for a specific grid element
function rebuildGridCarousel(gridId) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  // Remove existing dots container if any
  const existingDots = grid.nextElementSibling;
  if (existingDots && existingDots.classList.contains('carousel-dots')) {
    existingDots.remove();
  }

  const cards = grid.children;
  const count = cards.length;
  if (count <= 1) return; // No dots needed if 1 or 0 items

  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';

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
      dot.classList.toggle('active', idx === index);
    });
  }, { passive: true });
}
window.rebuildGridCarousel = rebuildGridCarousel;


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
  initGallery();
  initAdminPanel();
});

// ── SMILE GALLERY & ADMIN SYSTEM ──
const defaultCases = [
  {
    id: "case-1",
    title: "Orthodontic Realignment",
    description: "18 months of precision orthodontic treatment. Corrected severe crowding, aligned the bite, and restored facial symmetry.",
    category: "Orthodontics",
    before: "/src/assets/images/ortho-before.png",
    after: "/src/assets/images/ortho-after.png"
  },
  {
    id: "case-2",
    title: "Premium Veneers Restoration",
    description: "Cosmetic smile design using ultra-thin porcelain veneers. Corrected minor chipping, gaps, and restored natural brilliance.",
    category: "Cosmetic",
    before: "/src/assets/images/veneers-before.png",
    after: "/src/assets/images/veneers-after.png"
  },
  {
    id: "case-3",
    title: "Laser Teeth Whitening",
    description: "Single-session clinical grade laser teeth whitening. Lifted persistent staining by 6 shades while protecting tooth enamel sensitivity.",
    category: "Whitening",
    before: "/src/assets/images/whitening-before.png",
    after: "/src/assets/images/whitening-after.png"
  }
];

let galleryCases = [];
let activeFilter = 'all';

function initGallery() {
  // Load cases from LocalStorage or seed default cases
  const storedCases = localStorage.getItem('dr_dental_gallery_cases');
  if (storedCases) {
    galleryCases = JSON.parse(storedCases);
  } else {
    galleryCases = [...defaultCases];
    localStorage.setItem('dr_dental_gallery_cases', JSON.stringify(galleryCases));
  }

  // Render gallery Cases
  renderGallery();

  // Setup Admin Login Handlers
  const adminLoginLink = document.getElementById('adminLoginLink');
  const adminLoginModal = document.getElementById('adminLoginModal');
  const closeAdminLoginModal = document.getElementById('closeAdminLoginModal');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminPasscode = document.getElementById('adminPasscode');
  const adminLoginError = document.getElementById('adminLoginError');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');

  if (adminLoginLink && adminLoginModal) {
    adminLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (adminPasscode) adminPasscode.value = '';
      if (adminLoginError) adminLoginError.style.display = 'none';
      showAdminModal(adminLoginModal);
    });
  }

  if (closeAdminLoginModal && adminLoginModal) {
    closeAdminLoginModal.addEventListener('click', () => {
      hideAdminModal(adminLoginModal);
      handleAdminLoginClose();
    });
    adminLoginModal.addEventListener('click', (e) => {
      if (e.target === adminLoginModal) {
        hideAdminModal(adminLoginModal);
        handleAdminLoginClose();
      }
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (adminPasscode.value === 'admin123') {
        localStorage.setItem('dr_dental_admin_logged_in', 'true');
        hideAdminModal(adminLoginModal);
        checkRoute();
        renderGallery();
      } else {
        if (adminLoginError) adminLoginError.style.display = 'block';
      }
    });
  }

  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      localStorage.setItem('dr_dental_admin_logged_in', 'false');
      checkRoute();
      renderGallery();
    });
  }

  // Setup Add Case Form Handlers
  const addCaseBtn = document.getElementById('addCaseBtn');
  const caseEditorModal = document.getElementById('caseEditorModal');
  const closeCaseEditorModal = document.getElementById('closeCaseEditorModal');
  const cancelCaseEditBtn = document.getElementById('cancelCaseEditBtn');
  const caseEditorForm = document.getElementById('caseEditorForm');

  if (addCaseBtn && caseEditorModal) {
    addCaseBtn.addEventListener('click', () => {
      resetCaseEditorForm();
      const titleEl = document.getElementById('caseEditorTitle');
      if (titleEl) titleEl.textContent = 'Add Treatment Case';
      showAdminModal(caseEditorModal);
    });
  }

  if (closeCaseEditorModal && caseEditorModal) {
    closeCaseEditorModal.addEventListener('click', () => hideAdminModal(caseEditorModal));
  }
  if (cancelCaseEditBtn && caseEditorModal) {
    cancelCaseEditBtn.addEventListener('click', () => hideAdminModal(caseEditorModal));
  }
  if (caseEditorModal) {
    caseEditorModal.addEventListener('click', (e) => {
      if (e.target === caseEditorModal) hideAdminModal(caseEditorModal);
    });
  }

  // Setup Image File Inputs with Previews
  const beforeFileInput = document.getElementById('beforeFileInput');
  const beforePreviewContainer = document.getElementById('beforePreviewContainer');
  const beforeImgPreview = document.getElementById('beforeImgPreview');
  const beforePreviewPrompt = document.getElementById('beforePreviewPrompt');
  const beforeImgUrl = document.getElementById('beforeImgUrl');

  const afterFileInput = document.getElementById('afterFileInput');
  const afterPreviewContainer = document.getElementById('afterPreviewContainer');
  const afterImgPreview = document.getElementById('afterImgPreview');
  const afterPreviewPrompt = document.getElementById('afterPreviewPrompt');
  const afterImgUrl = document.getElementById('afterImgUrl');

  if (beforePreviewContainer && beforeFileInput) {
    beforePreviewContainer.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') beforeFileInput.click();
    });
    beforeFileInput.addEventListener('change', () => {
      handleFileUploader(beforeFileInput, beforeImgPreview, beforePreviewPrompt, beforeImgUrl);
    });
  }
  if (beforeImgUrl) {
    beforeImgUrl.addEventListener('input', () => {
      handleUrlPreview(beforeImgUrl, beforeImgPreview, beforePreviewPrompt, beforeFileInput);
    });
  }

  if (afterPreviewContainer && afterFileInput) {
    afterPreviewContainer.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') afterFileInput.click();
    });
    afterFileInput.addEventListener('change', () => {
      handleFileUploader(afterFileInput, afterImgPreview, afterPreviewPrompt, afterImgUrl);
    });
  }
  if (afterImgUrl) {
    afterImgUrl.addEventListener('input', () => {
      handleUrlPreview(afterImgUrl, afterImgPreview, afterPreviewPrompt, afterFileInput);
    });
  }

  // Case Form Submission (Create or Update)
  if (caseEditorForm) {
    caseEditorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      saveCaseStudy();
    });
  }

  // Filters Switcher
  const filterButtons = document.querySelectorAll('#galleryFilters .filter-btn');
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderGallery();
    });
  });

  // Dynamic Tab Switcher for Gallery Section
  const btnTransformations = document.getElementById('btnGalleryTransformations');
  const btnClinicTour = document.getElementById('btnGalleryClinicTour');
  const galleryFiltersWrapper = document.getElementById('galleryFiltersWrapper');
  const galleryGrid = document.getElementById('galleryGrid');
  const clinicTourContainer = document.getElementById('clinicTourContainer');

  if (btnTransformations && btnClinicTour) {
    btnTransformations.addEventListener('click', () => {
      // Toggle button active styles
      btnTransformations.classList.add('active');
      btnTransformations.style.background = 'var(--teal)';
      btnTransformations.style.color = 'var(--white)';
      btnTransformations.style.borderColor = 'var(--teal)';

      btnClinicTour.classList.remove('active');
      btnClinicTour.style.background = 'transparent';
      btnClinicTour.style.color = 'var(--text)';
      btnClinicTour.style.borderColor = 'var(--border)';

      // Toggle display
      if (galleryFiltersWrapper) galleryFiltersWrapper.style.display = 'block';
      if (galleryGrid) galleryGrid.style.display = '';
      if (clinicTourContainer) clinicTourContainer.style.display = 'none';

      renderGallery();
    });

    btnClinicTour.addEventListener('click', () => {
      // Toggle button active styles
      btnClinicTour.classList.add('active');
      btnClinicTour.style.background = 'var(--teal)';
      btnClinicTour.style.color = 'var(--white)';
      btnClinicTour.style.borderColor = 'var(--teal)';

      btnTransformations.classList.remove('active');
      btnTransformations.style.background = 'transparent';
      btnTransformations.style.color = 'var(--text)';
      btnTransformations.style.borderColor = 'var(--border)';

      // Toggle display
      if (galleryFiltersWrapper) galleryFiltersWrapper.style.display = 'none';
      if (galleryGrid) galleryGrid.style.display = 'none';
      if (clinicTourContainer) {
        clinicTourContainer.style.display = 'grid';
        clinicTourContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
        clinicTourContainer.style.gap = 'var(--space-3)';
      }

      renderWebsiteClinicPhotos();
    });
  }

  // Hydrate clinic content on loading the page
  hydrateWebsiteContent();
  renderWebsiteClinicPhotos();
}

// Render Cases Grid
function renderGallery() {
  const galleryGrid = document.getElementById('galleryGrid');
  const galleryAdminBanner = document.getElementById('galleryAdminBanner');
  if (!galleryGrid) return;

  const isAdmin = localStorage.getItem('dr_dental_admin_logged_in') === 'true';

  // Toggle Admin Banner visibility
  if (galleryAdminBanner) {
    galleryAdminBanner.style.display = isAdmin ? 'flex' : 'none';
  }

  // Filter cases
  const filteredCases = activeFilter === 'all' 
    ? galleryCases 
    : galleryCases.filter(c => c.category.toLowerCase() === activeFilter.toLowerCase());

  if (filteredCases.length === 0) {
    galleryGrid.style.display = 'block';
    galleryGrid.innerHTML = `
      <div style="text-align: center; padding: 48px; border: 1px dashed var(--border); border-radius: var(--radius); grid-column: 1 / -1;">
        <p style="color: var(--muted); font-size: 0.95rem; margin: 0;">No transformation cases found in this category.</p>
        ${isAdmin ? '<button type="button" class="btn-primary btn-teal" style="margin-top: 16px; padding: 8px 16px; font-size: 0.8rem;" onclick="document.getElementById(\'addCaseBtn\').click()">Add First Case</button>' : ''}
      </div>
    `;
    return;
  }

  galleryGrid.style.display = '';
  galleryGrid.innerHTML = filteredCases.map(c => {
    return `
      <div class="ba-card" data-id="${c.id}">
        <div class="ba-slider-container">
          <div class="ba-slider" style="--pos: 50%;">
            <img src="${c.after}" class="ba-after" alt="${c.title} - After" loading="lazy">
            <img src="${c.before}" class="ba-before" alt="${c.title} - Before" loading="lazy">
            <div class="ba-handle"></div>
            <div class="ba-handle-button">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:16px; height:16px; opacity:1;">
                <polyline points="8 18 2 12 8 6"></polyline>
                <polyline points="16 6 22 12 16 18"></polyline>
              </svg>
            </div>
            <input type="range" class="ba-range" min="0" max="100" value="50" aria-label="Before/After comparison slider for ${c.title}">
          </div>
          <span class="ba-label-tag before-tag">Before</span>
          <span class="ba-label-tag after-tag">After</span>
        </div>
        <div class="ba-info">
          <div class="ba-meta">
            <span class="ba-category-badge">${c.category}</span>
          </div>
          <h3 class="ba-title">${c.title}</h3>
          <p class="ba-description">${c.description}</p>
          
          ${isAdmin ? `
            <div class="ba-admin-actions">
              <button class="btn-edit-case" onclick="window.editCase('${c.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Edit
              </button>
              <button class="btn-delete-case" onclick="window.deleteCase('${c.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');

  // Attach slider drag/interaction events
  initializeSliders();
}

function initializeSliders() {
  document.querySelectorAll('.ba-range').forEach(input => {
    const updatePos = () => {
      const slider = input.closest('.ba-slider');
      if (slider) {
        slider.style.setProperty('--pos', input.value + '%');
      }
    };

    updatePos();
    input.addEventListener('input', updatePos);
  });

  if (typeof rebuildGridCarousel === 'function') {
    rebuildGridCarousel('galleryGrid');
  }
}

// Hydrate Clinic Details on Website
function hydrateWebsiteContent() {
  const details = JSON.parse(localStorage.getItem('dr_dental_clinic_details') || '{}');
  if (!details.name) return;

  // Clinic Name
  const nameEl = document.getElementById('landingClinicName');
  if (nameEl) nameEl.textContent = details.name;

  // Hero Subtitle
  const subtitleEl = document.getElementById('landingHeroSubtitle');
  if (subtitleEl) subtitleEl.textContent = details.heroSubtitle;

  // Address
  const addressEl = document.getElementById('landingClinicAddress');
  if (addressEl) addressEl.textContent = details.address;

  // Hours
  const hoursEl = document.getElementById('landingClinicHours');
  if (hoursEl) hoursEl.textContent = details.hours;

  // Footer About Us
  const footerAboutEl = document.getElementById('landingFooterAbout');
  if (footerAboutEl) footerAboutEl.textContent = details.footerAbout;

  // Phones
  if (details.phone) {
    const phoneLinks = document.querySelectorAll('#landingClinicPhone, .landingFooterPhoneLink, .landingEmergencyPhone');
    phoneLinks.forEach(link => {
      link.textContent = details.phone;
      link.setAttribute('href', `tel:${details.phone.replace(/[^0-9+]/g, '')}`);
    });
  }
}
window.hydrateWebsiteContent = hydrateWebsiteContent;

// Render Clinic Tour Gallery Grid
function renderWebsiteClinicPhotos() {
  const tourContainer = document.getElementById('clinicTourContainer');
  if (!tourContainer) return;

  let photos = [];
  try {
    photos = JSON.parse(localStorage.getItem('dr_dental_clinic_photos') || '[]');
  } catch (e) {
    photos = [];
  }
  if (!Array.isArray(photos)) photos = [];

  if (photos.length === 0) {
    tourContainer.innerHTML = `
      <div style="text-align: center; padding: 48px; border: 1px dashed var(--border); border-radius: var(--radius); grid-column: 1 / -1; width: 100%;">
        <p style="color: var(--muted); font-size: 0.95rem; margin: 0;">No clinic photos added yet.</p>
      </div>
    `;
    return;
  }

  tourContainer.innerHTML = photos.map(photo => {
    return `
      <div class="clinic-photo-card" style="position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); background: var(--white); height: 260px; transition: transform 0.3s, box-shadow 0.3s;">
        <img src="${photo.url}" alt="${photo.caption}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s;" class="tour-image">
        <div class="photo-overlay" style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(transparent, rgba(15, 42, 67, 0.9)); padding: 20px 16px; color: var(--white); display: flex; flex-direction: column; justify-content: flex-end;">
          <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: var(--teal); margin-bottom: 4px;">${photo.category || 'General'}</span>
          <h4 style="font-size: 0.95rem; font-weight: 600; color: var(--white); margin: 0; line-height: 1.3;">${photo.caption}</h4>
        </div>
      </div>
    `;
  }).join('');

  if (typeof rebuildGridCarousel === 'function') {
    rebuildGridCarousel('clinicTourContainer');
  }
}
window.renderWebsiteClinicPhotos = renderWebsiteClinicPhotos;

// Modal Toggle Helpers
function showAdminModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('open');
  modalEl.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  
  // Close with escape key
  const keyHandler = (e) => {
    if (e.key === 'Escape' && modalEl.classList.contains('open')) {
      hideAdminModal(modalEl);
      document.removeEventListener('keydown', keyHandler);
    }
  };
  document.addEventListener('keydown', keyHandler);
}

function hideAdminModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('open');
  modalEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// Uploader Previews
function handleFileUploader(fileInput, previewImg, promptEl, urlInput) {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImg.src = e.target.result;
      previewImg.style.display = 'block';
      if (promptEl) promptEl.style.display = 'none';
      if (urlInput) urlInput.value = ''; // Reset url input
    };
    reader.readAsDataURL(file);
  }
}

function handleUrlPreview(urlInput, previewImg, promptEl, fileInput) {
  const url = urlInput.value.trim();
  if (url) {
    previewImg.src = url;
    previewImg.style.display = 'block';
    if (promptEl) promptEl.style.display = 'none';
    if (fileInput) fileInput.value = ''; // Reset file input
  } else {
    previewImg.src = '';
    previewImg.style.display = 'none';
    if (promptEl) promptEl.style.display = 'flex';
  }
}

function resetCaseEditorForm() {
  const form = document.getElementById('caseEditorForm');
  if (!form) return;
  form.reset();

  document.getElementById('editorCaseId').value = '';
  
  // Reset previews
  const beforeImg = document.getElementById('beforeImgPreview');
  const beforePrompt = document.getElementById('beforePreviewPrompt');
  if (beforeImg) { beforeImg.src = ''; beforeImg.style.display = 'none'; }
  if (beforePrompt) beforePrompt.style.display = 'flex';

  const afterImg = document.getElementById('afterImgPreview');
  const afterPrompt = document.getElementById('afterPreviewPrompt');
  if (afterImg) { afterImg.src = ''; afterImg.style.display = 'none'; }
  if (afterPrompt) afterPrompt.style.display = 'flex';
}

// Case operations (Add / Edit / Delete)
function saveCaseStudy() {
  const caseId = document.getElementById('editorCaseId').value;
  const title = document.getElementById('caseTitle').value.trim();
  const category = document.getElementById('caseCategory').value;
  const description = document.getElementById('caseDescription').value.trim();
  
  const beforeImg = document.getElementById('beforeImgPreview').src;
  const afterImg = document.getElementById('afterImgPreview').src;

  if (!beforeImg || beforeImg.endsWith('undefined') || beforeImg === window.location.href) {
    alert('Please upload or enter a URL for the Before treatment image.');
    return;
  }
  if (!afterImg || afterImg.endsWith('undefined') || afterImg === window.location.href) {
    alert('Please upload or enter a URL for the After treatment image.');
    return;
  }

  if (caseId) {
    // Edit existing case
    const index = galleryCases.findIndex(c => c.id === caseId);
    if (index !== -1) {
      galleryCases[index] = {
        id: caseId,
        title,
        category,
        description,
        before: beforeImg,
        after: afterImg
      };
    }
  } else {
    // Add new case
    const newCase = {
      id: 'case-' + Date.now(),
      title,
      category,
      description,
      before: beforeImg,
      after: afterImg
    };
    galleryCases.push(newCase);
  }

  // Save to local storage
  localStorage.setItem('dr_dental_gallery_cases', JSON.stringify(galleryCases));
  
  // Close modal and re-render
  hideAdminModal(document.getElementById('caseEditorModal'));
  renderGallery();
}

function editCase(id) {
  const c = galleryCases.find(item => item.id === id);
  if (!c) return;

  resetCaseEditorForm();
  
  // Set values
  document.getElementById('editorCaseId').value = c.id;
  document.getElementById('caseTitle').value = c.title;
  document.getElementById('caseCategory').value = c.category;
  document.getElementById('caseDescription').value = c.description;

  // Set before image preview
  const beforeImg = document.getElementById('beforeImgPreview');
  const beforePrompt = document.getElementById('beforePreviewPrompt');
  if (c.before.startsWith('data:')) {
    if (beforeImg) { beforeImg.src = c.before; beforeImg.style.display = 'block'; }
    if (beforePrompt) beforePrompt.style.display = 'none';
  } else {
    document.getElementById('beforeImgUrl').value = c.before;
    if (beforeImg) { beforeImg.src = c.before; beforeImg.style.display = 'block'; }
    if (beforePrompt) beforePrompt.style.display = 'none';
  }

  // Set after image preview
  const afterImg = document.getElementById('afterImgPreview');
  const afterPrompt = document.getElementById('afterPreviewPrompt');
  if (c.after.startsWith('data:')) {
    if (afterImg) { afterImg.src = c.after; afterImg.style.display = 'block'; }
    if (afterPrompt) afterPrompt.style.display = 'none';
  } else {
    document.getElementById('afterImgUrl').value = c.after;
    if (afterImg) { afterImg.src = c.after; afterImg.style.display = 'block'; }
    if (afterPrompt) afterPrompt.style.display = 'none';
  }

  const titleEl = document.getElementById('caseEditorTitle');
  if (titleEl) titleEl.textContent = 'Edit Treatment Case';

  showAdminModal(document.getElementById('caseEditorModal'));
}

function deleteCase(id) {
  const c = galleryCases.find(item => item.id === id);
  if (!c) return;

  if (confirm(`Are you sure you want to delete the treatment case study "${c.title}"?`)) {
    galleryCases = galleryCases.filter(item => item.id !== id);
    localStorage.setItem('dr_dental_gallery_cases', JSON.stringify(galleryCases));
    renderGallery();
  }
}

// Attach case operation functions to window scope for inline HTML onclick attributes
window.editCase = editCase;
window.deleteCase = deleteCase;


// ── ADMIN PANEL DASHBOARD LOGIC ──

// Render the entire admin dashboard
function renderAdminDashboard() {
  const isAdmin = localStorage.getItem('dr_dental_admin_logged_in') === 'true';
  if (!isAdmin) return;

  const doctors = JSON.parse(localStorage.getItem('dr_dental_doctors') || '[]');
  const bookings = JSON.parse(localStorage.getItem('dr_dental_bookings') || '[]');
  const nextNum = localStorage.getItem('dr_dental_next_number') || '101';

  // 1. Calculate & Render Stats
  const todayStr = new Date().toDateString();
  const todayBookings = bookings.filter(b => new Date(b.date).toDateString() === todayStr);
  
  // Calculate revenue: fee is 500 per booking
  const donePayments = bookings.filter(b => b.paymentStatus === 'completed');
  const pendingPayments = bookings.filter(b => b.paymentStatus === 'pending');
  const revenueCollected = donePayments.length * 500;
  const revenuePending = pendingPayments.length * 500;

  const presentDocs = doctors.filter(d => d.isPresent).length;

  const statToday = document.getElementById('statTodayPatients');
  const statQueue = document.getElementById('statQueueActive');
  const statRevenue = document.getElementById('statRevenueCollected');
  const statRevenueSub = document.getElementById('statRevenueSub');
  const statDocs = document.getElementById('statDoctorsPresent');

  if (statToday) statToday.textContent = todayBookings.length;
  if (statQueue) statQueue.textContent = `DR-${nextNum}`;
  if (statRevenue) statRevenue.textContent = `₹ ${revenueCollected.toLocaleString()}`;
  if (statRevenueSub) statRevenueSub.textContent = `Pending: ₹ ${revenuePending.toLocaleString()} (${pendingPayments.length} patients)`;
  if (statDocs) statDocs.textContent = `${presentDocs} / ${doctors.length}`;

  // 2. Render Doctor Attendance & Detail List
  renderDoctorAttendanceList(doctors);

  // 3. Populate Offline Form Doctor Selector (only present doctors)
  populateOfflineDoctorSelector(doctors);

  // 4. Render Bookings Table
  renderBookingsTable(bookings, doctors);
}

// Render Doctor Attendance cards
function renderDoctorAttendanceList(doctors) {
  const container = document.getElementById('doctorAttendanceList');
  if (!container) return;

  container.innerHTML = doctors.map(doc => {
    const isChecked = doc.isPresent ? 'checked' : '';
    const statusText = doc.isPresent ? 'Present' : 'Absent';
    const statusClass = doc.isPresent ? 'status-present' : 'status-absent';
    
    return `
      <div class="admin-doc-card" style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border: 1px solid var(--border); border-radius: 8px; background: var(--white);">
        <div class="admin-doc-card-info" style="display: flex; align-items: center; gap: 12px;">
          <img src="${doc.img}" alt="${doc.name}" class="admin-doc-avatar" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--border);">
          <div class="admin-doc-meta">
            <h4 style="font-size: 0.85rem; font-weight: 700; color: var(--navy); margin: 0;">${doc.name}</h4>
            <p class="admin-doc-specialty" style="font-size: 0.72rem; color: var(--muted); margin: 0; line-height: 1.2;">${doc.title}</p>
            <p class="admin-doc-details" style="font-size: 0.68rem; color: var(--muted); margin: 2px 0 0; line-height: 1.2;">${doc.exp} · ${doc.languages}</p>
          </div>
        </div>
        <div class="admin-doc-card-action" style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
          <span class="doc-status-badge ${statusClass}" style="font-size: 0.68rem; font-weight: 600; padding: 1px 6px; border-radius: 4px;">${statusText}</span>
          <label class="switch-toggle" style="position: relative; display: inline-block; width: 34px; height: 20px;">
            <input type="checkbox" ${isChecked} onchange="window.toggleDoctorAttendance('${doc.id}')" style="opacity: 0; width: 0; height: 0; cursor: pointer;">
            <span class="switch-slider" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; border-radius: 20px;"></span>
          </label>
        </div>
      </div>
    `;
  }).join('');
}

// Toggle doctor presence
function toggleDoctorAttendance(id) {
  const doctors = JSON.parse(localStorage.getItem('dr_dental_doctors') || '[]');
  const index = doctors.findIndex(d => d.id === id);
  if (index !== -1) {
    doctors[index].isPresent = !doctors[index].isPresent;
    localStorage.setItem('dr_dental_doctors', JSON.stringify(doctors));
    
    // Refresh dashboard & dropdowns
    renderAdminDashboard();
    populateBookingDoctors(); // Update landing page select box if active
  }
}
window.toggleDoctorAttendance = toggleDoctorAttendance;

// Populate offline form dentist selector with attending dentists
function populateOfflineDoctorSelector(doctors) {
  const select = document.getElementById('offlineDoctorSelect');
  if (!select) return;

  const attendingDocs = doctors.filter(d => d.isPresent);
  
  if (attendingDocs.length === 0) {
    select.innerHTML = '<option value="" disabled selected>No doctors present today</option>';
  } else {
    select.innerHTML = attendingDocs.map(doc => {
      return `<option value="${doc.id}">${doc.name} (${doc.title})</option>`;
    }).join('');
  }
}

// Render patient bookings records table
function renderBookingsTable(bookings, doctors) {
  const tableBody = document.getElementById('bookingsTableBody');
  if (!tableBody) return;

  // Get search and filter terms
  const searchInput = document.getElementById('bookingSearchInput');
  const searchVal = (searchInput?.value || '').toLowerCase().trim();
  const typeFilter = document.getElementById('filterTypeSelect')?.value || 'all';
  const paymentFilter = document.getElementById('filterPaymentSelect')?.value || 'all';
  const statusFilter = document.getElementById('filterStatusSelect')?.value || 'all';

  // Filter bookings list
  let filteredBookings = bookings.filter(b => {
    const matchesSearch = b.patientName.toLowerCase().includes(searchVal) || 
                          b.patientPhone.toLowerCase().includes(searchVal) ||
                          b.token.toLowerCase().includes(searchVal) ||
                          b.doctorName.toLowerCase().includes(searchVal);
    const matchesType = typeFilter === 'all' ? true : b.type === typeFilter;
    const matchesPayment = paymentFilter === 'all' ? true : b.paymentStatus === paymentFilter;
    const matchesStatus = statusFilter === 'all' ? true : b.status === statusFilter;

    return matchesSearch && matchesType && matchesPayment && matchesStatus;
  });

  // Sort by created time (latest first)
  filteredBookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (filteredBookings.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 32px; color: var(--muted); font-size: 0.9rem;">
          No patient bookings match your criteria.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filteredBookings.map(b => {
    const statusClass = `badge-status-${b.status}`;
    const paymentClass = b.paymentStatus === 'completed' ? 'badge-status-completed' : 'badge-status-cancelled';
    const docOptions = doctors.map(doc => {
      const isSelected = doc.id === b.doctorKey ? 'selected' : '';
      const absentText = doc.isPresent ? '' : ' (Absent)';
      return `<option value="${doc.id}" ${isSelected}>${doc.name}${absentText}</option>`;
    }).join('');

    const sourceBadge = b.type === 'online' ? '<span class="badge badge-source-online">Online</span>' : '<span class="badge badge-source-offline">Offline</span>';

    return `
      <tr style="border-bottom: 1px solid var(--border);" data-booking-id="${b.id}">
        <td style="padding: 14px 16px; font-weight: 700; color: var(--navy); font-size: 0.85rem;">${b.token}</td>
        <td style="padding: 14px 16px;">
          <div style="font-weight: 600; color: var(--text); font-size: 0.88rem;">${b.patientName}</div>
          <div style="font-size: 0.75rem; color: var(--muted);">${b.patientPhone}</div>
        </td>
        <td style="padding: 14px 16px;">
          <select class="admin-table-select" onchange="window.reassignBookingDoctor('${b.id}', this.value)" style="border: 1px solid var(--border); border-radius: 6px; padding: 4px 8px; font-size: 0.8rem; background: var(--white); color: var(--text); max-width: 180px;">
            ${docOptions}
          </select>
        </td>
        <td style="padding: 14px 16px;">
          <div style="font-weight: 500; font-size: 0.82rem; color: var(--text);">${new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          <div style="font-size: 0.72rem; color: var(--muted);">${b.time}</div>
        </td>
        <td style="padding: 14px 16px;">${sourceBadge}</td>
        <td style="padding: 14px 16px;">
          <select class="admin-table-select-status ${paymentClass}" onchange="window.updateBookingPaymentStatus('${b.id}', this.value)" style="border: none; border-radius: 4px; padding: 4px 8px; font-size: 0.78rem; font-weight: 600; cursor: pointer; outline: none; transition: .2s;">
            <option value="pending" ${b.paymentStatus === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="completed" ${b.paymentStatus === 'completed' ? 'selected' : ''}>Done</option>
          </select>
        </td>
        <td style="padding: 14px 16px;">
          <select class="admin-table-select-status ${statusClass}" onchange="window.updateBookingStatus('${b.id}', this.value)" style="border: none; border-radius: 4px; padding: 4px 8px; font-size: 0.78rem; font-weight: 600; cursor: pointer; outline: none; transition: .2s;">
            <option value="pending" ${b.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="checked-in" ${b.status === 'checked-in' ? 'selected' : ''}>Checked In</option>
            <option value="completed" ${b.status === 'completed' ? 'selected' : ''}>Completed</option>
            <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td style="padding: 14px 16px; text-align: right;">
          <button class="btn-print-rx" onclick="window.openPrescriptionModal('${b.id}')" style="margin-right: 6px; padding: 6px 10px; background: transparent; border: none; color: var(--teal); cursor: pointer;" title="Create & Print Prescription">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; vertical-align: middle;"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
          </button>
          <button class="btn-delete-case" onclick="window.deleteBookingRecord('${b.id}')" style="margin: 0; padding: 6px 10px; background: transparent; border: none; color: #DC2626; cursor: pointer;" title="Delete Record">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px; vertical-align: middle;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// Re-assign doctor to patient booking
function reassignBookingDoctor(bookingId, doctorId) {
  const bookings = JSON.parse(localStorage.getItem('dr_dental_bookings') || '[]');
  const doctors = JSON.parse(localStorage.getItem('dr_dental_doctors') || '[]');
  
  const bIndex = bookings.findIndex(b => b.id === bookingId);
  const doc = doctors.find(d => d.id === doctorId);
  
  if (bIndex !== -1 && doc) {
    bookings[bIndex].doctorKey = doctorId;
    bookings[bIndex].doctorName = doc.name;
    localStorage.setItem('dr_dental_bookings', JSON.stringify(bookings));
    renderAdminDashboard();
  }
}
window.reassignBookingDoctor = reassignBookingDoctor;

// Update booking status
function updateBookingStatus(bookingId, status) {
  const bookings = JSON.parse(localStorage.getItem('dr_dental_bookings') || '[]');
  const bIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bIndex !== -1) {
    bookings[bIndex].status = status;
    localStorage.setItem('dr_dental_bookings', JSON.stringify(bookings));
    renderAdminDashboard();
  }
}
window.updateBookingStatus = updateBookingStatus;

// Update booking payment status
function updateBookingPaymentStatus(bookingId, status) {
  const bookings = JSON.parse(localStorage.getItem('dr_dental_bookings') || '[]');
  const bIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bIndex !== -1) {
    bookings[bIndex].paymentStatus = status;
    localStorage.setItem('dr_dental_bookings', JSON.stringify(bookings));
    renderAdminDashboard();
  }
}
window.updateBookingPaymentStatus = updateBookingPaymentStatus;

// Delete booking record
function deleteBookingRecord(bookingId) {
  if (confirm('Are you sure you want to permanently delete this booking record?')) {
    let bookings = JSON.parse(localStorage.getItem('dr_dental_bookings') || '[]');
    bookings = bookings.filter(b => b.id !== bookingId);
    localStorage.setItem('dr_dental_bookings', JSON.stringify(bookings));
    renderAdminDashboard();
  }
}
window.deleteBookingRecord = deleteBookingRecord;

// Render Admin Settings Form Inputs
function renderAdminSettings() {
  const details = JSON.parse(localStorage.getItem('dr_dental_clinic_details') || '{}');
  if (!details.name) return;

  const nameInput = document.getElementById('cmsClinicName');
  const phoneInput = document.getElementById('cmsClinicPhone');
  const hoursInput = document.getElementById('cmsClinicHours');
  const addressInput = document.getElementById('cmsClinicAddress');
  const heroInput = document.getElementById('cmsHeroSubtitle');
  const footerInput = document.getElementById('cmsFooterAbout');

  if (nameInput) nameInput.value = details.name;
  if (phoneInput) phoneInput.value = details.phone;
  if (hoursInput) hoursInput.value = details.hours;
  if (addressInput) addressInput.value = details.address;
  if (heroInput) heroInput.value = details.heroSubtitle;
  if (footerInput) footerInput.value = details.footerAbout;
}
window.renderAdminSettings = renderAdminSettings;

// Render Admin Photos Catalog Grid
function renderAdminPhotosCatalog() {
  const catalogList = document.getElementById('cmsPhotosCatalogList');
  const countBadge = document.getElementById('cmsPhotosCountBadge');
  if (!catalogList) return;

  const photos = JSON.parse(localStorage.getItem('dr_dental_clinic_photos') || '[]');

  if (countBadge) {
    countBadge.textContent = `${photos.length} Photo${photos.length === 1 ? '' : 's'}`;
  }

  if (photos.length === 0) {
    catalogList.innerHTML = `
      <div style="text-align: center; padding: 16px; border: 1px dashed var(--border); border-radius: 8px; color: var(--muted); font-size: 0.8rem;">
        No tour photos in catalog.
      </div>
    `;
    return;
  }

  catalogList.innerHTML = photos.map(photo => {
    return `
      <div class="cms-photo-item" style="display: flex; align-items: center; gap: 12px; padding: 8px; border: 1px solid var(--border); border-radius: 8px; background: var(--gray-bg); margin-bottom: 8px;">
        <img src="${photo.url}" alt="${photo.caption}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; flex-shrink: 0;">
        <div style="flex: 1; min-width: 0;">
          <h4 style="font-size: 0.82rem; font-weight: 600; color: var(--navy); margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${photo.caption}</h4>
          <span style="font-size: 0.7rem; color: var(--muted); display: block;">${photo.category || 'General'}</span>
        </div>
        <button type="button" onclick="window.deleteClinicPhoto('${photo.id}')" style="background: transparent; border: none; color: #DC2626; padding: 6px; cursor: pointer; flex-shrink: 0;" title="Delete Photo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; vertical-align: middle;"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    `;
  }).join('');
}
window.renderAdminPhotosCatalog = renderAdminPhotosCatalog;

// Delete photo handler
function deleteClinicPhoto(photoId) {
  let photos = JSON.parse(localStorage.getItem('dr_dental_clinic_photos') || '[]');
  photos = photos.filter(p => p.id !== photoId);
  localStorage.setItem('dr_dental_clinic_photos', JSON.stringify(photos));
  renderAdminPhotosCatalog();
  renderWebsiteClinicPhotos();
}
window.deleteClinicPhoto = deleteClinicPhoto;

// Open Prescription Creator Modal
function openPrescriptionModal(bookingId) {
  const rxModal = document.getElementById('prescriptionModal');
  if (!rxModal) return;

  const bookings = JSON.parse(localStorage.getItem('dr_dental_bookings') || '[]');
  const booking = bookings.find(b => b.id === bookingId);
  if (!booking) return;

  // Pre-fill inputs
  const rxBookingIdInput = document.getElementById('rxBookingId');
  const rxPatientNameInput = document.getElementById('rxPatientName');
  const rxPatientAgeInput = document.getElementById('rxPatientAge');
  const rxPatientGenderInput = document.getElementById('rxPatientGender');
  const rxPatientAddressInput = document.getElementById('rxPatientAddress');
  const rxDoctorSelect = document.getElementById('rxDoctorSelect');
  const rxDiagnosisInput = document.getElementById('rxDiagnosis');

  if (rxBookingIdInput) {
    rxBookingIdInput.value = bookingId;
    rxBookingIdInput.setAttribute('data-token', booking.token || 'N/A');
  }
  if (rxPatientNameInput) rxPatientNameInput.value = booking.patientName || '';
  if (rxPatientAgeInput) rxPatientAgeInput.value = '';
  if (rxPatientGenderInput) rxPatientGenderInput.value = 'Male';
  if (rxPatientAddressInput) rxPatientAddressInput.value = '';
  if (rxDiagnosisInput) rxDiagnosisInput.value = '';

  // Pre-select doctor if matched
  if (rxDoctorSelect && booking.doctorKey) {
    rxDoctorSelect.value = booking.doctorKey;
  }

  showAdminModal(rxModal);
}
window.openPrescriptionModal = openPrescriptionModal;

// Initialize Offline Booking Form Submit
function initOfflineBookingForm() {
  const form = document.getElementById('offlineBookingForm');
  if (!form) return;

  // Set default date to today
  const dateInput = document.getElementById('offlineDate');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();
    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;
    dateInput.value = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const patientName = document.getElementById('offlinePatientName').value.trim();
    const patientPhone = document.getElementById('offlinePatientPhone').value.trim();
    const doctorKey = document.getElementById('offlineDoctorSelect').value;
    const paymentStatus = document.getElementById('offlinePaymentStatus')?.value || "pending";
    const dateVal = document.getElementById('offlineDate').value;
    const timeSlot = document.getElementById('offlineTimeSlot').value;

    if (!doctorKey) {
      alert('Please select an attending dentist.');
      return;
    }

    const doctors = JSON.parse(localStorage.getItem('dr_dental_doctors') || '[]');
    const selectedDoc = doctors.find(d => d.id === doctorKey);
    const docName = selectedDoc ? selectedDoc.name : "Dentist";

    // Generate token
    const nextNum = parseInt(localStorage.getItem('dr_dental_next_number') || '101');
    const token = `DR-${nextNum}`;
    localStorage.setItem('dr_dental_next_number', (nextNum + 1).toString());

    // Create booking object
    const newBooking = {
      id: 'book-' + Date.now(),
      token: token,
      patientName: patientName,
      patientPhone: patientPhone,
      doctorKey: doctorKey,
      doctorName: docName,
      date: new Date(dateVal).toDateString(),
      time: timeSlot,
      type: "offline",
      paymentStatus: paymentStatus,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    // Save booking
    const bookings = JSON.parse(localStorage.getItem('dr_dental_bookings') || '[]');
    bookings.push(newBooking);
    localStorage.setItem('dr_dental_bookings', JSON.stringify(bookings));

    // Reset Form inputs (except date)
    document.getElementById('offlinePatientName').value = '';
    document.getElementById('offlinePatientPhone').value = '';

    // Alert & Refresh
    alert(`Booking confirmed! Token reserved: ${token}`);
    renderAdminDashboard();
  });
}

// Initialize Search Filters
function initTableFilters() {
  const searchInput = document.getElementById('bookingSearchInput');
  const typeSelect = document.getElementById('filterTypeSelect');
  const paymentSelect = document.getElementById('filterPaymentSelect');
  const statusSelect = document.getElementById('filterStatusSelect');
  
  const refreshTable = () => {
    const bookings = JSON.parse(localStorage.getItem('dr_dental_bookings') || '[]');
    const doctors = JSON.parse(localStorage.getItem('dr_dental_doctors') || '[]');
    renderBookingsTable(bookings, doctors);
  };

  if (searchInput) searchInput.addEventListener('input', refreshTable);
  if (typeSelect) typeSelect.addEventListener('change', refreshTable);
  if (paymentSelect) paymentSelect.addEventListener('change', refreshTable);
  if (statusSelect) statusSelect.addEventListener('change', refreshTable);
}

// Initialize CSV Exporter
function initCSVExport() {
  const exportBtn = document.getElementById('btnExportCSV');
  if (!exportBtn) return;

  exportBtn.addEventListener('click', () => {
    const bookings = JSON.parse(localStorage.getItem('dr_dental_bookings') || '[]');
    if (bookings.length === 0) {
      alert('No booking records to export.');
      return;
    }

    const headers = ['Token', 'Patient Name', 'Phone Number', 'Dentist', 'Appointment Date', 'Time Slot', 'Source', 'Payment Status', 'Booking Status', 'Booking Date'];
    const csvRows = bookings.map(b => [
      b.token,
      `"${b.patientName.replace(/"/g, '""')}"`,
      `"${b.patientPhone.replace(/"/g, '""')}"`,
      `"${b.doctorName}"`,
      `"${new Date(b.date).toLocaleDateString()}"`,
      b.time,
      b.type,
      b.paymentStatus,
      b.status,
      `"${new Date(b.createdAt).toLocaleString()}"`
    ]);

    const csvContent = [headers.join(','), ...csvRows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dr_dental_bookings_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

// Initialize all admin features
function initAdminPanel() {
  initOfflineBookingForm();
  initTableFilters();
  initCSVExport();
  
  // Dashboard Logout listener
  const logoutBtn = document.getElementById('adminDashboardLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.setItem('dr_dental_admin_logged_in', 'false');
      window.location.hash = '';
    });
  }

  // CMS Details Form submit
  const detailsForm = document.getElementById('clinicDetailsForm');
  if (detailsForm) {
    detailsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedDetails = {
        name: document.getElementById('cmsClinicName').value.trim(),
        phone: document.getElementById('cmsClinicPhone').value.trim(),
        hours: document.getElementById('cmsClinicHours').value.trim(),
        address: document.getElementById('cmsClinicAddress').value.trim(),
        heroSubtitle: document.getElementById('cmsHeroSubtitle').value.trim(),
        footerAbout: document.getElementById('cmsFooterAbout').value.trim()
      };
      localStorage.setItem('dr_dental_clinic_details', JSON.stringify(updatedDetails));
      hydrateWebsiteContent();
      alert('Clinic settings updated and published successfully!');
    });
  }

  // CMS Add Photo Form submit
  const addPhotoForm = document.getElementById('cmsAddPhotoForm');
  if (addPhotoForm) {
    addPhotoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const url = document.getElementById('cmsPhotoUrl').value.trim();
      const caption = document.getElementById('cmsPhotoCaption').value.trim();
      const category = document.getElementById('cmsPhotoCategory').value;

      const newPhoto = {
        id: 'photo-' + Date.now(),
        url: url,
        caption: caption,
        category: category
      };

      const photos = JSON.parse(localStorage.getItem('dr_dental_clinic_photos') || '[]');
      photos.push(newPhoto);
      localStorage.setItem('dr_dental_clinic_photos', JSON.stringify(photos));

      // Reset inputs
      document.getElementById('cmsPhotoUrl').value = '';
      document.getElementById('cmsPhotoCaption').value = '';

      renderAdminPhotosCatalog();
      renderWebsiteClinicPhotos();
      alert('Photo added to Clinic Tour catalog!');
    });
  }

  // Dashboard Tabs Switcher logic
  const btnTabBookings = document.getElementById('btnTabBookings');
  const btnTabSettings = document.getElementById('btnTabSettings');
  const panelBookings = document.getElementById('panelBookings');
  const panelSettings = document.getElementById('panelSettings');

  if (btnTabBookings && btnTabSettings && panelBookings && panelSettings) {
    btnTabBookings.addEventListener('click', () => {
      btnTabBookings.classList.add('active');
      btnTabBookings.style.background = '';
      btnTabBookings.style.color = '';
      btnTabBookings.style.borderColor = '';

      btnTabSettings.classList.remove('active');
      btnTabSettings.style.background = 'transparent';
      btnTabSettings.style.color = 'var(--muted)';
      btnTabSettings.style.borderColor = 'transparent';

      panelBookings.style.display = 'block';
      panelSettings.style.display = 'none';
    });

    btnTabSettings.addEventListener('click', () => {
      btnTabSettings.classList.add('active');
      btnTabSettings.style.background = 'var(--teal)';
      btnTabSettings.style.color = 'var(--white)';
      btnTabSettings.style.borderColor = 'var(--teal)';

      btnTabBookings.classList.remove('active');
      btnTabBookings.style.background = 'transparent';
      btnTabBookings.style.color = 'var(--muted)';
      btnTabBookings.style.borderColor = 'transparent';

      panelBookings.style.display = 'none';
      panelSettings.style.display = 'block';

      // Load data
      renderAdminSettings();
      renderAdminPhotosCatalog();
    });
  }

  // Prescription modal close listeners
  const rxModal = document.getElementById('prescriptionModal');
  const closeRxModal = document.getElementById('closePrescriptionModal');
  const cancelRxBtn = document.getElementById('btnCancelPrescription');
  const rxForm = document.getElementById('prescriptionForm');

  if (closeRxModal && rxModal) {
    closeRxModal.addEventListener('click', () => hideAdminModal(rxModal));
  }
  if (cancelRxBtn && rxModal) {
    cancelRxBtn.addEventListener('click', () => hideAdminModal(rxModal));
  }
  if (rxModal) {
    rxModal.addEventListener('click', (e) => {
      if (e.target === rxModal) hideAdminModal(rxModal);
    });
  }

  // Prescription Form submit listener
  if (rxForm) {
    rxForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const printArea = document.getElementById('printPrescriptionArea');
      const details = JSON.parse(localStorage.getItem('dr_dental_clinic_details') || '{}');
      
      // Get doctor details
      const docKey = document.getElementById('rxDoctorSelect').value;
      const doc = doctorData[docKey] || { name: 'Doctor', title: 'Dentist', qualification: 'BDS', regNo: 'Reg. No: Pending' };

      const name = document.getElementById('rxPatientName').value;
      const age = document.getElementById('rxPatientAge').value;
      const gender = document.getElementById('rxPatientGender').value;
      const address = document.getElementById('rxPatientAddress').value;
      const diagnosis = document.getElementById('rxDiagnosis').value;
      
      const tokenInput = document.getElementById('rxBookingId');
      const token = tokenInput ? tokenInput.getAttribute('data-token') : 'N/A';

      if (printArea) {
        printArea.innerHTML = `
          <div class="prescription-print-wrapper">
            <!-- Header / Letterhead -->
            <div class="prescription-header" style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0E8388; padding-bottom: 12px;">
              <div class="clinic-info" style="text-align: left;">
                <h1 style="font-size: 1.4rem; font-weight: 800; color: #0F2A43; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px;">${details.name || 'D&R Oral & Dental Care'}</h1>
                <p style="font-size: 0.78rem; color: #4A4A4A; margin: 0; line-height: 1.4; max-width: 340px;">${details.address || ''}</p>
                <p style="font-size: 0.78rem; color: #4A4A4A; margin: 4px 0 0 0; font-weight: 600;">Phone: ${details.phone || ''} | Hours: ${details.hours || ''}</p>
              </div>
              <div class="doctor-info" style="text-align: right;">
                <h2 style="font-size: 1.15rem; font-weight: 700; color: #0E8388; margin: 0 0 2px 0;">${doc.name}</h2>
                <p style="font-size: 0.8rem; font-weight: 700; color: #0F2A43; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">${doc.title}</p>
                <p style="font-size: 0.75rem; color: #4A4A4A; margin: 2px 0 0 0; font-style: italic;">${doc.qualification || ''}</p>
                <p style="font-size: 0.72rem; color: #777; margin: 2px 0 0 0; font-weight: 600;">${doc.regNo || ''}</p>
              </div>
            </div>
            
            <!-- Patient Information Grid -->
            <div class="prescription-patient-block" style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 12px; margin-top: 12px; font-size: 0.8rem; line-height: 1.5; display: block;">
              <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 8px 16px;">
                <div><span style="color: #64748B; font-weight: 600; text-transform: uppercase; font-size: 0.65rem; display: block; margin-bottom: 1px;">Patient Name</span><strong style="color: #0F2A43; font-size: 0.88rem;">${name}</strong></div>
                <div><span style="color: #64748B; font-weight: 600; text-transform: uppercase; font-size: 0.65rem; display: block; margin-bottom: 1px;">Age / Gender</span><strong style="color: #0F2A43; font-size: 0.88rem;">${age} Yrs / ${gender}</strong></div>
                <div><span style="color: #64748B; font-weight: 600; text-transform: uppercase; font-size: 0.65rem; display: block; margin-bottom: 1px;">Date</span><strong style="color: #0F2A43; font-size: 0.88rem;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
              </div>
              <div style="display: grid; grid-template-columns: 2fr 2fr; gap: 8px 16px; margin-top: 8px; border-top: 1px solid #F1F5F9; padding-top: 6px;">
                <div><span style="color: #64748B; font-weight: 600; text-transform: uppercase; font-size: 0.65rem; display: block; margin-bottom: 1px;">Address</span><span style="color: #0F2A43; font-weight: 600;">${address}</span></div>
                <div><span style="color: #64748B; font-weight: 600; text-transform: uppercase; font-size: 0.65rem; display: block; margin-bottom: 1px;">Token / Booking ID</span><strong style="color: #0E8388; font-size: 0.88rem;">#${token}</strong></div>
              </div>
            </div>
            
            <!-- Clinical Diagnosis / Disease -->
            <div class="prescription-diagnosis-block" style="margin-top: 12px; font-size: 0.82rem; display: flex; gap: 6px; align-items: baseline;">
              <strong style="color: #64748B; text-transform: uppercase; font-size: 0.68rem; letter-spacing: 0.5px; flex-shrink: 0;">Chief Complaints / Diagnosis:</strong>
              <span style="font-weight: 600; color: #0F2A43; border-bottom: 1px dashed #CBD5E1; flex-grow: 1; padding-bottom: 2px;">${diagnosis}</span>
            </div>
            
            <!-- Rx Section (Blank Ruled Lines for Pen Scripting) -->
            <div class="prescription-body" style="margin-top: 14px; min-height: 220px; align-items: stretch; display: flex; flex-direction: row;">
              <div class="rx-symbol" style="font-size: 3.5rem; margin-right: 20px; font-family: Georgia, serif; font-weight: 700; color: #0E8388; line-height: 1;">℞</div>
              <div class="rx-content-blank" style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; padding-top: 5px;">
                <div style="border-bottom: 1px dashed #CBD5E1; height: 23px; width: 100%;"></div>
                <div style="border-bottom: 1px dashed #CBD5E1; height: 23px; width: 100%;"></div>
                <div style="border-bottom: 1px dashed #CBD5E1; height: 23px; width: 100%;"></div>
                <div style="border-bottom: 1px dashed #CBD5E1; height: 23px; width: 100%;"></div>
                <div style="border-bottom: 1px dashed #CBD5E1; height: 23px; width: 100%;"></div>
                <div style="border-bottom: 1px dashed #CBD5E1; height: 23px; width: 100%;"></div>
                <div style="border-bottom: 1px dashed #CBD5E1; height: 23px; width: 100%;"></div>
                <div style="border-bottom: 1px dashed #CBD5E1; height: 23px; width: 100%;"></div>
                <div style="border-bottom: 1px dashed #CBD5E1; height: 23px; width: 100%;"></div>
              </div>
            </div>
            
            <!-- Advice / Instructions (Blank Ruled Lines) -->
            <div class="prescription-advice-block" style="margin-top: 16px; padding: 10px; border-left: 3px solid #0E8388; background: #F8FAFC; display: block; border-radius: 4px;">
              <strong style="font-size: 0.72rem; color: #64748B; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Advice & Instructions (Doctor's Note):</strong>
              <div style="border-bottom: 1px dashed #CBD5E1; height: 24px; width: 100%;"></div>
              <div style="border-bottom: 1px dashed #CBD5E1; height: 24px; width: 100%;"></div>
            </div>
            
            <!-- Signature Block -->
            <div class="prescription-footer" style="margin-top: 40px; display: flex; justify-content: flex-end;">
              <div class="signature-line-wrap" style="text-align: center; width: 220px; display: block;">
                <div class="signature-line" style="border-top: 1px solid #64748B; margin-bottom: 4px; display: block; height: 0;"></div>
                <p style="font-size: 0.7rem; color: #64748B; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">Doctor's Signature & Stamp</p>
              </div>
            </div>
          </div>
        `;
      }

      // Hide modal
      hideAdminModal(rxModal);
      
      // Execute printing process
      setTimeout(() => {
        window.print();
      }, 100);
    });
  }
}

window.renderAdminDashboard = renderAdminDashboard;




