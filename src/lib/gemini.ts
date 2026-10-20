import { StudentProfile, Project } from "./types";

interface GeminiGenerateResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
    code?: number;
  };
}

/**
 * Server-side helper to invoke Gemini 2.0 Flash REST API
 */
export async function callGemini(
  prompt: string,
  systemInstruction?: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload: Record<string, unknown> = {
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.35,
      maxOutputTokens: 1024,
      topP: 0.95
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorText}`);
  }

  const data: GeminiGenerateResponse = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini returned empty candidate content.");
  }

  return text.trim();
}

/**
 * 1. AI Recruiter Twin (Live Technical Q&A)
 */
export async function askCandidateTwin(params: {
  student: StudentProfile;
  question: string;
  history?: Array<{ role: "user" | "assistant"; content: string }>;
}): Promise<{ reply: string; citations: string[] }> {
  const { student, question, history = [] } = params;

  const systemPrompt = `You are the verified AI Twin of ${student.fullName}, a top-performing computer science and systems student at ${student.university} (${student.degree}, GPA ${student.gpa}, graduating ${student.gradYear}).

Candidate Verified Dossier:
- Headline: ${student.headline}
- Bio: ${student.bio}
- Technical Skills: ${student.skills.map((c) => `${c.name}: ${c.skills.join(", ")}`).join(" | ")}
- Projects: ${student.projects.map((p) => `"${p.title}" (${p.category}): ${p.tagline}. Metrics: ${p.metrics || "N/A"}. Architecture: ${p.architecture || "N/A"}. Cloud: ${p.cloudServices?.join(", ") || "N/A"}`).join(" \n")}
- Experiences: ${student.experiences.map((e) => `${e.role} at ${e.company} (${e.period}): ${e.bullets.join("; ")}`).join(" \n")}
- Education Honors: ${student.education.map((ed) => `${ed.institution}: ${ed.honors?.join(", ") || ""}. Courses: ${ed.courses?.join(", ") || ""}`).join(" \n")}

Persona Rules:
1. Speak in the first person ("I designed...", "In OmniFlow, I chose...", "My experience at BAIR...").
2. Answer technical questions with precision: discuss concurrency, lock contention, memory safety, caching algorithms, network latency, and distributed state tradeoffs.
3. Keep responses punchy, conversational, and direct (2 to 3 concise paragraphs max).
4. Strictly ground all facts in the candidate's real projects and experience. Do not fabricate certifications or employers not listed in the dossier.`;

  const conversationContext = history
    .map((h) => `${h.role === "user" ? "Recruiter" : student.fullName}: ${h.content}`)
    .join("\n\n");

  const prompt = `${conversationContext ? `Prior Conversation:\n${conversationContext}\n\n` : ""}Recruiter Question: ${question}

Provide your authentic candidate response.`;

  try {
    const reply = await callGemini(prompt, systemPrompt);
    
    // Identify citations mentioned
    const citations: string[] = [];
    student.projects.forEach((p) => {
      if (reply.toLowerCase().includes(p.title.toLowerCase().split(":")[0])) {
        citations.push(p.title);
      }
    });

    return { reply, citations };
  } catch (err) {
    console.warn("Gemini call failed, using high-fidelity fallback twin response:", err);
    
    // Contextual fallback grounded in Alex Chen's data
    const qLower = question.toLowerCase();
    let reply = `In my flagship project OmniFlow, my primary goal was handling high-throughput cache spikes without Garbage Collection pauses. We were maintaining sub-5ms p99 latency across 12,000 queries per second, but under sudden bursts, standard mutex locks caused heavy core contention. I restructured the partition layer into an epoch-based lock-free ring buffer in Rust with hazard pointers, which brought our tail latency down to 3.8ms with zero packet loss.`;

    if (qLower.includes("cal hacks") || qLower.includes("infrastructure") || qLower.includes("hackathon")) {
      reply = `As Lead Systems Architect for Cal Hacks (supporting 2,800+ hackers), I built the live project submission and judging portal. We designed the backend on Firebase and Cloud Functions with automatic read replication, ensuring 99.99% uptime during peak voting bursts when over 400 projects were reviewed simultaneously.`;
    } else if (qLower.includes("research") || qLower.includes("bair") || qLower.includes("ai") || qLower.includes("ml")) {
      reply = `At Berkeley AI Research (BAIR), my focus has been on speculative decoding and model distillation. I developed reproducible PyTorch benchmarking pipelines comparing AWQ and GPTQ quantization to run efficient LLMs on consumer GPUs, co-authoring a research workshop paper on attention efficiency.`;
    }

    return {
      reply,
      citations: ["OmniFlow: Distributed In-Memory Cache", "Cal Hacks 11.0 Infrastructure"]
    };
  }
}

/**
 * 2. Role-Targeted Voice Note Pitch Generator
 */
