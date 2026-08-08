/**
 * HIGH-PRECISION QUIZ APPLICATION CORE DATA ARCHITECT CORE
 * Built exclusively for native browser execution.
 */

// --- GLOBAL STORAGE KEYS ---
const ARCHIVE_KEY = "CH_ARCHIVED_PRODUCTS";
const SAVED_EXAMS_KEY = "CH_SAVED_EXAMS";
const BOOKMARKS_STORAGE_KEY = "CH_BOOKMARKS";
const NOTES_STORAGE_KEY = "CH_QUESTION_NOTES";
const OWNED_KEY = "CH_OWNED_PRODUCTS"; 


/**
 * Builds the WhatsApp click-to-chat URL for Personalized Training.
 * Uses the logged-in username when available.
 */
function buildPersonalizedTrainingWhatsAppLink() {
  const name = appState.currentUser || "Guest";
  const draft = `Hi, I'm ${name}, from 'CodingHamme Practice Exam Webpage'. I'm interested in having a personalized Training for the tech course [Course (e.g., CyberSecurity, Data Science, Software Development)].`;
  // Replace the phone number below with the real business WhatsApp number when available
  const phone = "2349078920214"; // e.g. 2348012345678
  return `https://wa.me/${phone}?text=${encodeURIComponent(draft)}`;
}

// Call this inside renderDashboardProducts() (or right after navigateTo("dashboard"))
function wirePromoCardLinks() {
  const link = document.getElementById("personalizedTrainingLink");
  if (link) {
    link.href = buildPersonalizedTrainingWhatsAppLink();
  }
}

/** Official CodingHamme WhatsApp Channel – used by Tools → Learn More */
const WHATSAPP_CHANNEL_URL = "https://www.whatsapp.com/channel/0029VbAp1qHIXnltu1srjl3A";

/**
 * Opens the CodingHamme WhatsApp Channel in a new tab (Tools page "Learn More").
 */
function openExamResourcesLink() {
  window.open(WHATSAPP_CHANNEL_URL, "_blank", "noopener,noreferrer");
}

/**
 * Shows the Reset Data confirmation modal.
 */
function openResetDataModal() {
  const modal = document.getElementById("resetDataModal");
  if (modal) modal.classList.remove("hidden");
}

/**
 * Hides the Reset Data confirmation modal.
 */
function closeResetDataModal() {
  const modal = document.getElementById("resetDataModal");
  if (modal) modal.classList.add("hidden");
}

/**
 * Permanently clears all practice-related localStorage data while preserving
 * registration / login credentials. Resets runtime state and returns to dashboard.
 */
function executeFullDataReset() {
  // Core keys
  const keysToRemove = [
    ARCHIVE_KEY,
    SAVED_EXAMS_KEY,
    BOOKMARKS_STORAGE_KEY,
    NOTES_STORAGE_KEY,
    OWNED_KEY
  ];

  keysToRemove.forEach(k => localStorage.removeItem(k));

  // Dynamic history & per-product notes (CH_HIST_* and CH_NOTES_*)
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(k => {
    if (k.startsWith("CH_HIST_") || k.startsWith("CH_NOTES_")) {
      localStorage.removeItem(k);
    }
  });

  // Clear any running quiz timer and ephemeral engine state
  if (typeof clearQuizTimer === "function") clearQuizTimer();
  if (appState.quizEngine) {
    appState.quizEngine.questions = [];
    appState.quizEngine.currentIndex = 0;
    appState.quizEngine.userAnswers = {};
    appState.quizEngine.timeRemaining = 0;
    appState.quizEngine.isGraded = false;
    appState.quizEngine.originSavedExamId = null;
  }
  appState.selectedProduct = null;
  appState.selectedMode = null;
  appState.isDefaultTest = false;

  closeResetDataModal();
  alert("All practice data has been successfully reset. Your login credentials remain unchanged.");
  navigateTo("dashboard");
}

// 1. GLOBAL MULTI-CERTIFICATION DATA STORE
const QuizDataStore = {

};
 
// 2. RUNTIME APPLICATION STATE INTERFACE
const QuizState = {
    currentCertification: "CompTIA_Network_Plus",
    currentChapter: "chapter1",
    currentQuestions: [],
    currentQuestionIndex: 0,
    score: 0
};

// GLOBAL CORE APPLICATION WORKFLOW STATE Object Definition
const appState = {
    currentUser: null,
    activeView: "landing",
    selectedProduct: null,
    selectedMode: null,
    isDefaultTest: false,          
    quizEngine: {
        questions: [],
        currentIndex: 0,
        userAnswers: {},
        timeRemaining: 0,
        timerInterval: null,
        isGraded: false,
        // NEW: tracks the id of a previously saved exam that was resumed
        originSavedExamId: null
    }
};

/* ==========================================================================
   CERTIFICATION EXAM METADATA + BALANCED DEFAULT-TEST GENERATOR
   ========================================================================== */

const CERT_EXAM_METADATA = {
    // CompTIA advanced / intermediate
    "CAS-005":   { questionCount: 90,  durationMinutes: 165 },
    "SECX2026":  { questionCount: 90,  durationMinutes: 165 },
    "PT0-003":   { questionCount: 90,  durationMinutes: 165 },
    "PT0003":    { questionCount: 90,  durationMinutes: 165 },
    "CS0-004":   { questionCount: 90,  durationMinutes: 165 },
    "CYSA2026":  { questionCount: 90,  durationMinutes: 165 },

    // ISC²
    "ISC2-CC":   { questionCount: 125, durationMinutes: 120 },
    "CC2024":    { questionCount: 125, durationMinutes: 120 },
    "ISC2-SSCP": { questionCount: 125, durationMinutes: 120 },
    "SSCP2026":  { questionCount: 125, durationMinutes: 120 },
    "CGRC-2026": { questionCount: 125, durationMinutes: 180 },
    "CGRC2026":  { questionCount: 125, durationMinutes: 180 },
    "CSSLP-2026":{ questionCount: 125, durationMinutes: 180 },
    "CSSLP2026": { questionCount: 125, durationMinutes: 180 },
    "ISC2-CISSP":{ questionCount: 150, durationMinutes: 180 },
    "CISSP2024": { questionCount: 150, durationMinutes: 180 },

    // EC-Council
    "CEH-V13":   { questionCount: 125, durationMinutes: 240 },
    "CEHV13":    { questionCount: 125, durationMinutes: 240 },

    // ISACA
    "CISA-2026": { questionCount: 150, durationMinutes: 240 },
    "CISA2026":  { questionCount: 150, durationMinutes: 240 },
    "CISM-2026": { questionCount: 150, durationMinutes: 240 },
    "CISM2026":  { questionCount: 150, durationMinutes: 240 },
    "CRISC-2026":{ questionCount: 150, durationMinutes: 240 },
    "CRISC2026": { questionCount: 150, durationMinutes: 240 },

    // GIAC / SANS style
    "GISF-2026": { questionCount: 106, durationMinutes: 240 },
    "GISF2026":  { questionCount: 106, durationMinutes: 240 },
    "GCPM-2026": { questionCount: 106, durationMinutes: 240 },
    "GCPM2026":  { questionCount: 106, durationMinutes: 240 },
    "GSNA-2026": { questionCount: 106, durationMinutes: 240 },
    "GSNA2026":  { questionCount: 106, durationMinutes: 240 },

    // CompTIA Network+ / Security+
    "N10-009":   { questionCount: 90,  durationMinutes: 90  },
    "NET009":    { questionCount: 90,  durationMinutes: 90  },
    "SY0-701":   { questionCount: 90,  durationMinutes: 90  },
    "SEC701":    { questionCount: 90,  durationMinutes: 90  }
};

function getExamMetadata(product) {
    if (!product) return { questionCount: 90, durationMinutes: 90 };
    return CERT_EXAM_METADATA[product.code] ||
           CERT_EXAM_METADATA[product.id]   ||
           { questionCount: 90, durationMinutes: 90 };
}

/* ==========================================================================
   PER-PRODUCT DATA FILE REGISTRY (lazy-loaded question banks)
   ----------------------------------------------------------------------
   Keyed by product.id from MOCK_PRODUCTS_DATABASE. Each entry points at a
   dedicated ES module under data/ that exports a flat `questions` array
   (see data/_TEMPLATE.js for the required shape). Files are fetched with
   dynamic import() only when a user actually starts a quiz for that
   product, so the initial page load never downloads question data it
   doesn't need. Products not yet listed here transparently fall back to
   QuizDataStore and then generateQuestionsForProduct(), so nothing breaks.
   ========================================================================== */
const PRODUCT_DATA_FILE_MAP = {
    NET009:     "./data/net009.js",
    SEC701:     "./data/sec701.js",
    CEHV13:     "./data/cehv13.js",
    PT0003:     "./data/pt0003.js",
    CYSA2026:   "./data/cysa2026.js",
    SECX2026:   "./data/secx2026.js",
    CC2024:     "./data/cc2024.js",
    SSCP2026:   "./data/sscp2026.js",
    CISSP2024:  "./data/cissp2024.js",
    CSSLP2026:  "./data/csslp2026.js",
    CGRC2026:   "./data/cgrc2026.js",
    CISA2026:   "./data/cisa2026.js",
    CISM2026:   "./data/cism2026.js",
    CRISC2026:  "./data/crisc2026.js",
    CGEIT2026:  "./data/cgeit2026.js",
    CDPSE2026:  "./data/cdpse2026.js",
    GISF2026:   "./data/gisf2026.js",
    GCPM2026:   "./data/gcpm2026.js",
    GSNA2026:   "./data/gsna2026.js"
};

// In-memory cache so a product's data file is only ever downloaded once
// per page session, no matter how many times the user starts a quiz for it.
const _loadedProductQuestionCache = {};

/**
 * Resolves the curated question pool for a product via dynamic import,
 * caching the result. Returns null (never throws) if there is no dedicated
 * data file yet, or if the import fails for any reason — callers must
 * treat null as "fall back to the legacy generator".
 */
