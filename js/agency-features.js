/**
 * eaklavya.dev — Agency Interactive Features
 * - Website Ownership & Payment Calculator
 * - Project Enquiry Form with validation & WhatsApp integration
 * - Legal & Policy Viewer Modal
 * - Case Study Modal Previews
 */

document.addEventListener('DOMContentLoaded', () => {
  initPaymentCalculator();
  initContactForm();
  initLegalModals();
  initCaseStudyModals();
});

/* ==========================================================================
   1. Website Ownership & Payment Calculator
   ========================================================================== */
function initPaymentCalculator() {
  const packageSelect = document.getElementById('calc-package-select');
  const installmentSlider = document.getElementById('calc-installment-slider');
  const sliderLabel = document.getElementById('calc-slider-current-step');
  
  const totalValEl = document.getElementById('calc-total-val');
  const installmentValEl = document.getElementById('calc-installment-val');
  const totalStepsEl = document.getElementById('calc-total-steps');
  const paidSoFarEl = document.getElementById('calc-paid-so-far');
  const remainingBalEl = document.getElementById('calc-remaining-balance');
  const finalPaymentNoticeEl = document.getElementById('calc-final-payment-notice');
  const onetimeAltEl = document.getElementById('calc-onetime-alt');
  const scheduleBreakdownEl = document.getElementById('calc-schedule-breakdown');

  if (!packageSelect || !installmentSlider) return;

  const packages = {
    basic: {
      name: 'Basic Package',
      total: 7000,
      regularInstallment: 1500,
      installmentsCount: 5,
      payments: [1500, 1500, 1500, 1500, 1000], // 4x 1,500 + 1x 1,000 = 7,000
      finalNote: 'Final 5th payment is ₹1,000 (saves ₹500 on regular installment)',
      onetime: '₹7,000 upfront purchase (100% ownership at handover)'
    },
    professional: {
      name: 'Professional Package',
      total: 10000,
      regularInstallment: 2500,
      installmentsCount: 4,
      payments: [2500, 2500, 2500, 2500], // 4x 2,500 = 10,000
      finalNote: 'All 4 payments are equal ₹2,500 installments',
      onetime: '₹10,000 upfront purchase (100% ownership at handover)'
    },
    premium: {
      name: 'Premium Package',
      total: 12500,
      regularInstallment: 3500,
      installmentsCount: 4,
      payments: [3500, 3500, 3500, 2000], // 3x 3,500 + 1x 2,000 = 12,500
      finalNote: 'Final 4th payment is ₹2,000 (saves ₹1,500 on regular installment)',
      onetime: '₹12,500 upfront purchase (100% ownership at handover)'
    }
  };

  function formatINR(val) {
    return '₹' + Number(val).toLocaleString('en-IN');
  }

  function updateCalculator() {
    const selectedKey = packageSelect.value || 'professional';
    const pkg = packages[selectedKey];
    if (!pkg) return;

    // Adjust slider bounds
    installmentSlider.max = pkg.installmentsCount;
    let currentStep = parseInt(installmentSlider.value, 10);
    if (currentStep > pkg.installmentsCount) {
      currentStep = pkg.installmentsCount;
      installmentSlider.value = currentStep;
    }
    if (currentStep < 1) {
      currentStep = 1;
      installmentSlider.value = currentStep;
    }

    if (sliderLabel) {
      sliderLabel.textContent = `Installment ${currentStep} of ${pkg.installmentsCount}`;
    }

    // Calculate totals based on currentStep
    let paid = 0;
    for (let i = 0; i < currentStep; i++) {
      paid += pkg.payments[i];
    }
    const remaining = pkg.total - paid;

    if (totalValEl) totalValEl.textContent = formatINR(pkg.total);
    if (installmentValEl) installmentValEl.textContent = formatINR(pkg.payments[0]) + '/mo';
    if (totalStepsEl) totalStepsEl.textContent = `${pkg.installmentsCount} Monthly Payments`;
    if (paidSoFarEl) paidSoFarEl.textContent = formatINR(paid);
    if (remainingBalEl) remainingBalEl.textContent = formatINR(remaining);
    if (finalPaymentNoticeEl) finalPaymentNoticeEl.textContent = pkg.finalNote;
    if (onetimeAltEl) onetimeAltEl.textContent = pkg.onetime;

    // Render schedule timeline breakdown
    if (scheduleBreakdownEl) {
      scheduleBreakdownEl.innerHTML = '';
      pkg.payments.forEach((amt, index) => {
        const stepNum = index + 1;
        const isPaid = stepNum <= currentStep;
        const isCurrent = stepNum === currentStep;

        const item = document.createElement('div');
        item.className = `flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
          isCurrent
            ? 'bg-purple-500/20 border-purple-500/50 text-purple-200 font-semibold shadow-sm'
            : isPaid
            ? 'bg-white/10 border-white/15 text-slate-200'
            : 'bg-white/5 border-white/10 text-slate-400'
        }`;

        item.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
              isPaid ? 'bg-[#a020ff] text-white shadow-[0_0_8px_rgba(160,32,255,0.6)]' : 'bg-white/10 text-slate-400'
            }">${stepNum}</span>
            <span>Month ${stepNum} Installment</span>
          </div>
          <span class="font-mono text-sm">${formatINR(amt)}</span>
        `;
        scheduleBreakdownEl.appendChild(item);
      });
    }
  }

  packageSelect.addEventListener('change', () => {
    installmentSlider.value = 1;
    updateCalculator();
  });

  installmentSlider.addEventListener('input', updateCalculator);

  // Allow clicking external package choose buttons
  document.querySelectorAll('[data-select-package]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetPkg = btn.getAttribute('data-select-package');
      if (packages[targetPkg]) {
        packageSelect.value = targetPkg;
        updateCalculator();
      }
    });
  });

  updateCalculator();
}

/* ==========================================================================
   2. Contact & Project Onboarding Form
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('project-onboarding-form');
  const successState = document.getElementById('form-success-state');
  const errorAlert = document.getElementById('form-error-alert');
  const packageSelect = document.getElementById('contact-package-select');

  if (!form) return;

  // Sync package selection from pricing cards
  document.querySelectorAll('[data-choose-tier]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tier = btn.getAttribute('data-choose-tier');
      if (packageSelect) {
        packageSelect.value = tier;
      }
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#client-name')?.value.trim();
    const email = form.querySelector('#client-email')?.value.trim();
    const phone = form.querySelector('#client-phone')?.value.trim();
    const brand = form.querySelector('#client-brand')?.value.trim();
    const packageChosen = form.querySelector('#contact-package-select')?.value;
    const details = form.querySelector('#client-details')?.value.trim();

    if (!name || !email) {
      if (errorAlert) {
        errorAlert.textContent = 'Please provide your name and a valid email address.';
        errorAlert.classList.remove('hidden');
      }
      return;
    }

    if (errorAlert) errorAlert.classList.add('hidden');

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        Sending Details...
      `;
    }

    // Simulate reliable submission
    setTimeout(() => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }

      form.classList.add('hidden');
      if (successState) {
        successState.classList.remove('hidden');
        successState.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Also prepare direct WhatsApp link for instant messaging
      const whatsappBtn = document.getElementById('whatsapp-direct-link');
      if (whatsappBtn) {
        const msg = encodeURIComponent(
          `Hi Eaklavya! I just submitted an inquiry for my business ${brand || name}. I'm interested in the ${packageChosen} package.`
        );
        whatsappBtn.href = `https://wa.me/919933733027?text=${msg}`;
      }
    }, 900);
  });
}

