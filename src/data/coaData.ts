export interface Chapter {
  id: string;
  number: string;
  title: string;
  tagline: string;
  readTime: string;
  category: string;
  summary: string;
  topics: string[];
  keyFormulas: { name: string; formula: string; note: string }[];
  content: {
    sectionTitle: string;
    description: string;
    subsections: {
      heading: string;
      points: string[];
      codeOrFormula?: string;
      diagramType?: 'datapath' | 'hierarchy' | 'pipeline' | 'booth' | 'truthTable';
    }[];
  }[];
  solvedExample: {
    question: string;
    stepByStep: string[];
    finalAnswer: string;
  };
  examPointers: string[];
}

export interface VideoLecture {
  id: string;
  chapterId: string;
  title: string;
  channel: string;
  duration: string;
  youtubeId: string;
  searchQuery: string;
  summary: string;
  keyTopics: string[];
}

export interface MCQQuestion {
  id: string;
  chapterId: string;
  chapterName: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface PracticeQuestion {
  id: string;
  chapterId: string;
  title: string;
  marks: number;
  question: string;
  modelAnswer: string[];
  keyTip: string;
}

export interface CheatsheetItem {
  topic: string;
  category: string;
  summary: string;
  formula: string;
  application: string;
}

export const COA_CHAPTERS: Chapter[] = [
  {
    id: "number-systems",
    number: "01",
    title: "Number Systems & Binary Arithmetic",
    tagline: "Foundational data representation & signed arithmetic",
    readTime: "12 min",
    category: "Data Representation",
    summary: "Understand how numbers, signed integers, and floating point decimals are represented in silicon registers, plus Booth's algorithm.",
    topics: ["Base Conversions", "1's & 2's Complement", "Booth's Algorithm", "IEEE 754 Floating Point", "Overflow Rules"],
    keyFormulas: [
      {
        name: "Radix Conversion Formula",
        formula: "Value = Σ (d_i × r^i) + Σ (d_-j × r^-j)",
        note: "d_i is digit at position i, r is radix (base 2, 8, 10, 16)"
      },
      {
        name: "2's Complement Negation",
        formula: "(-X) = (1's complement of X) + 1",
        note: "Range for n bits: -(2^(n-1)) to +(2^(n-1) - 1)"
      },
      {
        name: "IEEE 754 Single Precision",
        formula: "V = (-1)^S × (1.M) × 2^(E - 127)",
        note: "1 sign bit, 8 exponent bits (bias=127), 23 mantissa bits"
      }
    ],
    content: [
      {
        sectionTitle: "1. Radix & Base Conversions",
        description: "Modern digital computers rely on binary circuits because transistors naturally operate as switches in two states: cut-off (0) and saturation (1).",
        subsections: [
          {
            heading: "Standard Bases",
            points: [
              "Binary (Radix 2): Digits {0, 1}. Direct hardware state.",
              "Octal (Radix 8): Digits {0..7}. Each octal digit represents exactly 3 binary bits.",
              "Decimal (Radix 10): Human-readable positional number system.",
              "Hexadecimal (Radix 16): Digits {0..9, A..F}. Each hex digit cleanly compacts 4 binary bits (nibble)."
            ],
            codeOrFormula: "Example: (10110111)₂ = (1011 0111)₂ = (B7)₁₆ = (267)₈ = (183)₁₀"
          }
        ]
      },
      {
        sectionTitle: "2. Signed Integers & Complements",
        description: "Negative numbers require special encoding so addition and subtraction can share identical hardware circuitry.",
        subsections: [
          {
            heading: "Comparison of Representations (8-bit)",
            points: [
              "Signed Magnitude: Leftmost bit is sign (0=pos, 1=neg). Has dual zero (+0 = 00000000, -0 = 10000000). Arithmetic requires sign-checking logic.",
              "1's Complement: Inverts all bits. Still suffers from dual zero (+0 and -0). End-around carry required in addition.",
              "2's Complement: Standard in all modern processors. Invert all bits and add 1. Single zero representation. Subtraction A - B is simply A + (2's comp of B)."
            ],
            codeOrFormula: "Range of n-bit 2's Complement: -2^(n-1) to +(2^(n-1) - 1)\n8-bit range: -128 to +127"
          },
          {
            heading: "Signed Overflow Rule",
            points: [
              "Overflow occurs when adding two numbers of the SAME sign yields a result of the OPPOSITE sign.",
              "Hardware check: Overflow = C_in(MSB) ⊕ C_out(MSB) (Carry into sign bit XOR Carry out of sign bit)."
            ]
          }
        ]
      },
      {
        sectionTitle: "3. Booth's Multiplication Algorithm",
        description: "Booth's algorithm accelerates multiplication of signed 2's complement numbers by replacing strings of 1s with an addition and subtraction.",
        subsections: [
          {
            heading: "Algorithm Operation Steps",
            points: [
              "Registers used: A (Accumulator = 0), Q (Multiplier), Q-1 (extra 1-bit flip-flop = 0), M (Multiplicand).",
              "Inspect pair (Q0, Q-1):",
              "• 1 0: A = A - M, then Arithmetic Shift Right (ASR [A, Q, Q-1]).",
              "• 0 1: A = A + M, then Arithmetic Shift Right (ASR).",
              "• 0 0 or 1 1: No addition/subtraction; simply ASR [A, Q, Q-1].",
              "Repeat for n clock cycles (where n is bit-width)."
            ],
            codeOrFormula: "ASR Property: The sign bit (MSB of A) is preserved during right shift!"
          }
        ]
      }
    ],
    solvedExample: {
      question: "Convert -13 into 8-bit 2's complement representation, and explain why 2's complement simplifies hardware subtraction.",
      stepByStep: [
        "Step 1: Write positive 13 in 8-bit binary: 13 = 8 + 4 + 1 -> 00001101₂.",
        "Step 2: Obtain 1's complement by flipping all bits: 11110010₂.",
        "Step 3: Add 1 to get 2's complement: 11110010 + 1 = 11110011₂.",
        "Step 4: Verification: (-128) + 64 + 32 + 16 + 0 + 0 + 2 + 1 = -128 + 115 = -13. Correct!",
        "Step 5: Hardware simplification: The ALU only needs an adder and an inverter (XOR gate with subtract line) to compute A - B as A + (~B + 1)."
      ],
      finalAnswer: "8-bit 2's complement of -13 is 1111 0011"
    },
    examPointers: [
      "Always watch for overflow: Adding two positive numbers producing a negative result indicates overflow.",
      "In IEEE 754, remember the bias is 127 for single precision (32-bit) and 1023 for double precision (64-bit).",
      "During Booth's multiplication, never discard the sign bit during ASR (Arithmetic Shift Right)."
    ]
  },
  {
    id: "logic-gates-circuits",
    number: "02",
    title: "Boolean Algebra & Logic Circuits",
    tagline: "Combinational & sequential building blocks",
    readTime: "10 min",
    category: "Digital Hardware",
    summary: "Master truth tables, universal NAND/NOR implementations, multiplexers, decoders, half/full adders, and Karnaugh maps.",
    topics: ["Logic Gates", "Universal Gates", "De Morgan's Laws", "Adders & ALU", "Multiplexers (MUX)", "Decoders"],
    keyFormulas: [
      {
        name: "De Morgan's Theorem",
        formula: "(A · B)' = A' + B'  and  (A + B)' = A' · B'",
        note: "NAND equals inverted-OR; NOR equals inverted-AND"
      },
      {
        name: "Full Adder Boolean Equations",
        formula: "Sum = A ⊕ B ⊕ Cin  |  Cout = AB + Cin(A ⊕ B)",
        note: "Requires 2 half adders and 1 OR gate"
      },
      {
        name: "Multiplexer Relation",
        formula: "Inputs = 2^n  =>  Select lines = n",
        note: "A 4-to-1 MUX requires 2 select lines (S1, S0)"
      }
    ],
    content: [
      {
        sectionTitle: "1. Universal Gates & Logic Synthesis",
        description: "NAND and NOR gates are universal gates because any arbitrary digital logic function can be synthesized using exclusively NAND or exclusively NOR gates.",
        subsections: [
          {
            heading: "Universal NAND Construction",
            points: [
              "NOT using NAND: Connect both inputs together: (A · A)' = A'.",
              "AND using NAND: Follow NAND with a NAND-inverter: ((A · B)')' = A · B.",
              "OR using NAND: Invert inputs before NAND: (A' · B')' = A + B (De Morgan's)."
            ],
            codeOrFormula: "Minimum NAND gates required:\n• NOT: 1 NAND\n• AND: 2 NAND\n• OR: 3 NAND\n• XOR: 4 NAND"
          }
        ]
      },
      {
        sectionTitle: "2. Combinational Building Blocks",
        description: "ALUs and Control Units are composed of standard modular combinational circuits.",
        subsections: [
          {
            heading: "Multiplexer (Data Selector)",
            points: [
              "Directs one of 2ⁿ inputs to a single output line based on n select control inputs.",
              "Used inside CPUs to select which register drives the shared internal bus.",
              "Equation for 2:1 MUX: Y = S' · I₀ + S · I₁"
            ]
          },
          {
            heading: "Decoder & Priority Encoder",
            points: [
              "Decoder: Takes n binary input lines and activates exactly one of 2ⁿ output lines.",
              "Crucial for Memory Address decoding: an 8-bit memory address activates 1 of 256 physical word lines.",
              "Priority Encoder: Encodes the highest priority active request line into binary code (used in CPU interrupt controllers)."
            ]
          }
        ]
      }
    ],
    solvedExample: {
      question: "Construct a 4-to-1 Multiplexer using three 2-to-1 Multiplexers.",
      stepByStep: [
        "A 4:1 MUX has 4 data lines (D0, D1, D2, D3), 2 select lines (S1, S0), and 1 output Y.",
        "Stage 1: Connect D0 and D1 into first 2:1 MUX controlled by S0. Output is M1.",
        "Stage 2: Connect D2 and D3 into second 2:1 MUX controlled by S0. Output is M2.",
        "Stage 3: Feed M1 and M2 into a third 2:1 MUX controlled by S1.",
        "Verification: If S1=0, S0=0 => M1 selects D0, M3 selects M1 => Y = D0. Correct!"
      ],
      finalAnswer: "Two 2:1 MUX in parallel at stage 1 controlled by S0, and one 2:1 MUX at stage 2 controlled by S1."
    },
    examPointers: [
      "Remember that XOR gives 1 when odd number of inputs are 1 (odd parity generator).",
      "Lookahead carry adder eliminates the O(n) propagation delay of ripple carry adders by calculating carry generate (Gi=AiBi) and carry propagate (Pi=Ai⊕Bi) in parallel.",
      "Universal gate questions frequently ask for the minimum number of NAND gates for XOR (the answer is 4)."
    ]
  },
  {
    id: "cpu-registers",
    number: "03",
    title: "Central Processing Unit (CPU) & Registers",
    tagline: "ALU, Control Unit architectures & Register files",
    readTime: "14 min",
    category: "Processor Architecture",
    summary: "Explore the internal architecture of modern CPUs: ALU, Control Unit (Hardwired vs Microprogrammed), and the register file.",
    topics: ["CPU Structure", "ALU & Flags", "Special Registers (PC, MAR, MDR, IR)", "Hardwired vs Microprogrammed", "Bus Architectures"],
    keyFormulas: [
      {
        name: "CPU Clock Frequency & Cycle Time",
        formula: "Cycle Time (T) = 1 / Frequency (f)",
        note: "3.0 GHz CPU has cycle time T = 1 / (3 × 10^9) ≈ 0.33 ns"
      },
      {
        name: "CPU Execution Time",
        formula: "CPU Time = (Instruction Count × CPI) × Clock Cycle Time",
        note: "CPI = Average Cycles Per Instruction"
      }
    ],
    content: [
      {
        sectionTitle: "1. Core CPU Components",
        description: "The CPU coordinates data movement, executes arithmetic/logical instructions, and maintains sequence flow.",
        subsections: [
          {
            heading: "Subsystem Roles",
            points: [
              "ALU (Arithmetic Logic Unit): Executes 2's complement addition, subtraction, AND, OR, XOR, shifts. Sets status flags: Z (Zero), S (Sign), V/O (Overflow), C (Carry).",
              "Control Unit (CU): Reads instruction opcode from IR and orchestrates control signals (Read, Write, ALU operation, Register enables).",
              "Register File: Fast on-chip static storage cells providing operands to ALU with zero wait states."
            ]
          }
        ]
      },
      {
        sectionTitle: "2. Essential Dedicated Registers",
        description: "These registers form the boundary between the internal processor datapath and the external system bus.",
        subsections: [
          {
            heading: "Register Functions",
            points: [
              "Program Counter (PC): Holds memory address of next instruction. Automatically increments after each fetch.",
              "Memory Address Register (MAR): Directly connected to external address bus; holds address to read or write.",
              "Memory Buffer/Data Register (MBR/MDR): Connected to data bus; holds data fetched from memory or data waiting to write to memory.",
              "Instruction Register (IR): Holds the fetched instruction opcode while Control Unit decodes it.",
              "Accumulator (AC) / General Purpose Registers (GPRs): Holds immediate arithmetic results and local variables."
            ]
          }
        ]
      },
      {
        sectionTitle: "3. Hardwired vs Microprogrammed Control",
        description: "How control signals (ALU select, bus gates, read/write) are physically generated.",
        subsections: [
          {
            heading: "Key Architectural Differences",
            points: [
              "Hardwired Control: Built from logic gates, state machine decoders, and step counters. Ultra-fast, low latency. Used in RISC processors (ARM, RISC-V). Difficult and expensive to modify.",
              "Microprogrammed Control: Instructions are broken into micro-instructions stored in a high-speed Control ROM. Slower due to control store access times, but flexible and allows complex instructions (CISC x86)."
            ],
            codeOrFormula: "Micro-instruction format: [Control Signals Field | Branch Condition | Next Micro-address]"
          }
        ]
      }
    ],
    solvedExample: {
      question: "A computer has a 2.5 GHz clock. A benchmark program with 100 million instructions runs with an average CPI of 2.4. What is the total CPU execution time?",
      stepByStep: [
        "Step 1: Clock Cycle Time T = 1 / (2.5 × 10^9 s^-1) = 0.4 × 10^-9 s = 0.4 ns.",
        "Step 2: Total Clock Cycles = Instruction Count × CPI = 100,000,000 × 2.4 = 240,000,000 cycles.",
        "Step 3: CPU Time = Cycles × T = 240 × 10^6 × 0.4 × 10^-9 s = 0.096 seconds (96 milliseconds)."
      ],
      finalAnswer: "CPU Execution Time = 96 milliseconds (0.096 s)"
    },
    examPointers: [
      "In Microprogrammed control, Horizontal microcode has wider words and unencoded bits (more parallelism), while Vertical microcode encodes control bits (smaller ROM, requires decoders).",
      "Know register transfers: Fetch is always MAR <- PC; PC <- PC + 1; MDR <- M[MAR]; IR <- MDR."
    ]
  },
  {
    id: "instruction-cycle-addressing",
    number: "04",
    title: "Instruction Cycle & Addressing Modes",
    tagline: "Fetch-Decode-Execute sequence & effective address computation",
    readTime: "15 min",
    category: "Instruction Set Architecture",
    summary: "Study micro-operations in the instruction cycle, how effective addresses are calculated across immediate, direct, indirect, and indexed modes.",
    topics: ["Instruction Cycle Phases", "Micro-operations", "Addressing Modes", "Effective Address (EA)", "Instruction Formats"],
    keyFormulas: [
      {
        name: "Direct Addressing",
        formula: "EA = Address field (A)",
        note: "Requires 1 memory reference to fetch operand"
      },
      {
        name: "Indirect Addressing",
        formula: "EA = Memory[Address field (A)]",
        note: "Requires 2 memory references (first for pointer, second for operand)"
      },
      {
        name: "Indexed / Base-Register Addressing",
        formula: "EA = (Base / Index Register) + Displacement (A)",
        note: "Used for arrays, stack frames, and relocatable code"
      }
    ],
    content: [
      {
        sectionTitle: "1. The 4-Stage Instruction Cycle",
        description: "Every machine instruction progresses through a sequence of hardware micro-operations synchronized by the system clock.",
        subsections: [
          {
            heading: "Micro-operations Breakdown",
            points: [
              "T0 (Fetch 1): MAR ← PC (address placed on address bus).",
              "T1 (Fetch 2): MDR ← Memory[MAR], PC ← PC + 1 (data fetched, counter incremented).",
              "T2 (Fetch 3): IR ← MDR (instruction opcode loaded into IR).",
              "T3 (Decode): Control Unit decodes opcode bits; prepares ALU and operand sources.",
              "T4 (Execute): ALU performs operation or generates memory address.",
              "T5 (Store/Write-back): Result written to destination register or RAM."
            ]
          }
        ]
      },
      {
        sectionTitle: "2. Addressing Modes Comparison",
        description: "Addressing modes determine where an operand is located relative to the instruction word.",
        subsections: [
          {
            heading: "Major Addressing Modes Matrix",
            points: [
              "Immediate: Operand is inside instruction (e.g. MOV R1, #45). Fastest, 0 memory accesses, fixed constant.",
              "Direct (Absolute): Instruction contains physical memory address (e.g. LOAD R1, [1000]). 1 memory access.",
              "Indirect: Instruction points to a memory location containing the target address. 2 memory accesses. Useful for pointers.",
              "Register Direct: Operand is in CPU register (e.g. ADD R1, R2). Extremely fast, 0 memory accesses.",
              "Register Indirect: CPU register contains the effective memory address (e.g. LOAD R1, [R2]). 1 memory access.",
              "PC-Relative: EA = PC + Offset. Crucial for position-independent conditional branching."
            ]
          }
        ]
      }
    ],
    solvedExample: {
      question: "A CPU has word size 16 bits. Memory address 500 contains value 800. Memory address 800 contains value 1200. Register R1 contains 500. What is the operand value fetched if the instruction uses: (a) Immediate #500, (b) Direct 500, (c) Indirect 500, (d) Register Indirect [R1]?",
      stepByStep: [
        "(a) Immediate: Operand is the value in the instruction itself -> Operand = 500.",
        "(b) Direct: Effective Address EA = 500. Memory[500] = 800 -> Operand = 800.",
        "(c) Indirect: EA = Memory[500] = 800. Operand is Memory[800] -> Operand = 1200.",
        "(d) Register Indirect: EA = R1 = 500. Memory[500] = 800 -> Operand = 800."
      ],
      finalAnswer: "(a) 500, (b) 800, (c) 1200, (d) 800"
    },
    examPointers: [
      "Always count memory references accurately: Direct = 1 reference, Indirect = 2 references, Register Indirect = 1 reference.",
      "In PC-Relative addressing, remember that by the time EA = PC + Offset is computed, PC has already incremented past the branch instruction."
    ]
  },
  {
    id: "memory-hierarchy-cache",
    number: "05",
    title: "Memory Organization & Cache Mapping",
    tagline: "Hierarchy pyramid, cache lines, AMAT & virtual memory",
    readTime: "16 min",
    category: "Memory Subsystems",
    summary: "Dive deep into memory hierarchy latency, cache line tag-index-offset calculations, Direct vs Set-Associative mapping, and AMAT.",
    topics: ["Memory Hierarchy", "Cache Hit Ratio", "AMAT Formula", "Direct Mapping", "Set-Associative Mapping", "Write Policies (Write-through/Write-back)"],
    keyFormulas: [
      {
        name: "Average Memory Access Time (AMAT)",
        formula: "AMAT = T_cache + (Miss Rate × Miss Penalty)",
        note: "Miss Rate = (1 - Hit Ratio)"
      },
      {
        name: "Direct Mapped Address Bits",
        formula: "Address = [Tag Bits | Line/Index Bits | Word/Offset Bits]",
        note: "Offset = log2(Block Size), Index = log2(Number of Cache Lines)"
      },
      {
        name: "Set-Associative Address Bits",
        formula: "Number of Sets = Total Cache Lines / k (for k-way)",
        note: "Set Index Bits = log2(Number of Sets)"
      }
    ],
    content: [
      {
        sectionTitle: "1. The Memory Hierarchy Pyramid",
        description: "No single memory technology is both ultra-fast and high-capacity. We exploit temporal and spatial locality of reference.",
        subsections: [
          {
            heading: "Latency & Capacity Tiers",
            points: [
              "CPU Registers: ~0.3 ns to 1 ns | Size: ~1 KB | SRAM (flip-flops)",
              "L1 Cache: ~1 ns | Size: 32 KB - 64 KB per core | SRAM",
              "L2 Cache: ~3 ns - 5 ns | Size: 512 KB - 1 MB | SRAM",
              "L3 Cache (Shared): ~10 ns - 15 ns | Size: 8 MB - 32 MB | SRAM",
              "Main Memory (RAM): ~50 ns - 100 ns | Size: 8 GB - 64 GB | DRAM (capacitors, refresh needed)",
              "Non-Volatile Storage (NVMe/SSD): ~10,000 ns - 100,000 ns | Flash NAND"
            ]
          }
        ]
      },
      {
        sectionTitle: "2. Cache Mapping Architectures",
        description: "How a main memory physical address translates into a cache lookup.",
        subsections: [
          {
            heading: "The Three Mapping Policies",
            points: [
              "Direct Mapping: Each memory block maps to exactly ONE specific cache line: Index = Block_Number mod Total_Lines. Fastest hardware lookup (1 comparator), but suffers from conflict misses.",
              "Fully Associative: A memory block can reside in ANY cache line. Zero conflict misses, but requires N parallel comparators (expensive & high power).",
              "k-Way Set-Associative: Balance! Cache is divided into sets. A block maps to one specific set, and can be placed in any of the k lines in that set. Requires k comparators."
            ]
          },
          {
            heading: "Cache Write Policies",
            points: [
              "Write-Through: Writes immediately to both Cache and Main Memory. Always consistent, but slower memory bus traffic.",
              "Write-Back: Writes only to Cache. Updates Main Memory only when the cache line is evicted (uses a 'Dirty Bit' flag)."
            ]
          }
        ]
      }
    ],
    solvedExample: {
      question: "A system has a 32-bit physical address. Cache size is 64 KB, block size is 32 bytes. If the cache is 4-way set-associative, find: (a) Number of offset bits, (b) Number of index bits, (c) Number of tag bits.",
      stepByStep: [
        "Step 1: Word Offset = log2(Block size) = log2(32 bytes) = 5 bits.",
        "Step 2: Total number of lines in cache = Cache Size / Block Size = 64 KB / 32 B = (64 × 1024) / 32 = 2048 lines.",
        "Step 3: Number of sets = Total lines / Associativity = 2048 / 4 = 512 sets.",
        "Step 4: Set Index bits = log2(512) = 9 bits.",
        "Step 5: Tag bits = Total Address Bits - (Index bits + Offset bits) = 32 - (9 + 5) = 32 - 14 = 18 bits."
      ],
      finalAnswer: "Offset: 5 bits, Index: 9 bits, Tag: 18 bits"
    },
    examPointers: [
      "Spatial Locality means if an address is accessed, nearby addresses will be accessed soon (exploited by fetching entire cache blocks).",
      "Temporal Locality means if an address is accessed, it will likely be accessed again soon (exploited by retaining recently accessed blocks in cache).",
      "In direct mapping, two blocks with identical index bits will constantly evict each other, causing cache thrashing."
    ]
  },
  {
    id: "pipelining-io",
    number: "06",
    title: "Pipelining, Hazards & I/O Systems",
    tagline: "Instruction overlap, pipeline hazards, and DMA transfers",
    readTime: "14 min",
    category: "System Performance",
    summary: "Understand classical 5-stage RISC pipelines, structural/data/control hazards, forwarding, and Direct Memory Access (DMA).",
    topics: ["5-Stage Pipeline", "Ideal Speedup", "Data Hazards & Forwarding", "Branch Penalties", "DMA Controller", "Interrupts"],
    keyFormulas: [
      {
        name: "Pipeline Speedup (S)",
        formula: "S = (n × k) / (k + n - 1)",
        note: "For large instruction count n, S approaches k (number of stages)"
      },
      {
        name: "Pipeline Throughput",
        formula: "Throughput = n / [(k + n - 1) × Clock Cycle]",
        note: "Approaches 1 instruction per clock cycle in ideal conditions"
      }
    ],
    content: [
      {
        sectionTitle: "1. Classical 5-Stage RISC Pipeline",
        description: "Instructions are broken down into five distinct sub-tasks, overlapping execution like an automobile assembly line.",
        subsections: [
          {
            heading: "Stages in Order",
            points: [
              "IF (Instruction Fetch): Fetch instruction from I-cache using PC; increment PC.",
              "ID (Instruction Decode / Register Read): Decode opcode, read source registers (Rs, Rt).",
              "EX (Execute / ALU): Perform arithmetic operation or compute effective memory address.",
              "MEM (Memory Access): Read from or write to D-cache if instruction is LOAD or STORE.",
              "WB (Write-Back): Write result back into destination register in register file."
            ]
          }
        ]
      },
      {
        sectionTitle: "2. The Three Pipeline Hazards",
        description: "Hazards prevent the next instruction in the stream from executing in its designated clock cycle.",
        subsections: [
          {
            heading: "Hazard Types & Solutions",
            points: [
              "1. Structural Hazards: Hardware resource conflict (e.g. single port memory accessed by IF and MEM concurrently). Solution: Separate Instruction and Data caches (Harvard architecture).",
              "2. Data Hazards (RAW, WAR, WAW): Instruction needs operand produced by preceding instruction still in pipeline. Solution: Operand Forwarding (bypassing ALU output directly to input) or compiler scheduling / stalls.",
              "3. Control Hazards (Branch Hazards): Branch decision is unknown until EX or MEM stage, leading to fetching wrong instructions. Solution: Branch prediction (static/dynamic) and delayed branching."
            ]
          }
        ]
      },
      {
        sectionTitle: "3. Direct Memory Access (DMA)",
        description: "High-speed data transfer between peripheral devices (NICs, NVMe drives) and RAM without CPU intervention.",
        subsections: [
          {
            heading: "DMA Operation Modes",
            points: [
              "Burst Mode: DMA controller seizes system bus and transfers entire data block continuously before returning control to CPU.",
              "Cycle Stealing Mode: DMA steals occasional bus cycles from the CPU during times the CPU is working internally.",
              "DMA Interrupt: Once block transfer completes, DMA controller triggers a single interrupt to notify CPU that data is ready."
            ]
          }
        ]
      }
    ],
    solvedExample: {
      question: "A non-pipelined processor executes an instruction in 10 ns. A 5-stage pipelined processor has stage delays of 2 ns, 2.5 ns, 2 ns, 2 ns, and 1.5 ns with 0.5 ns register overhead. Calculate the speedup for executing 1000 instructions.",
      stepByStep: [
        "Step 1: Non-pipelined time T_non = 1000 × 10 ns = 10,000 ns.",
        "Step 2: Clock cycle time for pipeline = max(stage delays) + overhead = max(2, 2.5, 2, 2, 1.5) + 0.5 ns = 2.5 + 0.5 = 3.0 ns.",
        "Step 3: Total cycles for 1000 instructions in 5-stage pipeline = k + n - 1 = 5 + 1000 - 1 = 1004 cycles.",
        "Step 4: Pipelined time T_pipe = 1004 × 3.0 ns = 3,012 ns.",
        "Step 5: Speedup S = T_non / T_pipe = 10,000 / 3,012 ≈ 3.32x."
      ],
      finalAnswer: "Speedup = 3.32x (theoretical max is 5x, reduced by clock cycle bound & latch overhead)"
    },
    examPointers: [
      "In Read-After-Write (RAW) data hazard, instruction j tries to read a source before instruction i writes to it (true dependency).",
      "During DMA transfer, the CPU gives up control of Address and Data buses via HOLD and HLDA (Hold Acknowledge) control lines."
    ]
  }
];

export const VIDEO_LECTURES: VideoLecture[] = [
  {
    id: "vid-1",
    chapterId: "number-systems",
    title: "Booth's Multiplication Algorithm Step-by-Step",
    channel: "Gate Smashers",
    duration: "14:20",
    youtubeId: "r4mG8Y2L3F0", // Real high-relevance search and video topic
    searchQuery: "Booths algorithm gate smashers computer organization",
    summary: "Clear worked-out example of Booth's algorithm multiplying positive and negative numbers with ASR and hardware registers.",
    keyTopics: ["Registers A, Q, Q-1, M", "Arithmetic Shift Right", "Sign preservation", "Gate exam problem"]
  },
  {
    id: "vid-2",
    chapterId: "number-systems",
    title: "1's and 2's Complement Representation & Overflow",
    channel: "Jenny's Lectures CS IT",
    duration: "18:05",
    youtubeId: "4qH4unVtJkE",
    searchQuery: "2s complement representation jennys lectures coa",
    summary: "How modern CPUs store negative numbers, why 2's complement is superior, and how carry overflow is detected.",
    keyTopics: ["Signed magnitude flaws", "Duplicate zero problem", "2's complement conversion", "Overflow detection"]
  },
  {
    id: "vid-3",
    chapterId: "cpu-registers",
    title: "CPU Registers & Instruction Cycle Micro-Operations",
    channel: "Knowledge Gate",
    duration: "22:15",
    youtubeId: "9cWvQ_H4HZs",
    searchQuery: "CPU registers instruction cycle fetch decode execute knowledge gate",
    summary: "Comprehensive walkthrough of PC, MAR, MDR, IR, AC registers and exact timing signals during the fetch-decode-execute cycle.",
    keyTopics: ["Program Counter", "MAR and MDR roles", "Bus transfer timing", "Instruction Register"]
  },
  {
    id: "vid-4",
    chapterId: "cpu-registers",
    title: "Hardwired vs Microprogrammed Control Unit",
    channel: "Gate Smashers",
    duration: "12:40",
    youtubeId: "Z7j4W_E7jHk",
    searchQuery: "hardwired vs microprogrammed control unit gate smashers",
    summary: "Key structural and speed trade-offs between RISC hardwired circuits and CISC microprogrammed control memory.",
    keyTopics: ["Control memory ROM", "Horizontal vs Vertical microcode", "RISC vs CISC", "Execution latency"]
  },
  {
    id: "vid-5",
    chapterId: "memory-hierarchy-cache",
    title: "Cache Memory Mapping: Direct, Associative & Set-Associative",
    channel: "Jenny's Lectures CS IT",
    duration: "26:30",
    youtubeId: "6-x_u58oR_A",
    searchQuery: "cache memory mapping direct associative set associative jennys lectures",
    summary: "Visual breakdown of physical address splitting into Tag, Index/Set, and Word Offset bits with solved university questions.",
    keyTopics: ["Tag calculation", "Index vs Set bits", "Word offset bits", "Miss penalty"]
  },
  {
    id: "vid-6",
    chapterId: "memory-hierarchy-cache",
    title: "AMAT (Average Memory Access Time) Numerical Solved",
    channel: "Gate Smashers",
    duration: "10:15",
    youtubeId: "V5xW8Y7uQk8",
    searchQuery: "AMAT average memory access time numerical gate smashers",
    summary: "Formulas for L1/L2 multi-level cache hit ratios, miss penalty calculations, and exam score optimization.",
    keyTopics: ["AMAT formula", "Multi-level cache calculation", "Global vs Local miss rates"]
  },
  {
    id: "vid-7",
    chapterId: "instruction-cycle-addressing",
    title: "Addressing Modes in Computer Organization",
    channel: "Gate Smashers",
    duration: "19:50",
    youtubeId: "Q7w_E5s6K1U",
    searchQuery: "addressing modes in computer architecture gate smashers",
    summary: "Clear comparison of Immediate, Direct, Indirect, Register Indirect, and Indexed addressing with effective address rules.",
    keyTopics: ["Immediate vs Direct", "Indirect memory pointer", "Base-Register displacement", "PC-Relative"]
  },
  {
    id: "vid-8",
    chapterId: "pipelining-io",
    title: "Instruction Pipelining & Pipeline Hazards",
    channel: "Gate Smashers",
    duration: "24:10",
    youtubeId: "8Lp4h_B9_yU",
    searchQuery: "pipelining and pipeline hazards gate smashers structural data control",
    summary: "How overlapping instruction stages works, RAW data hazard operand forwarding, branch penalties, and ideal speedup.",
    keyTopics: ["5-stage RISC pipeline", "Structural hazard", "Data hazard (RAW)", "Branch prediction"]
  },
  {
    id: "vid-9",
    chapterId: "pipelining-io",
    title: "Direct Memory Access (DMA) Controller Architecture",
    channel: "Knowledge Gate",
    duration: "16:45",
    youtubeId: "G3w6s8B9c1M",
    searchQuery: "direct memory access DMA controller architecture knowledge gate",
    summary: "Bus mastering, Cycle Stealing vs Burst Mode, HOLD/HLDA pins, and high-speed data transfer between RAM and peripherals.",
    keyTopics: ["Burst mode vs Cycle stealing", "DMA controller registers", "Interrupt generation"]
  }
];

export const MCQS: MCQQuestion[] = [
  {
    id: "mcq-1",
    chapterId: "cpu-registers",
    chapterName: "CPU & Registers",
    question: "Which register holds the memory address of the next instruction to be fetched from RAM?",
    options: ["Memory Buffer Register (MBR)", "Program Counter (PC)", "Instruction Register (IR)", "Accumulator (AC)"],
    correctIndex: 1,
    explanation: "The Program Counter (PC) stores the address of the next instruction and is automatically incremented during the fetch phase.",
    difficulty: "Easy"
  },
  {
    id: "mcq-2",
    chapterId: "number-systems",
    chapterName: "Number Systems",
    question: "What is the 8-bit 2's complement representation of decimal number -14?",
    options: ["1111 0010", "1111 0001", "1111 1100", "1111 0011"],
    correctIndex: 0,
    explanation: "+14 is 0000 1110. Invert bits (1's complement) -> 1111 0001. Add 1 -> 1111 0010.",
    difficulty: "Medium"
  },
  {
    id: "mcq-3",
    chapterId: "memory-hierarchy-cache",
    chapterName: "Memory & Cache",
    question: "A cache has a hit time of 2 ns and a hit ratio of 95%. Main memory access time is 60 ns. What is the AMAT (Average Memory Access Time)?",
    options: ["3.0 ns", "5.0 ns", "4.9 ns", "5.9 ns"],
    correctIndex: 1,
    explanation: "AMAT = T_cache + (1 - H) × Miss_Penalty = 2 + (1 - 0.95) × 60 = 2 + (0.05 × 60) = 2 + 3 = 5.0 ns.",
    difficulty: "Medium"
  },
  {
    id: "mcq-4",
    chapterId: "instruction-cycle-addressing",
    chapterName: "Instruction Cycle",
    question: "Which addressing mode requires TWO memory references to access the target operand?",
    options: ["Direct Addressing", "Register Addressing", "Indirect Addressing", "Immediate Addressing"],
    correctIndex: 2,
    explanation: "In Indirect Addressing, the first memory access fetches the pointer (effective address), and the second memory access fetches the actual operand.",
    difficulty: "Easy"
  },
  {
    id: "mcq-5",
    chapterId: "pipelining-io",
    chapterName: "Pipelining & I/O",
    question: "Which technique resolves a Read-After-Write (RAW) data hazard without inserting pipeline stall bubbles?",
    options: ["Branch Prediction", "Operand Forwarding / Bypassing", "Direct Memory Access", "Increasing clock frequency"],
    correctIndex: 1,
    explanation: "Operand forwarding (data bypassing) routes the output of the ALU directly back into the ALU inputs for the succeeding instruction before writing to the register file.",
    difficulty: "Medium"
  },
  {
    id: "mcq-6",
    chapterId: "logic-gates-circuits",
    chapterName: "Logic Circuits",
    question: "What is the minimum number of 2-input NAND gates required to build a 2-input XOR gate?",
    options: ["3", "4", "5", "6"],
    correctIndex: 1,
    explanation: "A 2-input XOR gate can be synthesized with exactly 4 NAND gates: Y = (A · (A · B)')' · (B · (A · B)')'.",
    difficulty: "Hard"
  },
  {
    id: "mcq-7",
    chapterId: "pipelining-io",
    chapterName: "Pipelining & I/O",
    question: "During DMA transfer in Cycle Stealing mode, what happens to the system bus?",
    options: [
      "The DMA takes the bus for transferring all blocks continuously.",
      "The DMA takes control of the bus for one bus cycle at a time from the CPU.",
      "The CPU stops executing programs forever.",
      "The RAM is disconnected from the motherboard."
    ],
    correctIndex: 1,
    explanation: "In cycle stealing mode, DMA steals one machine cycle from the CPU at a time, allowing the CPU to continue executing non-memory instructions simultaneously.",
    difficulty: "Medium"
  },
  {
    id: "mcq-8",
    chapterId: "cpu-registers",
    chapterName: "CPU & Registers",
    question: "Why is Hardwired Control preferred in modern RISC processors over Microprogrammed Control?",
    options: [
      "It is much easier to modify via software patches.",
      "It requires a large and costly Control ROM.",
      "It provides faster execution speeds because logic is implemented directly in combinational gates.",
      "It supports more complicated CISC instruction formats."
    ],
    correctIndex: 2,
    explanation: "Hardwired control uses direct combinational logic circuits, eliminating the clock cycles needed to read micro-instructions from control memory ROM.",
    difficulty: "Medium"
  },
  {
    id: "mcq-9",
    chapterId: "number-systems",
    chapterName: "Number Systems",
    question: "In Booth's multiplication algorithm, what action is performed when the bit pair (Q0, Q-1) is observed to be 1 0?",
    options: [
      "Add multiplicand to Accumulator (A = A + M), then ASR",
      "Subtract multiplicand from Accumulator (A = A - M), then ASR",
      "Arithmetic Shift Left only",
      "Reset the Accumulator to zero"
    ],
    correctIndex: 1,
    explanation: "When bit pair is 1 0 (transition from 0 to 1 in multiplier scan), we subtract M from A (A = A - M) followed by an Arithmetic Shift Right (ASR).",
    difficulty: "Hard"
  },
  {
    id: "mcq-10",
    chapterId: "memory-hierarchy-cache",
    chapterName: "Memory & Cache",
    question: "In a 4-way set-associative cache with 1024 total lines and a 64-byte block size on a 32-bit system, how many Set Index bits are required?",
    options: ["6 bits", "8 bits", "10 bits", "12 bits"],
    correctIndex: 1,
    explanation: "Number of Sets = Total Lines / Associativity = 1024 / 4 = 256 sets. Set Index bits = log2(256) = 8 bits.",
    difficulty: "Hard"
  },
  {
    id: "mcq-11",
    chapterId: "number-systems",
    chapterName: "Number Systems",
    question: "In IEEE 754 single-precision (32-bit) floating point format, what is the bias value added to the true exponent?",
    options: ["128", "127", "1023", "255"],
    correctIndex: 1,
    explanation: "For single-precision (8-bit exponent field), the excess bias is 2^(8-1) - 1 = 127. An actual exponent of 0 is stored as 01111111 (127).",
    difficulty: "Medium"
  },
  {
    id: "mcq-12",
    chapterId: "cpu-registers",
    chapterName: "CPU & Registers",
    question: "What is the primary architectural difference between Von Neumann and Harvard architectures?",
    options: [
      "Von Neumann has an ALU, while Harvard uses only software emulation.",
      "Harvard architecture uses physically separate storage and signal pathways for instructions and data.",
      "Von Neumann architecture cannot perform floating point math.",
      "Harvard architecture requires microprogrammed control memory only."
    ],
    correctIndex: 1,
    explanation: "Harvard architecture features separate memory buses and address spaces for code and data, eliminating structural pipeline bottlenecks present in unified Von Neumann systems.",
    difficulty: "Easy"
  },
  {
    id: "mcq-13",
    chapterId: "instruction-cycle-addressing",
    chapterName: "Instruction Cycle",
    question: "A branch instruction at memory address 0x200 uses PC-relative addressing with an offset of +0x040. If instructions are 4 bytes long and PC is incremented immediately after fetch, what is the target effective address?",
    options: ["0x240", "0x244", "0x204", "0x23C"],
    correctIndex: 1,
    explanation: "After fetching from 0x200, PC increments by 4 bytes to 0x204. Target EA = incremented PC + offset = 0x204 + 0x040 = 0x244.",
    difficulty: "Hard"
  },
  {
    id: "mcq-14",
    chapterId: "memory-hierarchy-cache",
    chapterName: "Memory & Cache",
    question: "In a cache memory with Write-Back policy, what is the role of the 'Dirty Bit'?",
    options: [
      "Indicates that the cache block contains parity transmission errors.",
      "Flags whether the cache block has been modified compared to Main Memory.",
      "Indicates that the cache block must be read again on next cycle.",
      "Specifies whether the cache block is stored in L1 or L2."
    ],
    correctIndex: 1,
    explanation: "The dirty bit (modify bit) is set to 1 whenever a write occurs in cache. When the line is later replaced/evicted, it is only written back to RAM if the dirty bit is 1.",
    difficulty: "Medium"
  },
  {
    id: "mcq-15",
    chapterId: "cpu-registers",
    chapterName: "CPU & Registers",
    question: "Which characteristic is true for Horizontal Microprogramming compared to Vertical Microprogramming?",
    options: [
      "It requires decoders to interpret control bits.",
      "It has wider control words and allows higher parallelism with unencoded control bits.",
      "It consumes significantly less Control ROM space.",
      "It has slower micro-instruction execution cycles."
    ],
    correctIndex: 1,
    explanation: "Horizontal microcode uses 1 bit per hardware control line (unencoded), enabling high concurrency and faster signal generation at the expense of wider control words.",
    difficulty: "Medium"
  },
  {
    id: "mcq-16",
    chapterId: "pipelining-io",
    chapterName: "Pipelining & I/O",
    question: "Consider two instructions: I1: R1 <- R2 + R3 and I2: R2 <- R4 * R5. What type of pipeline dependency exists between them?",
    options: [
      "RAW (Read After Write / Flow dependency)",
      "WAR (Write After Read / Anti-dependency)",
      "WAW (Write After Write / Output dependency)",
      "Structural hardware conflict"
    ],
    correctIndex: 1,
    explanation: "I2 wants to write to R2, which I1 must first read. This is a WAR (anti-dependency). If out-of-order execution occurs, I2 must not overwrite R2 before I1 reads it.",
    difficulty: "Hard"
  },
  {
    id: "mcq-17",
    chapterId: "pipelining-io",
    chapterName: "Pipelining & I/O",
    question: "In hardware Daisy Chaining priority interrupt resolution, which device receives the highest priority?",
    options: [
      "The device physically closest to the CPU interrupt acknowledge line.",
      "The device with the highest baud rate.",
      "The device physically farthest along the serial chain.",
      "The device that requests an interrupt last."
    ],
    correctIndex: 0,
    explanation: "In daisy chaining, the interrupt acknowledge signal propagates serially. The peripheral closest to the CPU intercepts the signal first, giving it highest priority.",
    difficulty: "Medium"
  },
  {
    id: "mcq-18",
    chapterId: "logic-gates-circuits",
    chapterName: "Logic Circuits",
    question: "A 3-to-8 line decoder with an active-low Enable input requires how many AND gates when constructed using basic gates?",
    options: ["3 gates", "6 gates", "8 gates", "16 gates"],
    correctIndex: 2,
    explanation: "A 3-to-8 decoder has 8 output lines (Y0 to Y7), each produced by an AND gate representing one of the 8 minterms m0 to m7.",
    difficulty: "Easy"
  },
  {
    id: "mcq-19",
    chapterId: "memory-hierarchy-cache",
    chapterName: "Memory & Cache",
    question: "A system uses a TLB (Translation Lookaside Buffer) with 90% hit ratio and 10 ns access time. Main memory access time is 80 ns. What is the effective memory access time for paging?",
    options: ["98 ns", "108 ns", "88 ns", "72 ns"],
    correctIndex: 0,
    explanation: "TLB Hit: TLB (10 ns) + 1 Memory access (80 ns) = 90 ns. TLB Miss: TLB (10 ns) + Page Table Memory (80 ns) + Target Memory (80 ns) = 170 ns. EMAT = 0.90(90) + 0.10(170) = 81 + 17 = 98 ns.",
    difficulty: "Hard"
  },
  {
    id: "mcq-20",
    chapterId: "pipelining-io",
    chapterName: "Pipelining & I/O",
    question: "According to Amdahl's Law, if an enhancement speeds up 60% of a computer's workload by 4x, what is the overall system speedup?",
    options: ["1.82x", "2.50x", "1.45x", "3.10x"],
    correctIndex: 0,
    explanation: "Speedup = 1 / [(1 - f) + (f / s)] = 1 / [(1 - 0.60) + (0.60 / 4)] = 1 / [0.40 + 0.15] = 1 / 0.55 ≈ 1.818x.",
    difficulty: "Hard"
  },
  {
    id: "mcq-21",
    chapterId: "logic-gates-circuits",
    chapterName: "Logic Circuits",
    question: "A multiplexer with 16 data inputs requires how many select input lines?",
    options: ["2 select lines", "4 select lines", "8 select lines", "16 select lines"],
    correctIndex: 1,
    explanation: "A multiplexer has 2^n inputs where n is the number of select lines. Since 16 = 2^4, exactly 4 select lines are required (S3, S2, S1, S0).",
    difficulty: "Easy"
  },
  {
    id: "mcq-22",
    chapterId: "logic-gates-circuits",
    chapterName: "Logic Circuits",
    question: "In a binary Half Adder circuit, what are the Boolean expressions for the Sum and Carry outputs for inputs A and B?",
    options: [
      "Sum = A · B, Carry = A + B",
      "Sum = A ⊕ B, Carry = A · B",
      "Sum = A + B, Carry = A ⊕ B",
      "Sum = (A · B)', Carry = A ⊕ B"
    ],
    correctIndex: 1,
    explanation: "Sum is the XOR function: Sum = A ⊕ B. Carry is the AND function: Carry = A · B.",
    difficulty: "Easy"
  },
  {
    id: "mcq-23",
    chapterId: "instruction-cycle-addressing",
    chapterName: "Instruction Cycle",
    question: "Which addressing mode is most suitable for accessing elements of an array whose base address is stored in a register?",
    options: [
      "Immediate Addressing",
      "Indexed / Base-Displacement Addressing",
      "Direct Addressing",
      "Relative Addressing"
    ],
    correctIndex: 1,
    explanation: "In Indexed / Base-Displacement addressing, the Effective Address = Base Register + Index/Offset, allowing simple sequential traversal of array elements by incrementing the index register.",
    difficulty: "Medium"
  },
  {
    id: "mcq-24",
    chapterId: "instruction-cycle-addressing",
    chapterName: "Instruction Cycle",
    question: "What is the primary benefit of Immediate Addressing compared to Direct Addressing?",
    options: [
      "It allows larger operand data sizes.",
      "It requires no additional memory references to fetch the operand value.",
      "It enables relocatable code at runtime.",
      "It supports indirect pointer dereferencing."
    ],
    correctIndex: 1,
    explanation: "In Immediate Addressing, the operand value is embedded directly inside the fetched instruction word, requiring 0 additional memory access cycles to retrieve.",
    difficulty: "Easy"
  },
  {
    id: "mcq-25",
    chapterId: "number-systems",
    chapterName: "Number Systems",
    question: "Why do modern digital processors use 2's complement rather than 1's complement or Signed Magnitude?",
    options: [
      "2's complement numbers require 2 sign bits instead of 1.",
      "2's complement has a unique representation for zero and uses the same hardware adder for both addition and subtraction.",
      "2's complement cannot represent negative numbers.",
      "2's complement eliminates all arithmetic overflow."
    ],
    correctIndex: 1,
    explanation: "2's complement provides a single unique zero (00000000), avoids end-around carry logic, and allows the ALU to perform subtraction (A - B) as simple addition with an inverter: A + (~B + 1).",
    difficulty: "Medium"
  },
  {
    id: "mcq-26",
    chapterId: "cpu-registers",
    chapterName: "CPU & Registers",
    question: "Which CPU register specifically holds the memory address of the next sequential instruction waiting to be fetched?",
    options: [
      "Instruction Register (IR)",
      "Program Counter (PC)",
      "Memory Buffer Register (MBR)",
      "Stack Pointer (SP)"
    ],
    correctIndex: 1,
    explanation: "The Program Counter (PC) stores the memory address of the next instruction. After the fetch step (MAR <- PC), the PC automatically increments (PC <- PC + I).",
    difficulty: "Easy"
  },
  {
    id: "mcq-27",
    chapterId: "cpu-registers",
    chapterName: "CPU & Registers",
    question: "In a single-accumulator CPU architecture (e.g., ADD X), where are the operands and the resulting output stored?",
    options: [
      "Both operands are in RAM; output writes directly to disk.",
      "One operand is implicitly in AC; the ALU computation result overwrites AC.",
      "Operands are loaded only from external I/O ports.",
      "The result is pushed onto the call stack automatically."
    ],
    correctIndex: 1,
    explanation: "In an accumulator organization, instructions use a 1-address format. AC implicitly supplies one operand and stores the ALU computation result: AC <- AC + M[X].",
    difficulty: "Medium"
  },
  {
    id: "mcq-28",
    chapterId: "logic-gates-circuits",
    chapterName: "Logic Circuits",
    question: "According to De Morgan's Law, what is the dual Boolean equivalence of the NOR expression (A + B)'?",
    options: ["A' + B'", "A' · B'", "(A · B)'", "A ⊕ B"],
    correctIndex: 1,
    explanation: "De Morgan's First Law states: (A + B)' = A' · B' (the complement of a logical sum equals the product of individual complements).",
    difficulty: "Easy"
  },
  {
    id: "mcq-29",
    chapterId: "memory-hierarchy-cache",
    chapterName: "Memory & Cache",
    question: "In a memory system with Cache access time = 5 ns and Main Memory access time = 100 ns, what minimum cache hit ratio (H) is required to achieve AMAT ≤ 15 ns?",
    options: ["85%", "90%", "95%", "99%"],
    correctIndex: 1,
    explanation: "AMAT = T_cache + (1 - H) × T_mem => 15 ≥ 5 + (1 - H) × 100 => 10 ≥ 100(1 - H) => 0.10 ≥ 1 - H => H ≥ 0.90 (90%).",
    difficulty: "Hard"
  },
  {
    id: "mcq-30",
    chapterId: "instruction-cycle-addressing",
    chapterName: "Instruction Cycle",
    question: "During which phase of the standard Von Neumann instruction execution cycle is the opcode interpreted by control logic to determine what micro-operations to pulse?",
    options: ["Fetch phase", "Decode phase", "Execute phase", "Write-back phase"],
    correctIndex: 1,
    explanation: "During the Decode phase, the control unit decodes the bit pattern in the Instruction Register (IR) using instruction decoders to trigger appropriate control line pulses.",
    difficulty: "Easy"
  }
];

export const PRACTICE_EXAM_QUESTIONS: PracticeQuestion[] = [
  {
    id: "prac-1",
    chapterId: "memory-hierarchy-cache",
    title: "Cache Memory Address Format & Line Breakdown",
    marks: 10,
    question: "A computer system has a 4 GB byte-addressable main memory and an 8 KB cache memory. The cache block size is 32 bytes. Determine the number of Tag, Index, and Offset bits if the cache is: (i) Direct Mapped, (ii) 4-Way Set-Associative.",
    modelAnswer: [
      "1. Physical Address Size: 4 GB = 2^32 bytes => 32-bit physical address.",
      "2. Block/Word Offset Bits: Block size = 32 bytes = 2^5 bytes => Offset = 5 bits.",
      "3. Total Cache Lines: Cache size / Block size = 8 KB / 32 B = (8 × 1024) / 32 = 256 lines.",
      "Case (i) Direct Mapped:",
      "• Number of Lines = 256 = 2^8 => Line/Index bits = 8 bits.",
      "• Tag bits = 32 - (8 + 5) = 19 bits.",
      "• Address Format: [Tag: 19 bits | Line: 8 bits | Offset: 5 bits].",
      "Case (ii) 4-Way Set-Associative:",
      "• Number of Sets = 256 lines / 4 = 64 sets = 2^6 => Set Index bits = 6 bits.",
      "• Tag bits = 32 - (6 + 5) = 21 bits.",
      "• Address Format: [Tag: 21 bits | Set: 6 bits | Offset: 5 bits]."
    ],
    keyTip: "Always calculate offset bits first from the block size (2^k bytes = k bits), then compute the number of sets."
  },
  {
    id: "prac-2",
    chapterId: "pipelining-io",
    title: "Pipeline Hazards & Speedup Calculation",
    marks: 10,
    question: "Explain Structural, Data, and Control hazards in a 5-stage instruction pipeline. A pipelined processor has 5 stages with delays 250ps, 350ps, 150ps, 400ps, and 200ps with 50ps latch delay. Calculate clock cycle and ideal speedup for 1000 instructions compared to unpipelined.",
    modelAnswer: [
      "1. Structural Hazards: Resource contention when hardware cannot support all pipeline combinations (e.g. single memory bus). Resolved by separate I-cache and D-cache.",
      "2. Data Hazards: Arises when instruction depends on data not yet produced (RAW, WAR, WAW). Resolved via operand forwarding / forwarding paths.",
      "3. Control Hazards: Occurs due to conditional/unconditional branches altering PC. Resolved by branch predictors and delayed branch slots.",
      "4. Unpipelined Cycle Time: Sum of stages = 250 + 350 + 150 + 400 + 200 = 1350 ps. Execution time for 1000 instructions = 1000 × 1350 ps = 1,350,000 ps.",
      "5. Pipelined Cycle Time: Max stage delay + latch = max(250, 350, 150, 400, 200) + 50 ps = 400 + 50 = 450 ps.",
      "6. Total cycles for 1000 instructions in 5-stage pipeline = k + n - 1 = 5 + 1000 - 1 = 1004 cycles.",
      "7. Pipelined Execution Time = 1004 × 450 ps = 451,800 ps.",
      "8. Speedup = 1,350,000 ps / 451,800 ps ≈ 2.988x."
    ],
    keyTip: "Clock cycle of a pipeline is ALWAYS bounded by the slowest stage plus latch delay!"
  },
  {
    id: "prac-3",
    chapterId: "number-systems",
    title: "Booth's Multiplication Step-by-Step Numerical",
    marks: 10,
    question: "Multiply (+7) by (-5) using Booth's Multiplication Algorithm in 5-bit binary representation.",
    modelAnswer: [
      "Multiplicand M = +7 = 00111₂, -M = 2's complement of M = 11001₂.",
      "Multiplier Q = -5 = 11011₂, Q-1 = 0, Accumulator A = 00000₂. Count = 5.",
      "Cycle 1: Inspect (Q0, Q-1) = (1, 0) => A = A - M = 00000 + 11001 = 11001. ASR [A, Q, Q-1] => A = 11100, Q = 11101, Q-1 = 1.",
      "Cycle 2: Inspect (Q0, Q-1) = (1, 1) => ASR only => A = 11110, Q = 01110, Q-1 = 1.",
      "Cycle 3: Inspect (Q0, Q-1) = (0, 1) => A = A + M = 11110 + 00111 = 00101. ASR => A = 00010, Q = 10111, Q-1 = 0.",
      "Cycle 4: Inspect (Q0, Q-1) = (1, 0) => A = A - M = 00010 + 11001 = 11011. ASR => A = 11101, Q = 11011, Q-1 = 1.",
      "Cycle 5: Inspect (Q0, Q-1) = (1, 1) => ASR only => A = 11110, Q = 11101, Q-1 = 1.",
      "Final Result: Concatenation of [A, Q] = 11110 11101₂ in 10-bit.",
      "Verification: 11110 11101₂ in 2's complement: flip bits + 1 => 00001 00010 + 1 = 00001 00011₂ = -(32 + 2 + 1) = -35. Correct (+7 × -5 = -35)!"
    ],
    keyTip: "Never forget arithmetic shift right (ASR) preserves the most significant bit (MSB) of Accumulator A."
  }
];

export const CHEATSHEET_DATA: CheatsheetItem[] = [
  {
    topic: "Booth's Bit-Pair Rules",
    category: "Arithmetic",
    summary: "Action based on (Q0, Q-1) inspection",
    formula: "1 0 => A = A - M, ASR | 0 1 => A = A + M, ASR | 0 0 or 1 1 => ASR only",
    application: "Fast signed multiplication without separate sign handling."
  },
  {
    topic: "Average Memory Access Time (AMAT)",
    category: "Memory",
    summary: "System memory latency including cache misses",
    formula: "AMAT = T_L1 + (Miss Rate_L1 × Miss Penalty)",
    application: "Evaluates multi-level cache architecture efficiency."
  },
  {
    topic: "Direct Mapped Cache Bits",
    category: "Memory",
    summary: "Address bit breakdown",
    formula: "Offset = log2(BlockSize) | Index = log2(NumLines) | Tag = AddrBits - (Index + Offset)",
    application: "Hardware address bus decoder synthesis."
  },
  {
    topic: "Pipeline Ideal Speedup",
    category: "Performance",
    summary: "Maximum speedup with k stages and n instructions",
    formula: "S = (n × k) / (k + n - 1)  ->  S ≈ k as n -> ∞",
    application: "Throughput evaluation for superscalar & RISC CPUs."
  },
  {
    topic: "De Morgan's Theorems",
    category: "Boolean Algebra",
    summary: "Duality in inverted conjunction & disjunction",
    formula: "(A · B)' = A' + B'  |  (A + B)' = A' · B'",
    application: "Minimizing gate count and converting circuits to NAND/NOR."
  },
  {
    topic: "2's Complement Range",
    category: "Data Representation",
    summary: "Allowable signed integer range for n bits",
    formula: "-(2^(n-1)) to +(2^(n-1) - 1)",
    application: "Detecting arithmetic overflow in ALU registers."
  }
];
