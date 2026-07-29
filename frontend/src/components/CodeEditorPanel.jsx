import React from "react";
import Editor from "@monaco-editor/react";
import { Loader2, Play, Code2 } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";
import { Button } from "./ui/Button";

export default function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
}) {
  return (
    <div className="h-full bg-slate-900 flex flex-col">
      {/* Editor Toolbar Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
            <img
              src={LANGUAGE_CONFIG[selectedLanguage]?.icon}
              alt={LANGUAGE_CONFIG[selectedLanguage]?.name}
              className="size-4"
            />
            <select
              className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer"
              value={selectedLanguage}
              onChange={onLanguageChange}
            >
              {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
                <option key={key} value={key} className="bg-slate-900 text-white">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          variant="emeraldGradient"
          size="sm"
          disabled={isRunning}
          onClick={onRunCode}
          className="shadow-sm"
        >
          {isRunning ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              <span>Compiling...</span>
            </>
          ) : (
            <>
              <Play className="size-3.5 fill-current" />
              <span>Run Code</span>
            </>
          )}
        </Button>
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={LANGUAGE_CONFIG[selectedLanguage]?.monacoLang || "javascript"}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            padding: { top: 12, bottom: 12 },
            fontFamily: "Fira Code, Menlo, Monaco, Consolas, monospace",
          }}
        />
      </div>
    </div>
  );
}
