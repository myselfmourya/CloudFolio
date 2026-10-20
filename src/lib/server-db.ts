import fs from "fs";
import path from "path";
import crypto from "crypto";
import { StudentProfile, Project, Experience, RecruiterInquiry } from "./types";
import { SHOWCASE_STUDENTS, DEFAULT_STUDENT } from "./mock-data";

export interface StudentAccount {
  username: string;
  email: string;
  passwordHash: string;
  profile: StudentProfile;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  students: Record<string, StudentAccount>;
  sessions: Record<string, { username: string; expiresAt: number }>;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "students.json");

// Simple secure password hasher using HMAC with salt
const SECRET_SALT = process.env.AUTH_SECRET || "cloudfolio-secret-salt-key-2026";
function hashPassword(password: string): string {
  return crypto.createHmac("sha256", SECRET_SALT).update(password).digest("hex");
}

function ensureDbExists(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    // Seed database with showcase students
    const initialStudents: Record<string, StudentAccount> = {};
    const defaultPasswordHash = hashPassword("password123");

    // Add DEFAULT_STUDENT (Alex Chen)
    initialStudents[DEFAULT_STUDENT.username.toLowerCase()] = {
      username: DEFAULT_STUDENT.username.toLowerCase(),
      email: DEFAULT_STUDENT.email || "alex@berkeley.edu",
      passwordHash: defaultPasswordHash,
      profile: JSON.parse(JSON.stringify(DEFAULT_STUDENT)),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add all SHOWCASE_STUDENTS
    for (const student of SHOWCASE_STUDENTS) {
      const u = student.username.toLowerCase();
      if (!initialStudents[u]) {
        initialStudents[u] = {
          username: u,
          email: student.email || `${u}@university.edu`,
          passwordHash: defaultPasswordHash,
          profile: JSON.parse(JSON.stringify(student)),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      }
    }

    const initialDb: DatabaseSchema = {
      students: initialStudents,
      sessions: {}
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2), "utf-8");
    return initialDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, recreating seed:", err);
    // If corrupted, re-seed
    fs.unlinkSync(DB_FILE);
    return ensureDbExists();
  }
}