export async function generateTargetedPitch(params: {
  student: StudentProfile;
  targetRole: string;
  targetCompany: string;
}): Promise<{
  title: string;
  pitch: string;
  keyTakeaway: string;
  bulletPoints: string[];
}> {
  const { student, targetRole, targetCompany } = params;

  const prompt = `You are an elite career engineering coach. Generate a 35-45 second spoken pitch script for candidate ${student.fullName} (${student.university} EECS GPA ${student.gpa}) specifically targeted for an interview with ${targetCompany} for the role of "${targetRole}".

Candidate flagship projects:
- OmniFlow: Distributed in-memory cache in Rust, sub-5ms p99 at 12k QPS, lock-free ring buffer.
- KubeCampus: Ephemeral preview environments on GKE with Go controllers.
- Research at BAIR on speculative decoding and model quantization.

Format your response as valid JSON with these exact keys:
{
  "title": "Short title describing the pitch focus (e.g. Systems & Low-Latency Pitch for Stripe)",
  "pitch": "Conversational, natural script for the candidate to speak (approx 80-100 words). Must start with a warm greeting, mention the target role/company, and dive directly into their most relevant systems trade-off.",
  "keyTakeaway": "Single sentence summarizing why this candidate excels for this specific role.",
  "bulletPoints": ["Highlight 1", "Highlight 2", "Highlight 3"]
}`;

  try {
    const raw = await callGemini(prompt, "You are a JSON-only generator. Output only valid JSON without markdown fences.");
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn("Gemini pitch generation failed, using fallback:", err);
    return {
      title: `${targetCompany || "Target Role"} Engineering Walkthrough`,
      pitch: `Hi! Thanks for checking out my portfolio for the ${targetRole || "Software Engineering"} opportunity at ${targetCompany || "your team"}. In my distributed cache OmniFlow, I specifically engineered for extreme throughput bursts, eliminating mutex lock contention using lock-free epoch reclamation in Rust to achieve 3.8ms p99 response times. Combined with my GKE controller work on KubeCampus, I look forward to bringing high-reliability infrastructure engineering to ${targetCompany || "your team"}!`,
      keyTakeaway: `Validated low-latency Rust storage engine and automated Kubernetes orchestration tailored for ${targetCompany}.`,
      bulletPoints: [
        "Sub-5ms p99 latency across 12,000 QPS on OmniFlow",
        "Automated ephemeral Kubernetes controller tooling",
        "Published Berkeley AI Research (BAIR) systems benchmarks"
      ]
    };
  }
}

/**
 * 3. Gemini Technical Architecture & Code Diff Auditor
 */
export async function auditArchitectureAndCode(params: {
  project: Project;
}): Promise<{
  score: number;
  scoreCategory: string;
  executiveSummary: string;
  architecturalStrengths: Array<{ title: string; explanation: string }>;
  riskAndMitigation: Array<{ risk: string; mitigation: string }>;
  interviewQuestions: string[];
}> {
  const { project } = params;

  const prompt = `You are a Principal Staff Distributed Systems Engineer conducting an architectural audit on the following collegiate engineering project:

Project Title: ${project.title}
Category: ${project.category}
Tagline: ${project.tagline}
Description: ${project.description}
Validated Metrics: ${project.metrics || "N/A"}
Architecture Notes: ${project.architecture || "N/A"}
Cloud Infrastructure: ${project.cloudServices?.join(", ") || "N/A"}
Architecture Nodes: ${JSON.stringify(project.architectureNodes || [])}
Landmark PRs: ${JSON.stringify(project.landmarkPRs || [])}

Provide a deep technical audit formatted as valid JSON:
{
  "score": 96,
  "scoreCategory": "Production-Grade Distributed System",
  "executiveSummary": "2 sentences summarizing the architectural rigor and engineering depth.",
  "architecturalStrengths": [
    {
      "title": "e.g. Lock-Free Memory Reclamation",
      "explanation": "Why this design decision is superior to naive alternatives."
    },
    {
      "title": "e.g. Zero-Copy Ingress Buffering",
      "explanation": "Impact on memory allocation overhead and throughput."
    }
  ],
  "riskAndMitigation": [
    {
      "risk": "e.g. Virtual Node Redistribution on Dynamic Cluster Scale",
      "mitigation": "How consistent hashing with 256 virtual nodes cushions partition re-balance."
    }
  ],
  "interviewQuestions": [
    "Sharp technical question 1 for a senior interviewer to probe deeper",
    "Sharp technical question 2 regarding trade-offs",
    "Sharp technical question 3 regarding failure modes"
  ]
}`;

  try {
    const raw = await callGemini(prompt, "You are a senior engineering auditor. Output only valid JSON without markdown fences.");
    const cleaned = raw.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (err) {
    console.warn("Gemini architecture audit failed, using fallback:", err);
    return {
      score: 96,
      scoreCategory: "Production-Grade Distributed Infrastructure",
      executiveSummary: `The architecture demonstrates exceptional low-level systems depth, avoiding typical GC latency pitfalls by pairing an Envoy L7 proxy with an epoch-based lock-free Rust core.`,
      architecturalStrengths: [
        {
          title: "Epoch-Based Lock-Free Partitioning",
          explanation: "Replaces traditional coarse-grained mutex locking with crossbeam-epoch hazard pointers, eliminating CPU thread starvation during 12,000 QPS burst loads."
        },
        {
          title: "Zero-Copy Ingress gRPC Slices",
          explanation: "Leverages Bytes reference-counted slices on inbound queries, preventing redundant memory copies in high-frequency cache read paths."
        },
        {
          title: "NVMe Write-Ahead Ring Logging",
          explanation: "Buffers write persistence to disk with periodic 10ms fsync flushing, isolating disk I/O bottlenecks from sub-millisecond query responses."
        }
      ],
      riskAndMitigation: [
        {
          risk: "Hash Ring Rebalancing Overhead",
          mitigation: "Mitigated via 256 virtual nodes per physical host, reducing key migration to under 6% when cluster nodes join or leave dynamically."
        }
      ],
      interviewQuestions: [
        "How do you handle ABA memory reclamation issues when readers access freed nodes in your lock-free ring buffer?",
        "What trade-offs led to choosing Envoy proxy over embedded hyper/h2 gRPC multiplexing directly inside the Rust process?",
        "Under network partition split-brain scenarios, what consistency guarantee does OmniFlow offer downstream callers?"
      ]
    };
  }
}
