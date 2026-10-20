"use client";

import { DEFAULT_STUDENT, SHOWCASE_STUDENTS } from "./mock-data";
import { StudentProfile, Project, Experience, RecruiterInquiry } from "./types";

const STORAGE_KEY = "cloudfolio_current_student";
const ALL_STUDENTS_KEY = "cloudfolio_all_students";

export function getStoredCurrentStudent(): StudentProfile {
  if (typeof window === "undefined") return DEFAULT_STUDENT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STUDENT,
        ...parsed,
        voiceNote: DEFAULT_STUDENT.voiceNote ? {
          ...DEFAULT_STUDENT.voiceNote,
          ...parsed.voiceNote,
          audioUrl: parsed.voiceNote?.audioUrl || DEFAULT_STUDENT.voiceNote.audioUrl,
          transcript: DEFAULT_STUDENT.voiceNote.transcript
        } : parsed.voiceNote,
        attestations: (parsed.attestations && parsed.attestations.length > 0) ? parsed.attestations : DEFAULT_STUDENT.attestations
      };
    }
  } catch (e) {
    console.error("Failed to read from localStorage", e);
  }
  return DEFAULT_STUDENT;
}

export function saveCurrentStudent(profile: StudentProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    
    // Also sync into all students registry
    const all = getAllStudents();
    const idx = all.findIndex((s) => s.username.toLowerCase() === profile.username.toLowerCase());
    if (idx >= 0) {
      all[idx] = profile;
    } else {
      all.unshift(profile);
    }
    localStorage.setItem(ALL_STUDENTS_KEY, JSON.stringify(all));
  } catch (e) {
    console.error("Failed to save student profile", e);
  }
}

export function getAllStudents(): StudentProfile[] {
  if (typeof window === "undefined") return SHOWCASE_STUDENTS;
  try {
    const raw = localStorage.getItem(ALL_STUDENTS_KEY);
    if (raw) {
      const parsed: StudentProfile[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length >= SHOWCASE_STUDENTS.length) {
        return parsed.map((student) => {
          const match = SHOWCASE_STUDENTS.find((s) => s.id === student.id || s.username === student.username);
          if (match) {
            return {
              ...match,
              ...student,
              voiceNote: match.voiceNote ? {
                ...match.voiceNote,
                ...student.voiceNote,
                audioUrl: student.voiceNote?.audioUrl || match.voiceNote.audioUrl,
                transcript: match.voiceNote.transcript
              } : student.voiceNote,
              attestations: (student.attestations && student.attestations.length > 0) ? student.attestations : match.attestations
            };
          }
          return student;
        });
      }
    }
  } catch (e) {
    console.error("Failed to read all students", e);
  }
  return SHOWCASE_STUDENTS;
}

export function getStudentByUsername(username: string): StudentProfile | undefined {
  const all = getAllStudents();
  const cleanUsername = username.toLowerCase().replace("@", "");
  const found = all.find((s) => s.username.toLowerCase() === cleanUsername) || (cleanUsername === "alexchen" ? DEFAULT_STUDENT : undefined);
  if (found) {
    const defaultMatch = SHOWCASE_STUDENTS.find((s) => s.username.toLowerCase() === cleanUsername) || (cleanUsername === "alexchen" ? DEFAULT_STUDENT : undefined);
    if (defaultMatch) {
      if (defaultMatch.voiceNote) {
        found.voiceNote = {
          ...defaultMatch.voiceNote,
          ...found.voiceNote,
          audioUrl: found.voiceNote?.audioUrl || defaultMatch.voiceNote.audioUrl,
          transcript: defaultMatch.voiceNote.transcript
        };
      }
      if ((!found.attestations || found.attestations.length === 0) && defaultMatch.attestations) {
        found.attestations = defaultMatch.attestations;
      }
    }
  }
  return found;
}

export function sendInquiryToStudent(username: string, inquiryData: {
  senderName: string;
  senderEmail: string;
  company: string;
  roleOffered: string;
  message: string;
}): boolean {
  const student = getStudentByUsername(username);
  if (!student) return false;

  const newInquiry: RecruiterInquiry = {
    id: `inq-${Date.now()}`,
    senderName: inquiryData.senderName,
    senderEmail: inquiryData.senderEmail,
    company: inquiryData.company,
    roleOffered: inquiryData.roleOffered,
    message: inquiryData.message,
    date: "Just now",
    status: "new"
  };

  const updated: StudentProfile = {
    ...student,
    inquiries: [newInquiry, ...(student.inquiries || [])],
    stats: {
      ...student.stats,
      recruiterPings: (student.stats?.recruiterPings || 0) + 1
    }
  };

  saveCurrentStudent(updated);
  return true;
}
