// COA Study Hub - Client Script

const chapters = [
  {
    id: "num-sys",
    title: "Number Systems & Binary Arithmetic",
    icon: "01",
    description: "Binary, Decimal, Octal, Hexadecimal conversions, 1's & 2's complement, and IEEE 754 floating point.",
    summary: "Number systems form the foundation of computer hardware data representation.",
    content: `
      <h3>1. Base Conversions</h3>
      <p>Computers process electrical signals as binary bits (0 and 1). Key systems include:</p>
      <ul>
        <li><strong>Binary (Base 2):</strong> Digits 0, 1. Used in digital logic.</li>
        <li><strong>Octal (Base 8):</strong> Digits 0 to 7. Groups 3 binary bits.</li>
        <li><strong>Decimal (Base 10):</strong> Digits 0 to 9. Human standard.</li>
        <li><strong>Hexadecimal (Base 16):</strong> Digits 0-9 and A-F. Groups 4 binary bits.</li>
      </ul>
      <div class="formula">
        Radix conversion rule: Value = Σ (digit_i × base^i)<br>
        Example: (1101)₂ = (1×2³) + (1×2²) + (0×2¹) + (1×2⁰) = 8 + 4 + 0 + 1 = 13₁₀
      </div>

      <h3>2. Signed Numbers & Complements</h3>
      <p>How negative integers are stored in registers:</p>
      <ul>
        <li><strong>1's Complement:</strong> Invert all bits (0 becomes 1, 1 becomes 0). Has duplicate zero representation (+0 and -0).</li>
        <li><strong>2's Complement:</strong> 1's Complement + 1. Standard in modern ALUs because addition and subtraction use the same hardware logic without duplicate zero.</li>
      </ul>
      <div class="formula">
        Find 2's complement of 6 in 8-bit:<br>
        +6 = 0000 0110<br>
        1's complement = 1111 1001<br>
        2's complement = 1111 1001 + 1 = 1111 1010 (-6)
      </div>

      <h3>3. Booth's Multiplication Algorithm</h3>
      <p>An efficient hardware algorithm that multiplies signed binary numbers in 2's complement notation by scanning bit pairs (Q₀, Q₋₁).</p>
      <ul>
        <li>If <strong>1 0:</strong> Subtract multiplicand from accumulator (A = A - M).</li>
        <li>If <strong>0 1:</strong> Add multiplicand to accumulator (A = A + M).</li>
        <li>If <strong>0 0</strong> or <strong>1 1:</strong> Arithmetic Shift Right only.</li>
      </ul>
    `
  },
  {
    id: "logic-gates",
    title: "Boolean Algebra & Logic Circuits",
    icon: "02",
    description: "Logic gates, truth tables, De Morgan's laws, SOP/POS forms, Multiplexers, and Adders.",
    summary: "Digital electronics combine elementary gates to build ALUs, decoders, and memory latches.",
    content: `
      <h3>1. Fundamental Logic Gates</h3>
      <p>Basic gates implement Boolean operations:</p>
      <ul>
        <li><strong>AND (·):</strong> Output 1 only if all inputs are 1.</li>
        <li><strong>OR (+):</strong> Output 1 if at least one input is 1.</li>
        <li><strong>NOT (' or ¬):</strong> Inverter; flips 0 to 1 and 1 to 0.</li>
        <li><strong>NAND & NOR:</strong> Universal gates — any logic circuit can be created using only NAND or only NOR gates.</li>
        <li><strong>XOR (⊕):</strong> Output 1 when inputs are different (odd parity detector). Crucial for binary addition.</li>
      </ul>

      <h3>2. De Morgan's Laws</h3>
      <div class="formula">
        Law 1: (A · B)' = A' + B'<br>
        Law 2: (A + B)' = A' · B'
      </div>

      <h3>3. Combinational Circuits</h3>
      <ul>
        <li><strong>Half Adder:</strong> Sum = A ⊕ B, Carry = A · B.</li>
        <li><strong>Full Adder:</strong> Adds two bits plus input carry (C_in). Sum = A ⊕ B ⊕ C_in.</li>
        <li><strong>Multiplexer (MUX):</strong> 2ⁿ data inputs, n select lines, 1 output. Acts as a data selector.</li>
        <li><strong>Decoder:</strong> n input lines to 2ⁿ output lines. Used for memory address decoding.</li>
      </ul>
    `
  },
  {
    id: "cpu-registers",
    title: "CPU Organization & Registers",
    icon: "03",
    description: "ALU, Control Unit (Hardwired vs Microprogrammed), General & Special purpose registers.",
    summary: "The CPU is the brain of the computer, orchestrating data movement and executing arithmetic logic.",
    content: `
      <h3>1. Core CPU Components</h3>
      <ul>
        <li><strong>Arithmetic Logic Unit (ALU):</strong> Executes addition, bitwise logic, and comparisons.</li>
        <li><strong>Control Unit (CU):</strong> Generates timing and control signals to steer data buses.</li>
        <li><strong>Register File:</strong> High-speed internal storage locations closest to processing circuitry.</li>
      </ul>

      <h3>2. Essential Registers</h3>
      <table>
        <tr><th>Register</th><th>Full Name</th><th>Function</th></tr>
        <tr><td><strong>PC</strong></td><td>Program Counter</td><td>Holds memory address of the next instruction to fetch.</td></tr>
        <tr><td><strong>MAR</strong></td><td>Memory Address Register</td><td>Holds address currently placed onto address bus.</td></tr>
        <tr><td><strong>MDR / MBR</strong></td><td>Memory Data / Buffer Register</td><td>Contains data fetched from or waiting to be written to memory.</td></tr>
        <tr><td><strong>IR</strong></td><td>Instruction Register</td><td>Holds opcode and operands of the instruction being executed.</td></tr>
        <tr><td><strong>AC</strong></td><td>Accumulator</td><td>Stores temporary results of arithmetic/logical operations.</td></tr>
      </table>

      <h3>3. Hardwired vs Microprogrammed Control</h3>
      <ul>
        <li><strong>Hardwired:</strong> Implemented via fixed combinational logic gates. Faster execution (RISC), but inflexible to redesign.</li>
        <li><strong>Microprogrammed:</strong> Control signals generated by reading micro-instructions from Control Memory (ROM). Slower, but easy to update and supports complex CISC instructions.</li>
      </ul>
    `
  },
  {
    id: "instruction-cycle",
    title: "Instruction Cycle & Addressing Modes",
    icon: "04",
    description: "Fetch, Decode, Execute phases, and addressing modes (Direct, Indirect, Indexed, Register).",
    summary: "The CPU operates in an unending sequence of fetch, decode, execute, and interrupt cycles.",
    content: `
      <h3>1. The Instruction Cycle Phases</h3>
      <ol>
        <li><strong>Fetch:</strong> PC points to instruction address. MAR ← PC. Memory is read; MDR ← M[MAR]. IR ← MDR. PC is incremented (PC ← PC + 1).</li>
        <li><strong>Decode:</strong> Control Unit decodes the opcode bits in IR to determine the operation and operand locations.</li>
        <li><strong>Execute:</strong> ALU performs operation; result stored into register or written back to RAM.</li>
        <li><strong>Interrupt (Optional):</strong> CPU checks for external interrupt requests before fetching next instruction.</li>
      </ol>

      <h3>2. Common Addressing Modes</h3>
      <ul>
        <li><strong>Immediate:</strong> Operand is part of instruction itself (e.g., <code>ADD R1, #5</code>). Fastest, no memory access.</li>
        <li><strong>Direct:</strong> Instruction specifies exact memory address of operand (e.g., <code>LOAD R1, [1000]</code>). 1 memory reference.</li>
        <li><strong>Indirect:</strong> Instruction specifies address that contains pointer to operand. Requires 2 memory accesses.</li>
        <li><strong>Register:</strong> Operand resides directly in a CPU register (e.g., <code>ADD R1, R2</code>). Very fast.</li>
        <li><strong>Register Indirect:</strong> Register contains memory address of operand.</li>
        <li><strong>Indexed / Displacement:</strong> Effective Address = Base Register + Offset. Great for array indexing.</li>
      </ul>
    `
  },
  {
    id: "memory-hierarchy",
    title: "Memory Organization & Cache",
    icon: "05",
    description: "Memory hierarchy pyramid, Cache mapping (Direct, Associative, Set-Associative), Hit ratio & Virtual memory.",
    summary: "Memory design balances speed, capacity, and cost using a multi-level hierarchy.",
    content: `
      <h3>1. The Memory Hierarchy</h3>
      <p>Hierarchy from fastest & smallest to slowest & largest:</p>
      <div class="formula">
        Registers (< 1 ns) &gt; L1/L2/L3 Cache (1-10 ns) &gt; Main Memory RAM (50-100 ns) &gt; SSD/HDD (&gt; 10,000 ns)
      </div>

      <h3>2. Cache Mapping Techniques</h3>
      <ul>
        <li><strong>Direct Mapping:</strong> Each block of main memory maps to exactly one specific cache line: <code>Line = Block_Number mod Total_Lines</code>. Simple, but prone to conflict misses.</li>
        <li><strong>Fully Associative:</strong> Any main memory block can be placed in any cache line. Eliminates conflict misses, but requires expensive associative comparison hardware.</li>
        <li><strong>Set-Associative Mapping:</strong> Compromise! Cache is divided into sets. Each block maps to a specific set, but can sit in any line within that set (e.g. 2-way, 4-way, 8-way).</li>
      </ul>

      <h3>3. Key Performance Formulas</h3>
      <div class="formula">
        Hit Ratio (H) = Hits / (Hits + Misses)<br>
        Average Memory Access Time (AMAT) = T_cache + (1 - H) × Miss_Penalty
      </div>
    `
  },
  {
    id: "pipeline-io",
    title: "Pipelining & I/O Organization",
    icon: "06",
    description: "Instruction pipelining, Pipeline hazards (Structural, Data, Control), DMA, and Interrupts.",
    summary: "Pipelining allows overlapping instruction execution, boosting CPU throughput.",
    content: `
      <h3>1. Pipelining Principles</h3>
      <p>Decomposes instruction execution into sequential stages: Fetch (IF), Decode (ID), Execute (EX), Memory (MEM), Write-back (WB). Multiple instructions progress simultaneously like an assembly line.</p>
      <div class="formula">
        Ideal Speedup = Number of stages (k) for large N instructions.<br>
        Clock Cycle Time = max(stage delays) + overhead
      </div>

      <h3>2. Pipeline Hazards</h3>
      <ul>
        <li><strong>Structural Hazards:</strong> Hardware resource conflict (e.g. single memory port accessed for instruction fetch and data read simultaneously).</li>
        <li><strong>Data Hazards (RAW, WAR, WAW):</strong> Instruction depends on the result of an earlier instruction still in flight. Solved by operand forwarding or pipeline stalls (bubbles).</li>
        <li><strong>Control / Branch Hazards:</strong> Caused by conditional branch instructions. Solved by branch prediction or delayed branching.</li>
      </ul>

      <h3>3. I/O Transfer Modes</h3>
      <ul>
        <li><strong>Programmed I/O:</strong> CPU continuously polls device status. Wasteful CPU cycles.</li>
        <li><strong>Interrupt-Driven I/O:</strong> Device signals CPU when ready via interrupt pin.</li>
        <li><strong>Direct Memory Access (DMA):</strong> Specialized DMA controller transfers entire blocks between I/O and RAM directly, freeing the CPU entirely.</li>
      </ul>
    `
  }
];

