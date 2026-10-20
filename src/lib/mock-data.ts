import { StudentProfile } from "./types";

export const DEFAULT_STUDENT: StudentProfile = {
  id: "student-alex-chen",
  username: "alexchen",
  fullName: "Alex Chen",
  headline: "Computer Science & Systems Undergraduate | Incoming SWE Intern",
  university: "UC Berkeley",
  degree: "B.S. in Electrical Engineering & Computer Sciences (EECS)",
  gradYear: "Class of 2026",
  gpa: "3.92 / 4.0",
  location: "Berkeley, CA & San Francisco",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  bio: "Third-year EECS student at UC Berkeley focused on distributed systems, operating systems, and backend infrastructure. I enjoy writing low-level systems in Rust and Go, debugging networking issues, and building reliable tools for developers. Previously researched high-performance machine learning systems at Berkeley AI Research (BAIR).",
  email: "alex.chen@berkeley.edu",
  category: "Computer Science & AI",
  status: "Seeking Summer 2026 Internship",
  verifiedStudent: true,
  cloudSyncStatus: "Synced",
  socials: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    website: "https://alexchen.dev",
    devpost: "https://devpost.com"
  },
  themeColor: "monochrome",
  stats: {
    profileViews: 4890,
    projectClicks: 1420,
    resumeDownloads: 310,
    recruiterPings: 24
  },
  settings: {
    enableTerminal: true,
    enableStoryMode: true,
    enableArchitectureSim: true,
    enableLandmarkPRs: true,
    enableSkillGraph: true,
    enableResumeDownload: true,
    enableContactForm: true,
    portfolioVisibility: "public",
    requireRecruiterCompany: true,
    notifyOnView: false,
    notifyOnResumeDownload: true,
    allowSearchIndexing: true,
  },
  projects: [
    {
      id: "proj-1",
      title: "OmniFlow: Distributed In-Memory Cache",
      slug: "omniflow-cache",
      tagline: "Fast multi-threaded in-memory key-value store written in Rust with gRPC support",
      description: "Designed and implemented a distributed in-memory cache in Rust featuring consistent hashing, concurrent LRU eviction, and gRPC endpoints. Benchmarked against Redis under heavy read/write workloads, maintaining sub-5ms p99 response times at 12,000 queries per second.",
      category: "Cloud & Systems Engineering",
      tags: ["Rust", "gRPC", "Docker", "Prometheus", "Distributed Systems"],
      githubUrl: "https://github.com/example/omniflow",
      liveUrl: "https://omniflow.demo.cloud",
      imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
      featured: true,
      metrics: "Sub-5ms p99 latency | 12k QPS benchmarked",
      architecture: "Rust server nodes communicating over gRPC with consistent hashing ring and Prometheus metrics export",
      cloudServices: ["Google Cloud Run", "Cloud Monitoring", "Artifact Registry"],
      completionDate: "Spring 2025",
      architectureNodes: [
        {
          id: "envoy_proxy",
          name: "Envoy Ingress Proxy",
          role: "Layer-7 reverse proxy handling client TLS termination, HTTP/2 multiplexing, and traffic rate-limiting.",
          tradeoffRationale: "Selected Envoy over NGINX due to native gRPC stream management, dynamic service discovery, and low jitter under 10k+ concurrent client connections.",
          latencyBenchmark: "0.4ms overhead",
          configSnippet: "static_resources:\n  listeners:\n  - name: grpc_listener\n    address: { socket_address: { address: 0.0.0.0, port_value: 50051 } }\n    filter_chains: [ { filters: [ { name: envoy.filters.network.http_connection_manager } ] } ]"
        },
        {
          id: "rust_engine",
          name: "Rust Cache Core (Lock-Free)",
          role: "Multi-threaded sharded hash map implementing lock-free epoch-based memory reclamation and LRU eviction.",
          tradeoffRationale: "Built in Rust using crossbeam-epoch rather than Go or Java to completely eliminate Garbage Collection (GC) pauses during throughput spikes.",
          latencyBenchmark: "0.9ms p99 retrieval",
          configSnippet: "pub struct ShardedCache<K, V> {\n    shards: Box<[CacheShard<K, V>]>,\n    hasher: RandomState,\n    capacity_per_shard: usize,\n}"
        },
        {
          id: "consensus_ring",
          name: "Consistent Hashing Ring",
          role: "Virtual node distribution protocol balancing cache partitions across 16 auto-scaled nodes.",
          tradeoffRationale: "Uses MurmurHash3 with 256 virtual nodes per server to reduce key redistribution to under 6% when cluster nodes join or leave dynamically.",
          latencyBenchmark: "1.2ms re-route",
          configSnippet: "pub fn get_node(&self, key: &[u8]) -> Option<&NodeId> {\n    let hash = self.hasher.hash_one(key);\n    self.ring.range(hash..).next().or_else(|| self.ring.iter().next()).map(|(_, id)| id)\n}"
        },
        {
          id: "wal_persistence",
          name: "Cloud Run NVMe Write-Ahead Log",
          role: "Buffered sequential disk logging guaranteeing zero data loss across ephemeral node restarts.",
          tradeoffRationale: "Employs an append-only ring buffer flushed via fsync every 10ms, decoupling write durability from the sub-millisecond client query path.",
          latencyBenchmark: "4.8ms flush window",
          configSnippet: "let mut wal = OpenOptions::new().create(true).append(true).open(&path)?;\nwal.write_all(&entry.encode_bytes())?;\nwal.sync_data()?;"
        }
      ],
      landmarkPRs: [
        {
          id: "pr-14",
          prNumber: 14,
          title: "perf: replace global Mutex with 64 sharded lock-free buckets",
          branch: "perf/sharded-lock-free-buckets",
          summary: "Identified that global mutex lock contention accounted for 64% of latency spikes above 5,000 QPS. Partitioned the core hash table into 64 atomic bucket shards.",
          diffSummary: "+94 lines, -28 lines",
          codeSnippet: {
            filename: "src/storage/cache_engine.rs",
            oldCode: "// Contended single lock across all readers and writers\npub struct CacheEngine<K, V> {\n    inner: Arc<Mutex<HashMap<K, CacheEntry<V>>>>,\n}",
            newCode: "// 64 independent shards partitioned by murmur3 key hash\npub struct CacheEngine<K, V> {\n    shards: Box<[RwLock<HashMap<K, CacheEntry<V>>>; 64]>,\n    eviction_queue: crossbeam::queue::SegQueue<K>,\n}"
          }
        },
        {
          id: "pr-22",
          prNumber: 22,
          title: "feat: zero-copy gRPC response streaming using Bytes memory slice",
          branch: "feat/zero-copy-streaming",
          summary: "Eliminated heap reallocation on every outbound cache read by referencing shared memory byte buffers directly instead of cloning raw vectors.",
          diffSummary: "+68 lines, -45 lines",
          codeSnippet: {
            filename: "src/network/grpc_service.rs",
            oldCode: "// Deep-cloning vector buffer on every request\nlet data_vec = entry.value.clone();\nOk(Response::new(GetReply { payload: data_vec }))",
            newCode: "// Zero-copy atomic ref-counted buffer slice\nlet payload_bytes = entry.value.slice_ref();\nOk(Response::new(GetReply { payload: payload_bytes }))"
          }
        }
      ]
    },
    {
      id: "proj-2",
      title: "NoteCraft: Collaborative Lecture Notes & Study Guides",
      slug: "notecraft-study",
      tagline: "Real-time lecture transcription and shared markdown study notes for university courses",
      description: "Built an open-source web application for students that synchronizes audio recordings, generates clean markdown notes, and builds interactive practice flashcards for exams. Won 1st place at Cal Hacks 11.0 and actively used by over 2,400 students across campus.",
      category: "Computer Science & AI",
      tags: ["Next.js", "TypeScript", "Python", "FastAPI", "WebSockets", "Firebase"],
      githubUrl: "https://github.com/example/notecraft",
      liveUrl: "https://notecraft.study",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
      featured: true,
      metrics: "1st Place Cal Hacks 11.0 Winner | 2,400+ active student users",
      architecture: "Audio streaming pipeline with Python backend, real-time sync with Firebase, and responsive Next.js frontend",
      cloudServices: ["Firebase Auth", "Cloud Firestore", "Cloud Functions", "Google Cloud Storage"],
      completionDate: "Winter 2024"
    },
    {
      id: "proj-3",
      title: "KubeCampus: Ephemeral Preview Environments",
      slug: "kubecampus",
      tagline: "Automated staging environments and preview URLs for student engineering teams",
      description: "Created a lightweight deployment tool that listens to GitHub webhooks and spins up temporary, isolated Kubernetes namespaces for student course projects. Includes automated preview URLs and disposable test databases, saving teams hours of manual setup each week.",
      category: "Cloud & Systems Engineering",
      tags: ["Go", "Kubernetes", "Terraform", "GitHub Actions", "Docker"],
      githubUrl: "https://github.com/example/kubecampus",
      liveUrl: "https://kubecampus.dev",
      imageUrl: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80",
      featured: false,
      metrics: "Saved 15+ hours/week across 12 student project teams",
      architecture: "Kubernetes cluster managed by a custom Go controller with automatic cleanup routines and preview routing",
      cloudServices: ["Google Kubernetes Engine (GKE)", "Cloud DNS", "Secret Manager"],
      completionDate: "Fall 2024"
    },
    {
      id: "proj-4",
      title: "PulseGrade: Peer Review & Code Grading Platform",
      slug: "pulsegrade",
      tagline: "Fair grading distribution and peer code review tool for large undergraduate courses",
      description: "Developed an automated peer-assessment platform for UC Berkeley's CS 61B (Data Structures). Uses statistical calibration to normalize student grader variance and highlight high-quality constructive feedback. Adopted by two engineering courses with over 800 enrolled students.",
      category: "Data Science & Analytics",
      tags: ["Python", "React", "PostgreSQL", "FastAPI", "Docker"],
      githubUrl: "https://github.com/example/pulsegrade",
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      featured: false,
      metrics: "Adopted by 2 EECS courses | 38% grading variance reduction",
      architecture: "FastAPI application with Celery asynchronous task queues and PostgreSQL database",
      cloudServices: ["Cloud SQL", "Compute Engine"],
      completionDate: "Spring 2024"
    }
  ],
  experiences: [
    {
      id: "exp-1",
      role: "Software Engineering Intern - Cloud Infrastructure",
      company: "Cloudflare",
      location: "San Francisco, CA",
      period: "Jun 2024 - Aug 2024",
      current: false,
      type: "Internship",
      bullets: [
        "Built an internal telemetry pipeline in Rust for edge caching nodes, processing 450,000 requests/sec with minimal memory footprint.",
        "Developed an automated synthetic canary testing daemon in Go to detect DNS routing anomalies before they affect users.",
        "Worked alongside senior engineers to profile TCP socket reuse, reducing cold-start connection latency by 18ms."
      ],
      skills: ["Rust", "Go", "Distributed Systems", "Cloudflare Workers", "Prometheus"]
    },
    {
      id: "exp-2",
      role: "Undergraduate Research Fellow",
      company: "Berkeley AI Research (BAIR)",
      location: "Berkeley, CA",
      period: "Jan 2024 - Present",
      current: true,
      type: "Research",
      bullets: [
        "Conducted research on speculative decoding and model distillation to run efficient language models on consumer hardware.",
        "Built reproducible PyTorch benchmarking suites across different quantization techniques (AWQ, INT4, GPTQ).",
        "Co-authored a research workshop paper on efficient attention mechanisms submitted to an academic venue."
      ],
      skills: ["PyTorch", "CUDA", "LLM Inference", "Benchmarking", "Python"]
    },
    {
      id: "exp-3",
      role: "Lead Systems Architect & Officer",
      company: "Cal Hacks (World's Largest Collegiate Hackathon)",
      location: "Berkeley, CA",
      period: "Sep 2023 - Present",
      current: true,
      type: "Campus Leadership",
      bullets: [
        "Led the engineering team responsible for web platforms and digital infrastructure supporting 2,800+ in-person participants and mentors.",
        "Built the real-time project judging and scoring submission portal with 99.99% uptime during peak concurrent voting."
      ],
      skills: ["Firebase", "Next.js", "System Design", "DevOps"]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science in Electrical Engineering & Computer Sciences (EECS)",
      period: "2022 - 2026 (Expected)",
      gpa: "3.92 / 4.0",
      location: "Berkeley, CA",
      honors: ["Dean's Honor List (All Semesters)", "Regents' and Chancellor's Scholar candidate", "Eta Kappa Nu (HKN) EECS Honor Society"],
      courses: [
        "CS 162: Operating Systems & System Programming",
        "CS 189: Introduction to Machine Learning",
        "CS 168: Introduction to the Internet: Architecture & Protocols",
        "CS 170: Efficient Algorithms & Intractable Problems",
        "EECS 126: Probability & Random Processes"
      ]
    }
  ],
  skills: [
    {
      name: "Cloud & Infrastructure",
      skills: ["Google Cloud Platform (GCP)", "Firebase / Firestore", "Docker & Kubernetes", "Terraform", "Serverless / Cloud Run", "CI/CD (GitHub Actions)"]
    },
    {
      name: "Programming Languages",
      skills: ["TypeScript / JavaScript", "Rust", "Python", "Go", "C / C++", "SQL"]
    },
    {
      name: "Frontend & Full-Stack",
      skills: ["Next.js (App Router)", "React 19", "Tailwind CSS", "Node.js", "FastAPI", "WebSockets / gRPC"]
    },
    {
      name: "AI & Data",
      skills: ["PyTorch", "Hugging Face", "Vector DBs (pgvector, Pinecone)", "LangChain", "Data Pipelines"]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      title: "Google Cloud Certified Associate Cloud Engineer",
      issuer: "Google Cloud",
      date: "Aug 2024",
      badge: "☁️ Certified GCP Engineer",
      verifyUrl: "https://cloud.google.com"
    },
    {
      id: "cert-2",
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "Nov 2023",
      badge: "🛡️ Solutions Architect",
      verifyUrl: "https://aws.amazon.com"
    }
  ],
  inquiries: [
    {
      id: "inq-1",
      senderName: "Sarah Jenkins",
      senderEmail: "sjenkins@google.com",
      company: "Google Cloud",
      roleOffered: "Software Engineering Intern (Systems Infrastructure)",
      message: "Hi Alex! We came across your portfolio and your OmniFlow key-value store project write-up. Our team in Sunnyvale works on cloud storage infrastructure and we would love to invite you to interview for our Summer 2026 cohort.",
      date: "Yesterday at 4:15 PM",
      status: "new"
    },
    {
      id: "inq-2",
      senderName: "David Miller",
      senderEmail: "dmiller@stripe.com",
      company: "Stripe",
      roleOffered: "Infrastructure Engineering Intern",
      message: "Hi Alex, really impressive work on KubeCampus and your Cal Hacks infrastructure setup. We're interviewing for Summer 2026 infrastructure interns and your project case studies stood out. Let us know if you have time to chat.",
      date: "3 days ago",
      status: "reviewed"
    }
  ],
  voiceNote: {
    id: "vn-alex-1",
    title: "Candidate Audio Pitch: OmniFlow Cache Architecture",
    topic: "Overcoming Mutex Contention under 12,000 QPS Load Bursts",
    duration: "0:46",
    durationSeconds: 46,
    audioUrl: "/audio/alexchen-omniflow.mp3",
    transcript: "Hi there! Thanks for checking out my portfolio. I wanted to share a quick walkthrough of OmniFlow, my flagship distributed in-memory cache project. When we were benchmarking under heavy bursts of 12,000 queries per second, our 99th percentile latency spiked up to 78 milliseconds. Profiling with perf and flame graphs revealed that mutual exclusion locks on our cache partition were causing severe CPU thread contention. To solve this, I restructured the storage engine in Rust into an epoch-based, lock-free ring buffer with hazard pointers. This dropped our tail latency down to 3.8 milliseconds at full throughput, with zero packet loss and 4.2x higher query density. Feel free to inspect the live architecture diagram and check out the key pull requests below!",
    keyTakeaway: "Redesigned storage engine using epoch-based lock-free ring buffers in Rust, reducing p99 latency from 78ms down to 3.8ms."
  },
  attestations: [
    {
      id: "attest-1",
      title: "UC Berkeley EECS Verified Degree & 3.92 GPA Attestation",
      category: "Academic & Degree",
      issuer: "UC Berkeley College of Engineering Registrar",
      issuerDomain: "eecs.berkeley.edu",
      issueDate: "Oct 2024",
      status: "Verified & Sealed",
      sha256Hash: "8f3a9e4b7c1d2e5f6a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f",
      gpgFingerprint: "4A9F 82BC 3D11 E7A2 90C4  FE88 B104 22D9 7C14 09B5",
      merkleProofRoot: "0x98f2c019b8823f6e1074a2cc8e903b1154fdc0",
      verificationBadge: "🏛️ Registrar Certified",
      claimDetails: "Attestation of active enrolled status in B.S. EECS with verified cumulative GPA 3.92/4.0 across 84 completed units."
    },
    {
      id: "attest-2",
      title: "AWS Certified Solutions Architect (Associate)",
      category: "Systems & Cloud",
      issuer: "Amazon Web Services (AWS Training & Certification)",
      issuerDomain: "aws.amazon.com",
      issueDate: "Nov 2023",
      status: "Verified & Sealed",
      sha256Hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      gpgFingerprint: "7B11 09DE C842 5A19 3301  99AE D321 0081 44F2 88C1",
      merkleProofRoot: "0xa102bc491024ee8109927cba1024bb883901ca",
      verificationBadge: "☁️ Certified AWS Architect",
      claimDetails: "Validated proficiency in resilient distributed systems architectures, multi-region failover, VPC security, and containerized deployments."
    },
    {
      id: "attest-3",
      title: "Cal Hacks 11.0 — 1st Place Overall Engineering Lead",
      category: "Code Integrity",
      issuer: "Cal Hacks Foundation Collegiate Council",
      issuerDomain: "calhacks.io",
      issueDate: "Oct 2024",
      status: "Verified & Sealed",
      sha256Hash: "c72e9a8f4b1d6e3c0a9b8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c",
      gpgFingerprint: "99C1 3302 44EA 8801 FE09  11B2 C804 9910 22D1 77A4",
      merkleProofRoot: "0x44f9102ca89011be77390184ca90123984ca01",
      verificationBadge: "🏆 Cal Hacks 1st Place",
      claimDetails: "Led 4-person engineering team building NoteCraft; verified commit signatures and repository submission logs."
    }
  ]
};