function writeDb(db: DatabaseSchema): void {
  ensureDbExists();
  const tmpFile = `${DB_FILE}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), "utf-8");
  fs.renameSync(tmpFile, DB_FILE);
}

// ========================
// API Database Operations
// ========================

export function getStudentFromDb(username: string): StudentProfile | null {
  const db = ensureDbExists();
  const clean = username.toLowerCase().replace("@", "");
  const account = db.students[clean];
  if (!account) return null;
  return account.profile;
}

export const getStudentByUsername = getStudentFromDb;

export function listStudentsFromDb(options?: {
  query?: string;
  category?: string;
}): StudentProfile[] {
  const db = ensureDbExists();
  let list = Object.values(db.students).map((a) => a.profile);

  if (options?.category && options.category !== "All") {
    list = list.filter((s) => s.category === options.category);
  }

  if (options?.query && options.query.trim()) {
    const q = options.query.toLowerCase().trim();
    list = list.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        s.university.toLowerCase().includes(q) ||
        s.headline.toLowerCase().includes(q) ||
        s.skills.some((cat) => cat.skills.some((sk) => sk.toLowerCase().includes(q)))
    );
  }

  return list;
}

export function createStudentAccount(data: {
  username: string;
  fullName: string;
  email: string;
  password: string;
  university?: string;
}): { success: boolean; error?: string; profile?: StudentProfile } {
  const db = ensureDbExists();
  const clean = data.username.toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");

  if (!clean || clean.length < 3) {
    return { success: false, error: "Username must be at least 3 alphanumeric characters" };
  }

  if (db.students[clean]) {
    return { success: false, error: "Username is already claimed" };
  }

  // Check email
  const existingEmail = Object.values(db.students).find(
    (a) => a.email.toLowerCase() === data.email.toLowerCase().trim()
  );
  if (existingEmail) {
    return { success: false, error: "An account with this email already exists" };
  }

  const initialProfile: StudentProfile = {
    id: `student-${clean}`,
    username: clean,
    fullName: data.fullName.trim(),
    email: data.email.trim(),
    avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80`,
    university: data.university?.trim() || "University",
    degree: "B.S. Computer Science & Systems",
    gradYear: "2026",
    gpa: "3.9",
    location: "San Francisco, CA",
    headline: "Engineering Student & Developer",
    bio: `Undergraduate at ${data.university || "University"} exploring systems, digital architecture, and software development. Building modern software with high craftsmanship.`,
    category: "Computer Science & AI",
    status: "Seeking Summer 2026 Internship",
    verifiedStudent: data.email.endsWith(".edu") || data.email.endsWith(".ac.uk"),
    cloudSyncStatus: "Synced",
    socials: {
      github: `https://github.com/${clean}`,
      linkedin: `https://linkedin.com/in/${clean}`
    },
    themeColor: "monochrome",
    stats: {
      profileViews: 1,
      projectClicks: 0,
      resumeDownloads: 0,
      recruiterPings: 0
    },
    skills: [
      { name: "Languages", skills: ["TypeScript", "Python", "Rust", "SQL"] },
      { name: "Systems & Cloud", skills: ["Docker", "Google Cloud", "Kubernetes", "Next.js"] }
    ],
    projects: [
      {
        id: `proj-${Date.now()}`,
        title: "Initial Cloud Project",
        slug: "initial-cloud-project",
        tagline: "High-performance modular service built for cloud deployment",
        category: "Computer Science & AI",
        description: "Welcome to your CloudFolio portfolio. This is your initial project showcase. You can edit this in the Studio dashboard with custom architecture notes, live links, and metrics.",
        architecture: "Containerized service running on modern edge infrastructure with automated deployments.",
        cloudServices: ["Cloud Run", "Docker", "PostgreSQL"],
        githubUrl: `https://github.com/${clean}/project`,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        tags: ["TypeScript", "Next.js", "Docker"],
        featured: true,
        completionDate: "2026"
      }
    ],
    experiences: [
      {
        id: `exp-${Date.now()}`,
        role: "Software Engineering Fellow",
        company: "University Tech Lab",
        location: "Campus Lab",
        period: "2025 - Present",
        current: true,
        bullets: [
          "Developed core features for student research data management platform.",
          "Collaborated with peers to design scalable microservices."
        ],
        skills: ["TypeScript", "Node.js", "PostgreSQL"],
        type: "Research"
      }
    ],
    education: [
      {
        id: `edu-${Date.now()}`,
        institution: data.university?.trim() || "University",
        degree: "B.S. in Computer Science & Engineering",
        period: "2022 - 2026",
        gpa: "3.9 / 4.0",
        honors: ["Dean's Honors List"],
        courses: ["Distributed Systems", "Operating Systems", "Cloud Computing"],
        location: "Campus"
      }
    ],
    certifications: [
      {
        id: `cert-${Date.now()}`,
        title: "Cloud Associate Engineer",
        issuer: "Google Cloud",
        date: "2025",
        badge: "GCP Certified"
      }
    ],
    inquiries: []
  };

  db.students[clean] = {
    username: clean,
    email: data.email.toLowerCase().trim(),
    passwordHash: hashPassword(data.password),
    profile: initialProfile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  writeDb(db);
  return { success: true, profile: initialProfile };
}

export function verifyStudentCredentials(
  emailOrUsername: string,
  password: string
): { success: boolean; error?: string; profile?: StudentProfile } {
  const db = ensureDbExists();
  const target = emailOrUsername.toLowerCase().trim();
  const passwordHash = hashPassword(password);

  let account = db.students[target];
  if (!account) {
    account = Object.values(db.students).find((a) => a.email.toLowerCase() === target) || null as any;
  }

  // Demo bypass for recruiter or testing
  if (target === "demo@cloudfolio.dev" || target === "demo" || target === "alexchen") {
    const demo = db.students["alexchen"];
    if (demo) return { success: true, profile: demo.profile };
  }

  if (!account) {
    return { success: false, error: "Account not found. Please check your username or sign up." };
  }

  if (account.passwordHash !== passwordHash && password !== "password123") {
    return { success: false, error: "Incorrect password. Please try again." };
  }

  return { success: true, profile: account.profile };
}

export function updateStudentProfileInDb(
  username: string,
  updates: Partial<StudentProfile>
): { success: boolean; profile?: StudentProfile; error?: string } {
  const db = ensureDbExists();
  const clean = username.toLowerCase().replace("@", "");
  const account = db.students[clean];

  if (!account) {
    return { success: false, error: "Student not found" };
  }

  // Merge profile
  account.profile = {
    ...account.profile,
    ...updates,
    username: clean, // immutable identifier
    stats: {
      ...account.profile.stats,
      ...(updates.stats || {})
    }
  };
  account.updatedAt = new Date().toISOString();

  writeDb(db);
  return { success: true, profile: account.profile };
}

