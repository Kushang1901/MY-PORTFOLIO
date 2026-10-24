"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import WelcomeLoader from "@/components/WelcomeLoader";

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
    title: "Sarkaar Toolkit",
    subtitle: "A secure, offline desktop utility workspace designed for Indian tax consultants, accountants, and citizens to prepare compliance documents locally on PC.",
    category: "Desktop Application",
    filterCategory: "desktop",
    status: "Microsoft Store",
    statusType: "store",
    icon: "desktop_windows",
    highlights: ["Offline Compliance Engine", "Zero-Cloud Data Privacy", "Windows Store Certified"],
    tech: ["React", "Electron", "Vite", "Windows Store"],
    actions: [
      { label: "View on Store", href: "https://apps.microsoft.com/detail/9PLBXKSFMM04?hl=en-us&gl=US&ocid=pdpshare", variant: "primary", icon: "microsoft" },
    ],
  },
  {
    title: "AuraDoc",
    subtitle: "A modern, ultra-fast universal document reader and presentation suite with a sleek glassmorphic interface, supporting multiple file formats with 100% offline privacy.",
    category: "Desktop Suite",
    filterCategory: "desktop",
    status: "Microsoft Store",
    statusType: "store",
    icon: "auto_stories",
    highlights: ["Glassmorphic Presentation Suite", "Multi-format Document Engine", "100% Offline Privacy"],
    tech: ["React", "Electron", "Vite", "Windows Store"],
    actions: [
      { label: "View on Store", href: "https://apps.microsoft.com/detail/9N5Q46XTZ7DG?hl=en-us&gl=US&ocid=pdpshare", variant: "primary", icon: "microsoft" },
    ],
  },
  {
    title: "C S Kakkad & Associates",
    subtitle: "Premier Chartered Accountancy corporate portal featuring statutory auditing, corporate taxation, GST advisory, CMA loan syndication, and interactive tax calculators.",
    category: "Finance & Accounting Portal",
    filterCategory: "web",
    status: "Live Client",
    statusType: "live",
    icon: "account_balance",
    highlights: ["Statutory Audit & Tax Compliance", "Interactive Tax & EMI Calculators", "Multi-Language Localization Engine"],
    tech: ["Next.js", "React", "Tailwind CSS", "Financial Calculators", "SEO"],
    actions: [
      { label: "View Live Site", href: "https://cachintankakkad.in/", variant: "primary", icon: "arrow_outward" },
    ],
  },
  {
    title: "Dwarkesh Tour & Travels",
    subtitle: "Official pilgrimage travel portal and tour booking service for 8 sacred places Dwarka Darshan and Somnath coastal tours with instant WhatsApp reservations.",
    category: "Travel & Pilgrimage Portal",
    filterCategory: "web",
    status: "Live Client",
    statusType: "live",
    icon: "travel_explore",
    highlights: ["8 Sacred Places Pilgrimage Routing", "Instant WhatsApp Booking Desk", "Multilingual Pilgrim Experience"],
    tech: ["Next.js", "React", "Tailwind CSS", "WhatsApp API", "SEO"],
    actions: [
      { label: "View Live Site", href: "https://dwarkadarshantour.com/", variant: "primary", icon: "arrow_outward" },
    ],
  },
  {
    title: "Hotel Devang",
    subtitle: "Full-stack real-time hotel booking platform and hospitality portal with live room inventory and instant WhatsApp API reservation.",
    category: "Web Application",
    filterCategory: "web",
    status: "Live Production",
    statusType: "live",
    icon: "hotel",
    highlights: ["Real-time Room Inventory", "WhatsApp API Booking Flow", "Mobile-First High Conversion UX"],
    tech: ["Next.js", "React", "Tailwind CSS", "WhatsApp API"],
    actions: [
      { label: "View Live Site", href: "https://hoteldevang.com/", variant: "primary", icon: "arrow_outward" },
    ],
  },
  {
    title: "CVGrid – AI Resume Builder",
    subtitle: "AI-powered ATS resume builder and career tool suite featuring 18+ templates, AI content optimization, live preview, and watermark-free PDF export.",
    category: "AI Web Application",
    filterCategory: "web",
    status: "Live Production",
    statusType: "live",
    icon: "auto_awesome",
    highlights: ["AI Content Generation Engine", "18+ ATS-Friendly Templates", "Instant Vector PDF Exporter"],
    tech: ["Next.js", "React", "AI Integration", "Tailwind CSS"],
    actions: [
      { label: "View Live Site", href: "https://cvgrid.in", variant: "primary", icon: "arrow_outward" },
    ],
  },
  {
    title: "Shekhar Dental & Orthodontic Centre",
    subtitle: "Advanced dental healthcare and clinical practice portal designed for patient intake, appointment scheduling, and service discovery.",
    category: "Healthcare Web Portal",
    filterCategory: "web",
    status: "Live Client",
    statusType: "live",
    icon: "medical_services",
    highlights: ["Patient Intake Flow", "Practice Management Portal", "High-performance Mobile Design"],
    tech: ["Next.js", "Tailwind CSS", "React", "JavaScript"],
    actions: [
      { label: "View Live Site", href: "https://shekhardental.in/", variant: "primary", icon: "arrow_outward" },
    ],
  },
  {
    title: "PixelForge: Photo & Batch Studio",
    subtitle: "Advanced visual algorithm suite featuring custom 2D convolution kernels, color matrix transforms, and digital filter processing.",
    category: "Desktop / Algorithm",
    filterCategory: "desktop",
    status: "Microsoft Store",
    statusType: "store",
    icon: "filter_vintage",
    highlights: ["Custom Convolution Kernels", "Color Space Transformation", "MS Store Certified Desktop App"],
    tech: ["Java", "Swing/AWT", "Windows Store"],
    actions: [
      {
        label: "Get from Microsoft Store",
        href: "https://apps.microsoft.com/store/detail/9PF01CLJQVMH?cid=DevShareMCLPCS",
        variant: "primary",
        icon: "microsoft",
      },
    ],
  },
  {
    title: "Python Image Processing System",
    subtitle: "OpenCV-powered visual intelligence suite for computer vision tasks, edge detection, automated filtering pipelines, and spatial transforms.",
    category: "Computer Vision & AI",
    filterCategory: "algorithms",
    status: "Open Source",
    statusType: "opensource",
    icon: "biotech",
    highlights: ["OpenCV Vision Pipeline", "Edge & Contour Detection", "Automated Batch Transforms"],
    tech: ["Python", "OpenCV", "PIL", "NumPy"],
    actions: [
      { label: "View GitHub Repo", href: "https://github.com/Kushang1901/Python-Image-Processing", variant: "primary", icon: "code" },
      { label: "Download Project (.zip)", href: "https://github.com/Kushang1901/Python-Image-Processing/archive/refs/heads/main.zip", variant: "secondary", icon: "download" },
    ],
  },
  {
    title: "SoundWave E-Commerce",
    subtitle: "Futuristic audio retail experience featuring custom visualizers, persistent shopping cart, Google authentication, and high-fidelity product showcase.",
    category: "E-Commerce Web App",
    filterCategory: "web",
    status: "Live Prototype",
    statusType: "live",
    icon: "headphones",
    highlights: ["Next.js App Router Architecture", "Google OAuth Authentication", "Dynamic Audio Visualizer UI"],
    tech: ["Next.js", "React", "Tailwind CSS", "OAuth"],
    actions: [
      { label: "View Live Site", href: "https://my-soundwave.vercel.app/auth", variant: "primary", icon: "arrow_outward" },
    ],
  },
  {
    title: "AWARENEST - Harmony",
    subtitle: "Mindful mobile application design concept centered on emotional wellness, meditation pacing, and calming glassmorphic aesthetics.",
    category: "UI/UX Mobile Design",
    filterCategory: "design",
    status: "Figma Prototype",
    statusType: "design",
    icon: "spa",
    highlights: ["Comprehensive Design System", "Interactive Mobile Flow", "Glassmorphic Wellness UI"],
    tech: ["Figma", "UX Research", "Mobile App UI", "Interaction Design"],
    actions: [
      { label: "Explore in Figma", href: "https://www.figma.com/design/mRJieppUerKaA8hsBhvZy9/AwareNest--UED-Project?node-id=0-1&p=f&t=FV4rhhuJyJp3cylN-0", variant: "primary", icon: "palette" },
    ],
  },
  {
    title: "Comtech Systems",
    subtitle: "IT Infrastructure, Security & Communication Solutions corporate portal communicating high-tier enterprise IT engineering services.",
    category: "Enterprise Web Portal",
    filterCategory: "web",
    status: "Live Client",
    statusType: "live",
    icon: "router",
    highlights: ["Enterprise IT Architecture", "Lead Generation Pipeline", "Modern Responsive Layout"],
    tech: ["Next.js", "Tailwind CSS", "React", "JavaScript"],
    actions: [
      { label: "View Live Site", href: "https://comtech-systems.in", variant: "primary", icon: "arrow_outward" },
    ],
  },
  {
    title: "Archery Legends: TrueFlight 3D",
    subtitle: "Precision 3D archery sports simulation featuring realistic aerodynamic arrow ballistics, dynamic wind physics, and cinematic target cameras.",
    category: "3D Sports Simulation",
    filterCategory: "games",
    status: "Microsoft Store",
    statusType: "store",
    icon: "sports_esports",
    highlights: ["Aerodynamic Ballistics & Wind Physics", "Dynamic Cinematic Camera Suite", "Windows Store Certified"],
    tech: ["Unity / C#", "3D Physics Engine", "Cinemachine", "Windows Store"],
    actions: [
      { label: "View on Store", href: "https://apps.microsoft.com/detail/9PLSNG82FZ7L?hl=en-us&gl=US&ocid=pdpshare", variant: "primary", icon: "microsoft" },
    ],
  },
  {
    title: "CyberStrike: Robot Outbreak - 3D FPS",
    subtitle: "Fast-paced sci-fi first-person shooter featuring reactive enemy robot AI behaviors, spatial 3D audio, and immersive cybernetic combat environments.",
    category: "3D Sci-Fi FPS Game",
    filterCategory: "games",
    status: "Microsoft Store",
    statusType: "store",
    icon: "sports_esports",
    highlights: ["Autonomous Enemy AI NavMesh", "Spatial 3D Audio & Particle FX", "Windows Store Certified"],
    tech: ["3D Game Engine", "C#", "Enemy AI / NavMesh", "Windows Store"],
    actions: [
      { label: "View on Store", href: "https://apps.microsoft.com/detail/9PLDBSWW70DZ?hl=en-us&gl=US&ocid=pdpshare", variant: "primary", icon: "microsoft" },
    ],
  },
  {
    title: "VEXO - Universal Media Player",
    subtitle: "High-performance desktop multimedia player supporting comprehensive audio/video codecs with hardware acceleration, playlist queuing, and smooth playback controls.",
    category: "Desktop Media Engine",
    filterCategory: "desktop",
    status: "Microsoft Store",
    statusType: "store",
    icon: "play_circle",
    highlights: ["Hardware-Accelerated Decoding", "Universal Multi-Codec Playback", "Windows Store Certified"],
    tech: ["Electron / React", "Media Decoders", "Hardware Acceleration", "Windows Store"],
    actions: [
      { label: "View on Store", href: "https://apps.microsoft.com/detail/9PNM33BX82DN?hl=en-us&gl=US&ocid=pdpshare", variant: "primary", icon: "microsoft" },
    ],
  },
];