const videos = [
  {
    title: "Number Systems & Binary Arithmetic",
    channel: "Gate Smashers / NPTEL",
    desc: "Binary, 1's and 2's complement, signed addition, and Booth's algorithm.",
    url: "https://www.youtube.com/results?search_query=COA+number+system+binary+conversion+gate+smashers"
  },
  {
    title: "CPU & Instruction Cycle",
    channel: "Knowledge Gate",
    desc: "Fetch, decode, and execute stages with register transfer notation.",
    url: "https://www.youtube.com/results?search_query=COA+instruction+cycle+CPU+fetch+decode+execute"
  },
  {
    title: "Memory Hierarchy & Cache Mapping",
    channel: "Jenny's Lectures CS IT",
    desc: "Direct, associative, set-associative cache mapping and hit ratio calculations.",
    url: "https://www.youtube.com/results?search_query=COA+cache+memory+mapping+jennys+lectures"
  },
  {
    title: "Addressing Modes Simplified",
    channel: "Gate Smashers",
    desc: "Immediate, Direct, Indirect, Register, and Displacement addressing modes with examples.",
    url: "https://www.youtube.com/results?search_query=COA+addressing+modes+gate+smashers"
  },
  {
    title: "Instruction Pipelining & Hazards",
    channel: "NPTEL / Gate CS",
    desc: "Pipeline stages, throughput, speedup, structural, data, and branch hazards.",
    url: "https://www.youtube.com/results?search_query=COA+pipelining+hazards+speedup"
  },
  {
    title: "DMA & Input/Output Organization",
    channel: "Knowledge Gate",
    desc: "Programmed I/O vs Interrupts vs Direct Memory Access bus mastering.",
    url: "https://www.youtube.com/results?search_query=COA+DMA+controller+interrupt+driven+IO"
  }
];

