"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What makes CloudFolio different from standard website builders?",
    answer: "Traditional builders produce bloated, generic templates that require hours of manual formatting. CloudFolio is engineered specifically for student engineers, researchers, and designers. You get fast edge hosting, structured project case studies with technical architecture callouts, verified academic badges, and an automated single-page ATS resume export."
  },
  {
    question: "How does the cloud hosting and custom subdomain work?",
    answer: "When you sign up, you can immediately claim your personalized handle (e.g., cloudfolio.dev/@yourname). Your data is stored securely and served through global CDN edge locations with automated HTTPS/SSL. Whenever you publish changes, your live portfolio updates immediately."
  },
  {
    question: "Can I connect my own custom apex domain (e.g., yourname.com)?",
    answer: "Yes! You can point any custom domain or subdomain using a standard CNAME record. CloudFolio automatically provisions and auto-renews free SSL/TLS certificates."
  },
  {
    question: "How does the university .edu verification work?",
    answer: "We verify your student status by sending a confirmation link to your institutional email address (.edu, .ac.uk, etc.). Once confirmed, your portfolio displays a verified student badge, giving hiring teams confidence in your academic credentials."
  },
  {
    question: "How does recruiter messaging work without exposing my private contact info?",
    answer: "Hiring managers and mentors can contact you directly through your portfolio contact form. Messages are delivered straight to your Recruiter Inbox in the dashboard, keeping your personal phone number and direct email address protected."
  },
  {
    question: "How does the one-click ATS Resume Generator work?",
    answer: "Instead of maintaining a disconnected Word document or LaTeX template, CloudFolio compiles your verified coursework, work history, and featured projects into an ATS-tested, single-page vector PDF that you can download anytime."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 relative bg-white border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-900 text-xs font-geometric font-bold uppercase tracking-wider border border-slate-200">
            <HelpCircle className="w-3.5 h-3.5 text-slate-900" strokeWidth={1.5} />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-geometric font-extrabold text-slate-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-body max-w-lg mx-auto">
            Everything you need to know about cloud student portfolios, verified credentials, and recruiter connections.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-slate-50 border-black shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-geometric font-extrabold text-base sm:text-lg text-slate-950">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-black text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-0 text-xs sm:text-sm font-body text-slate-600 leading-relaxed animate-in fade-in duration-200">
                    <p className="border-t border-slate-200 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