const contactLinks = [
  { label: "kushangacharya8830@gmail.com", href: "mailto:kushangacharya8830@gmail.com", icon: "mail" },
  { label: "+91 97242 36385", href: "tel:+919724236385", icon: "call" },
  { label: "Download My Résumé", href: "/UPDATED%20CV.pdf", icon: "description" },
];

export default function Home() {
  const heroFrameRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const filterTabs = [
    { key: "all", label: "All Projects", count: projects.length },
    { key: "web", label: "Web Applications", count: projects.filter((p) => p.filterCategory === "web").length },
    { key: "desktop", label: "Desktop & Store Apps", count: projects.filter((p) => p.filterCategory === "desktop").length },
    { key: "games", label: "3D Games & Sim", count: projects.filter((p) => p.filterCategory === "games").length },
    { key: "algorithms", label: "Vision & Algorithms", count: projects.filter((p) => p.filterCategory === "algorithms").length },
    { key: "design", label: "UI/UX Design", count: projects.filter((p) => p.filterCategory === "design").length },
  ];

  const filteredProjects = activeCategory === "all"
    ? projects
    : projects.filter((p) => p.filterCategory === activeCategory);

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
      <WelcomeLoader />
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
                <a className="button button-secondary" href="/UPDATED%20CV.pdf" target="_blank" rel="noopener noreferrer">
                  Resume
                </a>
              </div>
            </div>

            <div className="hero-frame-wrap" ref={heroFrameRef}>
              <div className="hero-frame-shadow" aria-hidden="true"></div>
              <div className="hero-frame" style={{ aspectRatio: "4 / 5" }}>
                <Image
                  src="/profile-image.jpg"
                  alt="Kushang Acharya - Frontend Engineer and Web Architect Portrait"
                  fill
                  priority
                  sizes="(max-width: 1080px) 100vw, 420px"
                  style={{ objectFit: "cover" }}
                />
                <span className="hero-flag">Dwarka,Gujarat</span>
              </div>
            </div>
          </div>
        </section>

        <section className="surface-strip">
          <div className="container hero-stats">
            <div className="stat-card">
              <span className="stat-number">15+</span>
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
                  rel="noopener noreferrer"
                  className="achievement-card"
                  aria-label={`View certificate or document for ${achievement.title} - opens in a new tab`}
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
                  <a className="button button-secondary" href="https://drive.google.com/file/d/1XD8T9zm6AjRMDNrvXmua7YbOXdLY2IIL/view?usp=drive_link" target="_blank" rel="noopener noreferrer" aria-label="View DreamsDesign Internship Certificate - opens in a new tab">
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
                <p className="eyebrow">Architectural Showcase</p>
                <h2 className="headline headline-lg">Featured Projects</h2>
              </div>
              <div className="mono-label muted-text">
                Showing {filteredProjects.length} of {projects.length} System{projects.length === 1 ? "" : "s"}
              </div>
            </div>

            {/* Interactive Category Filter Bar */}
            <div className="project-filter-bar" role="tablist" aria-label="Filter projects by category">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === tab.key}
                  className={`project-filter-btn ${activeCategory === tab.key ? "active" : ""}`}
                  onClick={() => setActiveCategory(tab.key)}
                >
                  <span>{tab.label}</span>
                  <span className="project-filter-count">{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="project-grid">
              {filteredProjects.map((project, index) => (
                <article key={project.title} className="project-card">
                  <div className="project-card-header">
                    <div className="project-card-meta-left">
                      <span className="project-card-index">/{String(index + 1).padStart(2, "0")}</span>
                      <span className="project-category-pill">
                        <span className="material-symbols-outlined project-cat-icon">{project.icon}</span>
                        <span>{project.category}</span>
                      </span>
                    </div>
                    <div className={`project-status-pill status-${project.statusType}`}>
                      <span className="project-status-dot"></span>
                      <span>{project.status}</span>
                    </div>
                  </div>

                  <div className="project-card-main">
                    <a
                      href={project.actions[0]?.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-title-link"
                      aria-label={`Open ${project.title} project`}
                    >
                      <h3 className="project-title">
                        <span>{project.title}</span>
                        <span className="material-symbols-outlined project-title-arrow">arrow_outward</span>
                      </h3>
                    </a>
                    <p className="project-meta">{project.subtitle}</p>
                  </div>

                  {project.highlights && (
                    <div className="project-highlights">
                      {project.highlights.map((highlight, hIdx) => (
                        <div key={hIdx} className="project-highlight-item">
                          <span className="project-highlight-bullet">✦</span>
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}

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
                        rel="noopener noreferrer"
                        aria-label={`${action.label} for ${project.title} - opens in a new tab`}
                      >
                        {action.icon === "microsoft" && (
                          <svg
                            className="project-action-icon"
                            width="14"
                            height="14"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginRight: "0.55rem", flexShrink: 0 }}
                            aria-hidden="true"
                          >
                            <rect x="0" y="0" width="9.2" height="9.2" fill="#F25022" />
                            <rect x="10.8" y="0" width="9.2" height="9.2" fill="#7FBA00" />
                            <rect x="0" y="10.8" width="9.2" height="9.2" fill="#00A4EF" />
                            <rect x="10.8" y="10.8" width="9.2" height="9.2" fill="#FFB900" />
                          </svg>
                        )}
                        {action.icon && action.icon !== "microsoft" && (
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "1.05rem", marginRight: "0.45rem", verticalAlign: "middle" }}
                          >
                            {action.icon}
                          </span>
                        )}
                        <span>{action.label}</span>
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
            <a className="footer-link" href="https://github.com/Kushang1901" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a className="footer-link" href="https://www.linkedin.com/in/kushang-acharya-938a712a6/" target="_blank" rel="noopener noreferrer">
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