const quizQuestions = [
  {
    q: "Which register in a computer CPU holds the address of the next instruction to be fetched?",
    options: [
      "Memory Buffer Register (MBR)",
      "Program Counter (PC)",
      "Instruction Register (IR)",
      "Accumulator (AC)"
    ],
    answer: 1,
    explanation: "The Program Counter (PC) automatically holds and increments the memory address of the next instruction."
  },
  {
    q: "What is the 2's complement of the binary number (0101)₂ in 4-bit representation?",
    options: [
      "1010",
      "1011",
      "1100",
      "0110"
    ],
    answer: 1,
    explanation: "0101 inverted is 1010 (1's complement). Adding 1 gives 1011 (2's complement), representing -5."
  },
  {
    q: "In an instruction pipeline with 5 stages running ideally on a large stream of instructions, what is the theoretical maximum speedup?",
    options: [
      "2x",
      "5x",
      "10x",
      "1x"
    ],
    answer: 1,
    explanation: "In an ideal k-stage pipeline without stalls or hazards, speedup approaches k (here, 5x)."
  },
  {
    q: "Which cache mapping technique allows a block of main memory to be placed into ANY cache line?",
    options: [
      "Direct Mapping",
      "Set-Associative Mapping",
      "Fully Associative Mapping",
      "Linear Mapping"
    ],
    answer: 2,
    explanation: "Fully Associative mapping allows any block to go into any line, minimizing conflict misses."
  },
  {
    q: "Which I/O data transfer method completely relieves the CPU from transferring data blocks between memory and peripherals?",
    options: [
      "Programmed I/O",
      "Direct Memory Access (DMA)",
      "Polling",
      "Memory Mapped I/O"
    ],
    answer: 1,
    explanation: "DMA (Direct Memory Access) transfers blocks directly between peripheral and RAM while CPU performs other work."
  },
  {
    q: "Which addressing mode specifies the operand directly within the instruction itself?",
    options: [
      "Direct Addressing",
      "Register Indirect Addressing",
      "Immediate Addressing",
      "Relative Addressing"
    ],
    answer: 2,
    explanation: "In Immediate Addressing mode (e.g. MOV R1, #15), the operand is stored directly within the instruction code."
  }
];

