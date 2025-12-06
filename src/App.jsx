import { useState, useEffect, useRef } from "react";
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaFileAlt,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaApple,
} from "react-icons/fa";

/* ============================================================
   STARFIELD (static stars)
   ============================================================ */
const STARS = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  top: Math.random() * 100,
  left: Math.random() * 100,
  size: Math.random() * 2 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 5 + 4,
  opacity: Math.random() * 0.5 + 0.5,
}));

function StarField() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-gradient-to-br from-black via-[#020411] to-black">
      {STARS.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full bg-white/90 star-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ============================================================
   SHOOTING STARS
   ============================================================ */
function ShootingStars() {
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();

      const startTop = Math.random() * 80 + 5;
      const startLeft = Math.random() * 80; // not in rightmost 20%

      const star = { id, top: startTop, left: startLeft };

      setShootingStars((prev) => {
        const next = [...prev, star];
        if (next.length > 6) next.shift();
        return next;
      });

      setTimeout(() => {
        setShootingStars((prev) => prev.filter((s) => s.id !== id));
      }, 1400);
    }, 2000 + Math.random() * 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="shooting-star absolute"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
          }}
        />
      ))}
    </div>
  );
}

/* ===========================
   COMBINED HERO
   =========================== */

const TERMINAL_LINES = ["> Initializing portfolio...", "> whoami"];

function HeroCombined() {
  const [phase, setPhase] = useState("terminal"); // terminal → hero

  const handleDone = () => {
    // scroll smoothly to top when switching phases
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPhase("hero");
  };

  return phase === "terminal" ? (
    <HeroTerminalPhase onDone={handleDone} />
  ) : (
    <HeroTypingPhase />
  );
}

/* ---------- Phase 1: Terminal Boot ---------- */