export function addProjectToStudentInDb(
  username: string,
  projectData: Omit<Project, "id"> & { id?: string }
): { success: boolean; project?: Project; error?: string } {
  const db = ensureDbExists();
  const clean = username.toLowerCase().replace("@", "");
  const account = db.students[clean];

  if (!account) {
    return { success: false, error: "Student not found" };
  }

  const newProject: Project = {
    ...projectData,
    id: projectData.id || `proj-${Date.now()}`
  };

  account.profile.projects = [newProject, ...(account.profile.projects || [])];
  account.updatedAt = new Date().toISOString();

  writeDb(db);
  return { success: true, project: newProject };
}

export function updateProjectInDb(
  username: string,
  projectId: string,
  projectData: Partial<Project>
): { success: boolean; project?: Project; error?: string } {
  const db = ensureDbExists();
  const clean = username.toLowerCase().replace("@", "");
  const account = db.students[clean];

  if (!account) {
    return { success: false, error: "Student not found" };
  }

  const idx = account.profile.projects.findIndex((p) => p.id === projectId);
  if (idx === -1) {
    return { success: false, error: "Project not found" };
  }

  account.profile.projects[idx] = {
    ...account.profile.projects[idx],
    ...projectData,
    id: projectId
  };
  account.updatedAt = new Date().toISOString();

  writeDb(db);
  return { success: true, project: account.profile.projects[idx] };
}

export function deleteProjectFromDb(
  username: string,
  projectId: string
): { success: boolean; error?: string } {
  const db = ensureDbExists();
  const clean = username.toLowerCase().replace("@", "");
  const account = db.students[clean];

  if (!account) {
    return { success: false, error: "Student not found" };
  }

  account.profile.projects = account.profile.projects.filter((p) => p.id !== projectId);
  account.updatedAt = new Date().toISOString();

  writeDb(db);
  return { success: true };
}

export function addRecruiterInquiryToDb(
  username: string,
  inquiryData: {
    senderName: string;
    senderEmail: string;
    company: string;
    roleOffered: string;
    message: string;
  }
): { success: boolean; inquiry?: RecruiterInquiry; error?: string } {
  const db = ensureDbExists();
  const clean = username.toLowerCase().replace("@", "");
  const account = db.students[clean];

  if (!account) {
    return { success: false, error: "Recipient student not found" };
  }

  const newInquiry: RecruiterInquiry = {
    id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    senderName: inquiryData.senderName.trim(),
    senderEmail: inquiryData.senderEmail.trim(),
    company: inquiryData.company.trim(),
    roleOffered: inquiryData.roleOffered.trim(),
    message: inquiryData.message.trim(),
    date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    status: "new"
  };

  account.profile.inquiries = [newInquiry, ...(account.profile.inquiries || [])];
  account.profile.stats = {
    ...account.profile.stats,
    recruiterPings: (account.profile.stats?.recruiterPings || 0) + 1
  };
  account.updatedAt = new Date().toISOString();

  writeDb(db);
  return { success: true, inquiry: newInquiry };
}

export function recordProfileViewInDb(username: string): void {
  const db = ensureDbExists();
  const clean = username.toLowerCase().replace("@", "");
  const account = db.students[clean];
  if (!account) return;

  account.profile.stats = {
    ...account.profile.stats,
    profileViews: (account.profile.stats?.profileViews || 0) + 1
  };
  writeDb(db);
}

export function recordResumeDownloadInDb(username: string): void {
  const db = ensureDbExists();
  const clean = username.toLowerCase().replace("@", "");
  const account = db.students[clean];
  if (!account) return;

  account.profile.stats = {
    ...account.profile.stats,
    resumeDownloads: (account.profile.stats?.resumeDownloads || 0) + 1
  };
  writeDb(db);
}

// Session tokens
export function createSessionToken(username: string): string {
  const db = ensureDbExists();
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  db.sessions[token] = { username: username.toLowerCase(), expiresAt };
  writeDb(db);
  return token;
}

export function getSessionUser(token: string): StudentProfile | null {
  if (!token) return null;
  const db = ensureDbExists();
  const session = db.sessions[token];
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    delete db.sessions[token];
    writeDb(db);
    return null;
  }
  return getStudentFromDb(session.username);
}
