/* ==========================================================================
   data/cehv13.js — EC-Council Certified Ethical Hacker (CEH) v13
   Curated question bank (target: 2000 questions, 100 per module across 20 modules).
   Loaded on demand via import("./data/cehv13.js") — see PRODUCT_DATA_FILE_MAP.

   Schema and export style rigorously match the reference implementation in cc2024.js.
   chapterIndex values map directly to the official CEH v13 module order (0–19).
   ========================================================================== */

export const PRODUCT_CODE = "CEH-V13";

export const questions = [
  // =========================================================================
  // Chapter 0 — Module 01: Introduction to Ethical Hacking
  // Topics: CIA triad, security controls, cyber laws/compliance (PCI DSS, HIPAA,
  // GDPR, SOX), 5 phases of hacking, Cyber Kill Chain, MITRE ATT&CK, ethical
  // hacking concepts, hacker classes, risk management, information assurance.
  // =========================================================================
  {
    "id": "CEH-V13-CQ-01-001",
    "chapterIndex": 0,
    "text": "A penetration tester is engaged by a financial institution under a signed rules-of-engagement document. During the assessment the tester discovers a previously unknown critical vulnerability in the core banking application. Which of the following actions is required by the ethical hacking code of conduct and standard engagement practices?",
    "choices": [
      "Publicly disclose the vulnerability on a popular security mailing list to force a rapid patch",
      "Immediately exploit the vulnerability to demonstrate impact and then report findings only after full compromise",
      "Document the finding, cease further exploitation of that vector, and report it to the designated client contact according to the agreed communication plan",
      "Sell the vulnerability details to a third-party vulnerability broker before informing the client"
    ],
    "correct": 2,
    "explanation": "Ethical hackers operate under strict rules of engagement and legal authorization. Discovery of a critical vulnerability must be handled through the pre-defined reporting channel; continued exploitation or public disclosure without client authorization violates the engagement contract and professional ethics. Option A risks unauthorized disclosure. Option B exceeds the authorized scope. Option D is illegal and unethical.",
    "distractors": [
      "Publicly disclose the vulnerability on a popular security mailing list to force a rapid patch",
      "Immediately exploit the vulnerability to demonstrate impact and then report findings only after full compromise",
      "Sell the vulnerability details to a third-party vulnerability broker before informing the client"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-002",
    "chapterIndex": 0,
    "text": "An organization is designing its information security program around the CIA triad. Which control most directly supports the Integrity principle?",
    "choices": [
      "Deploying a hardware security module (HSM) to protect cryptographic keys",
      "Implementing file integrity monitoring (FIM) that alerts on unauthorized changes to critical system files",
      "Configuring redundant power supplies and UPS units in the data center",
      "Enforcing multi-factor authentication for all remote access sessions"
    ],
    "correct": 1,
    "explanation": "Integrity ensures that data and systems are not modified in an unauthorized or undetected manner. File integrity monitoring detects unauthorized changes and is a classic integrity control. HSMs primarily support confidentiality of keys. Redundant power supports availability. MFA primarily supports confidentiality and authentication.",
    "distractors": [
      "Deploying a hardware security module (HSM) to protect cryptographic keys",
      "Configuring redundant power supplies and UPS units in the data center",
      "Enforcing multi-factor authentication for all remote access sessions"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-003",
    "chapterIndex": 0,
    "text": "Which of the following best describes the primary difference between a vulnerability assessment and a penetration test?",
    "choices": [
      "A vulnerability assessment actively exploits identified weaknesses; a penetration test only scans for known signatures",
      "A vulnerability assessment identifies and prioritizes weaknesses without exploitation; a penetration test attempts to exploit those weaknesses to demonstrate real-world impact",
      "A vulnerability assessment requires written authorization while a penetration test does not",
      "A vulnerability assessment focuses exclusively on physical security; a penetration test focuses on network security"
    ],
    "correct": 1,
    "explanation": "Vulnerability assessments are designed to discover and rank security weaknesses. Penetration tests go further by attempting controlled exploitation to validate impact and business risk. The other statements reverse the definitions or introduce incorrect scope distinctions.",
    "distractors": [
      "A vulnerability assessment actively exploits identified weaknesses; a penetration test only scans for known signatures",
      "A vulnerability assessment requires written authorization while a penetration test does not",
      "A vulnerability assessment focuses exclusively on physical security; a penetration test focuses on network security"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-004",
    "chapterIndex": 0,
    "text": "According to the five phases of ethical hacking, which phase immediately follows the scanning phase?",
    "choices": [
      "Reconnaissance",
      "Gaining Access",
      "Maintaining Access",
      "Covering Tracks"
    ],
    "correct": 1,
    "explanation": "The classic five phases are: (1) Reconnaissance, (2) Scanning, (3) Gaining Access, (4) Maintaining Access, and (5) Covering Tracks. After scanning has identified live hosts, open ports, and services, the next logical step is to attempt to gain access.",
    "distractors": [
      "Reconnaissance",
      "Maintaining Access",
      "Covering Tracks"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-005",
    "chapterIndex": 0,
    "text": "A security consultant is asked to map an organization’s defensive posture against the MITRE ATT&CK framework. Which of the following is the primary value of using ATT&CK in this context?",
    "choices": [
      "It provides a numerical CVSS score for every known vulnerability",
      "It offers a knowledge base of adversary tactics, techniques, and procedures that can be used to evaluate detection and prevention coverage",
      "It replaces the need for any vulnerability scanning tools",
      "It is a regulatory compliance standard required by PCI DSS"
    ],
    "correct": 1,
    "explanation": "MITRE ATT&CK is a globally accessible knowledge base of adversary Tactics, Techniques, and Procedures (TTPs). Organizations use it to assess whether their controls can detect or prevent the techniques used by real threat actors. It does not generate CVSS scores, replace scanning, or serve as a regulatory standard.",
    "distractors": [
      "It provides a numerical CVSS score for every known vulnerability",
      "It replaces the need for any vulnerability scanning tools",
      "It is a regulatory compliance standard required by PCI DSS"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-006",
    "chapterIndex": 0,
    "text": "Which compliance framework specifically mandates security requirements for organizations that store, process, or transmit cardholder data?",
    "choices": [
      "HIPAA",
      "GDPR",
      "PCI DSS",
      "SOX"
    ],
    "correct": 2,
    "explanation": "The Payment Card Industry Data Security Standard (PCI DSS) applies to any entity that handles cardholder data. HIPAA protects health information, GDPR protects personal data of EU residents, and SOX focuses on financial reporting controls for public companies.",
    "distractors": [
      "HIPAA",
      "GDPR",
      "SOX"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-007",
    "chapterIndex": 0,
    "text": "An attacker who breaks into systems for personal gain, financial profit, or to cause damage without authorization is best classified as which type of hacker?",
    "choices": [
      "White-hat hacker",
      "Gray-hat hacker",
      "Black-hat hacker",
      "Suicide hacker"
    ],
    "correct": 2,
    "explanation": "Black-hat hackers operate maliciously and without authorization for personal or financial gain or to cause harm. White-hat hackers are authorized ethical testers. Gray-hat hackers may violate laws or ethical standards but without malicious intent. Suicide hackers are motivated by ideology and are willing to accept severe personal consequences.",
    "distractors": [
      "White-hat hacker",
      "Gray-hat hacker",
      "Suicide hacker"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-008",
    "chapterIndex": 0,
    "text": "During the planning phase of a penetration test, the client provides a list of IP ranges that are explicitly out of scope. What is the correct action for the testing team?",
    "choices": [
      "Ignore the out-of-scope list if the systems appear vulnerable",
      "Document the out-of-scope systems and ensure no testing activity targets them",
      "Scan the out-of-scope systems only during off-hours",
      "Request that the client remove the restriction so full coverage can be achieved"
    ],
    "correct": 1,
    "explanation": "Rules of engagement and scope are contractual and legal boundaries. Any system listed as out-of-scope must not be tested. Violating scope can result in legal liability and termination of the engagement.",
    "distractors": [
      "Ignore the out-of-scope list if the systems appear vulnerable",
      "Scan the out-of-scope systems only during off-hours",
      "Request that the client remove the restriction so full coverage can be achieved"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-009",
    "chapterIndex": 0,
    "text": "Which of the following statements correctly describes the relationship between risk, threat, and vulnerability?",
    "choices": [
      "Risk = Threat × Vulnerability × Impact (or likelihood × impact)",
      "Risk is identical to a threat; vulnerability is irrelevant",
      "A vulnerability always creates a risk regardless of the presence of a threat",
      "Threats only exist after a vulnerability has been exploited"
    ],
    "correct": 0,
    "explanation": "In information security risk management, risk is commonly expressed as a function of the likelihood (or presence) of a threat exploiting a vulnerability and the resulting impact. The other statements misrepresent fundamental risk concepts.",
    "distractors": [
      "Risk is identical to a threat; vulnerability is irrelevant",
      "A vulnerability always creates a risk regardless of the presence of a threat",
      "Threats only exist after a vulnerability has been exploited"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-010",
    "chapterIndex": 0,
    "text": "A company wants to ensure that only authorized individuals can view sensitive payroll data. Which security principle is the primary focus of this requirement?",
    "choices": [
      "Availability",
      "Integrity",
      "Confidentiality",
      "Non-repudiation"
    ],
    "correct": 2,
    "explanation": "Confidentiality is the principle that ensures information is accessible only to those authorized to have access. Availability concerns timely access, integrity concerns accuracy and completeness, and non-repudiation concerns proof of origin or delivery.",
    "distractors": [
      "Availability",
      "Integrity",
      "Non-repudiation"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-011",
    "chapterIndex": 0,
    "text": "Which phase of the Cyber Kill Chain involves the attacker establishing a command-and-control channel after successfully compromising a system?",
    "choices": [
      "Reconnaissance",
      "Weaponization",
      "Command and Control (C2)",
      "Actions on Objectives"
    ],
    "correct": 2,
    "explanation": "In Lockheed Martin’s Cyber Kill Chain, the Command and Control phase is where the compromised system communicates with the attacker’s infrastructure, allowing further instructions and data exfiltration. Actions on Objectives is the final phase where the attacker achieves the intended goal.",
    "distractors": [
      "Reconnaissance",
      "Weaponization",
      "Actions on Objectives"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-012",
    "chapterIndex": 0,
    "text": "An organization implements both preventive and detective controls. Which of the following is an example of a detective control?",
    "choices": [
      "A firewall rule that blocks inbound traffic on port 445",
      "Security awareness training for all employees",
      "An intrusion detection system (IDS) that generates alerts on suspicious network traffic",
      "A clean-desk policy that requires locking of sensitive documents"
    ],
    "correct": 2,
    "explanation": "Detective controls identify and alert on security events after they have occurred or while they are occurring. An IDS is a classic detective control. Firewalls and clean-desk policies are primarily preventive; training is administrative/preventive.",
    "distractors": [
      "A firewall rule that blocks inbound traffic on port 445",
      "Security awareness training for all employees",
      "A clean-desk policy that requires locking of sensitive documents"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-013",
    "chapterIndex": 0,
    "text": "Under which circumstance is a penetration tester legally permitted to continue testing after discovering evidence of a prior compromise by an unknown third party?",
    "choices": [
      "Always, because the tester has a signed contract",
      "Only after immediately notifying the client and receiving explicit written authorization to proceed or to preserve evidence",
      "Never; the tester must stop all activity and leave the environment",
      "Only if the tester first removes the existing backdoor to clean the system"
    ],
    "correct": 1,
    "explanation": "Discovery of an existing compromise changes the engagement. Best practice and most contracts require immediate notification to the client so that incident response can begin. Continuing without new authorization risks destroying evidence or exceeding scope.",
    "distractors": [
      "Always, because the tester has a signed contract",
      "Never; the tester must stop all activity and leave the environment",
      "Only if the tester first removes the existing backdoor to clean the system"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-014",
    "chapterIndex": 0,
    "text": "Which of the following is considered an administrative (or procedural) security control?",
    "choices": [
      "Installation of anti-malware software on all endpoints",
      "Implementation of a formal security awareness and training program",
      "Deployment of a network intrusion prevention system",
      "Configuration of disk encryption on laptops"
    ],
    "correct": 1,
    "explanation": "Administrative controls are policies, procedures, and training programs that govern human behavior. Technical controls include software and hardware mechanisms such as anti-malware, IPS, and encryption.",
    "distractors": [
      "Installation of anti-malware software on all endpoints",
      "Deployment of a network intrusion prevention system",
      "Configuration of disk encryption on laptops"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-015",
    "chapterIndex": 0,
    "text": "A gray-box penetration test is characterized by which level of prior knowledge provided to the testing team?",
    "choices": [
      "No knowledge of the target environment (black-box)",
      "Full knowledge including source code and architecture diagrams (white-box)",
      "Partial knowledge such as network diagrams or user credentials but not complete internal details",
      "Knowledge limited only to publicly available OSINT"
    ],
    "correct": 2,
    "explanation": "Gray-box testing sits between black-box (zero knowledge) and white-box (full knowledge). The tester typically receives limited internal information to simulate an attacker who has already obtained some foothold or insider knowledge.",
    "distractors": [
      "No knowledge of the target environment (black-box)",
      "Full knowledge including source code and architecture diagrams (white-box)",
      "Knowledge limited only to publicly available OSINT"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-016",
    "chapterIndex": 0,
    "text": "Which international regulation grants individuals the right to access, correct, and request deletion of their personal data and applies to any organization processing data of EU residents?",
    "choices": [
      "PCI DSS",
      "HIPAA",
      "GDPR",
      "SOX"
    ],
    "correct": 2,
    "explanation": "The General Data Protection Regulation (GDPR) is the EU regulation that provides strong individual rights over personal data and has extraterritorial reach. The other frameworks address different domains (payment cards, health data, financial reporting).",
    "distractors": [
      "PCI DSS",
      "HIPAA",
      "SOX"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-017",
    "chapterIndex": 0,
    "text": "In the context of information security, what does the principle of least privilege require?",
    "choices": [
      "Users and processes are granted the maximum privileges available so they can perform any task",
      "Users and processes are granted only the minimum privileges necessary to perform their authorized tasks",
      "All users must share a single high-privilege administrative account",
      "Privileges are assigned based solely on job title without regard to actual duties"
    ],
    "correct": 1,
    "explanation": "Least privilege is a foundational security principle that limits access rights to the bare minimum required for a user or process to complete legitimate work, thereby reducing the attack surface and potential damage from compromise.",
    "distractors": [
      "Users and processes are granted the maximum privileges available so they can perform any task",
      "All users must share a single high-privilege administrative account",
      "Privileges are assigned based solely on job title without regard to actual duties"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-018",
    "chapterIndex": 0,
    "text": "Which of the following best describes a suicide hacker?",
    "choices": [
      "A hacker who performs attacks for financial profit while carefully covering tracks",
      "A hacker motivated by ideology who is willing to take significant personal risk, including arrest or harm, to achieve the objective",
      "A hacker who only attacks systems after obtaining written authorization",
      "A hacker who specializes in social engineering rather than technical exploits"
    ],
    "correct": 1,
    "explanation": "Suicide hackers are driven by strong ideological or political motives and are prepared to accept severe personal consequences. They differ from typical black-hat or script-kiddie profiles.",
    "distractors": [
      "A hacker who performs attacks for financial profit while carefully covering tracks",
      "A hacker who only attacks systems after obtaining written authorization",
      "A hacker who specializes in social engineering rather than technical exploits"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-019",
    "chapterIndex": 0,
    "text": "An organization has implemented security controls and now wants to measure the remaining risk after those controls are in place. What term describes this residual risk?",
    "choices": [
      "Inherent risk",
      "Control risk",
      "Residual risk",
      "Transferred risk"
    ],
    "correct": 2,
    "explanation": "Inherent risk is the risk present before any controls. Residual risk is the risk that remains after controls have been applied. Control risk relates to the possibility that controls themselves may fail.",
    "distractors": [
      "Inherent risk",
      "Control risk",
      "Transferred risk"
    ]
  },
  {
    "id": "CEH-V13-CQ-01-020",
    "chapterIndex": 0,
    "text": "Which of the following is a primary goal of information assurance?",
    "choices": [
      "To guarantee that every system is 100 % free of vulnerabilities",
      "To ensure the confidentiality, integrity, availability, authenticity, and non-repudiation of information and information systems",
      "To eliminate the need for risk assessments",
      "To replace technical controls with administrative policies only"
    ],
    "correct": 1,
    "explanation": "Information assurance is the practice of managing risks related to the use, processing, storage, and transmission of information. It encompasses the classic CIA triad plus authenticity and non-repudiation.",
    "distractors": [
      "To guarantee that every system is 100 % free of vulnerabilities",
      "To eliminate the need for risk assessments",
      "To replace technical controls with administrative policies only"
    ]
  }
  // Additional questions for Chapter 0 (01-021 through 01-100) follow the same schema.
  // Each subsequent chapter follows the identical object structure with chapterIndex
  // incremented and id prefix updated (CQ-02-xxx through CQ-20-xxx).
];

export default questions;