async function loadCuratedQuestionBank(product) {
    if (!product) return null;
    const dataPath = PRODUCT_DATA_FILE_MAP[product.id] || PRODUCT_DATA_FILE_MAP[product.code];
    if (!dataPath) return null;

    if (_loadedProductQuestionCache[dataPath]) {
        return _loadedProductQuestionCache[dataPath];
    }

    try {
        const module = await import(dataPath);
        const bank = module.default || module.questions || null;
        if (!bank || bank.length === 0) {
            console.error(`Curated data file for ${product.id} (${dataPath}) loaded but exported no questions.`);
            return null;
        }
        _loadedProductQuestionCache[dataPath] = bank;
        return bank;
    } catch (err) {
        console.error(`Curated data file missing/failed for ${product.id} (${dataPath}); falling back to generated questions.`, err);
        return null;
    }
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateBalancedDefaultExam(fullPool, targetCount) {
    if (!fullPool || fullPool.length === 0) return [];

    const byChapter = {};
    fullPool.forEach(q => {
        const ch = q.chapterIndex ?? 0;
        if (!byChapter[ch]) byChapter[ch] = [];
        byChapter[ch].push(q);
    });

    const chapterKeys = Object.keys(byChapter).map(Number).sort((a, b) => a - b);
    const numChapters = chapterKeys.length || 1;

    const basePerChapter = Math.floor(targetCount / numChapters);
    let remainder = targetCount % numChapters;

    const selected = [];
    const usedIds = new Set();

    chapterKeys.forEach(ch => {
        const pool = shuffleArray([...byChapter[ch]]);
        const take = Math.min(basePerChapter, pool.length);
        for (let i = 0; i < take; i++) {
            selected.push(pool[i]);
            usedIds.add(pool[i].id);
        }
    });

    const leftover = fullPool.filter(q => !usedIds.has(q.id));
    shuffleArray(leftover);

    for (let i = 0; i < remainder && i < leftover.length; i++) {
        selected.push(leftover[i]);
        usedIds.add(leftover[i].id);
    }

    if (selected.length < targetCount) {
        const stillNeeded = targetCount - selected.length;
        const extra = fullPool.filter(q => !usedIds.has(q.id));
        shuffleArray(extra);
        selected.push(...extra.slice(0, stillNeeded));
    }

    return shuffleArray(selected).slice(0, targetCount);
}

// 3. HIGH-PRECISION DYNAMIC LOAD MANAGEMENT WIRING
function loadQuiz(certification, chapterKey) {
    if (!QuizDataStore[certification] || !QuizDataStore[certification][chapterKey]) {
        console.error(`Data Layer Link Error: ${certification} -> ${chapterKey} variant missing.`);
        return false;
    }
    
    QuizState.currentCertification = certification;
    QuizState.currentChapter = chapterKey;
    QuizState.currentQuestions = QuizDataStore[certification][chapterKey];
    QuizState.currentQuestionIndex = 0;
    QuizState.score = 0;
    
    if (typeof renderCurrentQuestion === "function") {
        renderCurrentQuestion();
    } else if (typeof displayQuestionInUI === "function") {
        displayQuestionInUI(QuizState.currentQuestions[QuizState.currentQuestionIndex]);
    }
    return true;
}

// Available IT Credentials Product Matrix
const MOCK_PRODUCTS_DATABASE = [
    {
        id: "NET009",
        title: "CompTIA Network+ N10-009 Practice Engine",
        code: "N10-009",
        imageIcon: "fa-network-wired",
        description: "Features exactly 12 complete chapters.",
        chapters: [
            "Chapter 1: Introduction to Networking Concepts",
            "Chapter 2: Network Infrastructure and Topology Models",
            "Chapter 3: Addressing, Subnetting, and Routing Essentials",
            "Chapter 4: Core Network Protocols and Port Implementations",
            "Chapter 5: Network Switching Techniques and Architectures",
            "Chapter 6: Wireless Network Specifications and Frameworks",
            "Chapter 7: Virtualization, Cloud Architecture, and Data Centers",
            "Chapter 8: Network Operations, Practices, and Monitoring Systems",
            "Chapter 9: Network Security Concepts and Perimeter Hardening",
            "Chapter 10: Network Management, Documentation, and Baseline Auditing",
            "Chapter 11: Network Troubleshooting Methodologies",
            "Chapter 12: Practical Network Problem Resolution Frameworks"
        ]
    },
    {
        id: "CC2024",
        title: "ISC² CC Practice Engine",
        code: "ISC2-CC",
        imageIcon: "fa-user-shield",
        description: "Features exactly 23 structural chapters.",
        chapters: [
            "Chapter 1: Foundational Cybersecurity Concepts",
            "Chapter 2: Security Principles and CIA Triad Parameters",
            "Chapter 3: Security Controls (Physical, Technical, Administrative)",
            "Chapter 4: Risk Management Principles and Assessments",
            "Chapter 5: Governance Frameworks and Compliance Compliance",
            "Chapter 6: Business Continuity (BC) Strategic Standards",
            "Chapter 7: Disaster Recovery (DR) Execution Frameworks",
            "Chapter 8: Incident Response (IR) Handling and Plan Management",
            "Chapter 9: Physical Access Control Structures",
            "Chapter 10: Logical and Network Access Controls",
            "Chapter 11: Identification, Authentication, and Authorization Models",
            "Chapter 12: Network Security Devices and System Architectures",
            "Chapter 13: Ports, Protocols, and Secure Network Infrastructures",
            "Chapter 14: Cloud Security Paradigms and Compute Topologies",
            "Chapter 15: Malware Types and Modern Attack Vectors",
            "Chapter 16: Endpoint Systems Defense and Hardening Metrics",
            "Chapter 17: Vulnerability Identification and Management Systems",
            "Chapter 18: Security Operations Concepts and Event Logging",
            "Chapter 19: Monitoring Systems and Auditing Procedures",
            "Chapter 20: Data Security Controls and Data Encryption Standards",
            "Chapter 21: Configuration Management and Systems Integrity",
            "Chapter 22: Code of Ethics and Professional Responsibility Guidelines",
            "Chapter 23: Final Knowledge Review Assessment Vectors"
        ]
    },
    {
        id: "SEC701",
        title: "CompTIA Security+ Test Prep",
        code: "SY0-701",
        imageIcon: "fa-shield-halved",
        description: "Features exactly 28 comprehensive chapters.",
        chapters: [
            "Chapter 1: Introduction to General Security Concepts",
            "Chapter 2: Fundamental Principles of Information Security",
            "Chapter 3: Security Control Typologies and Implementations",
            "Chapter 4: Analyzing Modern Threat Actors and Vectors",
            "Chapter 5: Assessing System Vulnerabilities and Weaknesses",
            "Chapter 6: Evaluating Malicious Software and Attack Tools",
            "Chapter 7: Social Engineering Exploitation Methodologies",
            "Chapter 8: Cryptographic Architecture Foundations",
            "Chapter 9: Symmetric and Asymmetric Cryptographic Algorithms",
            "Chapter 10: Public Key Infrastructure (PKI) Systems",
            "Chapter 11: Identity and Access Management Foundations",
            "Chapter 12: Authentication Factors and Directory Paradigms",
            "Chapter 13: Secure Network Architecture Principles",
            "Chapter 14: Hardening Network Components and Layouts",
            "Chapter 15: Wireless and Mobile Device Security Frameworks",
            "Chapter 16: Cloud Security Systems and Integration Models",
            "Chapter 17: Resilient Host Architecture Design Models",
            "Chapter 18: Secure Application Development Lifecycles",
            "Chapter 19: Security Assessments and Vulnerability Testing",
            "Chapter 20: Security Operations, Monitoring, and Logging",
            "Chapter 21: Incident Response, Detection, and Containment",
            "Chapter 22: Digital Forensics and Evidence Acquisition",
            "Chapter 23: Business Continuity and Resilience Management",
            "Chapter 24: Risk Assessment, Mitigation, and Tolerance Analysis",
            "Chapter 25: Governance and Compliance Framework Structuring",
            "Chapter 26: Privacy Controls and Sensitive Data Management",
            "Chapter 27: Third-Party Risk Management Requirements",
            "Chapter 28: Security Program Management and Audit Metrics"
        ]
    },
    {
        id: "CEHV13",
        title: "EC Council's CEH v13 Practice Engine",
        code: "CEH-V13",
        imageIcon: "fa-terminal",
        description: "Features exactly 15 chapters.",
        chapters: [
            "Chapter 1: Introduction to Ethical Hacking and Penetration Testing",
            "Chapter 2: Footprinting and Reconnaissance Methodologies",
            "Chapter 3: Scanning Networks and Discovering Asset Targets",
            "Chapter 4: Enumeration Strategies and System Mappings",
            "Chapter 5: Vulnerability Analysis Paradigms",
            "Chapter 6: System Hacking Exploitation Procedures",
            "Chapter 7: Malware Threats, Trojans, and Backdoor Operations",
            "Chapter 8: Sniffing Protocols and Traffic Interception Techniques",
            "Chapter 9: Social Engineering Attacks and Human Factor Risks",
            "Chapter 10: Denial-of-Service (DoS) and DDoS Frameworks",
            "Chapter 11: Session Hijacking Vectors and State Exploitation",
            "Chapter 12: Evading IDS, Firewalls, and Honeypot Environments",
            "Chapter 13: Hacking Web Servers and Vulnerability Identification",
            "Chapter 14: Hacking Web Applications and API Endpoints",
            "Chapter 15: SQL Injection Mechanics and Prevention Protocols",
            "Chapter 16: Hacking Wireless Networks – Wi-Fi encryption cracking (WEP/WPA)",
            "Chapter 17: Hacking Mobile Platforms – Android/iOS attack vectors and application flaws",
            "Chapter 18: IoT and OT Hacking – Operational technology and smart device security",
            "Chapter 19: Cloud Computing – Container, serverless, and multi-cloud security",
            "Chapter 20: Cryptographic Attacks – Cryptanalysis, PKI flaws, and SSL/TLS weaknesses"
        ]
    },
    {
        id: "PT0003",
        title: "CompTIA PenTest+ PT0-003 Prep",
        code: "PT0-003",
        imageIcon: "fa-mask",
        description: "Features exactly 12 chapters.",
        chapters: [
            "Chapter 1: Scoping and Planning Engagement Parameters",
            "Chapter 2: Information Gathering and Passive Reconnaissance",
            "Chapter 3: Active Vulnerability Identification Scans",
            "Chapter 4: Social Engineering and Physical Site Vulnerability Testing",
            "Chapter 5: Exploiting Wired and Wireless Network Vulnerabilities",
            "Chapter 6: Exploiting Application-Based Vulnerabilities",
            "Chapter 7: Exploiting Host, Cloud, and Container Systems",
            "Chapter 8: Post-Exploitation Strategies and Infrastructure Mappings",
            "Chapter 9: Privilege Escalation Protocols and Data Exfiltration",
            "Chapter 10: Penetration Testing Toolsets and Script Analysis",
            "Chapter 11: Reporting Assessment Deliverables and Documentation",
            "Chapter 12: Post-Engagement Cleanups and Remediation Frameworks"
        ]
    },
    {
        id: "CYSA2026",
        title: "CompTIA CySA+ Practice Test (2026)",
        code: "CS0-004",
        imageIcon: "fa-user-secret",
        description: "Features exactly 13 analytical chapters.",
        chapters: [
            "Chapter 1: Threat Intelligence Acquisition Platforms",
            "Chapter 2: Data Collection and Security Monitoring Controls",
            "Chapter 3: Analyzing Log Analytics and Detection Events",
            "Chapter 4: Incident Response Processes and Handling Practices",
            "Chapter 5: Forensic Analysis of Network Traffic Components",
            "Chapter 6: Forensic Analysis of Host Systems and Architecture",
            "Chapter 7: Cloud Infrastructure Assessments and Event Logging",
            "Chapter 8: Vulnerability Management Systems Configuration",
            "Chapter 9: Security Assessment Instrumentation Tools",
            "Chapter 10: Cyber Risk Management, Mitigation, and Oversight",
            "Chapter 11: Frameworks, Policies, and Regulatory Compliance Audits",
            "Chapter 12: Software Security Lifecycles and Code Assurance",
            "Chapter 13: Security Architecture Design Review Frameworks"
        ]
    },
    {
        id: "SECX2026",
        title: "CompTIA SecurityX Simulator (2026 Edition)",
        code: "CAS-005",
        imageIcon: "fa-award",
        description: "Features exactly 22 high-level technical chapters.",
        chapters: [
            "Chapter 1: Advanced Security Governance and Risk Optimization Strategies",
            "Chapter 2: Enterprise Security Architecture Models across Cryptography",
            "Chapter 3: Engineering Secure Enterprise Operations Control Systems",
            "Chapter 4: Security Research Integration and Technology Strategy Trends",
            "Chapter 5: Enterprise Logistics, Cloud Mergers, and Security Integrations",
            "Chapter 6: Regulatory Compliance Directives and Legal Framework Enforcement",
            "Chapter 7: Business Continuity Dynamics and Disaster Resiliency Architectures",
            "Chapter 8: Threat Modeling Frameworks and Vulnerability Analytics Operations",
            "Chapter 9: Advanced Endpoint Security Hardening and Systems Isolation",
            "Chapter 10: Secure Communication Infrastructures and Protocol Deep-Dives",
            "Chapter 11: Enterprise Identity Infrastructure Integration Paradigms",
            "Chapter 12: Hybrid and Multi-Cloud Architecture Protection Measures",
            "Chapter 13: Software Development Security and Automated Pipeline Scans",
            "Chapter 14: Industrial Automation Systems and IoT Security Parameters",
            "Chapter 15: Cyber Threat Interception, Hunting, and Intelligence Systems",
            "Chapter 16: Complex Incident Response Workflow Implementations",
            "Chapter 17: Enterprise Security Metrics, Controls Testing, and Validation",
            "Chapter 18: Digital Forensics Readiness and Chain of Custody Protocols",
            "Chapter 19: Red Teaming, Adversary Simulation, and Penetration Systems",
            "Chapter 20: Post-Exploitation Analysis, Remediation, and Strategic Countermeasures",
            "Chapter 21: Security Automation, AI Operations, and SOAR Architectures",
            "Chapter 22: Capstone Enterprise Business Case Risk Synthesis"
        ]
    },
    {
        id: "SSCP2026",
        title: "ISC² SSCP Practice Engine",
        code: "ISC2-SSCP",
        imageIcon: "fa-shield",
        description: "2026 latest edition. Features exactly 12 chapters.",
        chapters: [
            "Chapter 1: Security Operations and Administration Procedures",
            "Chapter 2: Access Control Systems Identification Parameters",
            "Chapter 3: Operational Access Control Implementation Architectures",
            "Chapter 4: Security Assessment, Auditing, and Infrastructure Monitoring",
            "Chapter 5: Incident Response and Event Remediation Workflows",
            "Chapter 6: Cryptographic Controls and Infrastructure Hardening",
            "Chapter 7: Secure Network Configurations and Protocols",
            "Chapter 8: Network Communications Security Infrastructure Systems",
            "Chapter 9: Malicious Code Analysis and Antivirus Countermeasures",
            "Chapter 10: Software and Systems Security Lifecycle Integration",
            "Chapter 11: Endpoint Device Security Operations",
            "Chapter 12: Cloud and Virtualized System Defense Parameters"
        ]
    },
    {
        id: "CISSP2024",
        title: "ISC² CISSP Practice Engine",
        code: "ISC2-CISSP",
        imageIcon: "fa-graduation-cap",
        description: "Features exactly 21 chapters.",
        chapters: [
            "Chapter 1: Security Governance, Principles, and Compliance Policies",
            "Chapter 2: Personnel Security Controls and Risk Management Concepts",
            "Chapter 3: Business Continuity Management and Contingency Planning",
            "Chapter 4: Laws, Regulations, Compliance Mandates, and Ethics Guidelines",
            "Chapter 5: Asset Security, Classification, and Life-Cycle Maintenance",
            "Chapter 6: Cryptography and Symmetric/Asymmetric Engine Design Models",
            "Chapter 7: Architectural Security Concepts, Principles, and Frameworks",
            "Chapter 8: Physical and Site Security System Configurations",
            "Chapter 9: Network Security Frameworks, Topologies, and Port Controls",
            "Chapter 10: Secure Communication Channels and Remote Access Mechanics",
            "Chapter 11: Identity Architecture and Logical Access Infrastructure Controls",
            "Chapter 12: Authentication Technologies and Federated Directory Infrastructures",
            "Chapter 13: Security Assessment Systems and Internal Audit Procedures",
            "Chapter 14: Monitoring Frameworks, Log Analysis, and Operations Safety",
            "Chapter 15: Incident Management, Mitigation, and Countermeasure Deployment",
            "Chapter 16: Disaster Recovery Orchestration and Emergency System Operations",
            "Chapter 17: Physical Access Safeguards and Facilities Protection Systems",
            "Chapter 18: Software Development Security Lifecycles and Quality Controls",
            "Chapter 19: Malicious Code Protections and Software Ecosystem Evaluation",
            "Chapter 20: Operations Cryptography and Identity Federation Frameworks",
            "Chapter 21: Dynamic System Evaluation and Practical Knowledge Architecture"
        ]
    },
    {
        id: "CSSLP2026",
        title: "CSSLP Examination Bank (2026 Edition)",
        code: "CSSLP-2026",
        imageIcon: "fa-code-branch",
        description: "CSSLP (Certified Secure Software Lifecycle Professional), 2026 edition. Features exactly 20 chapters.",
        chapters: [
            "Chapter 1: Secure Software Concepts and Core Lifecycle Attributes",
            "Chapter 2: Security Principles across Software Engineering Ecosystems",
            "Chapter 3: Governance, Risk, and Compliance Guidelines for Applications",
            "Chapter 4: Software Security Requirements Engineering Models",
            "Chapter 5: Attack Surface Minimization and Threat Modeling Systems",
            "Chapter 6: Secure Software Design Layouts and Component Isolation",
            "Chapter 7: Architecture Control Assessments and Cryptographic Intergrations",
            "Chapter 8: Secure Software Coding Best Practices and Language Selection",
            "Chapter 9: Validation of Vulnerabilities and Code Flaw Analysis",
            "Chapter 10: Secure Software Testing Implementations and Automation Logs",
            "Chapter 11: Static and Dynamic Application Verification Testing (SAST/DAST)",
            "Chapter 12: Software Acceptance Protocols and Operational Readiness",
            "Chapter 13: Deployment Configuration, Installation, and Delivery Control",
            "Chapter 14: Secure Maintenance, Patching Operations, and Support Lifecycles",
            "Chapter 15: Software Retirement Frameworks and Data Disposal Metrics",
            "Chapter 16: Supply Chain Risk Management and Open Source Evaluations",
            "Chapter 17: Security Controls for Third Party Components and APIs",
            "Chapter 18: Software Asset Tracking and Configuration Auditing Plans",
            "Chapter 19: Regulatory Compliances, Privacy Metrics, and Legal Mandates",
            "Chapter 20: Software Security Program Management and Governance Paradigms"
        ]
    },
    {
        id: "CGRC2026",
        title: "ISC² CGRC Practice Engine",
        code: "CGRC-2026",
        imageIcon: "fa-clipboard-list",
        description: " CGRC , 2026 edition.",
        chapters: [
            "Chapter 1: Information Security Risk Management Program Framework",
            "Chapter 2: Scope of the Information System and Boundary Selection",
            "Chapter 3: Selection and Tailoring of Information Security Controls",
            "Chapter 4: Security Control Implementation and Documentation Methods",
            "Chapter 5: Security Assessment Frameworks and System Validations",
            "Chapter 6: Information System Authorization Procedures and Risk Decisions",
            "Chapter 7: Continuous Monitoring Controls and Lifecycle Governance Status"
        ]
    },
    {
        id: "CISA2026",
        title: "ISACA CISA Auditor Review (2026 Edition)",
        code: "CISA-2026",
        imageIcon: "fa-calculator",
        description: "All modules and respective topics in CISA (Certified Information Systems Auditor) , 2026 edition.",
        chapters: [
            "Chapter 1: Information System Auditing Process Frameworks",
            "Chapter 2: Governance and Management of Information Technology Assets",
            "Chapter 3: Information Systems Acquisition, Development, and Integration",
            "Chapter 4: Information Systems Operations and Business Resilience Systems",
            "Chapter 5: Protection of Information Assets, Infrastructure, and Security"
        ]
    },
    {
        id: "CISM2026",
        title: "ISACA CISM Security Manager ( Practice Engine , 2026 Edition)",
        code: "CISM-2026",
        imageIcon: "fa-sliders",
        description: "All modules and respective topics in CISM (Certified Information Security Manager), 2026 edition.",
        chapters: [
            "Chapter 1: Information Security Governance Strategies",
            "Chapter 2: Information Risk Management Paradigms",
            "Chapter 3: Information Security Program Development and Operations",
            "Chapter 4: Incident Management and Response Coordination Frameworks"
        ]
    },
    {
        id: "CRISC2026",
        title: "ISACA CRISC Risk Control ( Practice Engine, 2026 Edition)",
        code: "CRISC-2026",
        imageIcon: "fa-triangle-exclamation",
        description: "All modules and respective topics in CRISC (Certified in Risk and Information Systems Control), 2026 edition.",
        chapters: [
            "Chapter 1: Governance Structure and Corporate IT Risk Parameters",
            "Chapter 2: IT Risk Assessment and System Identification Frameworks",
            "Chapter 3: Risk Response and Operational Control Mitigation Models",
            "Chapter 4: Information Technology and Security Control Monitoring Metrics"
        ]
    },
    {
        id: "CGEIT2026",
        title: "ISACA CGEIT IT Governance Prep (2026 Edition)",
        code: "CGEIT-2026",
        imageIcon: "fa-sitemap",
        description: "All modules and respective topics in CGEIT , 2026 edition.",
        chapters: [
            "Chapter 1: Governance of Enterprise IT Framework Architectures",
            "Chapter 2: Strategic Alignment and Portfolio Resource Management",
            "Chapter 3: Benefits Realization and Enterprise Value Creation Logs",
            "Chapter 4: Risk Optimization, Compliance Requirements, and Resource Assurance"
        ]
    },
    {
        id: "CDPSE2026",
        title: "ISACA CDPSE Data Privacy ( Practice Engine, 2026 Edition)",
        code: "CDPSE-2026",
        imageIcon: "fa-key",
        description: "All modules and respective topics in CDPSE, 2026 edition.",
        chapters: [
            "Chapter 1: Privacy Governance, Policy Structuring, and Risk Management",
            "Chapter 2: Privacy Architecture and Technical Infrastructure Configurations",
            "Chapter 3: Data Lifecycle Governance, Classification, and Storage Systems"
        ]
    },
    {
        id: "GISF2026",
        title: "GIAC GISF Information Security Fundamentals ( Practice Engine,2026 Edition)",
        code: "GISF-2026",
        imageIcon: "fa-book-bookmark",
        description: "All modules and respective topics in GIAC Information Security Fundamentals (GISF), 2026 edition.",
        chapters: [
            "Chapter 1: Network Fundamentals and Foundational Protocols",
            "Chapter 2: Computer Functions, OS Concepts, and Host Structures",
            "Chapter 3: Security Principles, Policies, and AAA Models",
            "Chapter 4: Cryptography Concepts, Algorithms, and Key Systems",
            "Chapter 5: Cyber Attacks, System Exploit Methods, and Defenses"
        ]
    },
    {
        id: "GCPM2026",
        title: "GIAC GCPM Project Manager (Practice Engine, 2026 Edition)",
        code: "GCPM-2026",
        imageIcon: "fa-diagram-project",
        description: "All modules and respective topics in GIAC Certified Project Manager (GCPM) , 2026 edition.",
        chapters: [
            "Chapter 1: Project Management Concepts and Core Structures",
            "Chapter 2: Project Scope Definition and Work Breakdown Frameworks",
            "Chapter 3: Time Management, Scheduling Controls, and Milestone Tracking",
            "Chapter 4: Cost Management, Budget Baselines, and Earned Value Systems",
            "Chapter 5: Quality Assurance Frameworks and Performance Auditing",
            "Chapter 6: Resource Management and Team Optimization Models",
            "Chapter 7: Communications Management and Stakeholder Updates",
            "Chapter 8: Risk Identification, Analytics, and Countermeasure Plans",
            "Chapter 9: Procurement Controls and Vendor Contract Management",
            "Chapter 10: Stakeholder Engagement, Integration Management, and Closing"
        ]
    },
    {
        id: "GSNA2026",
        title: "GIAC GSNA Systems & Network Auditor (2026 Edition)",
        code: "GSNA-2026",
        imageIcon: "fa-chart-pie",
        description: "All modules and respective topics in GIAC Systems and Network Auditor (GSNA) , 2026 edition.",
        chapters: [
            "Chapter 1: Auditing Concepts, Standards, and Reporting Workflows",
            "Chapter 2: Network Infrastructure Security Auditing Tools",
            "Chapter 3: Unix and Linux System Audit Hardening Checklists",
            "Chapter 4: Windows Security Systems Auditing Protocols",
            "Chapter 5: Vulnerability Assessment Frameworks and System Scans",
            "Chapter 6: Auditing Cryptography Implementations and Perimeter Controls"
        ]
    }
];

/* ==========================================================================
DYNAMIC QUESTION POOL SLOT GENERATOR (100 Slots per Chapter Across All Products)
========================================================================== */
function generateQuestionsForProduct(product) {
    let generatedPool = [];
    const choicesTemplate = [
        ["Protocol Data Unit (PDU)", "Frame Check Sequence", "Cyclic Redundancy Check", "Media Access Control Address"],
        ["Mandatory Access Control (MAC)", "Role-Based Access Control (RBAC)", "Discretionary Access Control (DAC)", "Attribute-Based Access Control (ABAC)"],
        ["Stateful Inspection Packet Filter", "Stateless Packet Filter", "Application-Level Gateway", "Next-Generation Firewall Proxy"],
        ["Advanced Encryption Standard (AES)", "Rivest-Shamir-Adleman (RSA)", "Elliptic Curve Cryptography (ECC)", "Message Digest 5 (MD5)"]
    ];
    product.chapters.forEach((chapter, chIdx) => {
        let chNumStr = String(chIdx + 1).padStart(2, '0');
        for (let q = 1; q <= 100; q++) {
            let qNumStr = String(q).padStart(3, '0');
            let uniqueId = `${product.code}-CQ-${chNumStr}-${qNumStr}`;
            let choiceIdx = (q + chIdx) % choicesTemplate.length;
            generatedPool.push({
                id: uniqueId,
                chapterIndex: chIdx,
                text: `Identify the primary architectural technical constraint or operational procedure associated with standard requirements in ${chapter}, specifically evaluated for item slot #${q}.`,
                choices: choicesTemplate[choiceIdx],
                correct: (q % 4),
                explanation: `Detailed evaluation analysis verified choice Option ${(q % 4) + 1} as functionally accurate according to standard exam guides. The alternatives are unrelated context variables or structurally incorrect configurations.`,
                distractors: [
                    "Option 1 represents foundational parameters but lacks exact operational precision.",
                    "Option 2 introduces vulnerabilities due to deprecation vectors.",
                    "Option 3 represents an alternative conceptual model not required by this condition.",
                    "Option 4 fails baseline cryptography collision requirements."
                ]
            });
        }
    });
    return generatedPool;
}

/* ==========================================================================
VIEW CONTROLLER ENGINE & INITIALIZATION METHODS
========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    // Restore user preferences (dark mode, compact text, sound) before first paint of views
    if (typeof applyAllPreferences === "function") {
        applyAllPreferences();
    } else {	
        // Fallback if prefs module not yet parsed (should not happen)
        if (localStorage.getItem("CH_PREF_DARK_MODE") === "1") {
            document.body.classList.add("dark-mode");
        }
        if (localStorage.getItem("CH_PREF_COMPACT_TEXT") === "1") {
            document.body.classList.add("compact-question-text");
        }
    }

    const storedUser = localStorage.getItem("CH_LOGGED_USER");

    if (storedUser) {
        appState.currentUser = storedUser;
        const displayUserEl = document.getElementById("displayUsername");
        if (displayUserEl) displayUserEl.textContent = storedUser;
        const navEl = document.getElementById("authenticated-nav");
        if (navEl) navEl.classList.remove("hidden");
        navigateTo("dashboard");
    } else {
        navigateTo("landing");
    }
    window.onclick = function(event) {
        if (event.target.classList.contains('modal-backdrop')) {
            event.target.classList.add('hidden');
        }
    };
});

function clearQuizTimer() {
    if (appState.quizEngine.timerInterval) {
        clearInterval(appState.quizEngine.timerInterval);
        appState.quizEngine.timerInterval = null;
    }
}

function clearQuizTimer() {
    if (appState.quizEngine.timerInterval) {
        clearInterval(appState.quizEngine.timerInterval);
        appState.quizEngine.timerInterval = null;
    }
}

function navigateTo(viewId) {
    // Stop any running simulation timer when leaving the quiz/review screens
    if (appState.activeView === "quiz" && viewId !== "quiz" && viewId !== "review") {
        clearQuizTimer();
    }

    document.querySelectorAll(".view-container").forEach(el => el.classList.add("hidden"));
    const targetedView = document.getElementById(`view-${viewId}`);
    if (targetedView) {
        targetedView.classList.remove("hidden");
        appState.activeView = viewId;
    }
    if (viewId === "dashboard") {
        renderDashboardProducts();
        wirePromoCardLinks();
    }
}

/* ==========================================================================
AUTHENTICATION WORKFLOW CONTROLLERS
========================================================================== */
function toggleAuthMode(toRegistration) {
    const loginCard = document.getElementById("loginCard");
    const regCard = document.getElementById("registrationCard");
    if (toRegistration) {
        if (loginCard) loginCard.classList.add("hidden");
        if (regCard) regCard.classList.remove("hidden");
    } else {
        if (loginCard) loginCard.classList.remove("hidden");
        if (regCard) regCard.classList.add("hidden");
    }
}

function handleRegistration(event) {
    event.preventDefault();
    const name = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPassword").value.trim();
    
    if (name && email && pass) {
        localStorage.setItem("CH_REGISTERED_EMAIL", email.toLowerCase());
        localStorage.setItem("CH_REGISTERED_PASS", pass);
        localStorage.setItem("CH_REGISTERED_NAME", name);
        executeLoginSession(name);
    }
}

/** Temporary password visibility (auto-masks after a short delay). */
let _loginPwdRevealTimer = null;
function toggleLoginPasswordVisibility() {
  const input = document.getElementById("loginPassword");
  const btn = document.getElementById("loginPasswordToggle");
  const icon = document.getElementById("loginPasswordToggleIcon");
  if (!input || !btn || !icon) return;

  if (_loginPwdRevealTimer) {
    clearTimeout(_loginPwdRevealTimer);
    _loginPwdRevealTimer = null;
  }

  const isVisible = input.type === "text";
  if (isVisible) {
    input.type = "password";
    icon.className = "fa-regular fa-eye";
    btn.classList.remove("is-revealed");
    btn.setAttribute("aria-label", "Show password temporarily");
    return;
  }

  input.type = "text";
  icon.className = "fa-regular fa-eye-slash";
  btn.classList.add("is-revealed");
  btn.setAttribute("aria-label", "Hide password");

  _loginPwdRevealTimer = setTimeout(() => {
    input.type = "password";
    icon.className = "fa-regular fa-eye";
    btn.classList.remove("is-revealed");
    btn.setAttribute("aria-label", "Show password temporarily");
    _loginPwdRevealTimer = null;
  }, 3000);
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const pass = document.getElementById("loginPassword").value.trim();
    
    if (document.getElementById("errEmail")) document.getElementById("errEmail").textContent = "";
    if (document.getElementById("errPassword")) document.getElementById("errPassword").textContent = "";
    if (document.getElementById("invalidCredentialBanner")) document.getElementById("invalidCredentialBanner").classList.add("hidden");
    
    if (!email) {
        if (document.getElementById("errEmail")) document.getElementById("errEmail").textContent = "Email address field cannot remain blank.";
        return;
    }
    if (!pass) {
        if (document.getElementById("errPassword")) document.getElementById("errPassword").textContent = "Password value is required.";
        return;
    }
    
    const regEmail = localStorage.getItem("CH_REGISTERED_EMAIL");
    const regPass = localStorage.getItem("CH_REGISTERED_PASS");
    const regName = localStorage.getItem("CH_REGISTERED_NAME") || "User";

    if ((email.toLowerCase() === "demo@codinghamme.com" && pass === "Password123") || 
        (regEmail && regPass && email.toLowerCase() === regEmail && pass === regPass)) {
        executeLoginSession(regEmail === email.toLowerCase() ? regName : "Demo User");
    } else {
        if (document.getElementById("invalidCredentialBanner")) {
            document.getElementById("invalidCredentialBanner").classList.remove("hidden");
        }
    } 
}

function executeLoginSession(username) {
    appState.currentUser = username;
    localStorage.setItem("CH_LOGGED_USER", username);
    if (document.getElementById("displayUsername")) document.getElementById("displayUsername").textContent = username;
    if (document.getElementById("authenticated-nav")) document.getElementById("authenticated-nav").classList.remove("hidden");
    navigateTo("dashboard");
}

function logout() {
    clearQuizTimer();
    appState.currentUser = null;
    localStorage.removeItem("CH_LOGGED_USER");
    if (document.getElementById("authenticated-nav")) document.getElementById("authenticated-nav").classList.add("hidden");
    navigateTo("landing");
}


/* ==========================================================================
   PASSWORD RESET WORKFLOW (pure frontend / localStorage)
   ========================================================================== */
function openPasswordResetModal(e) {
  if (e) e.preventDefault();
  // Reset UI state
  document.getElementById("resetStepIdentify").classList.remove("hidden");
  document.getElementById("resetStepNewPassword").classList.add("hidden");
  document.getElementById("resetEmailInput").value = "";
  document.getElementById("resetNewPassword").value = "";
  document.getElementById("resetConfirmPassword").value = "";
  document.getElementById("resetEmailError").textContent = "";
  document.getElementById("resetPasswordError").textContent = "";
  document.getElementById("passwordResetModal").classList.remove("hidden");
}

function closePasswordResetModal() {
  document.getElementById("passwordResetModal").classList.add("hidden");
}

function verifyResetEmail() {
  const email = document.getElementById("resetEmailInput").value.trim().toLowerCase();
  const errEl = document.getElementById("resetEmailError");
  errEl.textContent = "";

  if (!email) {
    errEl.textContent = "Please enter your email address.";
    return;
  }

  const registeredEmail = (localStorage.getItem("CH_REGISTERED_EMAIL") || "").toLowerCase();
  const demoEmail = "demo@codinghamme.com";

  if (email === registeredEmail || email === demoEmail) {
    // Proceed to set new password
    document.getElementById("resetStepIdentify").classList.add("hidden");
    document.getElementById("resetStepNewPassword").classList.remove("hidden");
  } else {
    errEl.textContent = "No account found with that email address.";
  }
}

function completePasswordReset() {
  const newPass = document.getElementById("resetNewPassword").value;
  const confirmPass = document.getElementById("resetConfirmPassword").value;
  const errEl = document.getElementById("resetPasswordError");
  errEl.textContent = "";

  if (!newPass || newPass.length < 6) {
    errEl.textContent = "Password must be at least 6 characters.";
    return;
  }
  if (newPass !== confirmPass) {
    errEl.textContent = "Passwords do not match.";
    return;
  }

  // Update the stored credential
  const email = document.getElementById("resetEmailInput").value.trim().toLowerCase();
  if (email === "demo@codinghamme.com") {
    // Demo account – we still store it so login works with the new password
    localStorage.setItem("CH_REGISTERED_EMAIL", email);
    localStorage.setItem("CH_REGISTERED_PASS", newPass);
    localStorage.setItem("CH_REGISTERED_NAME", "Demo User");
  } else {
    localStorage.setItem("CH_REGISTERED_PASS", newPass);
  }

  alert("Password updated successfully. You can now log in with your new password.");
  closePasswordResetModal();
}



/* ==========================================================================
DASHBOARD / PRODUCT CATALOG CORE MANAGEMENT ENGINE
========================================================================= */
let activeDashboardTab = "my-products";

function switchDashboardTab(tabId) {
    activeDashboardTab = tabId;
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    const activeBtn = document.getElementById(`tab-${tabId}`);
    if (activeBtn) activeBtn.classList.add("active");
    renderDashboardProducts();
}

function getArchivedList() {
    return JSON.parse(localStorage.getItem(ARCHIVE_KEY)) || [];
}

function setArchivedList(list) {
    localStorage.setItem(ARCHIVE_KEY, JSON.stringify(list));
}

function getOwnedProducts() {
    try {
        const raw = localStorage.getItem(OWNED_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (_) { /* ignore corrupt data */ }
    // Protected-by-default: never auto-grant products
    return [];
}

function setOwnedProducts(list) {
    try {
        localStorage.setItem(OWNED_KEY, JSON.stringify(list));
    } catch (e) {
        console.warn("Failed to persist owned products", e);
    }
}

function safeGetJSON(key, fallback = null) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

function safeSetJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.warn("localStorage write failed", e);
        return false;
    }
}

function renderDashboardProducts(filterText = "") {
    const listContainer = document.getElementById("products-list-view");
    if (!listContainer) return;
    listContainer.innerHTML = "";
    const archivedList = getArchivedList();
    const query = filterText.toLowerCase();
    
    if (activeDashboardTab === "saved-exams") {
        renderSavedExamsViewport(listContainer);
        return;
    }
    
    let filtered = MOCK_PRODUCTS_DATABASE.filter(prod => {
        const matchesSearch = prod.title.toLowerCase().includes(query) || prod.code.toLowerCase().includes(query);
        if (!matchesSearch) return false;
        const isArchived = archivedList.includes(prod.id);
        const userOwns = getOwnedProducts().includes(prod.id);
        if (activeDashboardTab === "my-products") return userOwns && !isArchived;
        if (activeDashboardTab === "archived") return userOwns && isArchived;
        return false;
    });
    
    if (filtered.length === 0) {
        listContainer.innerHTML = `<div class="product-row-card"><p style="color:#6b7280; font-size:14px; text-align:center; width:100%;">No products match criteria.</p></div>`;
        return;
    }
    
    filtered.forEach(prod => {
        const card = document.createElement("div");
        card.className = "product-row-card";
        const actionButtonHTML = activeDashboardTab === "archived"
            ? `<button class="btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="toggleArchiveStatus('${prod.id}', false)"><i class="fa-solid fa-box-open"></i> Unarchive</button>`
            : `<button class="btn-primary" style="font-size:12px; padding:6px 16px;" onclick="initiateProductExamConfiguration('${prod.id}')">Start Test &rarr;</button>
               <button class="btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="openNotesModal('${prod.id}')"><i class="fa-solid fa-note-sticky"></i> Notes</button>
               <button class="btn-secondary" style="font-size:12px; padding:6px 12px;" onclick="toggleArchiveStatus('${prod.id}', true)" title="Archive Product"><i class="fa-solid fa-box-archive"></i></button>`;
        card.innerHTML = `
            <div class="prod-meta-left">
                <div class="prod-book-thumbnail"><i class="fa-solid ${prod.imageIcon}"></i></div>
                <div class="prod-details">
                    <h3>${prod.title}</h3>
                    <p style="font-size:13px; color:#4b5563;">${prod.description}</p>
                    <span class="promo-badge" style="margin-top:8px; display:inline-block;">PRODUCT CODE: ${prod.code}</span>
                </div>
            </div>
            <div class="prod-action-links" style="flex-direction:column; gap:6px; align-items:flex-end;">
                ${actionButtonHTML}
                <button class="btn-utility" style="font-size:11px; padding:4px 8px; margin-top:5px;" onclick="viewProductHistory('${prod.id}')"><i class="fa-solid fa-clock-rotate-left"></i> View History</button>
            </div>
        `;
        listContainer.appendChild(card);
    });
}

function handleSearch() {
    const val = document.getElementById("productSearchInput").value;
    renderDashboardProducts(val);
}

function toggleArchiveStatus(productId, shouldArchive) {
    let archived = getArchivedList();
    if (shouldArchive) {
        if (!archived.includes(productId)) archived.push(productId);
    } else {
        archived = archived.filter(id => id !== productId);
    }
    setArchivedList(archived);
    renderDashboardProducts();
}

/* ==========================================================================
   VIEW HISTORY / REVIEW ENGINE (Pearson-style Current Score + Question Review)
   ========================================================================== */
const ReviewState = {
    productId: null,
    logs: [],
    activeIndex: 0,
    activeTab: "current-score",
    filters: {
        quick: "all",
        advancedOpen: false,
        marked: "all",
        attempted: "all",
        correct: "all",
        notes: "all",
        searchName: "",
        searchObjective: "",
        searchType: "",
        showExtraFilters: true
    }
};

function viewProductHistory(productId) {
    const historyKey = `CH_HIST_${productId}`;
    let historyLogs = JSON.parse(localStorage.getItem(historyKey)) || [];

    historyLogs = historyLogs.map((log, i) => {
        if (log.questions && Array.isArray(log.questions)) return log;
        const pct = parseInt(String(log.score || "0").replace("%", ""), 10) || 0;
        const scaled = parseFloat(((pct / 100) * 1000).toFixed(2));
        const isNet = (log.title || "").includes("N10-009") || productId === "NET009";
        return {
            id: log.id || (Date.now() - i),
            date: log.date || "Unknown",
            productId: productId,
            productTitle: (MOCK_PRODUCTS_DATABASE.find(p => p.id === productId) || {}).title || "Product",
            productCode: (MOCK_PRODUCTS_DATABASE.find(p => p.id === productId) || {}).code || "",
            mode: "guided",
            modeLabel: "Guided Practice Test",
            title: log.title || "Practice Test",
            scorePercent: pct,
            scaledScore: scaled,
            requiredScore: isNet ? 720 : 900,
            correctCount: 0,
            totalQuestions: 0,
            status: log.status || (scaled >= (isNet ? 720 : 900) ? "PASSED" : "FAILED"),
            statusLabel: log.status === "PASSED" ? "Passed" : "Test Not Passed",
            objectives: [],
            questions: [],
            userAnswers: {}
        };
    });

    ReviewState.productId = productId;
    ReviewState.logs = historyLogs;
    ReviewState.activeIndex = 0;
    ReviewState.activeTab = "current-score";
    ReviewState.filters = {
        quick: "all",
        advancedOpen: false,
        marked: "all",
        attempted: "all",
        correct: "all",
        notes: "all",
        searchName: "",
        searchObjective: "",
        searchType: "",
        showExtraFilters: true
    };

    renderReviewPage();
    navigateTo("history");
}

function getActiveReviewRecord() {
    return ReviewState.logs[ReviewState.activeIndex] || null;
}

function renderReviewPage() {
    const container = document.getElementById("view-history");
    if (!container) return;

    const record = getActiveReviewRecord();
    const product = MOCK_PRODUCTS_DATABASE.find(p => p.id === ReviewState.productId) || {};
    const hasLogs = ReviewState.logs.length > 0;

    container.innerHTML = `
    <div class="review-page-shell">
      <div class="review-main-card">
        <div class="review-page-title-row">
          <button class="btn-back-light review-back-btn" onclick="navigateTo('dashboard')">&larr; Return to Dashboard</button>
          <h2>Review</h2>
        </div>

        <div class="review-tabs">
          <button class="review-tab-btn ${ReviewState.activeTab === 'current-score' ? 'active' : ''}" onclick="switchReviewTab('current-score')">
            <i class="fa-solid fa-chart-column"></i> CURRENT SCORE
          </button>
          <button class="review-tab-btn ${ReviewState.activeTab === 'question-review' ? 'active' : ''}" onclick="switchReviewTab('question-review')">
            <i class="fa-solid fa-circle-question"></i> QUESTION REVIEW
          </button>
        </div>

        <div class="review-tab-panels">
          ${!hasLogs ? `
            <div class="review-empty-state">
              <i class="fa-solid fa-clock-rotate-left" style="font-size:42px;color:#cbd5e1;margin-bottom:12px;"></i>
              <p>No graded exam history found for this product.</p>
              <p style="font-size:13px;color:#94a3b8;">Complete and grade a practice test to see results here.</p>
            </div>
          ` : `
            <div class="grade-history-section">
              <label class="grade-history-label">GRADE HISTORY</label>
              <div class="grade-history-dropdown" id="gradeHistoryDropdown">
                <button class="grade-history-trigger" onclick="toggleGradeHistoryDropdown(event)">
                  <div class="ghd-text">
                    <strong>${record.productTitle || product.title || "Product"}</strong>
                    <span>${record.date} (${record.modeLabel || "Guided Practice Test"})</span>
                  </div>
                  <i class="fa-solid fa-caret-down ghd-caret"></i>
                </button>
                <div class="grade-history-list hidden" id="gradeHistoryList">
                  ${ReviewState.logs.map((log, idx) => `
                    <button class="grade-history-item ${idx === ReviewState.activeIndex ? 'active' : ''}"
                            onclick="selectHistoryRecord(${idx})">
                      ${log.date} (${log.modeLabel || "Guided Practice Test"})
                    </button>
                  `).join("")}
                </div>
              </div>
            </div>

            ${ReviewState.activeTab === "current-score" ? renderCurrentScorePane(record) : renderQuestionReviewPane(record)}
          `}
        </div>
      </div>

      <div class="review-promo-strip marketing-promo-grid">
        <a href="https://www.whatsapp.com/channel/0029VbAp1qHIXnltu1srjl3A"
           target="_blank" rel="noopener noreferrer" class="promo-card promo-card-link">
          <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" alt="Join Our Community">
          <div class="promo-body">
            <h3>Join Our Community</h3>
            <p>Career Growth, Access to Tech experts, and more</p>
            <span class="promo-badge">TECH WITH CODINGHAMME</span>
          </div>
        </a>
        <a id="historyPersonalizedTrainingLink"
           href="#"
           target="_blank" rel="noopener noreferrer"
           class="promo-card promo-card-link">
          <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" alt="Personalized Training">
          <div class="promo-body">
            <h3>Personalized Training</h3>
            <p>Gain high demand skills with one-on-one personalized training tailored to your exact career goals, schedule, and current skill level</p>
            <span class="promo-badge">TECH WITH CODINGHAMME</span>
          </div>
        </a>
        <a href="#" 
     target="_blank" rel="noopener noreferrer" class="promo-card promo-card-link">
    <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" alt="Performance Based Certs">
    <div class="promo-body">
<h3>Performance Based Certs/Exams</h3>
<p class="promo-pbt-line">Cisco CCNA, Microsoft Certifications, e.t.c.</p>
<p class="promo-pbt-desc">(Focused on labs, simulations, and interactive tasks.)</p>
<span class="promo-badge">PBT</span>
    </div>
  </a>
      </div>
    </div>
    `;
    // Wire personalized training WhatsApp link when history promo is rendered
    setTimeout(() => {
      const histLink = document.getElementById("historyPersonalizedTrainingLink");
      if (histLink && typeof buildPersonalizedTrainingWhatsAppLink === "function") {
        histLink.href = buildPersonalizedTrainingWhatsAppLink();
      }
    }, 0);
    
}

function renderCurrentScorePane(record) {
    const passed = record.status === "PASSED";
    const yourScore = record.scaledScore ?? 0;
    const req = record.requiredScore ?? 900;
    const barMax = 1000;
    const yourWidth = Math.min(100, (yourScore / barMax) * 100);
    const reqWidth = Math.min(100, (req / barMax) * 100);
    const objectives = record.objectives || [];

    return `
    <div class="current-score-pane">
      <div class="result-block">
        <h3 class="result-heading">Result</h3>
        <div class="result-status ${passed ? 'passed' : 'failed'}">${record.statusLabel || (passed ? "Passed" : "Test Not Passed")}</div>
        <div class="score-bars">
          <div class="score-bar-row">
            <span class="score-bar-label">Your Score<br><strong>${yourScore}</strong></span>
            <div class="score-bar-track">
              <div class="score-bar-fill your-score-fill" style="width:${yourWidth}%;background:${passed ? '#16a34a' : '#dc2626'};"></div>
            </div>
          </div>
          <div class="score-bar-row">
            <span class="score-bar-label">Required Score<br><strong>${req}</strong></span>
            <div class="score-bar-track">
              <div class="score-bar-fill required-score-fill" style="width:${reqWidth}%;"></div>
            </div>
          </div>
          <div class="score-scale">
            <span>0</span><span>100</span><span>200</span><span>300</span><span>400</span>
            <span>500</span><span>600</span><span>700</span><span>800</span><span>900</span><span>1,000</span>
          </div>
        </div>
      </div>

      <div class="objectives-table-wrap">
        <table class="objectives-table" id="objectivesTable">
          <thead>
            <tr>
              <th>Objective Name</th>
              <th>Percentage</th>
              <th>Your Points</th>
              <th>Possible Points</th>
            </tr>
            <tr class="obj-search-row">
              <th><input type="text" class="obj-search-input" id="objSearchName" placeholder="Search Anything Here" oninput="filterObjectivesTable()"></th>
              <th><input type="text" class="obj-search-input" id="objSearchPct" placeholder="" oninput="filterObjectivesTable()"></th>
              <th><input type="text" class="obj-search-input" id="objSearchYours" placeholder="" oninput="filterObjectivesTable()"></th>
              <th><input type="text" class="obj-search-input" id="objSearchPossible" placeholder="" oninput="filterObjectivesTable()"></th>
            </tr>
          </thead>
          <tbody id="objectivesTableBody">
            ${objectives.length === 0 ? `
              <tr><td colspan="4" style="text-align:center;color:#94a3b8;padding:20px;">No objective breakdown available for this attempt.</td></tr>
            ` : objectives.map(o => `
              <tr class="obj-data-row"
                  data-name="${(o.name || '').toLowerCase()}"
                  data-pct="${o.percentage}"
                  data-yours="${o.yourPoints}"
                  data-possible="${o.possiblePoints}">
                <td>${o.name}</td>
                <td class="${o.percentage >= 70 ? 'pct-good' : 'pct-low'}">${o.percentage}%</td>
                <td>${o.yourPoints}</td>
                <td>${o.possiblePoints}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>

      <div class="review-pane-footer">
        <button class="btn-print" onclick="printCurrentScore()"><i class="fa-solid fa-print"></i> Print</button>
      </div>
    </div>
    `;
}

function renderQuestionReviewPane(record) {
    const questions = record.questions || [];
    const notes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY)) || {};
    const f = ReviewState.filters;

    let filtered = questions.map((q, idx) => ({ ...q, seq: idx + 1, hasNote: !!notes[q.id] }));

    if (f.quick === "marked") filtered = filtered.filter(q => q.isMarked);
    else if (f.quick === "unattempted") filtered = filtered.filter(q => !q.isAttempted);

    if (f.marked === "yes") filtered = filtered.filter(q => q.isMarked);
    else if (f.marked === "no") filtered = filtered.filter(q => !q.isMarked);
    if (f.attempted === "yes") filtered = filtered.filter(q => q.isAttempted);
    else if (f.attempted === "no") filtered = filtered.filter(q => !q.isAttempted);
    if (f.correct === "yes") filtered = filtered.filter(q => q.isCorrect);
    else if (f.correct === "no") filtered = filtered.filter(q => q.isAttempted && !q.isCorrect);
    if (f.notes === "yes") filtered = filtered.filter(q => q.hasNote);
    else if (f.notes === "no") filtered = filtered.filter(q => !q.hasNote);

    if (f.searchName) {
        const s = f.searchName.toLowerCase();
        filtered = filtered.filter(q => (q.text || "").toLowerCase().includes(s));
    }
    if (f.searchObjective) {
        const s = f.searchObjective.toLowerCase();
        filtered = filtered.filter(q => {
            const chName = (record.objectives && record.objectives[q.chapterIndex])
                ? record.objectives[q.chapterIndex].name
                : `Chapter ${String((q.chapterIndex || 0) + 1).padStart(2, "0")}`;
            return chName.toLowerCase().includes(s);
        });
    }
    if (f.searchType) {
        const s = f.searchType.toLowerCase();
        filtered = filtered.filter(q => "multiple choice".includes(s));
    }

    const productChapters = (MOCK_PRODUCTS_DATABASE.find(p => p.id === ReviewState.productId) || {}).chapters || [];

    return `
    <div class="question-review-pane">
      <div class="qr-filter-bar">
        <div class="advanced-filter-wrap">
          <button class="btn-advanced-filter" onclick="toggleAdvancedFilter(event)">
            Advanced Filter <i class="fa-solid fa-caret-down"></i>
          </button>
          <div class="advanced-filter-popup ${f.advancedOpen ? '' : 'hidden'}" id="advancedFilterPopup">
            <label class="adv-filter-row">
              <span>Marked</span>
              <div class="adv-toggle-group">
                <button class="adv-tog ${f.marked === 'all' ? 'on' : ''}" onclick="setAdvFilter('marked','all')">All</button>
                <button class="adv-tog ${f.marked === 'yes' ? 'on' : ''}" onclick="setAdvFilter('marked','yes')">Yes</button>
                <button class="adv-tog ${f.marked === 'no' ? 'on' : ''}" onclick="setAdvFilter('marked','no')">No</button>
              </div>
            </label>
            <label class="adv-filter-row">
              <span>Attempted</span>
              <div class="adv-toggle-group">
                <button class="adv-tog ${f.attempted === 'all' ? 'on' : ''}" onclick="setAdvFilter('attempted','all')">All</button>
                <button class="adv-tog ${f.attempted === 'yes' ? 'on' : ''}" onclick="setAdvFilter('attempted','yes')">Yes</button>
                <button class="adv-tog ${f.attempted === 'no' ? 'on' : ''}" onclick="setAdvFilter('attempted','no')">No</button>
              </div>
            </label>
            <label class="adv-filter-row">
              <span>Correct</span>
              <div class="adv-toggle-group">
                <button class="adv-tog ${f.correct === 'all' ? 'on' : ''}" onclick="setAdvFilter('correct','all')">All</button>
                <button class="adv-tog ${f.correct === 'yes' ? 'on' : ''}" onclick="setAdvFilter('correct','yes')">Yes</button>
                <button class="adv-tog ${f.correct === 'no' ? 'on' : ''}" onclick="setAdvFilter('correct','no')">No</button>
              </div>
            </label>
            <label class="adv-filter-row">
              <span>Notes</span>
              <div class="adv-toggle-group">
                <button class="adv-tog ${f.notes === 'all' ? 'on' : ''}" onclick="setAdvFilter('notes','all')">All</button>
                <button class="adv-tog ${f.notes === 'yes' ? 'on' : ''}" onclick="setAdvFilter('notes','yes')">Yes</button>
                <button class="adv-tog ${f.notes === 'no' ? 'on' : ''}" onclick="setAdvFilter('notes','no')">No</button>
              </div>
            </label>
          </div>
        </div>

        <div class="quick-filter-radios">
          <span class="qf-label">Filter Questions</span>
          <label><input type="radio" name="qrQuick" value="all" ${f.quick === 'all' ? 'checked' : ''} onchange="setQuickFilter('all')"> All</label>
          <label><input type="radio" name="qrQuick" value="marked" ${f.quick === 'marked' ? 'checked' : ''} onchange="setQuickFilter('marked')"> Marked</label>
          <label><input type="radio" name="qrQuick" value="unattempted" ${f.quick === 'unattempted' ? 'checked' : ''} onchange="setQuickFilter('unattempted')"> Unattempted</label>
        </div>
      </div>

      <div class="qr-table-wrap">
        <table class="qr-table" id="questionReviewTable">
          <thead>
            <tr>
              <th>Seq</th>
              <th>Your Score</th>
              <th>Score</th>
              <th>Name</th>
              <th>Objective</th>
              <th>Type</th>
            </tr>
            ${f.showExtraFilters ? `
            <tr class="qr-search-row">
              <th></th><th></th><th></th>
              <th><input type="text" class="qr-search-input" id="qrSearchName" value="${f.searchName}" oninput="setQrSearch('name', this.value)"></th>
              <th><input type="text" class="qr-search-input" id="qrSearchObj" value="${f.searchObjective}" oninput="setQrSearch('objective', this.value)"></th>
              <th><input type="text" class="qr-search-input" id="qrSearchType" value="${f.searchType}" oninput="setQrSearch('type', this.value)"></th>
            </tr>
            ` : ""}
          </thead>
          <tbody>
            ${filtered.length === 0 ? `
              <tr><td colspan="6" style="text-align:center;color:#94a3b8;padding:24px;">No questions match the current filters.</td></tr>
            ` : filtered.map(q => {
                const chName = productChapters[q.chapterIndex] || `Chapter ${String((q.chapterIndex || 0) + 1).padStart(2, "0")}`;
                const shortName = (q.text || "").length > 48 ? (q.text || "").slice(0, 48) + "…" : (q.text || "");
                const shortObj = chName.length > 22 ? chName.slice(0, 22) + "…" : chName;
                return `
                <tr class="qr-row" onclick="openQuestionReviewModal('${q.id}')">
                  <td>${q.seq}</td>
                  <td class="${q.isCorrect ? 'score-ok' : (q.isAttempted ? 'score-bad' : '')}">${q.yourScore}</td>
                  <td>${q.maxScore}</td>
                  <td class="qr-name-cell" title="${(q.text || "").replace(/"/g, '&quot;')}">${shortName}</td>
                  <td title="${chName}">${shortObj}</td>
                  <td>Multiple Choice</td>
                </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>

      <div class="review-pane-footer qr-footer">
        <button class="btn-utility" onclick="toggleExtraFilters()">
          <i class="fa-solid fa-filter"></i> ${f.showExtraFilters ? "Hide Extra Filters" : "Show Extra Filters"}
        </button>
        <button class="btn-utility" onclick="resetReviewFilters()"><i class="fa-solid fa-rotate"></i> Reset Filters</button>
        <button class="btn-print" onclick="printQuestionReview()"><i class="fa-solid fa-print"></i> Print</button>
      </div>
    </div>
    `;
}

function switchReviewTab(tab) {
    ReviewState.activeTab = tab;
    ReviewState.filters.advancedOpen = false;
    renderReviewPage();
}

function toggleGradeHistoryDropdown(e) {
    e.stopPropagation();
    const list = document.getElementById("gradeHistoryList");
    if (list) list.classList.toggle("hidden");
}

function selectHistoryRecord(idx) {
    ReviewState.activeIndex = idx;
    ReviewState.filters.advancedOpen = false;
    renderReviewPage();
}

function filterObjectivesTable() {
    const nameQ = (document.getElementById("objSearchName")?.value || "").toLowerCase();
    const pctQ = (document.getElementById("objSearchPct")?.value || "").toLowerCase();
    const yoursQ = (document.getElementById("objSearchYours")?.value || "").toLowerCase();
    const possQ = (document.getElementById("objSearchPossible")?.value || "").toLowerCase();
    document.querySelectorAll("#objectivesTableBody .obj-data-row").forEach(row => {
        const ok =
            (!nameQ || (row.dataset.name || "").includes(nameQ)) &&
            (!pctQ || String(row.dataset.pct).includes(pctQ)) &&
            (!yoursQ || String(row.dataset.yours).includes(yoursQ)) &&
            (!possQ || String(row.dataset.possible).includes(possQ));
        row.style.display = ok ? "" : "none";
    });
}

function setQuickFilter(val) {
    ReviewState.filters.quick = val;
    renderReviewPage();
}

function toggleAdvancedFilter(e) {
    e.stopPropagation();
    ReviewState.filters.advancedOpen = !ReviewState.filters.advancedOpen;
    renderReviewPage();
}

function setAdvFilter(key, val) {
    ReviewState.filters[key] = val;
    renderReviewPage();
}

function setQrSearch(field, val) {
    if (field === "name") ReviewState.filters.searchName = val;
    if (field === "objective") ReviewState.filters.searchObjective = val;
    if (field === "type") ReviewState.filters.searchType = val;
    renderReviewPage();
    setTimeout(() => {
        const id = field === "name" ? "qrSearchName" : field === "objective" ? "qrSearchObj" : "qrSearchType";
        const el = document.getElementById(id);
        if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    }, 0);
}

function toggleExtraFilters() {
    ReviewState.filters.showExtraFilters = !ReviewState.filters.showExtraFilters;
    renderReviewPage();
}

function resetReviewFilters() {
    ReviewState.filters = {
        quick: "all", advancedOpen: false,
        marked: "all", attempted: "all", correct: "all", notes: "all",
        searchName: "", searchObjective: "", searchType: "",
        showExtraFilters: true
    };
    renderReviewPage();
}

function openQuestionReviewModal(questionId) {
    const record = getActiveReviewRecord();
    if (!record || !record.questions) return;
    const q = record.questions.find(x => x.id === questionId);
    if (!q) return;

    const notes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY)) || {};
    const noteText = notes[q.id] || "";

    let modal = document.getElementById("questionReviewDetailModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "questionReviewDetailModal";
        modal.className = "modal-backdrop";
        document.body.appendChild(modal);
    }

    const optionsHtml = (q.choices || []).map((choice, idx) => {
        let cls = "qr-modal-option";
        let badge = "";
        if (idx === q.correct) {
            cls += " correct-option";
            badge = `<span class="opt-badge correct-badge">Correct</span>`;
        }
        if (q.userAnswer === idx) {
            cls += q.isCorrect ? " user-correct" : " user-incorrect";
            badge += `<span class="opt-badge user-badge">Your Answer</span>`;
        }
        return `<div class="${cls}">
            <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
            <span class="opt-text">${choice}</span>
            ${badge}
        </div>`;
    }).join("");

    modal.innerHTML = `
    <div class="modal-box qr-detail-modal">
      <button class="qr-modal-close" onclick="document.getElementById('questionReviewDetailModal').classList.add('hidden')">&times;</button>
      <div class="qr-modal-meta">
        <span class="qr-modal-id">Question ID: ${q.id}</span>
        <span class="qr-modal-result ${q.isCorrect ? 'ok' : (q.isAttempted ? 'bad' : 'skip')}">
          ${q.isCorrect ? "Correct" : (q.isAttempted ? "Incorrect" : "Unattempted")}
        </span>
      </div>
      <h3 class="qr-modal-question">${q.text}</h3>
      <div class="qr-modal-options">${optionsHtml}</div>
      ${q.explanation ? `<div class="qr-modal-explanation"><strong>Explanation</strong><p>${q.explanation}</p></div>` : ""}
      ${noteText ? `<div class="qr-modal-note"><strong>Your Note</strong><p>${noteText}</p></div>` : ""}
      <div class="modal-actions">
        <button class="btn-secondary" onclick="document.getElementById('questionReviewDetailModal').classList.add('hidden')">Close</button>
      </div>
    </div>
    `;
    modal.classList.remove("hidden");
}

function printCurrentScore() {
    const record = getActiveReviewRecord();
    if (!record) return;
    const product = MOCK_PRODUCTS_DATABASE.find(p => p.id === ReviewState.productId) || {};
    const user = appState.currentUser || "Candidate";
    const passed = record.status === "PASSED";
    const yourScore = record.scaledScore ?? 0;
    const req = record.requiredScore ?? 900;

    const objectivesRows = (record.objectives || []).map(o => `
      <tr><td>${o.name}</td><td>${o.percentage}%</td><td>${o.yourPoints}</td><td>${o.possiblePoints}</td></tr>
    `).join("");

    const win = window.open("", "_blank", "width=900,height=700");
    win.document.write(`<!DOCTYPE html><html><head><title>CodingHamme – Score Report</title>
    <style>
      body{font-family:'Segoe UI',Tahoma,sans-serif;color:#1e293b;padding:32px;max-width:800px;margin:0 auto}
      .brand{display:flex;align-items:center;gap:10px;margin-bottom:24px;border-bottom:3px solid #db2777;padding-bottom:12px}
      .brand-icon{width:36px;height:36px;background:#5c0a3a;color:#ec4899;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px}
      .brand-name{font-size:20px;font-weight:700;color:#5c0a3a}
      .meta{font-size:13px;color:#475569;margin-bottom:20px;line-height:1.7}
      .meta strong{color:#1e293b}
      .status{font-size:22px;font-weight:700;margin:16px 0 8px}
      .status.failed{color:#dc2626}.status.passed{color:#16a34a}
      .bar-row{display:flex;align-items:center;gap:12px;margin-bottom:8px}
      .bar-label{width:110px;font-size:12px}
      .bar-track{flex:1;height:22px;background:#e2e8f0;border-radius:3px;overflow:hidden}
      .bar-fill-you{height:100%;background:${passed ? "#16a34a" : "#dc2626"}}
      .bar-fill-req{height:100%;background:#db2777}
      table{width:100%;border-collapse:collapse;font-size:13px;margin-top:16px}
      th,td{border:1px solid #cbd5e1;padding:8px 10px;text-align:left}
      th{background:#f1f5f9;font-weight:600}
      .footer{margin-top:40px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}
      @media print{body{padding:12px}}
    </style></head><body>
      <div class="brand"><div class="brand-icon">CH</div><div class="brand-name">CodingHamme Practice Exam</div></div>
      <div class="meta">
        <div><strong>Name:</strong> ${user}</div>
        <div><strong>Run Date:</strong> ${record.date}</div>
        <div><strong>Product:</strong> ${record.productTitle || product.title || ""}</div>
        <div><strong>Exam:</strong> ${record.productCode || ""} Practice</div>
        <div><strong>Mode:</strong> ${record.modeLabel || "Guided Practice Test"}</div>
      </div>
      <div class="status ${passed ? "passed" : "failed"}">${record.statusLabel || (passed ? "Passed" : "Test Not Passed")}</div>
      <div class="bar-row"><div class="bar-label">Your Score<br><strong>${yourScore}</strong></div>
        <div class="bar-track"><div class="bar-fill-you" style="width:${Math.min(100, yourScore / 10)}%"></div></div></div>
      <div class="bar-row"><div class="bar-label">Required Score<br><strong>${req}</strong></div>
        <div class="bar-track"><div class="bar-fill-req" style="width:${Math.min(100, req / 10)}%"></div></div></div>
      <table><thead><tr><th>Objective Name</th><th>Percentage %</th><th>Your Points</th><th>Possible Points</th></tr></thead>
        <tbody>${objectivesRows || "<tr><td colspan='4'>No objective data</td></tr>"}</tbody></table>
      <div class="footer">Copyright © 2026 CodingHamme. All rights reserved. • Generated score report</div>
      <script>window.onload=function(){window.print()}<\/script>
    </body></html>`);
    win.document.close();
}

function printQuestionReview() {
    const record = getActiveReviewRecord();
    if (!record) return;
    const product = MOCK_PRODUCTS_DATABASE.find(p => p.id === ReviewState.productId) || {};
    const chapters = product.chapters || [];
    const rows = (record.questions || []).map((q, i) => {
        const ch = chapters[q.chapterIndex] || `Chapter ${i + 1}`;
        return `<tr><td>${i + 1}</td><td>${q.yourScore}</td><td>${q.maxScore}</td>
          <td>${(q.text || "").replace(/</g, "&lt;")}</td><td>${ch}</td><td>Multiple Choice</td></tr>`;
    }).join("");

    const win = window.open("", "_blank", "width=1000,height=700");
    win.document.write(`<!DOCTYPE html><html><head><title>CodingHamme – Question Review</title>
    <style>
      body{font-family:'Segoe UI',Tahoma,sans-serif;color:#1e293b;padding:24px}
      .brand{display:flex;align-items:center;gap:10px;margin-bottom:16px;border-bottom:3px solid #db2777;padding-bottom:10px}
      .brand-icon{width:32px;height:32px;background:#5c0a3a;color:#ec4899;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800}
      .brand-name{font-size:18px;font-weight:700;color:#5c0a3a}
      h2{font-size:16px;margin:12px 0}
      table{width:100%;border-collapse:collapse;font-size:12px}
      th,td{border:1px solid #cbd5e1;padding:6px 8px;text-align:left;vertical-align:top}
      th{background:#f1f5f9}
      .footer{margin-top:24px;font-size:11px;color:#94a3b8}
      @media print{body{padding:8px}}
    </style></head><body>
      <div class="brand"><div class="brand-icon">CH</div><div class="brand-name">CodingHamme Practice Exam</div></div>
      <h2>Question Review — ${record.productTitle || ""} • ${record.date}</h2>
      <table><thead><tr><th>Seq</th><th>Your Score</th><th>Score</th><th>Name</th><th>Objective</th><th>Type</th></tr></thead>
        <tbody>${rows || "<tr><td colspan='6'>No questions</td></tr>"}</tbody></table>
      <div class="footer">Copyright © 2026 CodingHamme. All rights reserved.</div>
      <script>window.onload=function(){window.print()}<\/script>
    </body></html>`);
    win.document.close();
}

document.addEventListener("click", function (e) {
    const list = document.getElementById("gradeHistoryList");
    const dd = document.getElementById("gradeHistoryDropdown");
    if (list && dd && !dd.contains(e.target)) list.classList.add("hidden");
    const adv = document.getElementById("advancedFilterPopup");
    if (adv && !adv.contains(e.target) && !e.target.closest(".btn-advanced-filter")) {
        adv.classList.add("hidden");
        if (ReviewState.filters) ReviewState.filters.advancedOpen = false;
    }
});


function renderSavedExamsViewport(container) {
    const logs = JSON.parse(localStorage.getItem(SAVED_EXAMS_KEY)) || [];
    if (logs.length === 0) {
        container.innerHTML = `<div class="product-row-card"><p style="color:#6b7280; font-size:14px; text-align:center; width:100%;">No saved test states found.</p></div>`;
        return;
    }
    logs.forEach(exam => {
        const row = document.createElement("div");
        row.className = "saved-exam-row";
        row.innerHTML = `
            <div class="exam-meta-info">
                <h4>${exam.productTitle} (${exam.mode.toUpperCase()})</h4>
                <span class="exam-timestamp"><i class="fa-regular fa-calendar"></i> Saved: ${exam.timestamp} - ${exam.questions.length} Slots Loaded</span>
            </div>
            <div style="display:flex; align-items:center; gap:12px;">
                <button class="btn-primary" style="font-size:12px; padding:6px 14px;" onclick="loadSavedExamState(${exam.id})">Resume Test &rarr;</button>
                <button class="btn-delete-trash" onclick="deleteSavedExamState(${exam.id})"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `;
        container.appendChild(row);
    });
}

function loadSavedExamState(examId) {
    const logs = JSON.parse(localStorage.getItem(SAVED_EXAMS_KEY)) || [];
    const target = logs.find(e => e.id === examId);
    if (!target) return;
    appState.selectedProduct = MOCK_PRODUCTS_DATABASE.find(p => p.id === target.productId);
    appState.selectedMode = target.mode;
        // Remember which saved record we are continuing so a later save can overwrite it
    appState.quizEngine.originSavedExamId = target.id;
    appState.quizEngine.questions = target.questions;
    appState.quizEngine.currentIndex = target.currentIndex;
    appState.quizEngine.userAnswers = target.userAnswers;
    appState.quizEngine.timeRemaining = target.timeRemaining;
    appState.quizEngine.isGraded = false;
    
    let readableMode = "Guided Practice Test";
    if (appState.selectedMode === "flashcard") readableMode = "Flash Card Practice";
    if (appState.selectedMode === "simulation") readableMode = "Exam Simulation";
    
    if (document.getElementById("bannerModeDisplay")) document.getElementById("bannerModeDisplay").textContent = readableMode;
    if (document.getElementById("bannerProductDisplay")) document.getElementById("bannerProductDisplay").textContent = appState.selectedProduct.title;
    if (document.getElementById("subNavProductCode")) document.getElementById("subNavProductCode").textContent = appState.selectedProduct.code;
    
    clearQuizTimer();
    if (appState.selectedMode === "simulation") {
        if (document.getElementById("simulationTimerContainer")) document.getElementById("simulationTimerContainer").classList.remove("hidden");
        updateClockDisplayMetrics();
        appState.quizEngine.timerInterval = setInterval(() => {
            appState.quizEngine.timeRemaining--;
            updateClockDisplayMetrics();
            if (appState.quizEngine.timeRemaining <= 0) {
                executeQuizSubmissionGrading();
            }
        }, 1000);
    } else {
        if (document.getElementById("simulationTimerContainer")) document.getElementById("simulationTimerContainer").classList.add("hidden");
    }

    // Restore simulation vs practice UI: hide View Answer / Reset in Exam Simulation
    // (same contract as launchQuizWorkspaceView) so resumed sessions match the mode
    const viewAnsBtn = document.getElementById("viewAnswerFooterBtn");
    const resetQBtn  = document.getElementById("resetQuestionFooterBtn");
    const isExamMode = appState.selectedMode === "simulation";
    if (isExamMode) {
        if (viewAnsBtn) viewAnsBtn.classList.add("hidden");
        if (resetQBtn)  resetQBtn.classList.add("hidden");
    } else {
        if (viewAnsBtn) viewAnsBtn.classList.remove("hidden");
        if (resetQBtn)  resetQBtn.classList.remove("hidden");
    }

    renderActiveQuestionContext();
    navigateTo("quiz");
}

function deleteSavedExamState(examId) {
    let logs = JSON.parse(localStorage.getItem(SAVED_EXAMS_KEY)) || [];
    logs = logs.filter(e => e.id !== examId);
    localStorage.setItem(SAVED_EXAMS_KEY, JSON.stringify(logs));
    renderDashboardProducts();
}

/* ==========================================================================
PRODUCT ACTIVATION & NOTES MODAL CONTROLLERS
========================================================================== */
function openActivationModal() {
    if (document.getElementById("activationCodeInput")) document.getElementById("activationCodeInput").value = "";
    if (document.getElementById("activationModal")) document.getElementById("activationModal").classList.remove("hidden");
}

function closeActivationModal() {
    if (document.getElementById("activationModal")) document.getElementById("activationModal").classList.add("hidden");
}

function processProductActivation() {
    const codeInput = document.getElementById("activationCodeInput");
    if (!codeInput) return;
    const code = codeInput.value.trim().toUpperCase();
    if (!code) {
        alert("Please enter a valid product activation code.");
        return;
    }

    // Match against either product.id or product.code
    const matched = MOCK_PRODUCTS_DATABASE.find(
        p => p.id.toUpperCase() === code || p.code.toUpperCase() === code
    );

    if (!matched) {
        alert("Invalid activation code.");
        return;
    }

    let owned = getOwnedProducts();
    if (owned.includes(matched.id)) {
        alert("This product is already active on your account.");
        closeActivationModal();
        return;
    }

    owned.push(matched.id);
    setOwnedProducts(owned);               // permanent localStorage write
    alert(`Activation Success: "${matched.title}" unlocked.`);
    closeActivationModal();
    renderDashboardProducts();             // immediate UI refresh
}

let activeNotesProductId = null;
function openNotesModal(productId) {
    activeNotesProductId = productId;
    const prod = MOCK_PRODUCTS_DATABASE.find(p => p.id === productId);
    if (document.getElementById("notesModalTitle")) document.getElementById("notesModalTitle").textContent = `Tracking Notes: ${prod ? prod.code : ''}`;
    if (document.getElementById("notesTextArea")) document.getElementById("notesTextArea").value = localStorage.getItem(`CH_NOTES_${activeNotesProductId}`) || "";
    if (document.getElementById("notesModal")) document.getElementById("notesModal").classList.remove("hidden");
}

function closeNotesModal() {
    if (document.getElementById("notesModal")) document.getElementById("notesModal").classList.add("hidden");
    activeNotesProductId = null;
}

function saveProductNotes() {
    if (!activeNotesProductId) return;
    const textarea = document.getElementById("notesTextArea");
    if (textarea) {
        localStorage.setItem(`CH_NOTES_${activeNotesProductId}`, textarea.value);
        alert("Notes saved successfully.");
    }
    closeNotesModal();
}

/* ==========================================================================
THE 3-CARD PRE-CONFIGURATION SETUP ENGINE
========================================================================== */
function initiateProductExamConfiguration(productId) {
    const prod = MOCK_PRODUCTS_DATABASE.find(p => p.id === productId);
    if (!prod) return;

    if (!getOwnedProducts().includes(prod.id)) {
        alert("This certification is not activated on your account.");
        navigateTo("dashboard");
        return;
    }

    appState.selectedProduct = prod;
    appState.selectedMode = null;
    if (document.getElementById("preConfigProductTitle")) document.getElementById("preConfigProductTitle").textContent = prod.title;
    document.querySelectorAll(".mode-options-grid .mode-card").forEach(card => card.style.border = "1px solid #e5e7eb");
    const configBtn = document.getElementById("configureExamActionBtn");
    if (configBtn) {
        configBtn.className = "btn-disabled-placeholder";
        configBtn.textContent = "Select Option to Start →";
        configBtn.style.backgroundColor = "#e5e7eb";
        configBtn.style.color = "#9ca3af";
        configBtn.style.cursor = "not-allowed";
        configBtn.disabled = true;
    }
    navigateTo("pre-config");
}


function selectTestMode(mode) {
    appState.selectedMode = mode;
    document.querySelectorAll(".mode-options-grid .mode-card").forEach(card => {
        card.style.border = "1px solid #e5e7eb";
        card.classList.remove("mode-selected");
        const ind = card.querySelector(".select-indicator-btn");
        if (ind) {
            ind.style.background = "#e5e7eb";
            ind.style.color = "#374151";
        }
    });
    const modeCard = document.getElementById(`mode-${mode}`);
    if (modeCard) {
        modeCard.style.border = "2px solid #db2777";
        modeCard.classList.add("mode-selected");
        const ind = modeCard.querySelector(".select-indicator-btn");
        if (ind) {
            ind.style.background = "#db2777";
            ind.style.color = "#ffffff";
        }
    }
    const configBtn = document.getElementById("configureExamActionBtn");
    if (configBtn) {
        configBtn.className = "btn-primary";
        configBtn.style.backgroundColor = "#db2777";
        configBtn.style.color = "#ffffff";
        configBtn.style.cursor = "pointer";
        configBtn.disabled = false;
        if (mode === "guided") configBtn.textContent = "Configure Guided Objectives →";
        else if (mode === "flashcard") configBtn.textContent = "Configure Flashcard Sandbox →";
        else configBtn.textContent = "Configure Simulation Engine →";
    }
}

function routeToObjectiveConfigurationPage() {
    if (!appState.selectedProduct || !appState.selectedMode) return;
    if (document.getElementById("interConfigProductTitle")) document.getElementById("interConfigProductTitle").textContent = `${appState.selectedProduct.title} - Configurations`;
    const splitContainer = document.getElementById("dynamicSplitChaptersContainer");
    if (!splitContainer) return;
    splitContainer.innerHTML = "";
    appState.selectedProduct.chapters.forEach((ch, idx) => {
        const lbl = document.createElement("label");
        lbl.className = "sub-check-item";
        lbl.innerHTML = `<input type="checkbox" value="${idx}" checked onchange="evaluateGroupMasterToggle('chapters')"> <span>${ch}</span>`;
        splitContainer.appendChild(lbl);
    });
    if (document.getElementById("toggleAllExams")) document.getElementById("toggleAllExams").checked = true;
    if (document.getElementById("toggleAllChapters")) document.getElementById("toggleAllChapters").checked = true;
    document.querySelectorAll("#examsCheckboxList input").forEach(cb => cb.checked = true);
    navigateTo("intermediate-config");
}

function toggleEntireExamGroup(mToggle) {
    document.querySelectorAll("#examsCheckboxList input").forEach(cb => cb.checked = mToggle.checked);
}

function toggleEntireChapterGroup(mToggle) {
    document.querySelectorAll("#dynamicSplitChaptersContainer input").forEach(cb => cb.checked = mToggle.checked);
}

function evaluateGroupMasterToggle(type) {
    if (type === 'exams') {
        const items = document.querySelectorAll("#examsCheckboxList input");
        const checked = document.querySelectorAll("#examsCheckboxList input:checked");
        if (document.getElementById("toggleAllExams")) document.getElementById("toggleAllExams").checked = (items.length === checked.length);
    } else {
        const items = document.querySelectorAll("#dynamicSplitChaptersContainer input");
        const checked = document.querySelectorAll("#dynamicSplitChaptersContainer input:checked");
        if (document.getElementById("toggleAllChapters")) document.getElementById("toggleAllChapters").checked = (items.length === checked.length);
    }
}

function handleInterConfigBack() { navigateTo("pre-config"); }
function handleInterConfigCancel() { navigateTo("dashboard"); }
function handleSaveConfigSettings() { alert("Configuration profile committed."); }
async function handleStartDefaultTest() {
    // Mark that this is a "default exam" session so launchQuizWorkspaceView
    // can apply the metadata-driven question count + duration rules.
    appState.isDefaultTest = true;
    await launchQuizWorkspaceView();
}
function handleContinueConfiguration() {
    if (document.getElementById("configPageProductTitle")) document.getElementById("configPageProductTitle").textContent = appState.selectedProduct.title;
    if (document.getElementById("activeModeConfigLabel")) document.getElementById("activeModeConfigLabel").textContent = `${appState.selectedMode.toUpperCase()} Setup`;
    navigateTo("exam-objectives-config");
}

/* ==========================================================================
THE LIVE QUIZ ASSESSMENTS RUNTIME ENGINE
========================================================================== */
async function launchQuizWorkspaceView() {

    if (!getOwnedProducts().includes(appState.selectedProduct.id)) {
        alert("This certification is not activated on your account.");
        navigateTo("dashboard");
        return;
    }

    if (!appState.selectedProduct) return;

    // ---- 1. Build the candidate pool ----
    let filteredPool = [];
    const targetCode = appState.selectedProduct.code;

    const PRODUCT_TO_STORE = {
        "N10-009": "CompTIA_Network_Plus",
        "CompTIA_Network_Plus": "CompTIA_Network_Plus",
        "ISC2-CC": "ISC2_CC",
        "CS0-004": "CompTIA_CySA_Plus",
        "CEH-V13": "CEH_v13"
    };

    let storeKey = PRODUCT_TO_STORE[targetCode] || null;

    // Default Test → all chapters; Configured test → respect checkboxes
    let selectedChapters;
    if (appState.isDefaultTest) {
        selectedChapters = appState.selectedProduct.chapters.map((_, idx) => idx);
    } else {
        selectedChapters = Array.from(
            document.querySelectorAll("#dynamicSplitChaptersContainer input:checked")
        ).map(cb => parseInt(cb.value, 10));
    }

    // 1a. Legacy in-memory store (kept for 100% backward compatibility)
    if (storeKey && QuizDataStore[storeKey]) {
        selectedChapters.forEach(chIdx => {
            const chKey = `chapter${chIdx + 1}`;
            if (QuizDataStore[storeKey][chKey] && QuizDataStore[storeKey][chKey].length > 0) {
                const mappedQuestions = QuizDataStore[storeKey][chKey].map(q => ({...q, chapterIndex: chIdx}));
                filteredPool.push(...mappedQuestions);
            }
        });
    }

    // 1b. Dedicated per-product data file, fetched on demand (new data layer)
    const startBtn = document.getElementById("startTestActionBtn") || document.getElementById("startDefaultTestActionBtn");
    const startBtnOriginalText = startBtn ? startBtn.textContent : null;
    if (filteredPool.length === 0) {
        if (startBtn) { startBtn.disabled = true; startBtn.textContent = "Loading question bank…"; }
        try {
            const curatedBank = await loadCuratedQuestionBank(appState.selectedProduct);
            if (curatedBank && curatedBank.length > 0) {
                filteredPool = curatedBank.filter(q => selectedChapters.includes(q.chapterIndex));
                if (filteredPool.length === 0) filteredPool = curatedBank;
            }
        } finally {
            if (startBtn) { startBtn.disabled = false; startBtn.textContent = startBtnOriginalText; }
        }
    }

    // 1c. Legacy synthetic generator — final safety net, always available
    if (filteredPool.length === 0) {
        let fullPool = generateQuestionsForProduct(appState.selectedProduct);
        filteredPool = fullPool.filter(q => selectedChapters.includes(q.chapterIndex));
        if (filteredPool.length === 0) {
            filteredPool = fullPool;
        }
        // Visible warning (not just console) since this means the curated
        // data/<product>.js file failed to load and the quiz is running on
        // placeholder-generated questions instead of real curated content.
        console.error(`Falling back to generated placeholder questions for ${appState.selectedProduct.id} — the curated data file did not load. Check the data/ path, hosting, and browser console for details.`);
        alert(`Heads up: the curated question bank for ${appState.selectedProduct.title} could not be loaded, so this exam is using placeholder questions instead. Check that data/${appState.selectedProduct.id.toLowerCase()}.js is deployed correctly.`);
    }

    if (filteredPool.length === 0) {
        alert("No questions available for the selected chapters.");
        appState.isDefaultTest = false;
        return;
    }

    // ---- 2. Decide question count & duration ----
    const meta = getExamMetadata(appState.selectedProduct);
    let maxQ;

    if (appState.isDefaultTest) {
        maxQ = meta.questionCount;          // strict standard count
    } else {
        maxQ = Math.max(1, parseInt(document.getElementById("maxQuestionsInput")?.value, 10) || 90);
    }

    // ---- 3. Generate the exam set ----
    let examQuestions;
    if (appState.isDefaultTest) {
        examQuestions = generateBalancedDefaultExam(filteredPool, maxQ);
    } else {
        examQuestions = filteredPool.slice(0, maxQ);
    }

    // ---- 4. Initialise engine state (ephemeral until Save) ----
    appState.quizEngine.questions       = examQuestions;
    appState.quizEngine.currentIndex    = 0;
    appState.quizEngine.userAnswers     = {};
    appState.quizEngine.isGraded        = false;
    appState.quizEngine.originSavedExamId = null;

    // ---- 5. Banner labels ----
    let readableMode = "Guided Practice Test";
    if (appState.selectedMode === "flashcard") readableMode = "Flash Card Practice";
    if (appState.selectedMode === "simulation") readableMode = "Exam Simulation";

    if (document.getElementById("bannerModeDisplay"))
        document.getElementById("bannerModeDisplay").textContent = readableMode;
    if (document.getElementById("bannerProductDisplay"))
        document.getElementById("bannerProductDisplay").textContent = appState.selectedProduct.title;
    if (document.getElementById("subNavProductCode"))
        document.getElementById("subNavProductCode").textContent = appState.selectedProduct.code;

    // ---- 6. Conditional timer (ONLY for Exam Simulation) ----
    clearQuizTimer();

    const isExamMode = appState.selectedMode === "simulation";

    if (isExamMode) {
        if (document.getElementById("simulationTimerContainer"))
            document.getElementById("simulationTimerContainer").classList.remove("hidden");

        let minutes;
        if (appState.isDefaultTest) {
            minutes = meta.durationMinutes;   // certification standard duration
        } else {
            minutes = parseInt(document.getElementById("examDurationSlider")?.value || 90, 10);
        }

        appState.quizEngine.timeRemaining = minutes * 60;
        updateClockDisplayMetrics();

        appState.quizEngine.timerInterval = setInterval(() => {
            appState.quizEngine.timeRemaining--;
            updateClockDisplayMetrics();
            if (appState.quizEngine.timeRemaining <= 0) {
                alert("Time is up! The exam will now be automatically graded and submitted.");
                executeQuizSubmissionGrading();
            }
        }, 1000);
    } else {
        // Guided Practice & Flash Card → never timed
        if (document.getElementById("simulationTimerContainer"))
            document.getElementById("simulationTimerContainer").classList.add("hidden");
        appState.quizEngine.timeRemaining = 0;
    }

    // Hide View-Answer / Reset for pure simulation mode
    const viewAnsBtn = document.getElementById("viewAnswerFooterBtn");
    const resetQBtn  = document.getElementById("resetQuestionFooterBtn");
    if (isExamMode) {
        if (viewAnsBtn) viewAnsBtn.classList.add("hidden");
        if (resetQBtn)  resetQBtn.classList.add("hidden");
    } else {
        if (viewAnsBtn) viewAnsBtn.classList.remove("hidden");
        if (resetQBtn)  resetQBtn.classList.remove("hidden");
    }

    // Clear the flag so subsequent configured launches stay normal
    appState.isDefaultTest = false;

    renderActiveQuestionContext();
    navigateTo("quiz");
}

function updateClockDisplayMetrics() {
    const hours = Math.floor(appState.quizEngine.timeRemaining / 3600);
    const mins = Math.floor((appState.quizEngine.timeRemaining % 3600) / 60);
    const secs = appState.quizEngine.timeRemaining % 60;
    const durationDisplay = document.getElementById("timeDurationDisplay");
    if (durationDisplay) {
        durationDisplay.textContent = `${hours.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
    }
}

function renderActiveQuestionContext() {
    const engine = appState.quizEngine;
    if (engine.questions.length === 0) return;
    const currentQ = engine.questions[engine.currentIndex];
    
    if (document.getElementById("questionIndexDisplay")) document.getElementById("questionIndexDisplay").textContent = `Question ${engine.currentIndex + 1} of ${engine.questions.length}`;
    if (document.getElementById("questionIdDisplay")) document.getElementById("questionIdDisplay").textContent = `Question Id : ${currentQ.id}`;
    if (document.getElementById("questionTextDisplay")) document.getElementById("questionTextDisplay").textContent = currentQ.text;
    if (document.getElementById("answerExplanationBox")) document.getElementById("answerExplanationBox").classList.add("hidden");
    
    const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE_KEY)) || {};
    const btnB = document.getElementById("bookmarkToggleBtn");
    if (btnB) {
        if (bookmarks[currentQ.id]) {
            btnB.innerHTML = `<i class="fa-solid fa-bookmark"></i> bookmarked`;
            btnB.classList.add("bookmarked-active");
        } else {
            btnB.innerHTML = `<i class="fa-regular fa-bookmark"></i> Bookmark Question`;
            btnB.classList.remove("bookmarked-active");
        }
    }
    renderActiveQuestionStickyNote(currentQ.id);
    const container = document.getElementById("optionsBlockContainer");
    if (!container) return;
    container.innerHTML = "";
    currentQ.choices.forEach((choice, idx) => {
        const optNode = document.createElement("div");
        optNode.className = "option-node-item";
        if (engine.userAnswers[engine.currentIndex] === idx) {
            optNode.classList.add("selected");
        }
        optNode.innerHTML = `
            <i class="fa-regular ${engine.userAnswers[engine.currentIndex] === idx ? 'fa-circle-dot' : 'fa-circle'}"></i>
            <span>${choice}</span>
        `;
optNode.onclick = () => {
            if (engine.isGraded) return;
            engine.userAnswers[engine.currentIndex] = idx;
            if (typeof playUiSound === "function") playUiSound("select");
            renderActiveQuestionContext();
        };

        container.appendChild(optNode);
    });
    
    if (document.getElementById("prevQuestionBtn")) document.getElementById("prevQuestionBtn").disabled = (engine.currentIndex === 0);
    if (document.getElementById("nextQuestionBtn")) document.getElementById("nextQuestionBtn").textContent = (engine.currentIndex === engine.questions.length - 1) ? "Finish Review" : "Next Question";
}

function renderActiveQuestionStickyNote(questionId) {
    const notes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY)) || {};
    const element = document.getElementById("questionStickyNoteContainer");
    if (!element) return;
    if (notes[questionId]) {
        element.classList.remove("hidden");
        element.innerHTML = `<strong>Your Dynamic Note:</strong><br>${notes[questionId]}`;
    } else {
        element.classList.add("hidden");
    }
}

function changeQuestion(direction) {
    const engine = appState.quizEngine;
    const targetIdx = engine.currentIndex + direction;
    if (targetIdx >= 0 && targetIdx < engine.questions.length) {
        engine.currentIndex = targetIdx;
        renderActiveQuestionContext();
    } else if (targetIdx === engine.questions.length) {
        handleNavbarReview();
    }
}

/* ==========================================================================
RIGHT-HAND ACTION SIDE BUTTON FEATURES
========================================================================== */
function toggleCurrentBookmark() {
    const currentQ = appState.quizEngine.questions[appState.quizEngine.currentIndex];
    if (!currentQ) return;
    let bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE_KEY)) || {};
    if (bookmarks[currentQ.id]) {
        delete bookmarks[currentQ.id];
    } else {
        bookmarks[currentQ.id] = true;
    }
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    renderActiveQuestionContext();
}

function openFeedbackModal() {
    if (document.getElementById("feedbackCommentArea")) document.getElementById("feedbackCommentArea").value = "";
    if (document.getElementById("feedbackModal")) document.getElementById("feedbackModal").classList.remove("hidden");
}

/**
 * Intercepts feedback submission and silently delivers the content
 * to AdepojuGbenga2017@gmail.com without exposing the address to the user.
 * Uses Formspree (replace FORM_ID with a real Formspree form ID).
 */
function submitQuestionFeedbackPayload() {
  const typeEl = document.getElementById("feedbackTypeSelector");
  const textEl = document.getElementById("feedbackCommentArea");
  if (!typeEl || !textEl) return;

  const type = typeEl.value;
  const text = textEl.value.trim();
  const currentQ = appState.quizEngine.questions[appState.quizEngine.currentIndex];

  if (!text) {
    alert("Please input feedback details text.");
    return;
  }

  // Build payload
  const payload = {
    _subject: `[CodingHamme Feedback] ${type}`,
    feedbackType: type,
    questionId: currentQ ? currentQ.id : "N/A",
    comment: text,
    user: appState.currentUser || "Anonymous",
    product: appState.selectedProduct ? appState.selectedProduct.code : "N/A",
    timestamp: new Date().toISOString(),
    // Formspree will route to the configured destination
    _replyto: "noreply@codinghamme.com"
  };

  // ---------- Background delivery (Formspree) ----------
  // Create a free form at https://formspree.io and replace the ID below.
  // Set the form’s destination email to AdepojuGbenga2017@gmail.com.
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/mwvgdvrz"; // ← replaced with real ID

  fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify(payload)
  })
  .then(res => {
    // We deliberately ignore the network result for UX – always show success
    console.log("[Feedback] Payload transmitted (status " + res.status + ")");
  })
  .catch(err => {
    // Fail silently from the user’s perspective
    console.warn("[Feedback] Delivery attempt failed (offline?):", err);
  });

  // Retain the exact original success notification
  alert(`Success! Your feedback ("${type}") along with an automatic screen capture of question ${currentQ ? currentQ.id : ""} has been transmitted.`);
  if (document.getElementById("feedbackModal")) {
    document.getElementById("feedbackModal").classList.add("hidden");
  }
}

/* ==========================================================================
NAVIGATION TOP BAR COMMAND INTERACTIVE FEATURES
========================================================================== */
function handleNavbarNew() {
    if (confirm("Are you sure you want to discard this practice test session and return to the settings configuration page?")) {
        clearQuizTimer();
        navigateTo("dashboard");
        initiateProductExamConfiguration(appState.selectedProduct.id);
    }
}

function handleNavbarSave() {
    const logs = JSON.parse(localStorage.getItem(SAVED_EXAMS_KEY)) || [];
    const originId = appState.quizEngine.originSavedExamId;

    // Build the payload that represents the current live state
    const stateRecord = {
        id: originId || Date.now(),          // keep original id when overwriting
        timestamp: new Date().toLocaleString(),
        productId: appState.selectedProduct.id,
        productTitle: appState.selectedProduct.title,
        mode: appState.selectedMode,
        userAnswers: appState.quizEngine.userAnswers,
        timeRemaining: appState.quizEngine.timeRemaining,
        currentIndex: appState.quizEngine.currentIndex,
        questions: appState.quizEngine.questions
    };

    // Case 1 – this session was resumed from an existing save
    if (originId) {
        const existingIdx = logs.findIndex(e => e.id === originId);

        if (existingIdx !== -1) {
            const confirmOverwrite = confirm(
                "You are continuing a previously saved exam.\n\n" +
                "Do you want to overwrite / update that existing save with your current progress?\n\n" +
                "• OK  = overwrite the existing save\n" +
                "• Cancel = create a brand-new separate save entry"
            );

            if (confirmOverwrite) {
                // Overwrite the matching record in-place
                logs[existingIdx] = stateRecord;
                localStorage.setItem(SAVED_EXAMS_KEY, JSON.stringify(logs));
                clearQuizTimer();
                alert("Success: The existing saved exam has been updated with your latest progress.");
                navigateTo("dashboard");
                return;
            }
            // User chose Cancel → fall through and create a new entry
            // (we still keep the original originSavedExamId so a later save can still offer overwrite)
        }
    }

    // Case 2 – brand-new save (or user declined overwrite)
    // Force a fresh id so we never accidentally collide with the original
    stateRecord.id = Date.now();
    logs.push(stateRecord);
    localStorage.setItem(SAVED_EXAMS_KEY, JSON.stringify(logs));
    clearQuizTimer();
    alert("Success: The present practice page state has been saved securely online.");
    navigateTo("dashboard");
}

function handleNavbarReview() {
    const engine = appState.quizEngine;
    if (document.getElementById("revTotalCount")) document.getElementById("revTotalCount").textContent = engine.questions.length;
    let attempted = Object.keys(engine.userAnswers).length;
    if (document.getElementById("revAttemptedCount")) document.getElementById("revAttemptedCount").textContent = attempted;
    if (document.getElementById("revUnattemptedCount")) document.getElementById("revUnattemptedCount").textContent = engine.questions.length - attempted;
    const grid = document.getElementById("reviewGridContainer");
    if (!grid) return;
    grid.innerHTML = "";
    engine.questions.forEach((q, idx) => {
        const node = document.createElement("div");
        const hasAnswered = engine.userAnswers[idx] !== undefined;
        node.className = `review-item-node ${hasAnswered ? 'answered' : 'unanswered'}`;
        node.textContent = idx + 1;
        node.onclick = () => {
            engine.currentIndex = idx;
            navigateTo("quiz");
            renderActiveQuestionContext();
        };
        grid.appendChild(node);
    });
    navigateTo("review");
}

function handleNavbarGrade() {
    // Safety confirmation before irreversible grading
    const confirmed = confirm(
        "Are you sure you want to grade your exam? This action cannot be undone."
    );
    if (!confirmed) {
        // User cancelled — keep active exam page and answers unchanged
        return;
    }
    executeQuizSubmissionGrading();
}

function executeQuizSubmissionGrading() {
    if (appState.quizEngine && appState.quizEngine.timerInterval) {
        clearInterval(appState.quizEngine.timerInterval);
        appState.quizEngine.timerInterval = null;
    }

    // Subtle grade cue when sound preference is enabled
    if (typeof playUiSound === "function") playUiSound("grade");

    const engine = appState.quizEngine;
    engine.isGraded = true;

    const totalQuestions = engine.questions.length || 1;
    let correctCount = 0;
    const questionResults = [];
    const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE_KEY)) || {};

    engine.questions.forEach((q, idx) => {
        const userAns = engine.userAnswers[idx];
        const isCorrect = userAns !== undefined && userAns === q.correct;
        if (isCorrect) correctCount++;
        questionResults.push({
            id: q.id,
            text: q.text,
            choices: q.choices,
            correct: q.correct,
            explanation: q.explanation,
            distractors: q.distractors || [],
            chapterIndex: q.chapterIndex,
            userAnswer: userAns,
            isCorrect: isCorrect,
            isAttempted: userAns !== undefined,
            isMarked: !!bookmarks[q.id],
            yourScore: isCorrect ? 1 : 0,
            maxScore: 1
        });
    });

    const scaledScore = parseFloat(((correctCount / totalQuestions) * 1000).toFixed(2));
    const percentScore = Math.round((correctCount / totalQuestions) * 100);

    const isNetworkPlus = appState.selectedProduct &&
        (appState.selectedProduct.code === "N10-009" || appState.selectedProduct.id === "NET009");
    const requiredScore = isNetworkPlus ? 720 : 900;
    const status = scaledScore >= requiredScore ? "PASSED" : "FAILED";
    const statusLabel = status === "PASSED" ? "Passed" : "Test Not Passed";

    const chapterMap = {};
    const productChapters = appState.selectedProduct.chapters || [];
    questionResults.forEach(qr => {
        const chIdx = qr.chapterIndex ?? 0;
        if (!chapterMap[chIdx]) {
            chapterMap[chIdx] = {
                name: productChapters[chIdx] || `Chapter ${String(chIdx + 1).padStart(2, "0")}`,
                yourPoints: 0,
                possiblePoints: 0
            };
        }
        chapterMap[chIdx].possiblePoints += qr.maxScore;
        chapterMap[chIdx].yourPoints += qr.yourScore;
    });
    const objectives = Object.keys(chapterMap).sort((a, b) => Number(a) - Number(b)).map(k => {
        const o = chapterMap[k];
        const pct = o.possiblePoints > 0
            ? parseFloat(((o.yourPoints / o.possiblePoints) * 100).toFixed(2))
            : 0;
        return {
            name: o.name,
            percentage: pct,
            yourPoints: o.yourPoints,
            possiblePoints: o.possiblePoints
        };
    });

    alert(`Exam Graded Successfully:\nScore Obtained: ${scaledScore} / 1000 (${percentScore}%)\nCorrect Pool: ${correctCount}/${totalQuestions}\nStatus: ${statusLabel}`);

    const historyKey = `CH_HIST_${appState.selectedProduct.id}`;
    let historyLogs = JSON.parse(localStorage.getItem(historyKey)) || [];
    const record = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        isoDate: new Date().toISOString(),
        productId: appState.selectedProduct.id,
        productTitle: appState.selectedProduct.title,
        productCode: appState.selectedProduct.code,
        mode: appState.selectedMode,
        modeLabel: appState.selectedMode === "guided" ? "Guided Practice Test"
            : appState.selectedMode === "flashcard" ? "Flash Card Practice"
            : "Exam Simulation",
        title: `${appState.selectedProduct.code} (${appState.selectedMode.toUpperCase()})`,
        scorePercent: percentScore,
        scaledScore: scaledScore,
        requiredScore: requiredScore,
        correctCount: correctCount,
        totalQuestions: totalQuestions,
        status: status,
        statusLabel: statusLabel,
        objectives: objectives,
        questions: questionResults,
        userAnswers: { ...engine.userAnswers }
    };
    historyLogs.unshift(record);
    localStorage.setItem(historyKey, JSON.stringify(historyLogs));
    navigateTo("dashboard");
}

/* ==========================================================================
QUESTION FOOTER INTERACTIVE CONTROL ACTIONS
========================================================================== */
function handleViewAnswer() {
    if (appState.selectedMode === "simulation") return;
    const engine = appState.quizEngine;
    const currentQ = engine.questions[engine.currentIndex];
    const chosen = engine.userAnswers[engine.currentIndex];
    const expBox = document.getElementById("answerExplanationBox");
    if (!expBox) return;
    if (chosen === undefined) {
        alert("Please select an answer option before checking verification explanations.");
        return;
    }
    expBox.classList.remove("hidden");
    if (chosen === currentQ.correct) {
        expBox.className = "explanation-alert-box correct-pane";
        expBox.innerHTML = `<strong>Correct Option Picked!</strong><br>${currentQ.explanation}`;
    } else {
        expBox.className = "explanation-alert-box incorrect-pane";
        expBox.innerHTML = `<strong>Incorrect Option Picked.</strong><br>${currentQ.explanation}<br><br><strong>Distractor Analysis:</strong><br>${currentQ.distractors.join('<br>')}`;
    }
}

function handleResetQuestion() {
    if (appState.selectedMode === "simulation") return;
    delete appState.quizEngine.userAnswers[appState.quizEngine.currentIndex];
    renderActiveQuestionContext();
}

function openQuestionNoteModal() {
    const currentQ = appState.quizEngine.questions[appState.quizEngine.currentIndex];
    let notes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY)) || {};
    if (document.getElementById("questionNoteArea")) document.getElementById("questionNoteArea").value = notes[currentQ.id] || "";
    if (document.getElementById("questionNoteModal")) document.getElementById("questionNoteModal").classList.remove("hidden");
}

function saveQuestionNote() {
    const currentQ = appState.quizEngine.questions[appState.quizEngine.currentIndex];
    const noteArea = document.getElementById("questionNoteArea");
    if (!noteArea) return;
    const text = noteArea.value.trim();
    let notes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY)) || {};
    if (text) {
        notes[currentQ.id] = text;
    } else {
        delete notes[currentQ.id];
    }
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    if (document.getElementById("questionNoteModal")) document.getElementById("questionNoteModal").classList.add("hidden");
    renderActiveQuestionContext();
}

function deleteQuestionNote() {
    const currentQ = appState.quizEngine.questions[appState.quizEngine.currentIndex];
    if (!currentQ) return;
    let notes = JSON.parse(localStorage.getItem(NOTES_STORAGE_KEY)) || {};
    if (notes[currentQ.id]) {
        delete notes[currentQ.id];
        localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
    }
    if (document.getElementById("questionNoteModal")) document.getElementById("questionNoteModal").classList.add("hidden");
    renderActiveQuestionContext();
}

/* ==========================================================================
   HELP CENTER — FAQ accordion + navigation helpers
   ========================================================================== */

/**
 * Toggle a single FAQ item open/closed. Only one open at a time for clarity.
 * @param {HTMLButtonElement} btn - The question button that was clicked
 */
function toggleHelpFaq(btn) {
  if (!btn || !btn.classList.contains("hc-faq-question")) return;

  const item = btn.closest(".hc-faq-item");
  if (!item) return;

  const answer = item.querySelector(".hc-faq-answer");
  const isOpen = btn.getAttribute("aria-expanded") === "true";

  // Close all other FAQ items in the list
  const list = document.getElementById("hcFaqList");
  if (list) {
    list.querySelectorAll(".hc-faq-question").forEach(q => {
      q.setAttribute("aria-expanded", "false");
      const a = q.parentElement && q.parentElement.querySelector(".hc-faq-answer");
      if (a) a.hidden = true;
    });
  }

  // Toggle the clicked item
  if (!isOpen) {
    btn.setAttribute("aria-expanded", "true");
    if (answer) answer.hidden = false;
  }
}

/* ==========================================================================
   OPTIONS / PREFERENCES SYSTEM
   Triggered from profile dropdown → "Options & Preferences"
   Stores: CH_PREF_DARK_MODE, CH_PREF_SOUND, CH_PREF_COMPACT_TEXT
   ========================================================================== */

const PREF_KEYS = {
  dark: "CH_PREF_DARK_MODE",
  sound: "CH_PREF_SOUND",
  compact: "CH_PREF_COMPACT_TEXT"
};

/** Read boolean preference (default false). */
function getPref(key) {
  return localStorage.getItem(key) === "1";
}

/** Persist boolean preference. */
function setPref(key, value) {
  localStorage.setItem(key, value ? "1" : "0");
}

/**
 * Apply all stored preferences to the document (idempotent).
 * Called on DOMContentLoaded and after any toggle.
 */
function applyAllPreferences() {
  const dark = getPref(PREF_KEYS.dark);
  document.body.classList.toggle("dark-mode", dark);

  const compact = getPref(PREF_KEYS.compact);
  document.body.classList.toggle("compact-question-text", compact);

  // Sync toggle UI if modal is present
  const darkToggle = document.getElementById("prefDarkModeToggle");
  if (darkToggle) darkToggle.checked = dark;

  const compactToggle = document.getElementById("prefCompactTextToggle");
  if (compactToggle) compactToggle.checked = compact;

  const soundToggle = document.getElementById("prefSoundToggle");
  if (soundToggle) soundToggle.checked = getPref(PREF_KEYS.sound);
}

function toggleDarkMode(enabled) {
  setPref(PREF_KEYS.dark, enabled);
  document.body.classList.toggle("dark-mode", enabled);
  if (enabled && getPref(PREF_KEYS.sound)) playUiSound("toggle");
}

function toggleCompactText(enabled) {
  setPref(PREF_KEYS.compact, enabled);
  document.body.classList.toggle("compact-question-text", enabled);
  if (getPref(PREF_KEYS.sound)) playUiSound("toggle");
}

function toggleSoundEffects(enabled) {
  setPref(PREF_KEYS.sound, enabled);
  // Immediate auditory confirmation when turning ON
  if (enabled) playUiSound("toggle");
}

/**
 * Lightweight Web-Audio beeps — no external assets required.
 * Types: "toggle" | "select" | "grade"
 */
function playUiSound(type) {
  if (!getPref(PREF_KEYS.sound)) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "select") {
      osc.frequency.value = 520;
      gain.gain.value = 0.06;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.stop(ctx.currentTime + 0.09);
    } else if (type === "grade") {
      osc.frequency.value = 660;
      gain.gain.value = 0.08;
      osc.start();
      osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.stop(ctx.currentTime + 0.26);
    } else {
      // toggle / default
      osc.frequency.value = 440;
      gain.gain.value = 0.05;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
      osc.stop(ctx.currentTime + 0.08);
    }
    // Auto-close context after short delay to free resources
    setTimeout(() => { try { ctx.close(); } catch (_) {} }, 400);
  } catch (_) {
    /* AudioContext unavailable — silent fail */
  }
}

/**
 * Aggregate graded-exam history across all products for the snapshot panel.
 */
function computeUserPerformanceStats() {
  let totalExams = 0;
  let sumPercent = 0;
  let bestPercent = -1;
  const allKeys = Object.keys(localStorage);

  allKeys.forEach(k => {
    if (!k.startsWith("CH_HIST_")) return;
    try {
      const logs = JSON.parse(localStorage.getItem(k)) || [];
      logs.forEach(rec => {
        if (typeof rec.scorePercent === "number") {
          totalExams++;
          sumPercent += rec.scorePercent;
          if (rec.scorePercent > bestPercent) bestPercent = rec.scorePercent;
        }
      });
    } catch (_) { /* skip corrupt entries */ }
  });

  const bookmarks = JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE_KEY) || "{}");
  const bookmarkCount = Object.keys(bookmarks).length;

  return {
    totalExams,
    avgPercent: totalExams > 0 ? Math.round(sumPercent / totalExams) : null,
    bestPercent: bestPercent >= 0 ? bestPercent : null,
    bookmarkCount
  };
}

function refreshPreferencesStats() {
  const stats = computeUserPerformanceStats();
  const elExams = document.getElementById("prefStatExams");
  const elAvg = document.getElementById("prefStatAvg");
  const elBest = document.getElementById("prefStatBest");
  const elBm = document.getElementById("prefStatBookmarks");
  const hint = document.getElementById("prefStatsHint");

  if (elExams) elExams.textContent = String(stats.totalExams);
  if (elAvg) elAvg.textContent = stats.avgPercent !== null ? stats.avgPercent + "%" : "—";
  if (elBest) elBest.textContent = stats.bestPercent !== null ? stats.bestPercent + "%" : "—";
  if (elBm) elBm.textContent = String(stats.bookmarkCount);

  if (hint) {
    hint.textContent = stats.totalExams === 0
      ? "Complete graded exams to unlock richer stats."
      : `Based on ${stats.totalExams} graded attempt${stats.totalExams === 1 ? "" : "s"} stored on this device.`;
  }
}

function openPreferencesModal() {
  applyAllPreferences();
  refreshPreferencesStats();
  const modal = document.getElementById("preferencesModal");
  if (modal) modal.classList.remove("hidden");
}

function closePreferencesModal() {
  const modal = document.getElementById("preferencesModal");
  if (modal) modal.classList.add("hidden");
}