function HeroTerminalPhase({ onDone }) {
  const lines = TERMINAL_LINES;

  const [lineIndex, setLineIndex] = useState(0);
  const [current, setCurrent] = useState("");
  const [doneLines, setDoneLines] = useState([]);

  useEffect(() => {
    if (lineIndex >= lines.length) {
      const t = setTimeout(() => {
        onDone && onDone();
      }, 800);
      return () => clearTimeout(t);
    }

    let char = 0;
    const line = lines[lineIndex];

    const interval = setInterval(() => {
      setCurrent(line.substring(0, char));
      char++;

      if (char > line.length) {
        clearInterval(interval);

        // avoid duplicate line + show fresh prompt
        setCurrent("> ");

        setDoneLines((prev) => [...prev, line]);
        setTimeout(() => {
          setLineIndex((prev) => prev + 1);
        }, 350);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [lineIndex, onDone]);

  return (
    <section className="py-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-black/70 border border-white/10 rounded-xl px-4 py-4 md:px-6 md:py-5 shadow-lg font-mono">
          {/* Console header line */}
          <p className="text-[11px] md:text-xs text-gray-400 mb-2">
            kai@portfolio:~$
          </p>

          {/* Terminal body */}
          <div className="space-y-1 text-[#4eaaff] text-sm md:text-base">
            {doneLines.map((l, idx) => (
              <p key={idx}>{l}</p>
            ))}

            {lineIndex < lines.length && (
              <p>
                {current}
                <span className="border-r-2 border-[#4eaaff] animate-pulse ml-1" />
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Phase 2: Hero with Photo + Rotating Terminal-Line ---------- */

function HeroTypingPhase() {
  const phrases = [
    "Shipping AI-powered golf tools",
    "Building Mycel OS – OppFest Winner",
    "Designing brokerless logistics systems",
    "Creating ML pipelines for sports",
    "Crafting clean & premium UX/UI",
  ];

  const WARNING_MESSAGES = [
    "Hey! I was using that!!",
    "I'm trying to show you my work!!",
    "Stop typing in my terminal!",
    "Unauthorized input detected!!",
    "Please... I'm literally mid-demo...",
    "Quit messing with my terminal!!",
  ];

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Terminal typing interaction states
  const [terminalFocused, setTerminalFocused] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [lastKeyTime, setLastKeyTime] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");

  const terminalRef = useRef(null);

  /* -------------------------------------------------
     MAIN AUTO-TYPING (disabled when user interacts)
     ------------------------------------------------- */
  useEffect(() => {
    if (terminalFocused) return;

    const fullText = phrases[index];

    const timeout = setTimeout(() => {
      if (!isDeleting && subIndex < fullText.length) {
        setSubIndex((prev) => prev + 1);
      } else if (isDeleting && subIndex > 0) {
        setSubIndex((prev) => prev - 1);
      } else if (!isDeleting && subIndex === fullText.length) {
        setTimeout(() => setIsDeleting(true), 900);
      } else if (isDeleting && subIndex === 0) {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % phrases.length);
      }
    }, isDeleting ? 50 : 90);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, terminalFocused, phrases]);

  /* -------------------------------------------------
     USER KEY HANDLING (only when terminalFocused)
     ------------------------------------------------- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!terminalFocused) return;

      // Prevent scrolling with spacebar
      if (e.key === " ") {
        e.preventDefault();
      }

      const tag = e.target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      // If user JUST started typing, pick a random warning
      if (!isUserTyping) {
        const random =
          WARNING_MESSAGES[Math.floor(Math.random() * WARNING_MESSAGES.length)];
        setWarningMessage(random);
      }

      setIsUserTyping(true);
      setLastKeyTime(Date.now());

      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setUserInput((prev) => prev + e.key);
      } else if (e.key === "Backspace") {
        setUserInput((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter") {
        setUserInput("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [terminalFocused, isUserTyping]);

  /* -------------------------------------------------
     AUTO-DELETE USER INPUT (always deletes fully)
     ------------------------------------------------- */
  useEffect(() => {
    if (!terminalFocused || userInput.length === 0) return;

    const interval = setInterval(() => {
      setUserInput((prev) => {
        if (prev.length <= 0) return "";
        return prev.slice(0, -1);
      });
    }, 80);

    return () => clearInterval(interval);
  }, [terminalFocused, userInput.length]);

  /* -------------------------------------------------
     DETECT USER STOPPED TYPING (>3s)
     RESET EVERYTHING
     ------------------------------------------------- */
  useEffect(() => {
    if (!lastKeyTime) return;

    const checkIdle = setInterval(() => {
      const idle = Date.now() - lastKeyTime;

      // Stop showing "typing" state after ~1.2s
      if (idle > 1200 && isUserTyping) {
        setIsUserTyping(false);
      }

      // Fully reset experience after 3 seconds idle
      if (idle > 3000 && userInput.length === 0) {
        setTerminalFocused(false);
        setIsUserTyping(false);
        setLastKeyTime(null);
        setWarningMessage("");

        // Restart hero text animation from the beginning
        setIndex(0);
        setSubIndex(0);
        setIsDeleting(false);
      }
    }, 300);

    return () => clearInterval(checkIdle);
  }, [lastKeyTime, userInput.length, isUserTyping]);

  /* -------------------------------------------------
     CLICKING OUTSIDE TERMINAL UNFOCUSES IT
     ------------------------------------------------- */
  useEffect(() => {
    const handleClick = (e) => {
      if (!terminalRef.current) return;
      if (!terminalRef.current.contains(e.target)) {
        setTerminalFocused(false);
        setUserInput("");
        setIsUserTyping(false);
        setWarningMessage("");
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* -------------------------------------------------
     TERMINAL DISPLAY TEXT
     ------------------------------------------------- */
  const currentPhrase = phrases[index].substring(0, subIndex);
  const activeText = terminalFocused ? userInput : currentPhrase;

  const MAX_CHARS = 60; // never wrap
  const visibleText =
    activeText.length > MAX_CHARS
      ? activeText.slice(-MAX_CHARS)
      : activeText;

  return (
    <section className="relative overflow-hidden py-24 md:py-32 text-center">
      {/* glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="animate-gradient-slow h-[420px] w-[420px] md:h-[520px] md:w-[520px] rounded-full bg-gradient-to-br from-[#4eaaff]/30 via-transparent to-[#4eaaff]/10 blur-3xl opacity-80" />
      </div>

      {/* greeting */}
      <div className="relative max-w-3xl mx-auto mb-10">
        <p className="flex items-center justify-center gap-3 text-lg md:text-2xl text-gray-200 mb-3">
          <span className="text-3xl md:text-4xl">👋</span>
          <span>Hello! My name is</span>
        </p>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-gradient-to-r from-[#4eaaff] via-[#7df9ff] to-[#4eaaff] bg-clip-text text-transparent">
          Kai Samson
        </h1>
      </div>

      {/* photo (bigger now) */}
      <div className="relative flex justify-center mb-10">
        <div className="absolute -inset-4 md:-inset-5 rounded-full bg-black/60 blur-2xl" />
        <img
          src={isUserTyping ? "/kai-stop-typing.jpg" : "/kai-normal.jpg"}
          alt="Kai Samson"
          className={`relative w-52 h-52 md:w-64 md:h-64 lg:w-78 lg:h-78 rounded-full object-cover object-[center_20%] border border-white/20 shadow-2xl transition duration-300 ${
            isUserTyping ? "scale-105 opacity-90" : "scale-100 opacity-100"
          }`}
        />
      </div>

      {/* terminal (wider & taller) */}
      <div className="relative mt-2 flex justify-center">
        <div
          ref={terminalRef}
          onClick={() => {
            setTerminalFocused(true);
            setWarningMessage("");
            setLastKeyTime(null);
          }}
          className={
            "bg-black/70 border border-white/10 rounded-xl px-5 py-4 md:px-7 md:py-5 shadow-lg max-w-2xl w-full mx-6 text-left cursor-text transition " +
            (terminalFocused
              ? "ring-2 ring-[#7df9ff]/80 border-[#7df9ff]"
              : "hover:border-[#7df9ff]/60")
          }
        >
          {/* terminal header */}
          <p className="text-[11px] md:text-xs text-gray-400 font-mono mb-2 flex justify-between">
            <span>kai@portfolio:~$</span>

            {!terminalFocused && (
              <span className="text-[10px] text-gray-500">
                click to type
              </span>
            )}
          </p>

          {/* warning message */}
          {terminalFocused && isUserTyping && warningMessage && (
            <p className="text-[10px] md:text-xs text-red-400 font-mono mb-2">
              ⚠ {warningMessage}
            </p>
          )}

          {/* terminal line (no wrap) */}
          <p className="text-sm md:text-base lg:text-lg text-[#4eaaff] font-mono whitespace-nowrap overflow-hidden">
            {"> "}
            {visibleText}
            <span className="border-r-2 border-[#4eaaff] animate-pulse ml-1" />
          </p>
        </div>
      </div>

      {/* CTA buttons below stay the same */}
    </section>
  );
}







/* ============================================================
   PROJECTS DATA (with images & featured)
   ============================================================ */
const PROJECTS = [
  {
    title: "Neuronami Golf AI",
    subtitle: "AI Swing Analysis App",
    description:
      "iOS app that uses pose estimation and custom ML models to compare golfer swings to tour pros, with swing metrics and real-time feedback.",
    image: "/projects/neuronami-golf-1.png",
    images: [
      "/projects/neuronami-golf-1.png",
      "/projects/neuronami-golf-2.png",
      "/projects/neuronami-golf-3.png",
    ],
    tags: ["Swift", "YOLO", "CoreML", "Firebase"],
    github: null,
    website: null,
    appStoreLabel: "App Store (Spring 2026)",
    primaryLink: null, // you can set this later if you want
    featured: true,
  },
  {
    title: "Mycel OS",
    subtitle: "Brokerless Freight Platform",
    description:
      "Real-time logistics OS that syncs shippers and fleets, removes broker middlemen, and won 1st place at OppFest 2025.  Link to lightweight demo and info-site.",
    image: "/projects/mycel-os.png",
    tags: ["React", "Firebase", "Swift", "JS"],
    github: null,
    website: "https://mycel-demo.web.app/",
    primaryLink: "https://mycel-demo.web.app/", // mini card will click here
    featured: false,
  },
  {
    title: "GolfMirror",
    subtitle: "Delayed Swing Replay",
    description:
      "Range-side tool that records your swing and auto-replays it on a short delay so you can watch yourself between shots without touching your phone.",
    image: "/projects/golfmirror.png",
    tags: ["SwiftUI", "AVFoundation"],
    github: "https://github.com/YOUR_GITHUB/golfmirror",
    website: null,
    primaryLink: "https://github.com/YOUR_GITHUB/golfmirror",
    featured: false,
  },
  {
    title: "Orange Squash - Android",
    subtitle: "14 Oranges Internship Project",
    description:
      "Built during 14 Oranges internship An Android app that allows quick bug reporting to FogBugz with screenshots and device info.",
    image: "/projects/14-oranges.jpg",
    tags: ["Java", "Android Studio", "OkHttp3"],
    github: null,
    website: "https://www.14oranges.com/orange-squash-for-fogbugz/",
    primaryLink: "https://www.14oranges.com/orange-squash-for-fogbugz/",
    featured: false,
  },
  {
    title: "Isekai Origins",
    subtitle: "Top down MMO Combat System",
    description:
      "A Lua combat system for an isekai-themed top-down MMO game built in Roblox, featuring abilities, hitboxing, and dynamic enemy bots.",
    image: "/projects/isekai-origins.jpg",
    tags: ["Lua", "Roblox Studio"],
    github: null,
    website: "https://www.roblox.com/games/111168131214887/Isekai-Origins-Demo",
    primaryLink: "https://www.roblox.com/games/111168131214887/Isekai-Origins-Demo",
    featured: false,
  },
  {
    title: "Finance Tracker - HS Capstone",
    subtitle: "Everyday Expenses",
    description:
      "An Android personal finance tracker created in highschool. Log expenses, plan savings, and manage budgets with an extravagant UI.",
    image: "/projects/everyday-exp.jpg",
    tags: ["Java", "Android Studio"],
    github: "https://github.com/kaisamson/everyday-expenses",
    website: null,
    primaryLink: "https://github.com/kaisamson/everyday-expenses",
    featured: false,
  },
  {
    title: "Titanic Survival ML",
    subtitle: "Python ML Project",
    description:
      "A machine learning model that learns how to predict death on a sinking Titantic given a past dataset of passengers",
    image: "/projects/dma.jpg",
    tags: ["Python", "Keras", "Matplotlib"],
    github: "https://github.com/kaisamson/titanic-survival-ml",
    website: null,
    primaryLink: "https://github.com/kaisamson/titanic-survival-ml",
    featured: false,
  },
];

/* ============================================================
   MINI PROJECT CARD (for grid) — now fully clickable via primary link
   ============================================================ */
function ProjectMiniCard({ project }) {
  const primaryHref =
    project.primaryLink || project.website || project.github || null;

  const CardInner = (
    <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-none backdrop-blur-md transition-transform hover:-translate-y-1 hover:border-[#4eaaff]/70 hover:shadow-[0_0_35px_rgba(78,170,255,0.35)] hover:bg-white/10">
      <div className="relative h-32 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 right-3">
          <p className="text-[11px] text-gray-300">{project.subtitle}</p>
          <h3 className="text-sm font-semibold text-white truncate">
            {project.title}
          </h3>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <p className="text-xs text-gray-300 line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full bg-black/40 border border-white/10 text-[10px] text-gray-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {(project.github || project.website) && (
          <div className="flex flex-wrap gap-3 pt-1">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#7df9ff] hover:text-white transition"
                onClick={(e) => e.stopPropagation()}
              >
                <FaGithub size={12} />
                <span>Code</span>
              </a>
            )}
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#7df9ff] hover:text-white transition"
                onClick={(e) => e.stopPropagation()}
              >
                <FaExternalLinkAlt size={10} />
                <span>Live</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (primaryHref) {
    return (
      <a
        href={primaryHref}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {CardInner}
      </a>
    );
  }

  // Not clickable if no link set
  return CardInner;
}

/* ============================================================
   PROJECT SPOTLIGHT (text left, image carousel right)
   ============================================================ */
function ProjectSpotlight({ project }) {
  const images =
    project.images && project.images.length > 0
      ? project.images
      : [project.image].filter(Boolean);

  const [imageIndex, setImageIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [fading, setFading] = useState(false);

  const switchImage = (nextIndex) => {
    setPrevIndex(imageIndex);
    setImageIndex(nextIndex);
    setFading(true);

    setTimeout(() => setFading(false), 500); // match fade duration
  };

  const handleUserInteraction = (callback) => (e) => {
    e.stopPropagation();
    setIsAutoRotate(false);
    setLastInteraction(Date.now());
    callback();
  };

  const handlePrev = handleUserInteraction(() => {
    switchImage(imageIndex === 0 ? images.length - 1 : imageIndex - 1);
  });

  const handleNext = handleUserInteraction(() => {
    switchImage(imageIndex === images.length - 1 ? 0 : imageIndex + 1);
  });

  const handleDotClick = (i) =>
    handleUserInteraction(() => {
      switchImage(i);
    });

  // Auto rotate
  useEffect(() => {
    if (!isAutoRotate || images.length <= 1) return;

    const interval = setInterval(() => {
      switchImage(imageIndex === images.length - 1 ? 0 : imageIndex + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoRotate, imageIndex, images.length]);

  // Resume auto-rotate after 40s
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAutoRotate(true);
    }, 40000);

    return () => clearTimeout(timeout);
  }, [lastInteraction]);

  return (
    <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-none backdrop-blur-md transition-transform hover:-translate-y-1 hover:border-[#4eaaff]/80 hover:shadow-[0_0_45px_rgba(78,170,255,0.4)] hover:bg-white/10">
      <div className="grid md:grid-cols-2">

        {/* LEFT: Text content */}
        <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">

          <div>
            <p className="text-xs uppercase tracking-wide text-[#7df9ff] mb-1">
              Featured Project
            </p>
            <p className="text-xs text-gray-300">{project.subtitle}</p>
            <h3 className="text-2xl md:text-3xl font-semibold text-white">
              {project.title}
            </h3>
          </div>

          <p className="text-sm md:text-base text-gray-200 leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-gray-200"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Featured App Store label */}
          {project.appStoreLabel && (
            <div className="inline-flex items-center gap-2 rounded-full bg-black/70 border border-[#7df9ff]/70 px-4 py-1.5 text-sm font-medium text-[#7df9ff]">
              <FaApple size={16} />
              <span>{project.appStoreLabel}</span>
            </div>
          )}
        </div>

        {/* RIGHT: Image carousel w/ smooth fade */}
        <div className="relative h-56 md:h-full min-h-[220px] bg-black/60 overflow-hidden">

          {/* Previous Image (fades out) */}
          <img
            key={`prev-${prevIndex}`}
            src={images[prevIndex]}
            alt="prev"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              fading ? "opacity-0" : "opacity-0"
            }`}
          />

          {/* Current Image (fades in) */}
          <img
            key={`current-${imageIndex}`}
            src={images[imageIndex]}
            alt="current"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              fading ? "opacity-0" : "opacity-100"
            }`}
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

          {/* Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-black/60 border border-white/20 p-2 text-white hover:bg-black/80"
              >
                <FaChevronLeft size={16} />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-full bg-black/60 border border-white/20 p-2 text-white hover:bg-black/80"
              >
                <FaChevronRight size={16} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={handleDotClick(i)}
                    className={`h-2.5 w-2.5 rounded-full border border-white/40 ${
                      i === imageIndex ? "bg-[#7df9ff]" : "bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



/* ============================================================
   PROJECTS SECTION — spotlight + 3-column grid
   ============================================================ */
function ProjectsSpotlightSection() {
  const featured = PROJECTS.find((p) => p.featured);
  const others = PROJECTS.filter((p) => !p.featured);

  return (
    <section id="projects" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-white mb-6">Projects</h2>

      <div className="space-y-8">
        {/* Spotlight at the top */}
        {featured && <ProjectSpotlight project={featured} />}

        {/* 3-column responsive grid for the rest */}
        {others.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {others.map((project) => (
              <ProjectMiniCard key={project.title} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   EXPERIENCE DATA (with logos + highlight badge)
   ============================================================ */
const EXPERIENCES = [
  {
    id: "neuronami",
    role: "Founder",
    company: "Neuronami",
    timeframe: "2024 – Present",
    location: "Vancouver, BC",
    blurb:
      "Building AI-native tools for golf practice and logistics, starting with Neuronami Golf – an iOS swing analysis app powered by pose estimation and custom ML.",
    bullets: [
      "Designing and shipping Swift / SwiftUI apps with CoreML, Firebase, and premium UX for golfers.",
      "Prototyping and validating product ideas through demo videos, early testers, and iterative UX.",
      "Owning end-to-end execution: branding, engineering, roadmap, and early go-to-market experiments.",
    ],
    tags: ["Swift / SwiftUI", "CoreML", "Firebase", "Product", "Founder"],
    logo: "/logos/neuronami-logo.svg",
    logoAlt: "Neuronami logo",
    highlight: "Founder & Builder",
  },
  {
    id: "mycel",
    role: "Lead Software Engineer",
    company: "Mycel OS",
    timeframe: "Sept 2025 – Dec 2025",
    location: "SFU · OppFest 2025",
    blurb:
      "Led product and demo for a brokerless freight platform that syncs shippers and fleets in real time and won multiple awards at OppFest 2025.",
    bullets: [
      "Won 1st place in Technology Platforms & Services and High Impact Innovator Runner-Up at OppFest 2025.",
      "Built a real-time Firebase + JS demo in under 30 minutes for live judging under time pressure.",
      "Drove customer discovery with fleet owners / drivers and iterated the business model canvas.",
    ],
    tags: ["Product", "Firebase", "JavaScript", "Logistics", "Competition"],
    logo: "/logos/mycel-logo.svg",
    logoAlt: "Mycel OS logo",
    highlight: "OppFest 2025 Winner 🏆",
  },
 {
  id: "oranges",
  role: "Software Developer Intern",
  company: "14 Oranges Software",
  timeframe: "Aug 2020 – Jul 2021",
  location: "Richmond, BC",
  blurb:
    "Contributed to full-stack mobile tools, client websites, and internal developer workflows during a company-wide transition to Android.",
  bullets: [
    "Built a full-stack Android app used by QA staff and future interns to report bugs directly to developers, enabling mobile access to the project management database during a company-wide iOS → Android migration.",
    "Implemented a Java API Manager using Square OkHttp3 for efficient JSON API request handling across multiple production apps.",
    "Debugged and tested new WebApp features with the QA team, collaborating with developers to rapidly identify and resolve broken functionality.",
    "Developed responsive WordPress.org websites for business clients, improving conversions and traffic through optimized layout, structure, and SEO-focused keyword integration.",
    "Set up secure FTP systems via SSH tunnels on Ubuntu, enabling remote work continuity during COVID-19.",
  ],
  tags: ["Java", "Android", "OkHttp3", "Full-Stack", "QA", "WordPress", "Linux"],
  logo: "/logos/14-oranges.png",
  logoAlt: "14 Oranges Software logo",
  highlight: "Internship",
  },
  {
    id: "cnl",
    role: "Linux Admin / Website Admin",
    company: "C&L Multimedia",
    timeframe: "Sept 2021 – Present",
    location: "Vancouver, BC",
    blurb:
      "Supporting a legacy e-commerce stack by automating workflows, maintaining Linux servers, and keeping large product and client databases up to date.",
    bullets: [
      "Automated HTML page generation with shell scripts, boosting throughput from ~120 pages/hour to over 10,000 pages/hour.",
      "Automated normalization of 100k+ products in a legacy FoxPro SQL database via shell scripts, eliminating 800+ hours of manual entry and ensuring error-free UPC-based naming.",
      "Maintained and updated records for 37,000+ clients in a legacy database, improving data accuracy and enabling more effective customer outreach.",
    ],
    tags: ["Linux", "Shell Scripting", "FoxPro No-SQL", "Automation"],
    logo: "/logos/cnl-logo.svg",         // swap to your real logo path when ready
    logoAlt: "C&L Multimedia logo",
    highlight: "Linux + Automation",
  },
  {
    id: "tutor",
    role: "Assistant Coding Tutor",
    company: "Richmond Public Library",
    timeframe: "2024",
    location: "Richmond, BC",
    blurb:
      "Helped kids take their first steps into programming by teaching Roblox game development workshops focused on creativity and core coding concepts.",
    bullets: [
      "Taught kids how to build simple Roblox games in Roblox Studio, introducing Lua scripting through hands-on projects.",
      "Explained foundational programming ideas—events, conditionals, and loops—in an age-appropriate, game-focused way.",
      "Encouraged creativity and persistence by helping students debug their own games and present their projects to peers.",
    ],
    tags: ["Teaching", "Lua", "Roblox Studio", "STEM Outreach"],
    logo: "/logos/library-logo.svg",     // swap to your real logo path when ready
    logoAlt: "Richmond Public Library logo",
    highlight: "Youth Coding Mentor",
  },
];



/* ============================================================
   EXPERIENCE – COMPANY LANES (compact pills, logos, aligned card)
   ============================================================ */
function ExperienceSection() {
  const [activeId, setActiveId] = useState(EXPERIENCES[0].id);
  const active = EXPERIENCES.find((exp) => exp.id === activeId) || EXPERIENCES[0];

  return (
    <section id="experience" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-white mb-6">Experience</h2>

      <div className="flex flex-col md:flex-row md:items-stretch gap-6 md:gap-8">
        {/* LEFT: Company lane */}
        <div className="w-full md:w-[260px] lg:w-[280px] flex flex-col">

          <div className="space-y-3 flex-1">
            {EXPERIENCES.map((exp) => {
              const isActive = exp.id === activeId;
              return (
                <button
                  key={exp.id}
                  onClick={() => setActiveId(exp.id)}
                  className={`w-full text-left rounded-2xl border px-3 py-3 md:px-4 md:py-3 transition
                    h-[68px] md:h-[72px] flex items-center
                    ${
                      isActive
                        ? "border-[#7df9ff] bg-[#7df9ff]/10 text-white shadow-[0_0_24px_rgba(125,249,255,0.45)]"
                        : "border-white/10 bg-black/40 text-gray-300 hover:border-[#4eaaff]/80 hover:bg-white/5 hover:text-white"
                    }`}
                >
                  {/* Logo + company name only */}
                  <div className="flex items-center gap-2 w-full">
                    {exp.logo && (
                      <img
                        src={exp.logo}
                        alt={exp.logoAlt || exp.company}
                        className="h-12 w-12 md:h-18 md:w-18 object-contain opacity-90"
                      />
                    )}

                    <p className="text-sm md:text-base font-semibold truncate">
                      {exp.company}
                    </p>
                  </div>

                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Active detail card (aligned vertically with lane) */}
        <div className="md:flex-1">
          <div className="bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md p-6 md:p-8 shadow-lg flex flex-col h-full">
            {/* Header: title + highlight */}
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                {/* Title (role + company) */}
                <h3 className="text-xl md:text-2xl font-semibold text-white">
                  {active.role}{" "}
                  <span className="text-[#7df9ff]">— {active.company}</span>
                </h3>
                {/* Date / location */}
                <p className="text-xs md:text-sm text-gray-400 mt-1">
                  {active.timeframe} · {active.location}
                </p>
              </div>

              {/* Highlight badge (award / status) */}
              {active.highlight && (
                <div className="inline-flex items-center max-w-[180px] justify-end">
                  <span className="inline-flex items-center justify-center rounded-full bg-[#7df9ff]/15 border border-[#7df9ff]/70 px-3 py-1 text-[11px] md:text-xs font-medium text-[#7df9ff] text-right whitespace-normal">
                    {active.highlight}
                  </span>
                </div>
              )}
            </div>

            {/* Skills / tags */}
            {active.tags && active.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {active.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-black/50 border border-white/10 text-[11px] md:text-xs text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Blurb + bullets */}
            <p className="text-sm md:text-base text-gray-200 mb-4 leading-relaxed">
              {active.blurb}
            </p>

            <ul className="space-y-2 text-sm md:text-base text-gray-200">
              {active.bullets.map((item, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#7df9ff]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}




/* ============================================================
   EDUCATION
   ============================================================ */
function EducationSection() {
  return (
    <section id="education" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-white mb-6">Education</h2>

      <div className="space-y-4">
        {/* SFU */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-white">
                Simon Fraser University
              </h3>
              <p className="text-sm md:text-base text-[#7df9ff]">
                BSc Computing Science
              </p>
              <p className="text-xs md:text-sm text-gray-400">Burnaby, BC</p>
              <p className="text-xs md:text-sm text-gray-300 mt-2">
                Bachelor&apos;s in Computing Science with a focus on software engineering and AI.
              </p>
            </div>

            <p className="text-xs md:text-sm text-gray-400 whitespace-nowrap">
              2025 – Present
            </p>
          </div>
        </div>

        {/* Langara */}
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-white">
                Langara College
              </h3>
              <p className="text-sm md:text-base text-[#7df9ff]">
                ASc Computer Science (Part-time)
              </p>
              <p className="text-xs md:text-sm text-gray-400">Vancouver, BC</p>
              <p className="text-xs md:text-sm text-gray-300 mt-2">
                Part-time Associate of Science in Computer Science while working and building projects.
              </p>
            </div>

            <p className="text-xs md:text-sm text-gray-400 whitespace-nowrap">
              2021 – 2025
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   CONTACT
   ============================================================ */
function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Get In Touch
      </h2>

      <p className="text-center text-gray-300 max-w-xl mx-auto mb-10 text-sm md:text-base">
        Whether it's internships, collaborations, or chatting about AI + golf,
        feel free to reach out. I try to respond within a day.
      </p>

      <div className="flex flex-col items-center gap-4">

        {/* EMAIL */}
        <a
          href="mailto:samsonkai123@gmail.com"
          className="inline-flex items-center gap-3 rounded-xl border-2 border-[#4eaaff] bg-black/60 px-7 py-3 text-white text-lg font-semibold shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-[#7df9ff] transition w-[260px] justify-center"
        >
          <FaEnvelope className="text-[#7df9ff]" size={22} />
          Email Me
        </a>

        {/* LINKEDIN */}
        <a
          href="https://www.linkedin.com/in/kaisamson/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-xl border-2 border-[#4eaaff] bg-black/60 px-7 py-3 text-white text-lg font-semibold shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-[#7df9ff] transition w-[260px] justify-center"
        >
          <FaLinkedin className="text-[#7df9ff]" size={22} />
          LinkedIn Message
        </a>

        {/* OPTIONAL – CALENDLY */}
        {/* Add later if you want:
        <a
          href="https://calendly.com/YOUR_LINK"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 rounded-xl border-2 border-[#4eaaff] bg-black/60 px-7 py-3 text-white text-lg font-semibold shadow-md hover:shadow-xl hover:-translate-y-1 hover:border-[#7df9ff] transition w-[260px] justify-center"
        >
          <FaCalendarAlt className="text-[#7df9ff]" size={22} />
          Book a Call
        </a>
        */}
      </div>
    </section>
  );
}


/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const [modal, setModal] = useState({
    open: false,
    title: "",
    content: null,
  });

  const closeModal = () => setModal((m) => ({ ...m, open: false }));

  return (
    <div className="min-h-screen text-gray-200 relative z-10">
      <StarField />
      <ShootingStars />

      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left label */}
          <span className="text-base md:text-lg font-semibold tracking-wide text-white">
            KS
          </span>

          {/* Right: nav buttons */}
          <nav className="flex gap-6 md:gap-8">
            <a
              href="#projects"
              className="text-white text-base md:text-lg font-medium hover:text-[#7df9ff] transition"
            >
              Projects
            </a>
            <a
              href="#experience"
              className="text-white text-base md:text-lg font-medium hover:text-[#7df9ff] transition"
            >
              Experience
            </a>
            <a
              href="#education"
              className="text-white text-base md:text-lg font-medium hover:text-[#7df9ff] transition"
            >
              Education
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <HeroCombined />

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 pb-24 space-y-24">
        <ProjectsSpotlightSection />
        <ExperienceSection />
        <EducationSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs md:text-sm text-gray-400">
            © {new Date().getFullYear()} Kai Samson. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://github.com/kaisamson"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[#7df9ff] transition"
            >
              <FaGithub size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/kaisamson"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-[#7df9ff] transition"
            >
              <FaLinkedin size={20} />
            </a>
            <a
              href="mailto:khs11@sfu.ca"
              className="text-gray-300 hover:text-[#7df9ff] transition"
            >
              <FaEnvelope size={20} />
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