export const SHOWCASE_STUDENTS: StudentProfile[] = [
  DEFAULT_STUDENT,
  {
    id: "student-sophia-patel",
    username: "sophiapatel",
    fullName: "Sophia Patel",
    headline: "Product Designer & Frontend Developer | Stanford Junior",
    university: "Stanford University",
    degree: "B.S. in Symbolic Systems (HCI Track)",
    gradYear: "Class of 2026",
    gpa: "3.96 / 4.0",
    location: "Stanford, CA",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Undergraduate student in Symbolic Systems (Human-Computer Interaction) at Stanford. I care deeply about accessibility, clean typography, and building user interfaces that feel intuitive and responsive. When I'm not designing in Figma, I write React and TypeScript.",
    email: "spatel@stanford.edu",
    category: "Product Design & UI/UX",
    status: "Seeking Summer 2026 Internship",
    verifiedStudent: true,
    cloudSyncStatus: "Synced",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      website: "https://sophiapatel.design"
    },
    themeColor: "monochrome",
    stats: {
      profileViews: 6120,
      projectClicks: 2180,
      resumeDownloads: 430,
      recruiterPings: 31
    },
    projects: [
      {
        id: "proj-sp-1",
        title: "AuraUI: Accessible React Component Library",
        slug: "auraui",
        tagline: "An open-source design system and accessible component kit for student projects",
        description: "Designed and built an open-source component library in React with strict WCAG AAA color contrast compliance, keyboard navigation, and full screen-reader support. Created to help student teams build accessible hackathon projects quickly.",
        category: "Product Design & UI/UX",
        tags: ["Figma Tokens", "Tailwind CSS", "React", "Radix UI", "Storybook"],
        githubUrl: "https://github.com/example/auraui",
        liveUrl: "https://auraui.design",
        imageUrl: "https://images.unsplash.com/photo-1581291518655-9523c932dede?auto=format&fit=crop&w=800&q=80",
        featured: true,
        metrics: "4.5k GitHub Stars | Used by 30+ Hackathon Teams",
        architecture: "Cloudflare Pages deployment with automated Storybook test matrix",
        cloudServices: ["Cloud Storage", "Firebase Hosting"],
        completionDate: "Spring 2025"
      },
      {
        id: "proj-sp-2",
        title: "CogniFlow: Distraction-Free Study Dashboard",
        slug: "cogniflow",
        tagline: "A clean, calming task planner designed to help students focus without feeling overwhelmed",
        description: "Designed and conducted usability testing with 60 Stanford undergraduates to build a focus dashboard that uses progressive disclosure and gentle reminders to break down large assignments into manageable chunks.",
        category: "Product Design & UI/UX",
        tags: ["Next.js", "TypeScript", "User Research", "Figma", "UserTesting"],
        liveUrl: "https://cogniflow.study",
        imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        featured: true,
        metrics: "Published in Stanford Undergraduate HCI Research Journal",
        completionDate: "Fall 2024"
      }
    ],
    experiences: [
      {
        id: "exp-sp-1",
        role: "Product Design Intern",
        company: "Figma",
        location: "San Francisco, CA",
        period: "Jun 2024 - Aug 2024",
        current: false,
        type: "Internship",
        bullets: [
          "Prototyped collaborative canvas annotation tools for design systems teams.",
          "Conducted 18 moderated user interviews with Fortune 500 design leads.",
          "Refined color token contrast inspector now tested in Figma Beta."
        ],
        skills: ["Figma", "Design Systems", "Prototyping", "User Research"]
      }
    ],
    education: [
      {
        id: "edu-sp-1",
        institution: "Stanford University",
        degree: "B.S. in Symbolic Systems (Human-Computer Interaction)",
        period: "2022 - 2026",
        gpa: "3.96 / 4.0",
        location: "Stanford, CA",
        honors: ["Tau Beta Pi", "Stanford Undergraduate Research Fellow"],
        courses: ["CS 147: Human-Computer Interaction Design", "CS 247: Cross-Platform Interaction Design", "PSYCH 70: Social Psychology"]
      }
    ],
    skills: [
      {
        name: "Design & UX",
        skills: ["Figma & FigJam", "Design Systems", "Interaction Design", "User Testing", "WCAG Accessibility", "Wireframing"]
      },
      {
        name: "Frontend Code",
        skills: ["React / Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5 Canvas", "Git"]
      }
    ],
    certifications: [
      {
        id: "cert-sp-1",
        title: "Nielsen Norman Group UX Master Certified",
        issuer: "NN/g",
        date: "2024",
        badge: "🎨 NN/g Certified UX",
        verifyUrl: "https://nngroup.com"
      }
    ],
    inquiries: []
  },
  {
    id: "student-marcus-vance",
    username: "marcusvance",
    fullName: "Marcus Vance",
    headline: "Mathematics & Computer Science Student | MIT Junior",
    university: "Massachusetts Institute of Technology (MIT)",
    degree: "B.S. in Mathematics & Computer Science (Course 18C)",
    gradYear: "Class of 2026",
    gpa: "4.0 / 4.0",
    location: "Cambridge, MA",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Junior at MIT studying Mathematics and Computer Science (Course 18C). Interested in numerical algorithms, scientific computing, and high-performance computing clusters. I enjoy translating complex mathematical theory into fast, clean C++ and Python code.",
    email: "mvance@mit.edu",
    category: "Data Science & Analytics",
    status: "Open to Research Fellowships",
    verifiedStudent: true,
    cloudSyncStatus: "Synced",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://marcusvance.mit.edu"
    },
    themeColor: "monochrome",
    stats: {
      profileViews: 3890,
      projectClicks: 1100,
      resumeDownloads: 195,
      recruiterPings: 19
    },
    projects: [
      {
        id: "proj-mv-1",
        title: "QuantumSim: High-Performance Error Correction Simulator",
        slug: "quantumsim-sim",
        tagline: "A fast C++ simulation and syndrome decoder for quantum error-correcting codes",
        description: "Implemented a high-performance surface code decoder in modern C++ with OpenMP parallelization and Python bindings. Achieved a 25x speedup compared to standard baseline libraries during benchmark runs on university compute clusters.",
        category: "Data Science & Analytics",
        tags: ["C++20", "Python", "Google Cloud BigQuery", "NumPy", "OpenMP"],
        githubUrl: "https://github.com/example/quantumsim",
        liveUrl: "https://quantumsim.mit.edu",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
        featured: true,
        metrics: "25x faster decoding throughput over standard PyMatching baseline",
        cloudServices: ["Compute Engine HPC", "BigQuery ML"],
        completionDate: "Spring 2025"
      }
    ],
    experiences: [
      {
        id: "exp-mv-1",
        role: "Quantum Computing Research Assistant",
        company: "MIT Center for Theoretical Physics",
        location: "Cambridge, MA",
        period: "Sep 2023 - Present",
        current: true,
        type: "Research",
        bullets: [
          "Developed Clifford group numerical simulation routines on university cluster nodes.",
          "Analyzed noisy intermediate-scale quantum gate fidelity distributions under varied decoherence models."
        ],
        skills: ["Quantum Circuits", "Python", "Linear Algebra", "Scientific Computing"]
      }
    ],
    education: [
      {
        id: "edu-mv-1",
        institution: "MIT",
        degree: "B.S. in Mathematics and Computer Science (18C)",
        period: "2022 - 2026",
        gpa: "4.0 / 4.0",
        location: "Cambridge, MA",
        honors: ["Putnam Competition Top 100", "MIT Peter J. Eloranta Fellow"],
        courses: ["18.701: Abstract Algebra", "6.1220: Design and Analysis of Algorithms", "18.435: Quantum Computation"]
      }
    ],
    skills: [
      {
        name: "Mathematical & Scientific Tools",
        skills: ["Python (NumPy, SciPy, Pandas)", "PyTorch", "C++", "R", "Julia", "LaTeX"]
      },
      {
        name: "Cloud & Data Engineering",
        skills: ["Google BigQuery", "Cloud Storage", "Slurm / HPC Clusters", "PostgreSQL", "Docker"]
      }
    ],
    certifications: [],
    inquiries: []
  },
  {
    id: "student-elena-rostova",
    username: "elenarostova",
    fullName: "Elena Rostova",
    headline: "Robotics & Embedded Systems Engineering Student | Carnegie Mellon",
    university: "Carnegie Mellon University",
    degree: "B.S. in Mechanical Engineering & Robotics Minor",
    gradYear: "Class of 2026",
    gpa: "3.89 / 4.0",
    location: "Pittsburgh, PA",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    bio: "Third-year Mechanical Engineering and Robotics student at CMU. Passionate about autonomous navigation, sensor fusion (LiDAR, cameras, IMUs), and writing robust C++ firmware for mobile robots and inspection vehicles.",
    email: "erostova@andrew.cmu.edu",
    category: "Biotech & Robotics",
    status: "Available for Full-Time Roles",
    verifiedStudent: true,
    cloudSyncStatus: "Synced",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://elenarostova.dev"
    },
    themeColor: "monochrome",
    stats: {
      profileViews: 2950,
      projectClicks: 940,
      resumeDownloads: 140,
      recruiterPings: 15
    },
    projects: [
      {
        id: "proj-er-1",
        title: "AeroNav: Real-Time LiDAR & Visual Odometry",
        slug: "aeronav-odometry",
        tagline: "Sub-centimeter drone localization for GPS-denied environments",
        description: "Engineered a visual-inertial odometry and point cloud mapping system for micro-aerial vehicles navigating underground tunnels. Deployed and validated on an NVIDIA Jetson embedded board during testing in CMU research facilities.",
        category: "Biotech & Robotics",
        tags: ["ROS2 Humble", "C++", "OpenCV", "GTSAM", "NVIDIA Jetson"],
        githubUrl: "https://github.com/example/aeronav",
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
        featured: true,
        metrics: "Field-tested in CMU test tunnels | Drift under 0.8cm per 100 meters",
        completionDate: "Spring 2025"
      }
    ],
    experiences: [
      {
        id: "exp-er-1",
        role: "Robotics Firmware Intern",
        company: "Boston Dynamics",
        location: "Waltham, MA",
        period: "Jun 2024 - Aug 2024",
        current: false,
        type: "Internship",
        bullets: [
          "Developed embedded CAN-bus communication firmware for hydraulic actuation sensor modules.",
          "Wrote automated hardware-in-the-loop (HIL) test suites in Python for joint motor controllers."
        ],
        skills: ["C", "C++", "FreeRTOS", "CAN Bus", "Control Theory"]
      }
    ],
    education: [
      {
        id: "edu-er-1",
        institution: "Carnegie Mellon University",
        degree: "B.S. in Mechanical Engineering, Minor in Robotics",
        period: "2022 - 2026",
        gpa: "3.89 / 4.0",
        location: "Pittsburgh, PA",
        honors: ["CMU Tartans Innovation Award", "Society of Women Engineers Officer"],
        courses: ["16-384: Robot Kinematics and Dynamics", "16-720: Computer Vision", "24-334: Microcontroller Systems"]
      }
    ],
    skills: [
      {
        name: "Robotics & Embedded",
        skills: ["ROS / ROS2", "C++ / C", "NVIDIA Isaac Sim", "Embedded Linux", "MATLAB & Simulink", "CAD (SolidWorks)"]
      }
    ],
    certifications: [],
    inquiries: []
  },
  {
    id: "student-lucas-dubois",
    username: "lucasdubois",
    fullName: "Lucas Dubois",
    headline: "Systems & Cloud Security Student | Harvard Senior",
    university: "Harvard University",
    degree: "A.B. in Computer Science & Applied Mathematics",
    gradYear: "Class of 2026",
    gpa: "3.95 / 4.0",
    location: "Cambridge, MA & New York",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Senior at Harvard studying Computer Science and Applied Mathematics. Interested in operating systems, network protocols, and Linux kernel programming. I build high-performance network filters and security monitoring tools using eBPF and Rust.",
    email: "ldubois@college.harvard.edu",
    category: "Computer Science & AI",
    status: "Seeking Summer 2026 Internship",
    verifiedStudent: true,
    cloudSyncStatus: "Synced",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://lucasdubois.dev"
    },
    themeColor: "monochrome",
    stats: {
      profileViews: 4120,
      projectClicks: 1350,
      resumeDownloads: 280,
      recruiterPings: 22
    },
    projects: [
      {
        id: "proj-ld-1",
        title: "KubeShield: eBPF Network Monitor & Security Filter",
        slug: "kubeshield-ebpf",
        tagline: "High-throughput kernel-level packet inspection for container clusters",
        description: "Developed custom eBPF programs running inside the Linux kernel to monitor network traffic and detect abnormal connection patterns across container workloads with less than 1 microsecond of latency per packet.",
        category: "Cloud & Systems Engineering",
        tags: ["C", "Rust", "eBPF", "Kubernetes", "Linux Kernel"],
        githubUrl: "https://github.com/example/kubeshield",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        featured: true,
        metrics: "Filtered 4.2M packets/sec with sub-1 microsecond overhead",
        completionDate: "Fall 2025"
      }
    ],
    experiences: [
      {
        id: "exp-ld-1",
        role: "Cloud Security Engineering Intern",
        company: "Cloudflare",
        location: "Austin, TX",
        period: "Jun 2024 - Aug 2024",
        current: false,
        type: "Internship",
        bullets: [
          "Engineered automated rate-limiting policies for edge reverse proxies handling 50M+ RPS.",
          "Integrated TLS 1.3 zero-RTT validation with distributed token bucket state."
        ],
        skills: ["Rust", "eBPF", "Linux", "Anycast CDN"]
      }
    ],
    education: [
      {
        id: "edu-ld-1",
        institution: "Harvard University",
        degree: "A.B. in Computer Science",
        period: "2022 - 2026",
        gpa: "3.95 / 4.0",
        location: "Cambridge, MA",
        honors: ["John Harvard Scholar", "Harvard Undergraduate Cybersecurity Club President"],
        courses: ["CS 161: Operating Systems", "CS 262: Distributed Computing", "AM 205: Advanced Scientific Computing"]
      }
    ],
    skills: [
      {
        name: "Systems & Cloud Security",
        skills: ["eBPF / XDP", "Rust & C", "Linux Kernel", "Kubernetes & Docker", "WireGuard", "Terraform"]
      }
    ],
    certifications: [],
    inquiries: []
  },
  {
    id: "student-maya-lin",
    username: "mayalin",
    fullName: "Maya Lin",
    headline: "Applied Physics & Computer Science Student | Caltech Junior",
    university: "Caltech",
    degree: "B.S. in Applied Physics & Computer Science",
    gradYear: "Class of 2026",
    gpa: "3.98 / 4.0",
    location: "Pasadena, CA",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
    bio: "Junior at Caltech studying Applied Physics and Computer Science. Undergraduate researcher exploring tensor network simulations and quantum circuit compilation. Passionate about scientific computing and GPU acceleration.",
    email: "mlin@caltech.edu",
    category: "Data Science & Analytics",
    status: "Open to Research Fellowships",
    verifiedStudent: true,
    cloudSyncStatus: "Synced",
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://mayalin.caltech.edu"
    },
    themeColor: "monochrome",
    stats: {
      profileViews: 3410,
      projectClicks: 1120,
      resumeDownloads: 195,
      recruiterPings: 18
    },
    projects: [
      {
        id: "proj-ml-1",
        title: "TensorQ: GPU-Accelerated Quantum Circuit Simulator",
        slug: "tensorq-compiler",
        tagline: "Simulating multi-qubit entanglement dynamics using tensor contractions on GPU clusters",
        description: "Built an optimized tensor network contraction engine using Julia and CUDA to simulate quantum circuits. Benchmarked simulations across GPU nodes, achieving an 18x speedup over standard CPU statevector methods.",
        category: "Data Science & Analytics",
        tags: ["Julia", "CUDA / C++", "CuQuantum", "Python", "HPC MPI"],
        githubUrl: "https://github.com/example/tensorq",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
        featured: true,
        metrics: "18x speedup on 50-qubit circuit simulations on university HPC cluster",
        completionDate: "Spring 2025"
      }
    ],
    experiences: [
      {
        id: "exp-ml-1",
        role: "Quantum Software Research Fellow",
        company: "NASA Jet Propulsion Laboratory (JPL)",
        location: "Pasadena, CA",
        period: "Jun 2024 - Aug 2024",
        current: false,
        type: "Research",
        bullets: [
          "Benchmarked quantum annealing heuristics against deep space communication routing graphs.",
          "Published conference paper on graph partitioning algorithms with QAOA."
        ],
        skills: ["Quantum Computing", "Python", "C++", "High Performance Computing"]
      }
    ],
    education: [
      {
        id: "edu-ml-1",
        institution: "Caltech",
        degree: "B.S. in Applied Physics & CS",
        period: "2022 - 2026",
        gpa: "3.98 / 4.0",
        location: "Pasadena, CA",
        honors: ["Goldwater Scholar 2025", "Caltech SURF Fellow", "Putnam Competition Top 100"],
        courses: ["Ph 125: Quantum Mechanics", "CS 138: Algorithms", "APh 114: Physics of Quantum Information"]
      }
    ],
    skills: [
      {
        name: "Quantum & Scientific Computing",
        skills: ["Qiskit & Cirq", "Julia", "C++ / CUDA", "PyTorch", "Tensor Networks", "MPI / SLURM"]
      }
    ],
    certifications: [],
    inquiries: []
  }
];
