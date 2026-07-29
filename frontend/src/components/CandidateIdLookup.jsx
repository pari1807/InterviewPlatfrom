import React, { useState } from "react";
import { Search, UserCheck, Loader2, Plus, Sparkles, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export default function CandidateIdLookup({ onSelectCandidate }) {
  const [candidateIdInput, setCandidateIdInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundCandidate, setFoundCandidate] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!candidateIdInput.trim()) {
      toast.error("Please enter a Candidate ID (e.g. CAND-XXXXXX)");
      return;
    }

    setIsSearching(true);
    setFoundCandidate(null);

    try {
      const res = await axios.get(`/users/candidate/${candidateIdInput.trim()}`);
      setFoundCandidate(res.data.candidate);
      toast.success(`Candidate ${res.data.candidate.name} verified!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Candidate ID not found");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
          <UserCheck className="size-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 text-base">Candidate ID Verification</h3>
          <p className="text-xs text-slate-500">Lookup candidate profile by unique permanent Candidate ID</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 size-4 text-slate-400" />
          <input
            type="text"
            placeholder="Enter Candidate ID (e.g. CAND-8X2P91)..."
            value={candidateIdInput}
            onChange={(e) => setCandidateIdInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:border-emerald-500 uppercase transition-all"
          />
        </div>

        <Button variant="emeraldGradient" size="sm" type="submit" disabled={isSearching}>
          {isSearching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          <span>Verify ID</span>
        </Button>
      </form>

      {foundCandidate && (
        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {foundCandidate.profileImage ? (
                <img
                  src={foundCandidate.profileImage}
                  alt={foundCandidate.name}
                  className="size-10 rounded-xl object-cover border border-emerald-300"
                />
              ) : (
                <div className="size-10 rounded-xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center">
                  {foundCandidate.name?.charAt(0) || "C"}
                </div>
              )}
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{foundCandidate.name}</h4>
                <p className="text-xs text-slate-500">{foundCandidate.email}</p>
              </div>
            </div>

            <Badge variant="emerald" size="sm" className="font-mono">
              {foundCandidate.candidateId}
            </Badge>
          </div>

          <div className="pt-3 border-t border-emerald-200/60 flex items-center justify-between">
            <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
              <CheckCircle2 className="size-3.5 text-emerald-600" /> Candidate Verified in Database
            </span>

            <Button
              variant="emeraldGradient"
              size="sm"
              onClick={() => onSelectCandidate && onSelectCandidate(foundCandidate)}
            >
              <Plus className="size-3.5" />
              <span>Schedule Interview</span>
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
