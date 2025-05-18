"use client";

import { useState, useEffect } from "react";

const emotionDescriptions: Record<string, string> = {
  Happy: "Feeling pleasure or joy about something positive.",
  Excited: "Feeling enthusiastic or thrilled about something.",
  Content: "A calm sense of satisfaction.",
  Grateful: "Appreciating what you have or someone’s actions.",
  Hopeful: "Feeling positive about the future.",
  Proud: "Feeling good about your achievements or who you are.",
  Joyful: "A strong feeling of happiness and delight.",
  Peaceful: "A sense of calm and quiet inside.",
  Inspired: "Motivated by something meaningful or moving.",
  Confident: "Believing in your abilities.",
  Loved: "Feeling cared for and connected.",
  Relaxed: "Free of tension or stress.",
  Amused: "Finding something entertaining or funny.",
  Curious: "Wanting to explore or understand more.",
  Motivated: "Feeling ready and energized to do something.",
  Sad: "Feeling down or unhappy about something.",
  Angry: "Feeling upset or mad, often from injustice.",
  Frustrated: "Blocked from reaching a goal.",
  Anxious: "Nervous about what might happen.",
  Lonely: "Feeling disconnected or alone.",
  Guilty: "Feeling bad for something you did or didn’t do.",
  Ashamed: "Feeling bad about who you are or how you think others see you.",
  Jealous: "Wishing for what someone else has.",
  Embarrassed: "Feeling awkward or exposed.",
  Bored: "Lacking interest or stimulation.",
  Disappointed: "Expectations weren’t met.",
  Tired: "Lacking energy, mentally or physically.",
  Hopeless: "Feeling like nothing will improve.",
};

const goodEmotions = [
  "Happy",
  "Excited",
  "Content",
  "Grateful",
  "Hopeful",
  "Proud",
  "Joyful",
  "Peaceful",
  "Inspired",
  "Confident",
  "Loved",
  "Relaxed",
  "Amused",
  "Curious",
  "Motivated",
];

const badEmotions = [
  "Sad",
  "Angry",
  "Frustrated",
  "Anxious",
  "Lonely",
  "Guilty",
  "Ashamed",
  "Jealous",
  "Embarrassed",
  "Bored",
  "Disappointed",
  "Tired",
  "Hopeless",
];

type EmotionEntry = {
  emotion: string;
  type: "good" | "bad";
  timestamp: string;
};

export default function Page() {
  const [selected, setSelected] = useState<EmotionEntry[]>([]);
  const [history, setHistory] = useState<EmotionEntry[]>([]);
  const [open, setOpen] = useState(false);
  const [descOpen, setDescOpen] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("emotionHistory");
    if (stored) setHistory(JSON.parse(stored));
  }, []);

  const toggleSelect = (emotion: string, type: "good" | "bad") => {
    const exists = selected.find((e) => e.emotion === emotion);
    if (exists) {
      setSelected(selected.filter((e) => e.emotion !== emotion));
    } else {
      setSelected([...selected, { emotion, type, timestamp: "" }]);
    }
  };

  const handleSubmit = () => {
    if (selected.length === 0) return;
    const timestamp = new Date().toISOString();
    const withTime = selected.map((e) => ({ ...e, timestamp }));
    const updated = [...withTime, ...history];
    localStorage.setItem("emotionHistory", JSON.stringify(updated));
    setHistory(updated);
    setSelected([]);
    setOpen(false);
  };

  const handleDelete = (timestamp: string) => {
    const filtered = history.filter((e) => e.timestamp !== timestamp);
    localStorage.setItem("emotionHistory", JSON.stringify(filtered));
    setHistory(filtered);
  };

  const isSelected = (emotion: string) =>
    selected.some((e) => e.emotion === emotion);

  const groupedHistory = Object.entries(
    history.reduce<Record<string, EmotionEntry[]>>((acc, entry) => {
      acc[entry.timestamp] = acc[entry.timestamp] || [];
      acc[entry.timestamp].push(entry);
      return acc;
    }, {}),
  );

  const EmotionButton = ({
    emotion,
    type,
  }: {
    emotion: string;
    type: "good" | "bad";
  }) => (
    <button
      onClick={() => toggleSelect(emotion, type)}
      onContextMenu={(e) => {
        e.preventDefault();
        setDescOpen(emotion);
      }}
      className={`px-3 py-1 rounded border border-zinc-700 text-sm
        ${isSelected(emotion) ? "bg-zinc-800" : "bg-zinc-900"}
        hover:bg-zinc-800 text-zinc-100`}
    >
      <span
        className="inline-block w-2 h-2 rounded-full mr-1"
        style={{
          backgroundColor: type === "good" ? "#22c55e" : "#ef4444",
        }}
      />
      {emotion}
    </button>
  );

  return (
    <div className="bg-black text-white min-h-screen flex flex-col p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">How do you feel?</h1>

      <div className="flex-grow space-y-6">
        <div>
          <h2 className="text-xl font-semibold">History</h2>
          <div className="space-y-4 mt-2">
            {groupedHistory.map(([timestamp, emotions], i) => (
              <div
                key={i}
                className="bg-zinc-900 p-3 rounded border border-zinc-800"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xs text-zinc-500">
                    {new Date(timestamp).toLocaleString()}
                  </div>
                  <button
                    onClick={() => handleDelete(timestamp)}
                    className="text-xs text-red-500 hover:underline"
                    aria-label="Delete entry"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((e, j) => (
                    <span
                      key={j}
                      className="px-2 py-1 rounded text-sm bg-zinc-800 border border-zinc-700 flex items-center text-zinc-100"
                    >
                      <span
                        className={`w-2 h-2 rounded-full inline-block mr-1 ${
                          e.type === "good" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {e.emotion}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 right-4 px-4 py-3 bg-zinc-800 rounded text-white text-lg shadow-md"
      >
        Select Emotions
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 w-full max-w-md overflow-y-auto max-h-[90vh] space-y-4">
            <h2 className="text-lg font-semibold">Select your emotions</h2>
            <div>
              <h3 className="font-medium">Good</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {goodEmotions.map((emotion) => (
                  <EmotionButton key={emotion} emotion={emotion} type="good" />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium mt-4">Bad</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {badEmotions.map((emotion) => (
                  <EmotionButton key={emotion} emotion={emotion} type="bad" />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-zinc-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-zinc-100 text-black px-4 py-1 rounded text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {descOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded w-full max-w-sm space-y-4">
            <h2 className="text-lg font-semibold">{descOpen}</h2>
            <p className="text-zinc-300">{emotionDescriptions[descOpen]}</p>
            <button
              onClick={() => setDescOpen(null)}
              className="text-sm text-zinc-400 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
