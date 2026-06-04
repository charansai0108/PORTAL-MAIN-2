import React, { useState } from 'react';
import { Squiggle, ScribbleUnderline } from './SetuIllustrations';
import SetuScrollTimeline from './SetuScrollTimeline';
import SetuTitleLine from './SetuTitleLine';
import SetuContactForm from './SetuContactForm';
import PWIOIFooter from '../Footer';
import landingHero from '../../../assets/images/landing_page.webp';
import queriesVisual from '../../../assets/images/queries.webp';
import './setu-landing.css';

const PILLARS = [
  {
    tag: 'Institutes',
    title: 'For Colleges',
    intro:
      'One command center for your entire placement cell — no more scattered sheets and inbox archaeology.',
    points: [
      'Live dashboards for drives, eligibility, and student pipeline status',
      'Bulk uploads, shortlists, and coordinator workflows in one place',
      'Policy-aware rules so every drive stays fair and audit-ready',
      'Reports your leadership actually reads — exportable, filterable, clear',
    ],
  },
  {
    tag: 'Recruiters',
    title: 'For Companies',
    intro:
      'Hire from campuses that run on a system built for speed, clarity, and intentional matching.',
    points: [
      'Verified student profiles with skills, projects, and assessment signals',
      'Structured job postings, screening rounds, and interview scheduling',
      'Fewer back-and-forth emails — status updates recruiters and admins share',
      'Talent pools you can return to semester after semester',
    ],
  },
  {
    tag: 'Students',
    title: 'For Students',
    intro:
      'Your placement journey should feel like a roadmap, not a maze of forms and missed deadlines.',
    points: [
      'One profile, one resume hub — always the version companies see',
      'Apply to eligible drives in clicks; track where you stand at every stage',
      'Prep resources, notifications, and calendar sync so nothing slips',
      'Transparent eligibility before you apply — save time, stay confident',
    ],
  },
];

const FAQ_ITEMS = [
  {
    q: 'How do I register for the placement portal?',
    a: 'Log in with your institute email, complete your profile, and upload your resume.',
  },
  {
    q: 'Can I update my resume after submitting?',
    a: 'Yes — update anytime before a drive’s deadline. The latest version replaces the old one automatically.',
  },
  {
    q: 'How will I know about upcoming placement drives?',
    a: 'Notifications land on your dashboard and in your registered email under Upcoming Drives.',
  },
  {
    q: 'What is the eligibility criteria?',
    a: 'It varies per company — CGPA, backlogs, and attendance are listed in each job description.',
  },
  {
    q: 'Can I apply to multiple companies at once?',
    a: 'Yes, when you meet each company’s criteria and your institute policy allows it.',
  },
];

function SetuFAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3 w-full setu-faq-center">
      {FAQ_ITEMS.map((item, i) => (
        <div key={item.q} className={`setu-faq-item ${open === i ? 'is-open' : ''}`}>
          <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span className="text-sm sm:text-base">{item.q}</span>
            <span className="setu-script text-2xl shrink-0">{open === i ? '×' : '+'}</span>
          </button>
          <div className="setu-faq-answer text-sm text-neutral-700">{item.a}</div>
        </div>
      ))}
    </div>
  );
}

