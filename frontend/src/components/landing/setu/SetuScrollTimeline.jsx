import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_STEPS = [
  {
    label: '01',
    title: 'Discover',
    desc: 'Colleges and companies onboard — profiles, policies, and pipelines in one place.',
    side: 'right',
  },
  {
    label: '02',
    title: 'Map the gap',
    desc: 'We surface where coordinators lose time and what students actually need.',
    side: 'left',
  },
  {
    label: '03',
    title: 'Connect',
    desc: 'Drives go live — eligibility, applications, and shortlists without the email storm.',
    side: 'right',
  },
  {
    label: '04',
    title: 'Execute',
    desc: 'Interviews, assessments, and updates stay in sync for every stakeholder.',
    side: 'left',
  },
  {
    label: '05',
    title: 'Grow',
    desc: 'Offers close the loop — analytics and alumni pipelines keep momentum.',
    side: 'right',
  },
];

const TIMELINE_PATH_D =
  'M 100 24 Q 188 104 100 184 Q 12 264 100 344 Q 188 424 100 504 Q 12 584 100 664 Q 188 744 100 824';

export default function SetuScrollTimeline() {
  const sectionRef = useRef(null);
  const fillPathRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const fillPath = fillPathRef.current;
    if (!section || !fillPath) return;

    const length = fillPath.getTotalLength();
    fillPath.style.strokeDasharray = `${length}`;
    fillPath.style.strokeDashoffset = `${length}`;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 0.9,
      onUpdate: (self) => {
        const p = self.progress;
        fillPath.style.strokeDashoffset = `${length * (1 - p)}`;
        const idx = Math.min(
          TIMELINE_STEPS.length - 1,
          Math.floor(p * TIMELINE_STEPS.length + 0.15)
        );
        setActiveIndex(idx);
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div ref={sectionRef} className="setu-scroll-timeline">
      <div className="setu-scroll-timeline__spine" aria-hidden>
        <svg viewBox="0 0 200 848" className="setu-scroll-timeline__svg">
          <path className="setu-scroll-timeline__path-track" d={TIMELINE_PATH_D} fill="none" />
          <path
            ref={fillPathRef}
            className="setu-scroll-timeline__path-fill"
            d={TIMELINE_PATH_D}
            fill="none"
          />
        </svg>
      </div>

      <div className="setu-scroll-timeline__rows">
        {TIMELINE_STEPS.map((step, i) => (
          <div key={step.label} className="setu-scroll-timeline__row">
            <div className="setu-scroll-timeline__col setu-scroll-timeline__col--left">
              {step.side === 'left' && (
                <StepCard step={step} active={activeIndex >= i} />
              )}
            </div>

            <div className="setu-scroll-timeline__col setu-scroll-timeline__col--center">
              <div
                className={`setu-scroll-timeline__node ${activeIndex >= i ? 'is-active' : ''}`}
              >
                <span className="setu-scroll-timeline__node-num">{step.label}</span>
              </div>
            </div>

            <div className="setu-scroll-timeline__col setu-scroll-timeline__col--right">
              {step.side === 'right' && (
                <StepCard step={step} active={activeIndex >= i} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({ step, active }) {
  return (
    <article className={`setu-scroll-timeline__card ${active ? 'is-active' : ''}`}>
      <span className="setu-script setu-scroll-timeline__step-tag">{step.label}</span>
      <h4 className="setu-display text-base sm:text-lg">{step.title}</h4>
      <p className="setu-script text-lg sm:text-xl text-neutral-700 leading-snug mt-1">{step.desc}</p>
    </article>
  );
}