/* ==========================================================================
   3. Legal & Policy Modals
   ========================================================================== */
function initLegalModals() {
  const modalContainer = document.getElementById('legal-modal-container');
  const modalTitle = document.getElementById('legal-modal-title');
  const modalBody = document.getElementById('legal-modal-body');
  const closeBtn = document.getElementById('legal-modal-close');
  const backdrop = document.getElementById('legal-modal-backdrop');

  if (!modalContainer) return;

  const policies = {
    terms: {
      title: 'Terms of Service',
      content: `
        <h4 class="text-base font-semibold text-slate-900 mb-2">1. Scope of Engagement</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          eaklavya.dev provides custom website design, web engineering, optimization, and technical maintenance. All projects operate under a written statement of work outlining deliverables, revisions, timelines, and payment milestones.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">2. Deliverables &amp; Approval</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Clients are given defined review rounds (2 rounds for Basic, 3 rounds for Professional, 4 rounds for Premium) prior to launch. Any structural changes requested outside the agreed scope will be estimated separately.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">3. Third-Party Services</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Domain registration, premium third-party plugins, third-party payment gateways, and hosting infrastructure renewals are the financial responsibility of the client, clearly stated upfront with zero markups.
        </p>
      `
    },
    privacy: {
      title: 'Privacy Policy',
      content: `
        <h4 class="text-base font-semibold text-slate-900 mb-2">1. Information We Collect</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          We collect basic contact information (name, business name, email, phone/WhatsApp) submitted through project onboarding forms solely to correspond regarding your project.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">2. Data Security &amp; Sharing</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          We never sell, rent, or trade your business information or customer databases. Data is stored on secure encrypted servers with strict access controls.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">3. Analytics &amp; Cookies</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          We use Google Analytics with anonymized IP tracking to monitor website performance and visitor navigation without tracking personally identifiable identity.
        </p>
      `
    },
    refunds: {
      title: 'Payment & Refund Policy',
      content: `
        <h4 class="text-base font-semibold text-slate-900 mb-2">1. Payment Structure</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Clients can choose between a one-time upfront purchase or fixed monthly installment terms (Basic: 5 installments, Professional: 4 installments, Premium: 4 installments).
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">2. Milestone Approvals &amp; Refunds</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Because design and development are bespoke services, work completed and approved through discovery and design milestones is non-refundable. If a project is cancelled prior to design commencement, advance deposits are refunded minus documented discovery costs.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">3. Transparent Currency</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Domestic transactions are billed in INR (₹) via UPI / Razorpay / Net Banking. International clients are billed in USD / equivalent via Stripe or PayPal.
        </p>
      `
    },
    cancellation: {
      title: 'Cancellation & Late Payment Policy',
      content: `
        <h4 class="text-base font-semibold text-slate-900 mb-2">1. Grace Period</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          A 7-day grace period is provided for all scheduled installment invoices. We will notify you via email and WhatsApp if an installment is pending.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">2. Project Pausing</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Invoices overdue past 14 days may result in active development pausing until payments are reconciled. Work resumes immediately upon receipt with an updated launch timeline.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">3. Voluntary Project Cancellation</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Clients may cancel an ongoing project with 7 business days written notice. You will receive all code, visual assets, and deliverables completed up to the date of settlement.
        </p>
      `
    },
    ownership: {
      title: 'Website Ownership & Intellectual Property',
      content: `
        <h4 class="text-base font-semibold text-slate-900 mb-2">1. Full Ownership Upon Final Payment</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Once your agreed purchase price (whether paid one-time or across installments) is settled in full, 100% of the website code, custom visual assets, brand graphics, and database contents transfer entirely to you.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">2. No Vendor Lock-In</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          We never lock your website or withhold your credentials. You receive the complete source code, GitHub repository access, and hosting admin access to move anywhere at any time.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">3. Open-Source Libraries</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Open-source frameworks used (such as Tailwind CSS, React, Lucide, Three.js) remain under their respective permissive MIT/Apache licenses.
        </p>
      `
    },
    support: {
      title: 'Maintenance & Support Terms',
      content: `
        <h4 class="text-base font-semibold text-slate-900 mb-2">1. Included Routine Maintenance</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Maintenance packages cover minor text/image updates, performance checks, security patches, SSL renewals, and backup verification during the agreed active period.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">2. Guaranteed Response Time</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Standard support requests are acknowledged within 24 hours on business days. Priority support (Professional and Premium) response time is within 8–12 business hours.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">3. Major Feature Changes</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Large feature additions (such as building custom booking engines, whole new page templates, or payment re-architecting) fall outside minor maintenance and are quoted with transparent scope.
        </p>
      `
    }
  };

  function openModal(key) {
    const policy = policies[key];
    if (!policy) return;

    modalTitle.textContent = policy.title;
    modalBody.innerHTML = policy.content;
    modalContainer.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeModal() {
    modalContainer.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  document.querySelectorAll('[data-open-policy]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const policyKey = link.getAttribute('data-open-policy');
      openModal(policyKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalContainer.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   4. Case Study Modals
   ========================================================================== */
function initCaseStudyModals() {
  const modal = document.getElementById('case-study-modal');
  const titleEl = document.getElementById('cs-modal-title');
  const catEl = document.getElementById('cs-modal-category');
  const objEl = document.getElementById('cs-modal-objective');
  const stackEl = document.getElementById('cs-modal-stack');
  const resultEl = document.getElementById('cs-modal-results');
  const closeBtn = document.getElementById('cs-modal-close');
  const backdrop = document.getElementById('cs-modal-backdrop');

  if (!modal) return;

  const caseStudies = {
    vertex: {
      title: 'Vertex Studio — Interactive E-Commerce Experience',
      category: 'Concept Project • Retail & Design',
      objective: 'Create a high-impact, 3D interactive showcase for a curated design goods brand with frictionless cart flow and sub-second page transitions.',
      stack: ['Next.js', 'Tailwind CSS', 'Three.js / WebGL', 'Framer Motion', 'Stripe'],
      results: 'Achieved a 99/100 Core Web Vitals score, sub-second checkout readiness, and responsive 3D card layout rendering smoothly across mobile and desktop.'
    },
    pulse: {
      title: 'Pulse Analytics — Financial SaaS Interface',
      category: 'Product Concept • Fintech & SaaS',
      objective: 'Design a clean, distraction-free merchant dashboard with real-time settlement tracking, volume breakdown charts, and role-based permissions.',
      stack: ['React', 'TypeScript', 'Tailwind CSS', 'Recharts', 'Lucide Icons'],
      results: 'Clean visual hierarchy reducing cognitive load during financial reconciliation; instant data filter updates without layout shifting.'
    },
    aura: {
      title: 'Aura Health & Clinic — Modern Healthcare Practice',
      category: 'Client Practice Concept • Medical & Wellness',
      objective: 'Build an empathetic, accessible appointment portal for a multidisciplinary clinic with instant WhatsApp appointment booking and localized search optimization.',
      stack: ['HTML5 Semantic', 'Tailwind CSS', 'Vanilla JavaScript', 'Schema.org SEO', 'WhatsApp API'],
      results: 'Streamlined patient enquiry pipeline allowing bookings in 2 clicks; comprehensive structured data for local clinic discovery on Google Maps and AI search engines.'
    },
    kavya: {
      title: 'Kavya Architecture — High-End Studio Portfolio',
      category: 'Studio Brand Concept • Architecture & Spatial',
      objective: 'Present an architecture firm’s spatial projects through cinematic imagery, fluid hover transitions, and an elegant editorial typography layout.',
      stack: ['Modern CSS Grid', 'Vanilla JavaScript', 'Intersection Observer', 'Playfair Display Serif'],
      results: 'Editorial aesthetic that conveys premium quality and architectural prestige, keeping bounce rates low and client retention high.'
    }
  };

  function openCS(key) {
    const cs = caseStudies[key];
    if (!cs) return;

    if (titleEl) titleEl.textContent = cs.title;
    if (catEl) catEl.textContent = cs.category;
    if (objEl) objEl.textContent = cs.objective;
    if (resultEl) resultEl.textContent = cs.results;

    if (stackEl) {
      stackEl.innerHTML = '';
      cs.stack.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200';
        span.textContent = tech;
        stackEl.appendChild(span);
      });
    }

    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }

  function closeCS() {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  document.querySelectorAll('[data-open-case-study]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-open-case-study');
      openCS(key);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeCS);
  if (backdrop) backdrop.addEventListener('click', closeCS);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeCS();
    }
  });
}
