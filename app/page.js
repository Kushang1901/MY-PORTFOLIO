"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

const skills = [
  { icon: "code", label: "HTML5 & CSS3" },
  { icon: "javascript", label: "JavaScript (ES6+)" },
  { icon: "hub", label: "React.js" },
  { icon: "rocket_launch", label: "Next.js" },
  { icon: "dns", label: "Node.js" },
  { icon: "database", label: "MongoDB" },
  { icon: "palette", label: "Tailwind CSS" },
  { icon: "terminal", label: "Python & Java" },
  { icon: "cloud_done", label: "Firebase" },
  { icon: "gif", label: "Git & Version Control" },
];

const achievements = [
  {
    title: "EduVetha",
    description: "Course completion, Internship & Outstanding certification",
    link: "https://drive.google.com/file/d/1T61d6dQvfj1PV8rWF1VhjgL6ky8wEUHp/view",
    icon: "school"
  },
  {
    title: "TCS Offer Letter",
    description: "BPS Smart Hiring 2024",
    link: "https://drive.google.com/file/d/1oGNATiPNZ4O7hZArK9XacO92QydMlTMN/view",
    icon: "work"
  },
  {
    title: "CMAT",
    description: "Common Management Admission Test",
    link: "https://drive.google.com/file/d/1mYpFHktMOQ82g5Fc6j_gnJSjfU0j8hRy/view",
    icon: "grade"
  },
  {
    title: "TCS ION NQT",
    description: "Cognitive and Psychometric Skills Assessment",
    link: "https://drive.google.com/file/d/1v6RCmVr6trvNZ3Bl74AhZqWzRWnQY3tp/view",
    icon: "psychology"
  },
  {
    title: "TCS ION NQT — IT",
    description: "Programming, Cognitive and Psychometric Skills",
    link: "https://drive.google.com/file/d/1W1qgAhQYs6MwZ2a40GuUE-tYiQFzFfeV/view",
    icon: "computer"
  }
];

const projects = [
  
  {
    title: "Hotel Devang",
    subtitle: "Real time Booking Platform & Inventory system",
    image: "/hotel_devang.png",
    tech: ["Next.js", "Tailwind", "Framer","HTML/CSS/JS"],
    actions: [
      { label: "View Site", href: "https://hoteldevang.com/", variant: "primary" },
    ],
  },
   {
    title: "CVGRID",
    subtitle: "Grid-based Content Architect",
    image: "/CVGrid.png",
    tech: ["Vanilla JS", "CSS Grid", "A11y"],
    actions: [
      { label: "View Site", href: "https://cvgrid.in", variant: "primary" },
    ],
  },
  {
    title: "Java Image Processing System",
    subtitle: "Advanced Visual Algorithm Suite",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5m4HC0LtEyJqUDXbGcxZVqNuVrgdDz0FJVBSH2ONiLJjqexk5TzTFF3kfG_x-1WHExOi_Z-VifqNcx0m_yYVkIxG26cN5a7_a6LnESVFY3aKkNUS0xbbi27lb_mUZU5O6YKW9x42qilwfTdDpMQTQ_w_pnkV2Zl3fSLOGdrZORLFMWNZrEairBNw-OWx4ZEv1eC7Oe9pOoJ0NQAtUz7fJgyzG7xupML_O-QaZJS9VfMHZCpLo0Mp-b4oL8KVFFG5eznkuRz-9Fro",
    tech: ["Java"],
    actions: [
      { label: "View Repo", href: "https://github.com/Kushang1901/java-image-processing", variant: "primary" },
      { label: "Download Project", href: "https://github.com/Kushang1901/java-image-processing/archive/refs/heads/main.zip", variant: "secondary" },
    ],
  },
  {
    title: "Python Based Image Processing System",
    subtitle: "OpenCV-powered Visual Intelligence Suite",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5m4HC0LtEyJqUDXbGcxZVqNuVrgdDz0FJVBSH2ONiLJjqexk5TzTFF3kfG_x-1WHExOi_Z-VifqNcx0m_yYVkIxG26cN5a7_a6LnESVFY3aKkNUS0xbbi27lb_mUZU5O6YKW9x42qilwfTdDpMQTQ_w_pnkV2Zl3fSLOGdrZORLFMWNZrEairBNw-OWx4ZEv1eC7Oe9pOoJ0NQAtUz7fJgyzG7xupML_O-QaZJS9VfMHZCpLo0Mp-b4oL8KVFFG5eznkuRz-9Fro",
    tech: ["Python", "OpenCV", "PIL"],
    actions: [
      { label: "View Repo", href: "https://github.com/Kushang1901/Python-Image-Processing", variant: "primary" },
      { label: "Download Project", href: "https://github.com/Kushang1901/Python-Image-Processing/archive/refs/heads/main.zip", variant: "secondary" },
    ],
  },
 
  {
    title: "SoundWave E-Commerce",
    subtitle: "Premium Audio Retail Experience",
    image: "/Soundwave.png",
    tech: ["React", "Redux", "Stripe"],
    actions: [
      { label: "View Site", href: "https://my-soundwave.vercel.app/auth", variant: "primary" },
    ],
  },
  {
    title: "AWARENEST - Harmony",
    subtitle: "Mobile App UI / Figma Design Concept",
    image: "/awareNest.png",
    tech: ["Figma", "UX", "Mobile App"],
    actions: [
      { label: "View Design", href: "https://www.figma.com/design/mRJieppUerKaA8hsBhvZy9/AwareNest--UED-Project?node-id=0-1&p=f&t=FV4rhhuJyJp3cylN-0", variant: "primary" },
    ],
  },
];

