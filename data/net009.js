/* ==========================================================================
   data/net009.js — CompTIA Network+ (N10-009 / NET009)
   Curated question bank for this product. Loaded on demand via
   import("./data/net009.js") — see PRODUCT_DATA_FILE_MAP in app.js.

   NOTE: This file demonstrates the pattern with one hand-written,
   real question per chapter (12 of 100). Extend by adding more objects
   with the same shape until you reach the target of 100 per product,
   distributing chapterIndex according to real exam-objective weighting.
   ========================================================================== */

export const PRODUCT_CODE = "N10-009";

export const questions = [
  {
    id: "N10-009-CQ-01-001",
    chapterIndex: 0,
    text: "Which OSI layer is responsible for logical addressing and routing between different networks?",
    choices: ["Network layer", "Data Link layer", "Transport layer", "Session layer"],
    correct: 0,
    explanation: "The Network layer (Layer 3) handles logical addressing (IP) and routing decisions between networks.",
    distractors: [
      "Data Link handles MAC addressing and framing on a single segment, not inter-network routing.",
      "Transport manages end-to-end delivery and segmentation, above the routing layer.",
      "Session manages dialog control between applications, unrelated to routing."
    ]
  },
  {
    id: "N10-009-CQ-02-001",
    chapterIndex: 1,
    text: "A network technician needs a topology that offers the highest fault tolerance by giving every node a direct connection to every other node. Which topology should they choose?",
    choices: ["Mesh", "Bus", "Ring", "Star"],
    correct: 0,
    explanation: "A full mesh topology connects every node directly to every other node, so no single link failure isolates a device.",
    distractors: [
      "Bus relies on a single shared backbone, a single point of failure.",
      "Ring failures can disrupt the whole loop unless dual-ring redundancy exists.",
      "Star depends entirely on the central switch or hub."
    ]
  },
  {
    id: "N10-009-CQ-03-001",
    chapterIndex: 2,
    text: "How many usable host addresses are available in the 192.168.10.0/27 subnet?",
    choices: ["30", "32", "62", "14"],
    correct: 0,
    explanation: "/27 yields 32 total addresses; subtracting the network and broadcast addresses leaves 30 usable hosts.",
    distractors: [
      "32 is the total block size, not the usable host count.",
      "62 usable hosts corresponds to a /26 subnet.",
      "14 usable hosts corresponds to a /28 subnet."
    ]
  },
  {
    id: "N10-009-CQ-04-001",
    chapterIndex: 3,
    text: "Which port is used by default for unencrypted HTTP web traffic?",
    choices: ["80", "443", "21", "25"],
    correct: 0,
    explanation: "Port 80 is the standard well-known port for plaintext HTTP.",
    distractors: [
      "443 is used for HTTPS (TLS-encrypted HTTP).",
      "21 is the FTP control port.",
      "25 is used for SMTP mail relay."
    ]
  },
  {
    id: "N10-009-CQ-05-001",
    chapterIndex: 4,
    text: "What is the primary purpose of Spanning Tree Protocol (STP) on a switched network?",
    choices: [
      "Preventing Layer 2 loops among redundant switch links",
      "Assigning IP addresses dynamically to hosts",
      "Encrypting traffic between switches",
      "Load balancing traffic across WAN links"
    ],
    correct: 0,
    explanation: "STP blocks redundant paths to prevent broadcast storms and MAC table instability caused by Layer 2 loops.",
    distractors: [
      "Dynamic IP assignment is the role of DHCP, not STP.",
      "STP does not provide encryption of any kind.",
      "WAN load balancing is handled by routing or link-aggregation protocols, not STP."
    ]
  },
  {
    id: "N10-009-CQ-06-001",
    chapterIndex: 5,
    text: "Which wireless standard operates using both the 2.4GHz and 5GHz bands and introduced MU-MIMO for downlink traffic?",
    choices: ["802.11ac", "802.11b", "802.11a", "802.11g"],
    correct: 0,
    explanation: "802.11ac (Wi-Fi 5) primarily operates in 5GHz and introduced downlink MU-MIMO; many deployments pair it with 2.4GHz radios for compatibility.",
    distractors: [
      "802.11b operates only in 2.4GHz and predates MU-MIMO.",
      "802.11a operates only in 5GHz and predates MU-MIMO.",
      "802.11g operates only in 2.4GHz with no MU-MIMO support."
    ]
  },
  {
    id: "N10-009-CQ-07-001",
    chapterIndex: 6,
    text: "In a virtualized data center, what component is responsible for allocating physical CPU, memory, and storage resources to guest virtual machines?",
    choices: ["Hypervisor", "vNIC", "Storage area network switch", "Load balancer"],
    correct: 0,
    explanation: "The hypervisor abstracts and allocates physical hardware resources among the virtual machines it hosts.",
    distractors: [
      "A vNIC is a virtual network interface, not a resource scheduler.",
      "A SAN switch handles storage-network connectivity, not compute allocation.",
      "A load balancer distributes traffic across servers, not hardware resources within a host."
    ]
  },
  {
    id: "N10-009-CQ-08-001",
    chapterIndex: 7,
    text: "Which monitoring protocol is most commonly used to collect performance metrics (CPU, interface utilization) from network devices via polling?",
    choices: ["SNMP", "SMTP", "SIP", "NTP"],
    correct: 0,
    explanation: "SNMP (Simple Network Management Protocol) is the standard protocol for polling device metrics and receiving traps.",
    distractors: [
      "SMTP is an email transport protocol.",
      "SIP is used for VoIP session signaling.",
      "NTP synchronizes device clocks, not performance metrics."
    ]
  },
  {
    id: "N10-009-CQ-09-001",
    chapterIndex: 8,
    text: "Which device is specifically designed to inspect traffic at the application layer and enforce granular security policies based on application signatures?",
    choices: ["Next-Generation Firewall (NGFW)", "Hub", "Layer 2 switch", "Repeater"],
    correct: 0,
    explanation: "An NGFW performs deep packet inspection and can identify and control traffic by application, not just port/protocol.",
    distractors: [
      "A hub blindly repeats signals with no inspection capability.",
      "A Layer 2 switch forwards based on MAC address, not application content.",
      "A repeater simply regenerates a signal at the physical layer."
    ]
  },
  {
    id: "N10-009-CQ-10-001",
    chapterIndex: 9,
    text: "What is the primary benefit of maintaining an accurate network baseline?",
    choices: [
      "It provides a reference point to identify abnormal performance or behavior",
      "It automatically remediates detected faults",
      "It replaces the need for device documentation",
      "It encrypts management traffic by default"
    ],
    correct: 0,
    explanation: "A baseline captures normal operating conditions so deviations can be quickly recognized as potential issues.",
    distractors: [
      "Baselines are diagnostic references; they don't perform automated remediation.",
      "Baselines complement, not replace, configuration and topology documentation.",
      "Baselining is unrelated to encryption of management channels."
    ]
  },
  {
    id: "N10-009-CQ-11-001",
    chapterIndex: 10,
    text: "A user reports intermittent connectivity loss. Using the standard troubleshooting methodology, what should a technician do immediately after identifying the problem?",
    choices: [
      "Establish a theory of probable cause",
      "Document the resolution",
      "Implement the solution",
      "Close the ticket"
    ],
    correct: 0,
    explanation: "The standard methodology moves from identifying the problem to establishing a theory of probable cause before testing that theory.",
    distractors: [
      "Documentation happens after the issue is resolved and verified.",
      "Implementing a solution comes only after the theory is tested and confirmed.",
      "Closing the ticket is the final step, done after verifying full system functionality."
    ]
  },
  {
    id: "N10-009-CQ-12-001",
    chapterIndex: 11,
    text: "A switch port intended for a single workstation is instead receiving traffic from an unauthorized switch that a user connected, causing a broadcast storm. Which practice would have prevented this?",
    choices: [
      "Disabling unused ports and applying port security",
      "Increasing the VLAN count",
      "Enabling a routing protocol",
      "Lowering the DHCP lease time"
    ],
    correct: 0,
    explanation: "Port security and disabling unused access ports prevents rogue devices, such as unauthorized switches, from being connected.",
    distractors: [
      "Adding more VLANs doesn't stop an unauthorized device from being physically connected.",
      "Routing protocols operate above Layer 2 loop/rogue-device issues.",
      "DHCP lease time affects address reuse, not physical port access control."
    ]
  }

  // Continue adding curated questions here, following the same chapterIndex
  // distribution, until the file reaches 100 total questions for NET009.
];

export default questions;