// SIMULATOR STATE
const simStages = [
  {
    stage: "1. Fetch Instruction",
    pc: "0x004",
    mar: "0x004",
    mdr: "LOAD R1, [100]",
    ir: "LOAD R1, [100]",
    ac: "0",
    activeReg: "regMAR",
    desc: "Stage 1 (Fetch): The Program Counter (PC = 0x004) places the instruction address onto the MAR. Memory is accessed via the bus."
  },
  {
    stage: "2. Load into Instruction Register",
    pc: "0x005",
    mar: "0x004",
    mdr: "LOAD R1, [100]",
    ir: "LOAD R1, [100]",
    ac: "0",
    activeReg: "regIR",
    desc: "Stage 2 (Decode): The instruction 'LOAD R1, [100]' moves from MDR into IR. PC increments to 0x005 to prepare for next cycle."
  },
  {
    stage: "3. Decode & Fetch Operand",
    pc: "0x005",
    mar: "0x064 (100)",
    mdr: "42 (Data)",
    ir: "LOAD R1, [100]",
    ac: "0",
    activeReg: "regMDR",
    desc: "Stage 3 (Execute): The Control Unit decodes the opcode. It places memory address 100 into MAR to read the target operand value (42)."
  },
  {
    stage: "4. Store Operand in Register",
    pc: "0x005",
    mar: "0x064",
    mdr: "42",
    ir: "LOAD R1, [100]",
    ac: "R1 = 42",
    activeReg: "regAC",
    desc: "Stage 4 (Store / Writeback): The data value 42 is transferred from MDR into Register R1. Instruction execution is complete!"
  }
];
let currentSimStep = 0;