const contactLinks = [
  { label: "kushangacharya8830@mail.com", href: "mailto:kushangacharya8830@gmail.com", icon: "mail" },
  { label: "Download My Résumé", href: "/UPDATED%20CV.pdf", icon: "description" },
];

export default function Home() {
  const heroFrameRef = useRef(null);

  useEffect(() => {
    const handleMove = (event) => {
      const frame = heroFrameRef.current;
      if (!frame) {
        return;
      }

      const offsetX = event.clientX / window.innerWidth - 0.5;
      const offsetY = event.clientY / window.innerHeight - 0.5;
      frame.style.transform = `translate(${offsetX * 20}px, ${offsetY * 20}px)`;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="page-shell">
      <Navbar />

      <main>
        <section id="hero" className="hero-section">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Frontend Architect</p>
              <h1 className="headline headline-xl hero-name">
                Kushang <em style={{ fontStyle: "italic", fontWeight: 400 }}>Acharya</em>
              </h1>
              <p className="body-lg hero-lead">
                Frontend-first developer crafting responsive, user-centric web experiences with technical precision and editorial elegance.
              </p>

              <div className="button-row" style={{ marginTop: "2rem" }}>
                <a className="button button-primary" href="#projects">
                  View Projects <span className="material-symbols-outlined">arrow_forward</span>
                </a>
                <a className="button button-secondary" href="#contact">
                  Get in Touch
                </a>
                <a className="button button-secondary" href="/UPDATED%20CV.pdf" target="_blank" rel="noreferrer">
                  Resume
                </a>
              </div>
            </div>

            <div className="hero-frame-wrap" ref={heroFrameRef}>
              <div className="hero-frame-shadow" aria-hidden="true"></div>
              <div className="hero-frame" style={{ aspectRatio: "4 / 5" }}>
                <Image
                  src="/profile-image.jpg"
                  alt="Kushang Acharya portrait"
                  fill
                  priority
                  sizes="(max-width: 1080px) 100vw, 420px"
                  style={{ objectFit: "cover" }}
                />
                <span className="hero-flag">Based in Gujarat</span>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-strip">
          <div className="container hero-stats">
            <div className="stat-card">
              <span className="stat-number">7+</span>
              <span className="stat-label">Projects Built</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">5+</span>
              <span className="stat-label">Certifications</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">MSc IT</span>
              <span className="stat-label">Post Graduate</span>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container section-heading-row">
            <div>
              <h2 className="headline headline-lg">MSc IT Graduate &amp; IT Professional</h2>
              <div className="section-divider"></div>
            </div>
            <div className="about-copy">
              <p className="body-lg" style={{ marginTop: 0 }}>
                As a dedicated IT professional with an MSc in Information Technology, I specialize in the architecture and development of sophisticated frontend solutions. My approach combines technical rigor with a keen eye for minimalist design aesthetics.
              </p>
              <p className="body-md">
                I thrive on transforming complex requirements into elegant, high-performance web applications. My focus is on the modern JavaScript ecosystem, leveraging React and Next.js to build user-centric experiences that are both visually compelling and technically robust. Currently exploring the intersection of AI and frontend optimization.
              </p>
            </div>
          </div>
        </section>

        <section id="skills" className="section surface-strip">
          <div className="container">
            <div style={{ textAlign: "center" }}>
              <p className="eyebrow">Technical Arsenal</p>
              <h2 className="headline headline-lg">Precision Tools</h2>
            </div>

            <div className="skills-grid">
              {skills.map((skill) => (
                <article key={skill.label} className="skill-card">
                  <span className="material-symbols-outlined skill-icon">{skill.icon}</span>
                  <p className="skill-title">{skill.label}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="achievements" className="section surface-strip">
          <div className="container">
            <div style={{ textAlign: "center" }}>
              <p className="eyebrow">Recognition &amp; Credentials</p>
              <h2 className="headline headline-lg">Achievements</h2>
            </div>

            <div className="achievements-grid">
              {achievements.map((achievement) => (
                <a
                  key={achievement.title}
                  href={achievement.link}
                  target="_blank"
                  rel="noreferrer"
                  className="achievement-card"
                >
                  <span className="material-symbols-outlined achievement-icon">{achievement.icon}</span>
                  <div className="achievement-content">
                    <h3 className="achievement-title">{achievement.title}</h3>
                    <p className="achievement-description">{achievement.description}</p>
                  </div>
                  <span className="material-symbols-outlined achievement-arrow">arrow_outward</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="section">
          <div className="container section-heading-row">
            <div>
              <p className="eyebrow">Professional Timeline</p>
              <h2 className="headline headline-lg">Experience</h2>
            </div>

            <div className="timeline-wrap">
              <article className="timeline-item">
                <span className="timeline-marker"></span>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <h3 className="headline headline-md">Frontend Developer Intern</h3>
                  <div className="company-badge">
                    <span className="company-name">DreamsDesign</span>
                    <span className="company-location">Vadodara</span>
                  </div>
                </div>
                <p className="body-lg" style={{ marginTop: "1rem" }}>
                  Contributed to responsive frontend interfaces, polished landing pages, and content-focused web experiences for client projects with a strong emphasis on visual clarity and usability.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.25rem" }}>
                  <span className="tag">Dec 2025 - May 2026</span>
                  <span className="tag">Frontend Development</span>
                </div>
                <ul style={{ margin: "1rem 0 0", padding: 0, listStyle: "none", color: "var(--slate-muted)", display: "grid", gap: "0.85rem" }}>
                  <li>Built responsive sections and components using modern React and Next.js workflows.</li>
                  <li>Translated design references into clean, polished user interfaces.</li>
                  <li>Improved layout consistency, mobile behavior, and overall presentation quality.</li>
                </ul>
                <div style={{ marginTop: "1.5rem" }}>
                  <a className="button button-secondary" href="https://drive.google.com/file/d/1XD8T9zm6AjRMDNrvXmua7YbOXdLY2IIL/view?usp=drive_link" target="_blank" rel="noreferrer">
                    View Internship Certificate
                  </a>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="projects" className="section surface-strip">
          <div className="container">
            <div className="project-header">
              <div>
                <p className="eyebrow">Portfolio Highlights</p>
                <h2 className="headline headline-lg">My Projects</h2>
              </div>
              <div className="mono-label muted-text">01 — 05</div>
            </div>

            <div className="project-grid">
              {projects.map((project, index) => (
                <article key={project.title} className="project-card">
                  {project.image ? (
                    <a
                      className="project-media"
                      style={{ aspectRatio: "16 / 9" }}
                      href={project.actions[0]?.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.title}`}
                    >
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1080px) 100vw, 50vw"
                        loading={index === 0 ? "eager" : "lazy"}
                        style={{ objectFit: "cover" }}
                      />
                      <div className="project-overlay"></div>
                    </a>
                  ) : (
                    <a
                      className="project-media project-media-placeholder"
                      style={{ aspectRatio: "16 / 9" }}
                      href={project.actions[0]?.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.title}`}
                    >
                      <div className="project-placeholder">
                        <p className="project-placeholder-eyebrow">Figma Design</p>
                        <h3 className="project-placeholder-title">AWARENEST</h3>
                        <p className="project-placeholder-subtitle">Harmony mobile app concept</p>
                      </div>
                      <div className="project-overlay"></div>
                    </a>
                  )}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "1rem" }}>
                    <div>
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-meta">{project.subtitle}</p>
                    </div>
                  </div>

                  <div className="project-tags">
                    {project.tech.map((tag) => (
                      <span key={tag} className="project-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="project-actions">
                    {project.actions.map((action) => (
                      <a
                        key={action.label}
                        className={`project-action project-action-${action.variant}`}
                        href={action.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {action.label}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container contact-grid">
            <div>
              <h2 className="headline headline-lg">Ready to build something exceptional?</h2>
              <p className="body-lg" style={{ margin: "1.5rem 0 0" }}>
                Currently seeking new opportunities as a Frontend Developer. Let&apos;s discuss how my technical skills can elevate your next project.
              </p>

              <div className="contact-list" style={{ marginTop: "2rem" }}>
                {contactLinks.map((link) => (
                  <a key={link.label} href={link.href} className="contact-link" download={link.icon === "description" ? true : undefined}>
                    <span className="contact-icon">
                      <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>
                        {link.icon}
                      </span>
                    </span>
                    <span className="mono-label contact-text" style={{ color: "var(--on-surface)" }}>
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="terminal-window">
              <div className="terminal-bar">
                <span className="terminal-dot dot-red"></span>
                <span className="terminal-dot dot-gold"></span>
                <span className="terminal-dot dot-green"></span>
                <span className="terminal-title">zsh — kushang@portfolio</span>
              </div>

              <div className="terminal-body">
                <div className="terminal-line">
                  <span className="terminal-prompt">➜</span> <span className="terminal-path">~</span> <span>status</span>
                  <div className="muted-text">Status: Open to Collaboration</div>
                </div>
                <div className="terminal-line">
                  <span className="terminal-prompt">➜</span> <span className="terminal-path">~</span> <span>skills --list</span>
                  <div className="muted-text">Found: [React, Next.js, Node.js, JavaScript, Tailwind, MongoDB]</div>
                </div>
                <div className="terminal-line" style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                  <span className="terminal-prompt">➜</span> <span className="terminal-path">~</span> <span>message --to kushang</span>
                </div>
                <span className="terminal-cursor"></span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-row">
          <div>
            <h3 className="headline headline-md" style={{ marginBottom: "0.35rem" }}>
              KUSHANG ACHARYA
            </h3>
            <p className="body-md" style={{ margin: 0 }}>
              © 2026 Kushang Acharya. Built with precision.
            </p>
          </div>

          <div className="footer-links">
            <a className="footer-link" href="https://github.com/Kushang1901" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="footer-link" href="https://www.linkedin.com/in/kushang-acharya-938a712a6/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a className="footer-link" href="mailto:kushangacharya8830@gmail.com">
              Email
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
