import React from "react";
import { Terminal, CheckCircle2, XCircle } from "lucide-react";

export default function OutputPanel({ output }) {
  return (
    <div className="h-full bg-slate-950 text-slate-200 flex flex-col font-mono text-xs">
      {/* Header */}
      <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center gap-2 font-sans font-bold text-xs text-slate-300">
        <Terminal className="size-4 text-emerald-400" />
        <span>Execution Console Output</span>
      </div>

      {/* Console output display */}
      <div className="flex-1 overflow-auto p-4 leading-relaxed">
        {output === null ? (
          <p className="text-slate-500 font-sans text-xs italic">
            Click "Run Code" above to execute your solution against Piston sandbox test cases...
          </p>
        ) : output.success ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-400 font-sans font-bold text-xs">
              <CheckCircle2 className="size-4" />
              <span>Execution Succeeded</span>
            </div>
            <pre className="text-emerald-300 whitespace-pre-wrap font-mono">{output.output}</pre>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-rose-400 font-sans font-bold text-xs">
              <XCircle className="size-4" />
              <span>Execution Error</span>
            </div>
            {output.output && (
              <pre className="text-slate-300 whitespace-pre-wrap mb-2 font-mono">{output.output}</pre>
            )}
            <pre className="text-rose-400 whitespace-pre-wrap font-mono">{output.error}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