// RENDER CHAPTERS
function renderChapters(list) {
  const grid = document.getElementById("chapterGrid");
  if (!grid) return;
  grid.innerHTML = "";
  list.forEach(c => {
    const card = document.createElement("div");
    card.className = "chapter-card";
    card.dataset.id = c.id;
    card.innerHTML = `
      <div class="chapter-icon">${c.icon}</div>
      <h3>${c.title}</h3>
      <p>${c.description}</p>
      <span>Read Notes →</span>
    `;
    card.addEventListener("click", () => selectChapter(c.id));
    grid.appendChild(card);
  });
}

function selectChapter(id) {
  const chapter = chapters.find(c => c.id === id);
  if (!chapter) return;

  activeChapterId = id;
  if (typeof updateFavBtnText === "function") {
    updateFavBtnText();
  }

  document.querySelectorAll(".chapter-card").forEach(el => {
    el.classList.toggle("active", el.dataset.id === id);
  });

  document.getElementById("noteTitle").textContent = chapter.title;
  document.getElementById("noteDescription").textContent = chapter.summary;
  document.getElementById("noteContent").innerHTML = chapter.content;

  const notesSection = document.getElementById("notes");
  if (notesSection) {
    notesSection.scrollIntoView({ behavior: "smooth" });
  }
}

// RENDER VIDEOS
function renderVideos() {
  const grid = document.getElementById("videoGrid");
  if (!grid) return;
  grid.innerHTML = "";
  videos.forEach(v => {
    const card = document.createElement("a");
    card.className = "video-card";
    card.href = v.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.innerHTML = `
      <div class="video-icon">▶</div>
      <h3>${v.title}</h3>
      <p><strong>${v.channel}</strong><br>${v.desc}</p>
      <span>Watch Lectures ↗</span>
    `;
    grid.appendChild(card);
  });
}

// SIMULATOR FUNCTIONALITY
function updateSimulator() {
  const step = simStages[currentSimStep];
  document.getElementById("simStageText").textContent = `Stage: ${step.stage}`;
  document.getElementById("valPC").textContent = step.pc;
  document.getElementById("valMAR").textContent = step.mar;
  document.getElementById("valMDR").textContent = step.mdr;
  document.getElementById("valIR").textContent = step.ir;
  document.getElementById("valAC").textContent = step.ac;
  document.getElementById("simExpl").innerHTML = `<strong>${step.stage}:</strong> ${step.desc}`;

  document.querySelectorAll(".reg-box").forEach(el => el.classList.remove("active"));
  const activeEl = document.getElementById(step.activeReg);
  if (activeEl) activeEl.classList.add("active");
}

