/**
 * eaklavya.dev — Agency Interactive Features
 * - Website Ownership & Payment Calculator
 * - Project Enquiry Form with validation & WhatsApp integration
 * - Legal & Policy Viewer Modal
 * - Case Study Modal Previews
 */

document.addEventListener('DOMContentLoaded', () => {
  initContactForm();
  initLegalModals();
  initCaseStudyModals();
});
/* ==========================================================================
   1. Contact & Project Onboarding Form
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
      title: 'Payment & Pricing Terms',
      content: `
        <h4 class="text-base font-semibold text-slate-900 mb-2">1. Flexible Payment Options</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Clients can choose between a monthly managed retainer (Basic: ₹1,500/mo, Professional: ₹2,500/mo, Premium: ₹3,500/mo) or a 100% full website buyout (Basic: ₹7,000, Professional: ₹10,000, Premium: ₹12,500 one-time). After full buyout, optional ongoing management and repair maintenance drops to just ₹500/month.
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
      title: 'Cancellation & Retainer Policy',
      content: `
        <h4 class="text-base font-semibold text-slate-900 mb-2">1. Monthly Retainer Terms</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Monthly retainer subscriptions cover ongoing cloud hosting, updates, and active technical management. You can cancel your monthly retainer anytime with 7 days advance notice, or switch to a full website buyout.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">2. Transitioning to Full Buyout</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          If you no longer wish to pay the monthly retainer, you can purchase the website outright (₹7,000 for Basic, ₹10,000 for Professional, ₹12,500 for Premium) to take 100% ownership of all source code, assets, and design files.
        </p>
        <h4 class="text-base font-semibold text-slate-900 mb-2">3. Post-Buyout Maintenance at ₹500/mo</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Once you own the website, you are not locked into monthly fees. Whenever you need future repairs, technical maintenance, or minor updates, you can re-activate support at a reduced rate of only ₹500/month!
        </p>
      `
    },
    ownership: {
      title: 'Website Ownership & Intellectual Property',
      content: `
        <h4 class="text-base font-semibold text-slate-900 mb-2">1. Full Ownership Upon Buyout</h4>
        <p class="text-sm text-slate-600 mb-4 leading-relaxed">
          Once your website buyout is settled in full, 100% of the website code, custom visual assets, brand graphics, and repository contents transfer entirely to you.
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
