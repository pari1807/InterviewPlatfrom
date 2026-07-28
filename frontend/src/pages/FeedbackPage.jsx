import React, { useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Code2,
  MessageSquare,
  UserCheck,
  Zap,
  Target,
  BookOpen,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

export default function FeedbackPage() {
  const [openSection, setOpenSection] = useState("overall");

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  const feedbackSections = [
    {
      id: "overall",
      title: "Overall Summary",
      icon: Sparkles,
      score: "92 / 100",
      content:
        "Demonstrated strong problem-solving capabilities, structured thinking, and clean JavaScript syntax execution. Handled edge cases effectively and communicated architectural trade-offs with confidence.",
    },
    {
      id: "technical",
      title: "Technical Feedback & Code Execution",
      icon: Code2,
      score: "94 / 100",
      content:
        "Code structure was modular and readable. Optimal O(N) time complexity was achieved. Variable naming followed industry standard conventions. Recommended slight refinement in validating empty array input edge cases before proceeding to optimal loop execution.",
    },
    {
      id: "communication",
      title: "Communication & Articulation",
      icon: MessageSquare,
      score: "90 / 100",
      content:
        "Maintained continuous audio commentary while typing out solution code. Clearly explained initial brute-force approach prior to optimizing with hash map data structure.",
    },
    {
      id: "bodyLanguage",
      title: "Body Language & Demeanor",
      icon: UserCheck,
      score: "88 / 100",
      content:
        "Eye contact with camera was consistent during video call. Maintained calm composure throughout test execution and debugging phase.",
    },
    {
      id: "confidence",
      title: "Confidence & Problem Solving",
      icon: Zap,
      score: "91 / 100",
      content:
        "Showed zero hesitation when encountering syntax errors during execution, immediately reading compiler trace log and fixing index boundaries.",
    },
    {
      id: "improvements",
      title: "Suggested Improvements",
      icon: Target,
      score: "Actionable",
      content:
        "1. Always declare space complexity bounds upfront.\n2. Write unit test cases before running final Piston execution engine.\n3. Keep verbal cadence consistent during heavy code typing intervals.",
    },
  ];

  const recommendedPractice = [
    { id: "two-sum", title: "Two Sum", difficulty: "Easy", category: "Arrays & Hashing" },
    { id: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy", category: "Two Pointers" },
    { id: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy", category: "Linked List" },
  ];

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              AI Interview Feedback
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase">
                AI Powered
              </span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Detailed breakdown of your recent mock interview performance across key evaluation pillars.
            </p>
          </div>

          <Link to="/problems">
            <Button variant="emeraldGradient" size="md">
              <BookOpen className="size-4" />
              <span>Practice Recommended Problems</span>
            </Button>
          </Link>
        </div>

        {/* Collapsible Feedback Cards */}
        <div className="space-y-4">
          {feedbackSections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSection === section.id;
            return (
              <Card key={section.id} className="overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{section.title}</h3>
                      <p className="text-xs text-slate-500">Click to expand feedback details</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant="emerald">{section.score}</Badge>
                    {isOpen ? (
                      <ChevronUp className="size-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="size-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/40 text-slate-700 text-sm leading-relaxed animate-fade-in whitespace-pre-line">
                    {section.content}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Recommended Practice Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-200/60">
              <Target className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recommended Practice Areas</h2>
              <p className="text-xs text-slate-500">Tailored problem suggestions based on your AI feedback</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {recommendedPractice.map((prob) => (
              <Link
                key={prob.id}
                to={`/problem/${prob.id}`}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:shadow-xs transition-all bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-emerald-600">{prob.category}</span>
                    <Badge variant="emerald" size="sm">
                      {prob.difficulty}
                    </Badge>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{prob.title}</h3>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                  <span>Solve Problem</span>
                  <ArrowRight className="size-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