// QUIZ FUNCTIONALITY
let currentQIndex = 0;
let userScore = 0;
let answered = false;
let quizDuration = 180; // 3 mins demo timer
let quizTimeRemaining = quizDuration;
let quizTimerInterval = null;

function formatQuizClock(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

function startQuizTimer() {
  if (quizTimerInterval) clearInterval(quizTimerInterval);
  const timerEl = document.getElementById("quizTimer");
  if (timerEl) {
    timerEl.textContent = `⏱ Time Left: ${formatQuizClock(quizTimeRemaining)}`;
  }

  quizTimerInterval = setInterval(() => {
    quizTimeRemaining--;
    if (timerEl) {
      timerEl.textContent = `⏱ Time Left: ${formatQuizClock(Math.max(0, quizTimeRemaining))}`;
      if (quizTimeRemaining <= 30) {
        timerEl.style.color = "#dc2626";
        timerEl.style.background = "#fef2f2";
      }
    }

    if (quizTimeRemaining <= 0) {
      clearInterval(quizTimerInterval);
      finishQuizDueToTimeout();
    }
  }, 1000);
}

function finishQuizDueToTimeout() {
  const nextBtn = document.getElementById("nextBtn");
  document.getElementById("question").textContent = `Time Expired! Test auto-submitted. Final Score: ${userScore} / ${quizQuestions.length} (${Math.round((userScore / quizQuestions.length) * 100)}%)`;
  document.getElementById("options").innerHTML = "";
  document.getElementById("feedback").textContent = `Total Time Spent: ${formatQuizClock(quizDuration)} (Time limit reached).`;
  document.getElementById("feedback").style.color = "#d97706";
  if (nextBtn) {
    nextBtn.textContent = "Restart Quiz";
    nextBtn.disabled = false;
    nextBtn.onclick = () => {
      currentQIndex = 0;
      userScore = 0;
      quizTimeRemaining = quizDuration;
      nextBtn.textContent = "Next Question →";
      nextBtn.onclick = null;
      startQuizTimer();
      loadQuizQuestion();
    };
  }
}

function loadQuizQuestion() {
  answered = false;
  const q = quizQuestions[currentQIndex];
  document.getElementById("question").textContent = q.q;
  document.getElementById("progress").textContent = `Question ${currentQIndex + 1} of ${quizQuestions.length}`;
  document.getElementById("quizScore").textContent = `Score: ${userScore} / ${quizQuestions.length}`;
  document.getElementById("feedback").textContent = "";
  document.getElementById("nextBtn").disabled = true;

  const optionsContainer = document.getElementById("options");
  optionsContainer.innerHTML = "";

  q.options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = `${String.fromCharCode(65 + idx)}. ${optText}`;
    btn.addEventListener("click", () => handleAnswer(idx));
    optionsContainer.appendChild(btn);
  });
}

