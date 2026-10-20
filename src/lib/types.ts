export type StudentCategory = 
  | "All"
  | "Computer Science & AI"
  | "Product Design & UI/UX"
  | "Data Science & Analytics"
  | "Cloud & Systems Engineering"
  | "Biotech & Robotics";

export interface ArchitectureNode {
  id: string;
  name: string;
  role: string;
  tradeoffRationale: string;
  latencyBenchmark: string;
  configSnippet?: string;
}

export interface LandmarkPR {
  id: string;
  prNumber: number;
  title: string;
  branch: string;
  summary: string;
  diffSummary: string;
  codeSnippet: {
    filename: string;
    oldCode?: string;
    newCode: string;
  };
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl: string;
  featured: boolean;
  metrics?: string;
  architecture?: string;
  cloudServices?: string[];
  completionDate?: string;
  architectureNodes?: ArchitectureNode[];
  landmarkPRs?: LandmarkPR[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  bullets: string[];
  skills: string[];
  type: "Internship" | "Research" | "Campus Leadership" | "Part-time";
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  gpa: string;
  honors: string[];
  courses: string[];
  location: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  badge: string;
  verifyUrl?: string;
}

export interface RecruiterInquiry {
  id: string;
  senderName: string;
  senderEmail: string;
  company: string;
  roleOffered: string;
  message: string;
  date: string;
  status: "new" | "reviewed";
}

export interface VoiceNote {
  id: string;
  title: string;
  topic: string;
  duration: string;
  durationSeconds: number;
  transcript: string;
  keyTakeaway: string;
  audioUrl?: string;
}

export interface CryptographicAttestation {
  id: string;
  title: string;
  category: "Academic & Degree" | "Systems & Cloud" | "Code Integrity";
  issuer: string;
  issuerDomain: string;
  issueDate: string;
  status: "Verified & Sealed";
  sha256Hash: string;
  gpgFingerprint: string;
  merkleProofRoot: string;
  verificationBadge: string;
  claimDetails: string;
}

export interface StudentProfile {
  id: string;
  username: string;
  fullName: string;
  headline: string;
  university: string;
  degree: string;
  gradYear: string;
  gpa: string;
  location: string;
  avatar: string;
  banner?: string;
  bio: string;
  email: string;
  phone?: string;
  category: StudentCategory;
  status: "Seeking Summer 2026 Internship" | "Available for Full-Time Roles" | "Open to Research Fellowships";
  verifiedStudent: boolean;
  cloudSyncStatus: "Synced" | "Pending" | "Local Draft";
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    devpost?: string;
  };
  themeColor: "monochrome" | "obsidian" | "minimal";
  stats: {
    profileViews: number;
    projectClicks: number;
    resumeDownloads: number;
    recruiterPings: number;
  };
  projects: Project[];
  experiences: Experience[];
  education: Education[];
  skills: SkillCategory[];
  certifications: Certification[];
  inquiries: RecruiterInquiry[];
  voiceNote?: VoiceNote;
  attestations?: CryptographicAttestation[];
  settings?: PortfolioSettings;
}

export interface PortfolioSettings {
  enableTerminal: boolean;          // Developer CLI (~/term: student-sh)
  enableStoryMode: boolean;         // 60-second Recruiter Story Mode
  enableVoiceNote?: boolean;        // Candidate 30s Audio Walkthrough
  enableAttestations?: boolean;     // Cryptographic Proof-of-Work Badges
  enableArchitectureSim: boolean;   // Interactive Architecture & Traffic Simulation
  enableLandmarkPRs: boolean;       // Milestone PRs & Code Diff Forensics
  enableSkillGraph: boolean;        // Evidence-linked Skill Context Graph
  enableResumeDownload: boolean;    // 1-Click ATS Resume PDF Generator
  enableContactForm: boolean;       // Recruiter Interview Inquiry Form
  portfolioVisibility: "public" | "unlisted" | "private"; // Access level
  accessCode?: string;              // Optional passcode for private portfolios
  requireRecruiterCompany: boolean; // Require verified company for inquiries
  notifyOnView: boolean;            // Alert when someone views portfolio
  notifyOnResumeDownload: boolean;  // Alert when resume is downloaded
  allowSearchIndexing: boolean;     // Allow Google / SEO indexing
  customDomain?: string;            // Custom Apex or CNAME domain
}
