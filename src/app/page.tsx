"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Mic,
  Video,
  Camera,
  FileText,
  RefreshCw,
  Send,
  Clock,
  X,
} from "lucide-react";

export default function Home() {
  const [activeInput, setActiveInput] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [recentNotes, setRecentNotes] = useState<
    Array<{ type: string; content: string }>
  >([]);

  const handleInputToggle = (inputType: string) => {
    if (activeInput === inputType) {
      setActiveInput(null);
    } else {
      setActiveInput(inputType);
    }
  };

  const handleSubmit = () => {
    if (noteText.trim() || activeInput) {
      setRecentNotes([
        { type: activeInput || "text", content: noteText || "Note recorded" },
        ...recentNotes,
      ]);
      setNoteText("");
      setActiveInput(null);
    }
  };

  const handleReset = () => {
    setNoteText("");
    setActiveInput(null);
  };

  const renderInputArea = () => {
    switch (activeInput) {
      case "audio":
        return (
          <div className="p-6 bg-sky-100 rounded-xl border-2 border-dashed border-sky-400 flex flex-col items-center justify-center">
            <Mic className="h-12 w-12 text-sky-500 animate-pulse" />
            <p className="mt-2 font-bold text-sky-700">Recording Audio...</p>
          </div>
        );
      case "video":
        return (
          <div className="p-6 bg-indigo-100 rounded-xl border-2 border-dashed border-indigo-400 flex flex-col items-center justify-center">
            <Video className="h-12 w-12 text-indigo-500 animate-pulse" />
            <p className="mt-2 font-bold text-indigo-700">Recording Video...</p>
          </div>
        );
      case "image":
        return (
          <div className="p-6 bg-green-100 rounded-xl border-2 border-dashed border-green-400 flex flex-col items-center justify-center">
            <Camera className="h-12 w-12 text-green-500" />
            <p className="mt-2 font-bold text-green-700">Capture Image</p>
          </div>
        );
      case "text":
      default:
        return (
          <textarea
            className="w-full p-4 rounded-xl border-2 border-slate-200 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-sky-400"
            placeholder="How are you feeling today?"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        );
    }
  };

  const [showRecentNotes, setShowRecentNotes] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-slate-100">
          <h1 className="text-2xl font-bold text-center mb-6 text-slate-800">
            Emoki Notes
          </h1>

          <div className="mb-6">{renderInputArea()}</div>

          {/* Input Type Buttons */}
          <div className="flex justify-center gap-3 mb-6">
            <Button
              variant={activeInput === "audio" ? "primary" : "default"}
              size="icon"
              onClick={() => handleInputToggle("audio")}
              className="rounded-full"
            >
              <Mic className="h-5 w-5" />
            </Button>

            <Button
              variant={activeInput === "video" ? "super" : "default"}
              size="icon"
              onClick={() => handleInputToggle("video")}
              className="rounded-full"
            >
              <Video className="h-5 w-5" />
            </Button>

            <Button
              variant={activeInput === "image" ? "secondary" : "default"}
              size="icon"
              onClick={() => handleInputToggle("image")}
              className="rounded-full"
            >
              <Camera className="h-5 w-5" />
            </Button>

            <Button
              variant={activeInput === "text" ? "primaryOutline" : "default"}
              size="icon"
              onClick={() => handleInputToggle("text")}
              className="rounded-full"
            >
              <FileText className="h-5 w-5" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3">
            <Button variant="danger" onClick={handleReset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>

            <Button
              variant="secondary"
              onClick={handleSubmit}
              className="flex-1"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit
            </Button>

            <Button
              variant="super"
              onClick={() => setShowRecentNotes(!showRecentNotes)}
              className="flex-1"
            >
              <Clock className="mr-2 h-4 w-4" />
              Recent
            </Button>
          </div>

          {/* Recent Notes Panel */}
          {showRecentNotes && (
            <div className="mt-6 bg-slate-50 rounded-xl p-4 border-2 border-slate-200 max-h-[300px] overflow-auto">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-slate-700">Recent Notes</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecentNotes(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {recentNotes.length === 0 ? (
                <p className="text-slate-500 text-center py-4">
                  No recent notes yet
                </p>
              ) : (
                <ul className="space-y-3">
                  {recentNotes.map((note, index) => (
                    <li
                      key={index}
                      className="bg-white p-3 rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        {note.type === "audio" && (
                          <Mic className="h-4 w-4 text-sky-500" />
                        )}
                        {note.type === "video" && (
                          <Video className="h-4 w-4 text-indigo-500" />
                        )}
                        {note.type === "image" && (
                          <Camera className="h-4 w-4 text-green-500" />
                        )}
                        {note.type === "text" && (
                          <FileText className="h-4 w-4 text-slate-500" />
                        )}
                        <span className="text-sm">{note.content}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
