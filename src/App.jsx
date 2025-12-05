import { useState, useEffect } from "react";

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

const TERMINAL_LINES = [
  "> Initializing portfolio...",
  "> whoami",
];


function HeroCombined() {
  // ❌ remove TypeScript generic, just plain JS:
  const [phase, setPhase] = useState("terminal"); // "terminal" | "hero"

  return phase === "terminal" ? (
    <HeroTerminalPhase onDone={() => setPhase("hero")} />
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

      // ✅ add this to avoid duplicate line
      setCurrent("> ");          // clear the typing line

      setDoneLines((prev) => [...prev, line]);
      setTimeout(
        () => setLineIndex((prev) => prev + 1),
        350
      );
    }
  }, 40);

  return () => clearInterval(interval);
  }, [lineIndex, onDone]);


  return (
    <section className="py-32 font-mono text-[#4eaaff] text-base md:text-lg">
      <div className="max-w-3xl mx-auto bg-black/60 backdrop-blur-md p-6 md:p-8 rounded-xl border border-white/10 shadow-xl">
        <div className="space-y-1">
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

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const fullText = phrases[index];

      if (!isDeleting && subIndex < fullText.length) {
        setSubIndex(subIndex + 1);
      } else if (isDeleting && subIndex > 0) {
        setSubIndex(subIndex - 1);
      } else if (!isDeleting && subIndex === fullText.length) {
        setTimeout(() => setIsDeleting(true), 900);
      } else if (isDeleting && subIndex === 0) {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % phrases.length);
      }
    }, isDeleting ? 50 : 90);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index]);

  return (
    <section className="relative overflow-hidden py-24 md:py-32 text-center">
      {/* Soft central glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="animate-gradient-slow h-[380px] w-[380px] md:h-[450px] md:w-[450px] rounded-full bg-gradient-to-br from-[#4eaaff]/30 via-transparent to-[#4eaaff]/10 blur-3xl opacity-80" />
      </div>

      {/* PHOTO */}
      <div className="relative flex justify-center mb-8">
        <div className="absolute -inset-3 rounded-full bg-black/60 blur-xl" />
        <img
          src="/your-photo.jpg"
          alt="Kai Samson"
          className="relative w-40 h-40 md:w-52 md:h-52 rounded-full object-cover border border-white/20 shadow-2xl"
        />
      </div>

      {/* Name */}
      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
        Kai Samson
      </h1>

      {/* Typing Line — terminal look */}
      <p className="mt-4 text-xl md:text-2xl text-[#4eaaff] h-8 font-mono">
        {"> "}
        {phrases[index].substring(0, subIndex)}
        <span className="border-r-2 border-[#4eaaff] animate-pulse ml-1" />
      </p>
    </section>
  );
}

/* ============================================================
   PROJECT CARD
   ============================================================ */
function ProjectCard({ title, subtitle, tags, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#4eaaff]/50 rounded-2xl p-5 md:p-6 backdrop-blur-md shadow-lg transition cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-3">{subtitle}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={i}
            className="px-2 py-1 rounded-full bg-black/40 border border-white/10 text-xs text-gray-200"
          >
            {tag}
          </span>
        ))}
      </div>
    </button>
  );
}

/* ============================================================
   SECTIONS (Projects / Experience / Education)
   ============================================================ */
function ProjectsSection({ openModal }) {
  return (
    <section id="projects" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-white mb-6">Projects</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <ProjectCard
          title="Neuronami Golf AI"
          subtitle="AI Swing Analysis App"
          tags={["Swift", "YOLO", "CoreML"]}
          onClick={() =>
            openModal(
              "Neuronami Golf AI",
              <div>
                <p>
                  iOS app using pose estimation + ML to compare user swings to
                  professional models.
                </p>
              </div>
            )
          }
        />
        <ProjectCard
          title="Mycel OS"
          subtitle="Brokerless Freight Platform"
          tags={["React", "Firebase", "Swift"]}
          onClick={() =>
            openModal(
              "Mycel OS",
              <div>
                <p>
                  Real-time logistics platform built for OppFest 2025 — 1st
                  place winner.
                </p>
              </div>
            )
          }
        />
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-white mb-6">Experience</h2>

      <div className="space-y-4">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <h3 className="text-white font-semibold">Founder — Neuronami</h3>
          <p className="text-gray-400 text-sm mt-1">2024–Present</p>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <h3 className="text-white font-semibold">
            Product Lead — Mycel OS
          </h3>
          <p className="text-gray-400 text-sm mt-1">OppFest 2025 Winner</p>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <h3 className="text-white font-semibold">
            Software Developer Intern — 14 Oranges Software
          </h3>
          <p className="text-gray-400 text-sm mt-1">2020 Oct–2021 Aug</p>
        </div>
      </div>
    </section>
  );
}

function EducationSection() {
  return (
    <section id="education" className="scroll-mt-24">
      <h2 className="text-3xl font-bold text-white mb-6">Education</h2>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <h3 className="text-white font-semibold">
          Simon Fraser University — BSc Computing Science
        </h3>
        <p className="text-gray-400 text-sm mt-1">2025–Present</p>
      </div>

      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
        <h3 className="text-white font-semibold">
          Langara College — ASc Computer Science (Part-time)
        </h3>
        <p className="text-gray-400 text-sm mt-1">2021–2025</p>
      </div>
    </section>
  );
}

/* ============================================================
   MODAL COMPONENT
   ============================================================ */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-2xl bg-[#050816] border border-white/10 shadow-2xl p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
        <div className="text-gray-300 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
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

  const openModal = (title, content) =>
    setModal({ open: true, title, content });

  const closeModal = () =>
    setModal((m) => ({ ...m, open: false }));

  return (
    <div className="min-h-screen text-gray-200 relative z-10">
      <StarField />
      <ShootingStars />

      {/* Navbar */}
      <header className="sticky top-0 z-20 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold tracking-wide text-white">
            Kai Samson
          </h1>
          <nav className="space-x-6 text-sm">
            <a href="#projects" className="hover:text-white text-gray-300">
              Projects
            </a>
            <a href="#experience" className="hover:text-white text-gray-300">
              Experience
            </a>
            <a href="#education" className="hover:text-white text-gray-300">
              Education
            </a>
          </nav>
        </div>
      </header>

      {/* HERO — use the combined one */}
      <HeroCombined />

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto px-6 pb-32 space-y-24">
        <ProjectsSection openModal={openModal} />
        <ExperienceSection />
        <EducationSection />
      </main>

      {/* Modal */}
      <Modal open={modal.open} onClose={closeModal} title={modal.title}>
        {modal.content}
      </Modal>
    </div>
  );
}
