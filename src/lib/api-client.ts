import { StudentProfile, Project, RecruiterInquiry } from "./types";
import { 
  getStoredCurrentStudent, 
  saveCurrentStudent, 
  getAllStudents as getLocalStudents, 
  getStudentByUsername as getLocalStudentByUsername 
} from "./portfolio-store";

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(endpoint, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data as T;
  }

  // Auth Endpoints
  auth = {
    signup: async (data: {
      username: string;
      fullName: string;
      email: string;
      password: string;
      university?: string;
    }): Promise<{ success: boolean; profile: StudentProfile }> => {
      const res = await this.request<{ success: boolean; profile: StudentProfile }>("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data)
      });
      if (res.profile) {
        saveCurrentStudent(res.profile);
      }
      return res;
    },

    login: async (emailOrUsername: string, password: string): Promise<{ success: boolean; profile: StudentProfile }> => {
      const res = await this.request<{ success: boolean; profile: StudentProfile }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ emailOrUsername, password })
      });
      if (res.profile) {
        saveCurrentStudent(res.profile);
      }
      return res;
    },

    me: async (): Promise<{ authenticated: boolean; profile: StudentProfile }> => {
      try {
        const res = await this.request<{ authenticated: boolean; profile: StudentProfile }>("/api/auth/me");
        if (res.profile) {
          saveCurrentStudent(res.profile);
        }
        return res;
      } catch {
        return {
          authenticated: false,
          profile: getStoredCurrentStudent()
        };
      }
    },

    logout: async (): Promise<{ success: boolean }> => {
      return this.request<{ success: boolean }>("/api/auth/logout", {
        method: "POST"
      });
    }
  };

  // Student Profiles Endpoints
  students = {
    list: async (options?: { query?: string; category?: string }): Promise<StudentProfile[]> => {
      try {
        const params = new URLSearchParams();
        if (options?.query) params.set("q", options.query);
        if (options?.category && options.category !== "All") params.set("category", options.category);
        
        const res = await this.request<{ success: boolean; students: StudentProfile[] }>(
          `/api/students?${params.toString()}`
        );
        return res.students;
      } catch (err) {
        console.warn("Falling back to local cache for student list:", err);
        return getLocalStudents();
      }
    },

    get: async (username: string): Promise<StudentProfile | null> => {
      try {
        const clean = username.replace("@", "");
        const res = await this.request<{ success: boolean; student: StudentProfile }>(
          `/api/students/${clean}`
        );
        return res.student;
      } catch (err) {
        console.warn("Falling back to local cache for student get:", err);
        return getLocalStudentByUsername(username) || null;
      }
    },

    update: async (username: string, updates: Partial<StudentProfile>): Promise<StudentProfile> => {
      const clean = username.replace("@", "");
      const res = await this.request<{ success: boolean; student: StudentProfile }>(
        `/api/students/${clean}`,
        {
          method: "PUT",
          body: JSON.stringify(updates)
        }
      );
      if (res.student) {
        saveCurrentStudent(res.student);
      }
      return res.student;
    },

    addProject: async (username: string, project: Omit<Project, "id">): Promise<Project> => {
      const clean = username.replace("@", "");
      const res = await this.request<{ success: boolean; project: Project }>(
        `/api/students/${clean}/projects`,
        {
          method: "POST",
          body: JSON.stringify(project)
        }
      );
      // update local cache
      const curr = getStoredCurrentStudent();
      if (curr.username.toLowerCase() === clean.toLowerCase()) {
        saveCurrentStudent({
          ...curr,
          projects: [res.project, ...(curr.projects || [])]
        });
      }
      return res.project;
    },

    updateProject: async (username: string, projectId: string, project: Partial<Project>): Promise<Project> => {
      const clean = username.replace("@", "");
      const res = await this.request<{ success: boolean; project: Project }>(
        `/api/students/${clean}/projects/${projectId}`,
        {
          method: "PUT",
          body: JSON.stringify(project)
        }
      );
      // update local cache
      const curr = getStoredCurrentStudent();
      if (curr.username.toLowerCase() === clean.toLowerCase()) {
        saveCurrentStudent({
          ...curr,
          projects: curr.projects.map((p) => (p.id === projectId ? res.project : p))
        });
      }
      return res.project;
    },

    deleteProject: async (username: string, projectId: string): Promise<boolean> => {
      const clean = username.replace("@", "");
      const res = await this.request<{ success: boolean }>(
        `/api/students/${clean}/projects/${projectId}`,
        {
          method: "DELETE"
        }
      );
      // update local cache
      const curr = getStoredCurrentStudent();
      if (curr.username.toLowerCase() === clean.toLowerCase()) {
        saveCurrentStudent({
          ...curr,
          projects: curr.projects.filter((p) => p.id !== projectId)
        });
      }
      return res.success;
    },

    sendInquiry: async (
      username: string,
      inquiry: {
        senderName: string;
        senderEmail: string;
        company: string;
        roleOffered: string;
        message: string;
      }
    ): Promise<RecruiterInquiry> => {
      const clean = username.replace("@", "");
      const res = await this.request<{ success: boolean; inquiry: RecruiterInquiry }>(
        `/api/students/${clean}/inquiries`,
        {
          method: "POST",
          body: JSON.stringify(inquiry)
        }
      );
      return res.inquiry;
    },

    getInquiries: async (username: string): Promise<RecruiterInquiry[]> => {
      const clean = username.replace("@", "");
      const res = await this.request<{ success: boolean; inquiries: RecruiterInquiry[] }>(
        `/api/students/${clean}/inquiries`
      );
      return res.inquiries;
    },

    trackResumeDownload: async (username: string): Promise<number> => {
      try {
        const clean = username.replace("@", "");
        const res = await this.request<{ success: boolean; downloads: number }>(
          `/api/students/${clean}/resume`,
          {
            method: "POST"
          }
        );
        return res.downloads;
      } catch {
        return 1;
      }
    }
  };

  claimHandle = async (handle: string): Promise<{ available: boolean; message?: string }> => {
    return this.request<{ available: boolean; message?: string }>("/api/claim-handle", {
      method: "POST",
      body: JSON.stringify({ handle })
    });
  };
}

export const apiClient = new ApiClient();
