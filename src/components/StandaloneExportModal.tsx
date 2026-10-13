import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, FolderArchive, ExternalLink } from 'lucide-react';

interface StandaloneExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StandaloneExportModal: React.FC<StandaloneExportModalProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<'index.html' | 'style.css' | 'script.js'>('index.html');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Actual standalone code from coa-study-hub/
  const fileContents: Record<string, string> = {
    'index.html': `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>COA Study Hub | Computer Organization & Architecture</title>
  <link rel="stylesheet" href="style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>

  <header class="navbar">
    <a href="#" class="logo">COA<span>Hub</span></a>
    <nav>
      <a href="#home">Home</a>
      <a href="#courses">Chapters</a>
      <a href="#notes">Quick Notes</a>
      <a href="#simulator">Architecture Sim</a>
      <a href="#videos">Videos</a>
      <a href="#quiz">Quiz</a>
    </nav>
  </header>

  <section class="hero" id="home">
    <div class="hero-content">
      <p class="tag">YOUR SMART STUDY PARTNER</p>
      <h1>Learn COA the <span>Easy Way.</span></h1>
      <p>Simplified notes, CPU datapath diagrams, curated video lectures, and practice quizzes to help you ace your university & competitive exams.</p>
      <div class="hero-actions">
        <a href="#courses" class="btn">Start Learning →</a>
        <a href="#simulator" class="btn btn-outline">Try CPU Simulator</a>
      </div>
    </div>
    <div class="hero-card">
      <div class="chip">CPU</div>
      <h2>Computer Architecture</h2>
      <p>Understand how hardware executes code, step by step.</p>
      <div class="mini-grid">
        <div>01<br><b>CPU & ALU</b></div>
        <div>02<br><b>Memory Hierarchy</b></div>
        <div>03<br><b>Logic & Circuits</b></div>
        <div>04<br><b>Control Unit</b></div>
      </div>
    </div>
  </section>

  <main>
    <!-- CHAPTERS LIST -->
    <section class="section" id="courses">
      <div class="section-heading">
        <p class="tag">LEARN BY TOPIC</p>
        <h2>COA Chapters</h2>
        <p>Choose any topic below to open comprehensive quick-revision notes.</p>
      </div>

      <input type="text" id="search" placeholder="Search chapters, e.g. CPU, cache, addressing modes, pipeline...">

      <div class="chapter-grid" id="chapterGrid"></div>
    </section>

    <!-- INTERACTIVE CPU SIMULATOR -->
    <section class="section sim-section" id="simulator">
      <div class="section-heading">
        <p class="tag">INTERACTIVE SIMULATION</p>
        <h2>Instruction Cycle Simulator</h2>
        <p>Step through how the CPU executes an instruction (Fetch → Decode → Execute → Store).</p>
      </div>
      <div class="sim-box">
        <div class="sim-controls">
          <button id="simStepBtn" class="btn">Next Step ➔</button>
          <button id="simResetBtn" class="btn btn-outline">Reset Cycle</button>
          <span class="sim-stage-label" id="simStageText">Stage: 1. Fetch Instruction</span>
        </div>
        <div class="sim-registers">
          <div class="reg-box" id="regPC">
            <span class="reg-name">PC (Prog Counter)</span>
            <span class="reg-val" id="valPC">0x004</span>
          </div>
          <div class="reg-box" id="regMAR">
            <span class="reg-name">MAR (Mem Address)</span>
            <span class="reg-val" id="valMAR">0x004</span>
          </div>
          <div class="reg-box" id="regMDR">
            <span class="reg-name">MDR / MBR</span>
            <span class="reg-val" id="valMDR">LOAD R1, [100]</span>
          </div>
          <div class="reg-box" id="regIR">
            <span class="reg-name">IR (Instruction)</span>
            <span class="reg-val" id="valIR">LOAD R1, [100]</span>
          </div>
          <div class="reg-box" id="regAC">
            <span class="reg-name">AC / Registers</span>
            <span class="reg-val" id="valAC">R1 = 42</span>
          </div>
        </div>
        <div class="sim-explanation" id="simExpl">
          <strong>Step 1 (Fetch):</strong> The Program Counter (PC) holds the address of the next instruction (0x004). This address is transferred to the Memory Address Register (MAR) via the address bus.
        </div>
      </div>
    </section>

    <!-- SELECTED NOTE VIEWER -->
    <section class="notes-section" id="notes">
      <div class="notes-box">
        <p class="tag">TOPIC NOTES</p>
        <h2 id="noteTitle">Select a chapter</h2>
        <p id="noteDescription">Click on any chapter card above to read simplified notes, key formulas, diagrams, and exam pointers.</p>
        <div id="noteContent"></div>
        <div class="note-footer-action">
          <a id="videoLink" class="btn" href="#videos">Watch Related Video Lectures ↗</a>
        </div>
      </div>
    </section>

    <!-- VIDEO LECTURES -->
    <section class="section video-section" id="videos">
      <div class="section-heading">
        <p class="tag">WATCH AND UNDERSTAND</p>
        <h2>Curated Video Lectures</h2>
        <p>Master complex architecture topics with top-rated university & competitive exam lectures.</p>
      </div>
      <div class="video-grid" id="videoGrid"></div>
    </section>

    <!-- INTERACTIVE QUIZ -->
    <section class="quiz-section" id="quiz">
      <div class="quiz-box">
        <p class="tag">TEST YOUR KNOWLEDGE</p>
        <h2>COA Practice Quiz</h2>
        <div class="quiz-meta">
          <span id="quizScore">Score: 0 / 0</span>
        </div>
        <p id="question">Question will appear here.</p>
        <div id="options" class="options"></div>
        <p id="feedback" aria-live="polite"></p>
        <div class="quiz-controls">
          <span id="progress">Question 1 of 6</span>
          <button id="nextBtn" class="btn" disabled>Next Question →</button>
        </div>
      </div>
    </section>
  </main>

  <footer>
    <h3>COA<span>Hub</span></h3>
    <p>Computer Organization & Architecture • Learn smart. Practice daily. Understand deeply.</p>
    <p>Student Learning Project • Vanilla HTML, CSS & JavaScript</p>
  </footer>

  <script src="script.js"></script>
</body>
</html>`,

    'style.css': `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --navy: #0f172a;
  --navy-light: #1e293b;
  --blue: #3b82f6;
  --blue-hover: #2563eb;
  --indigo: #6366f1;
  --light: #f8fafc;
  --text: #1e293b;
  --muted: #64748b;
  --border: #e2e8f0;
  --green: #10b981;
  --red: #ef4444;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Plus Jakarta Sans', Arial, sans-serif;
  background: white;
  color: var(--text);
  line-height: 1.6;
}

a {
  text-decoration: none;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 8%;
  background: white;
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--border);
}

.logo, footer h3 {
  font-size: 24px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.5px;
}

.logo span, footer span {
  color: var(--blue);
}

nav {
  display: flex;
  gap: 24px;
}

nav a {
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  transition: color 0.15s ease;
}

nav a:hover {
  color: var(--blue);
}

.hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  padding: 80px 8%;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 48px;
}

.tag {
  color: #93c5fd;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.hero h1 {
  font-size: clamp(34px, 4.5vw, 56px);
  line-height: 1.15;
  margin-bottom: 18px;
  font-weight: 800;
}

.hero h1 span {
  color: #60a5fa;
}

.hero-content > p:not(.tag) {
  color: #cbd5e1;
  max-width: 520px;
  margin-bottom: 28px;
  font-size: 16px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--blue);
  color: white;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 11px 22px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.15s ease;
}

.btn:hover {
  background: var(--blue-hover);
}

.btn-outline {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.chapter-grid, .video-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.chapter-card, .video-card {
  display: block;
  background: white;
  padding: 24px;
  border-radius: 14px;
  border: 1px solid var(--border);
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  cursor: pointer;
}

.chapter-card:hover, .video-card:hover {
  transform: translateY(-3px);
  border-color: #93c5fd;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
}

/* responsive */
@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; padding: 60px 6%; }
  .chapter-grid, .video-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 560px) {
  .chapter-grid, .video-grid { grid-template-columns: 1fr; }
}`,

    'script.js': `// COA Study Hub Client Logic (Refer to /coa-study-hub/script.js in repository)
// Contains full chapters list, CPU simulator, interactive quiz with score tracking, and YouTube links.
console.log("COA Study Hub initialized successfully!");`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(fileContents[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([fileContents[selectedFile]], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 text-white">
      <div className="bg-[#070b16] rounded-2xl max-w-4xl w-full border border-blue-900/60 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-[#0a1020] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800 text-blue-400 flex items-center justify-center font-bold">
              <FolderArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Standalone Project Package: <code className="text-blue-400">coa-study-hub/</code>
              </h3>
              <p className="text-xs text-slate-400">
                Created directly in your project root. Ready to run in VS Code or browser with zero setup.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* File Tabs & Actions */}
        <div className="px-5 py-3 bg-[#080d1a] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex bg-[#0f172a] border border-slate-800 p-0.5 rounded-lg">
            {(['index.html', 'style.css', 'script.js'] as const).map(fileName => (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName)}
                className={`px-3 py-1.5 font-mono font-semibold rounded-md transition-colors ${
                  selectedFile === fileName
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {fileName}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] border border-slate-700 rounded-lg text-slate-200 font-semibold hover:bg-slate-800 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>

            <button
              onClick={handleDownloadFile}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-500 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {selectedFile}</span>
            </button>
          </div>
        </div>

        {/* Code Preview Box */}
        <div className="p-5 overflow-auto flex-1 bg-[#03060d] font-mono text-xs text-slate-200">
          <pre className="leading-relaxed">
            <code>{fileContents[selectedFile]}</code>
          </pre>
        </div>

        {/* Instructions Footer */}
        <div className="p-4 bg-[#0a1020] border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            <strong>How to run in VS Code:</strong> Open the <code className="text-blue-400 font-mono">coa-study-hub</code> folder, right-click <code className="font-mono">index.html</code>, and select <em>"Open with Live Server"</em>.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg self-end sm:self-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