export default function SetuLandingPage({
  onLoginOpen,
  onContactTeam,
  onMeetDevTeam,
  collegeName,
  logo,
}) {
  const openAuth = (role) => {
    if (onLoginOpen) onLoginOpen(role);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const brandLabel = collegeName || 'Setu';

  return (
    <div className="setu-landing w-full min-h-screen overflow-x-hidden">
      <header className="setu-nav">
        <div className="flex items-center gap-3">
          {logo ? (
            <img src={logo} alt="" className="h-9 w-9 object-contain rounded-lg" />
          ) : (
            <span className="setu-script text-3xl font-bold text-[#1a1a1a]">{brandLabel}</span>
          )}
          <span className="setu-display text-lg hidden sm:inline tracking-tight">{brandLabel}</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold">
          <button type="button" className="hover:text-[#ffb800] transition-colors" onClick={() => scrollTo('setu-hero')}>
            Home
          </button>
          <button type="button" className="hover:text-[#ffb800] transition-colors" onClick={() => scrollTo('setu-pillars')}>
            What&apos;s this
          </button>
          <button type="button" className="hover:text-[#ffb800] transition-colors" onClick={() => scrollTo('setu-process')}>
            Process
          </button>
          <button type="button" className="hover:text-[#ffb800] transition-colors" onClick={() => scrollTo('setu-queries')}>
            Contact
          </button>
          <button type="button" className="hover:text-[#ffb800] transition-colors" onClick={() => scrollTo('setu-faq')}>
            FAQ
          </button>
        </nav>
        <div className="flex gap-2">
          <button type="button" className="setu-btn-outline text-sm py-2 px-4" onClick={() => openAuth('Student')}>
            Log in
          </button>
          <button type="button" className="setu-btn-primary text-sm py-2 px-4" onClick={() => openAuth('Recruiter')}>
            Recruiter
          </button>
        </div>
      </header>

      <section id="setu-hero" className="relative px-[5%] pt-14 pb-16 text-center max-w-6xl mx-auto">
        <Squiggle className="absolute left-[6%] top-20 opacity-50 hidden sm:block" />
        <Squiggle className="absolute right-[8%] top-28 opacity-50 hidden sm:block" flip />

        <SetuTitleLine prefix="Placements made" highlight="10X simpler!" size="hero" />

        <div className="setu-hero-image-wrap mt-8">
          <img src={landingHero} alt="Diverse team illustration" className="w-full h-auto object-contain" />
        </div>

        <p className="setu-hero-stat">
          3 months of avg. time spent by coordinator chasing companies
        </p>

        <h2 className="setu-bridge-heading text-[#1a1a1a]">We bridge the gap.</h2>
      </section>

      <section className="px-[5%] pb-16">
        <div className="setu-platform-box setu-sketch-box setu-sketch-box--soft px-8 sm:px-12 py-8 sm:py-10 text-center">
          <p className="setu-platform-text text-[#1a1a1a] mx-auto">
            A two-sided platform built for new-age colleges &amp; the companies who want to hire from them.
          </p>
        </div>
      </section>

      <section id="setu-pillars" className="px-[5%] py-16 max-w-7xl mx-auto">
        <h2 className="setu-heading text-4xl sm:text-5xl text-center mb-14">
          What&apos;s even this?
          <span className="setu-script normal-case text-5xl ml-2 font-bold">?</span>
        </h2>
        <div className="grid lg:grid-cols-3 gap-8">
          {PILLARS.map((p) => (
            <article key={p.title} className="setu-pillar">
              <span className="setu-pillar-tag">{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.intro}</p>
              <ul>
                {p.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="px-[5%] py-20 bg-[#fff4d6]/60 border-y-2 border-[#1a1a1a]/10">
        <div className="max-w-5xl mx-auto text-center">
          <SetuTitleLine prefix="We built what we wished" highlight="existed!" size="section" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
          <div className="setu-comp-traditional p-10 text-center">
            <h3 className="setu-heading text-2xl sm:text-3xl">Traditional</h3>
            <p className="setu-script text-3xl font-bold -mt-1">placements</p>
            <p className="text-sm text-neutral-600 mt-4 font-[Inter]">
              Messy spreadsheets, endless email threads, and portals nobody wants to open twice.
            </p>
          </div>
          <div className="setu-comp-different p-10 text-center">
            <p className="setu-script text-3xl sm:text-4xl font-bold leading-tight">How we do it differently</p>
            <p className="text-sm text-neutral-700 mt-4 font-[Inter]">
              One place for colleges, companies, and students — clean, human, and built for how hiring actually works.
            </p>
          </div>
        </div>
      </section>

      <section id="setu-process" className="px-[5%] py-20 max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <p className="setu-script text-2xl text-[#ffb800] mb-1 font-bold">Glance</p>
          <h2 className="setu-heading text-3xl sm:text-4xl">How it works so it always</h2>
          <p className="setu-script text-3xl sm:text-4xl font-bold">works out!</p>
          <div className="flex justify-center gap-1 mt-3">
            <ScribbleUnderline width={120} />
            <ScribbleUnderline width={100} />
          </div>
        </div>

        <SetuScrollTimeline />
      </section>

      <section id="setu-queries" className="px-[5%] py-20 bg-white border-t-2 border-[#1a1a1a]/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="setu-script text-3xl sm:text-4xl font-bold text-center leading-tight mb-12">
            Got Queries? We are just a question away
          </h2>
          <div className="setu-queries-grid">
            <div className="setu-queries-visual">
              <img src={queriesVisual} alt="" />
            </div>
            <div className="setu-contact-panel">
              <SetuContactForm />
            </div>
          </div>
        </div>
      </section>

      <section id="setu-faq" className="px-[5%] py-20 bg-[#fff4d6]/40">
        <h2 className="setu-faq-section-title">Things you&apos;ll probably ask</h2>
        <SetuFAQ />
      </section>

      <PWIOIFooter
        variant="setu"
        onLoginOpen={onLoginOpen}
        onContactTeam={onContactTeam}
        onMeetDevTeam={onMeetDevTeam}
      />
    </div>
  );
}