function handleAnswer(selectedIdx) {
  if (answered) return;
  answered = true;

  const q = quizQuestions[currentQIndex];
  const buttons = document.querySelectorAll(".option");
  const feedback = document.getElementById("feedback");

  buttons.forEach(b => b.disabled = true);

  if (selectedIdx === q.answer) {
    buttons[selectedIdx].classList.add("correct");
    feedback.textContent = `Correct! ${q.explanation}`;
    feedback.style.color = "#10b981";
    userScore++;
  } else {
    buttons[selectedIdx].classList.add("wrong");
    buttons[q.answer].classList.add("correct");
    feedback.textContent = `Incorrect. ${q.explanation}`;
    feedback.style.color = "#ef4444";
  }

  document.getElementById("quizScore").textContent = `Score: ${userScore} / ${quizQuestions.length}`;
  document.getElementById("nextBtn").disabled = false;
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  renderChapters(chapters);
  renderVideos();
  updateSimulator();
  loadQuizQuestion();
  startQuizTimer();

  // Search filter
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = chapters.filter(c =>
        c.title.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.content.toLowerCase().includes(query)
      );
      renderChapters(filtered);
    });
  }

  // Auto select first chapter
  if (chapters.length > 0) {
    selectChapter(chapters[0].id);
  }

  // Simulator buttons
  const stepBtn = document.getElementById("simStepBtn");
  if (stepBtn) {
    stepBtn.addEventListener("click", () => {
      currentSimStep = (currentSimStep + 1) % simStages.length;
      updateSimulator();
    });
  }

  const resetBtn = document.getElementById("simResetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      currentSimStep = 0;
      updateSimulator();
    });
  }

  // Favorites & Backup handling
  let activeChapterId = chapters[0]?.id || "";
  const favBtn = document.getElementById("favChapterBtn");
  const downloadBackupBtn = document.getElementById("downloadBackupBtn");

  function getLocalFavorites() {
    try {
      return JSON.parse(localStorage.getItem("coa_hub_favorites") || "[]");
    } catch {
      return [];
    }
  }

  function updateFavBtnText() {
    if (!favBtn) return;
    const favs = getLocalFavorites();
    const isFav = favs.includes(activeChapterId);
    favBtn.textContent = isFav ? "★ Saved in Favorites" : "☆ Save to Favorites";
    favBtn.style.color = isFav ? "#d97706" : "#0f172a";
  }

  if (favBtn) {
    favBtn.addEventListener("click", () => {
      const favs = getLocalFavorites();
      let updated;
      if (favs.includes(activeChapterId)) {
        updated = favs.filter(id => id !== activeChapterId);
      } else {
        updated = [...favs, activeChapterId];
      }
      localStorage.setItem("coa_hub_favorites", JSON.stringify(updated));
      updateFavBtnText();
    });
  }

  if (downloadBackupBtn) {
    downloadBackupBtn.addEventListener("click", () => {
      const favs = getLocalFavorites();
      const backupData = {
        schemaVersion: "1.0.0",
        appName: "COA Study Hub",
        exportDate: new Date().toISOString(),
        summary: {
          savedFavoritesCount: favs.length,
          lastQuizScore: `${userScore}/${quizQuestions.length}`
        },
        savedFavorites: favs.map(id => {
          const ch = chapters.find(c => c.id === id);
          return ch ? { id: ch.id, title: ch.title, icon: ch.icon } : { id };
        }),
        quizResults: {
          lastScore: userScore,
          totalQuestions: quizQuestions.length,
          accuracyPct: Math.round((userScore / quizQuestions.length) * 100)
        }
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `coa_study_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // Quiz next button
  const nextBtn = document.getElementById("nextBtn");
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentQIndex++;
      if (currentQIndex < quizQuestions.length) {
        loadQuizQuestion();
      } else {
        // Quiz completed
        if (quizTimerInterval) clearInterval(quizTimerInterval);
        const timeSpent = quizDuration - quizTimeRemaining;
        document.getElementById("question").textContent = `Quiz Finished! Your final score: ${userScore} out of ${quizQuestions.length} (${Math.round((userScore / quizQuestions.length) * 100)}%)`;
        document.getElementById("options").innerHTML = "";
        document.getElementById("feedback").textContent = `Time Taken: ${formatQuizClock(timeSpent)} / ${formatQuizClock(quizDuration)}. ${userScore >= 4 ? "Great speed and accuracy!" : "Good practice! Review the notes and try again."}`;
        document.getElementById("feedback").style.color = "#3b82f6";
        nextBtn.textContent = "Restart Quiz";
        nextBtn.disabled = false;
        nextBtn.onclick = () => {
          currentQIndex = 0;
          userScore = 0;
          quizTimeRemaining = quizDuration;
          nextBtn.textContent = "Next Question →";
          nextBtn.onclick = null;
          startQuizTimer();
          loadQuizQuestion();
        };
      }
    });
  }
});
