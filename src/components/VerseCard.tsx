import React from "react";

interface Verse {
  text: string;
  book: string;
  chapter: string;
  verse: string;
  topic: string[];
}

interface Props {
  verse: Verse;
  onNext: () => void;
}

const VerseCard: React.FC<Props> = ({ verse, onNext }) => {
  if (!verse) return null;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-3xl shadow-2xl p-6 text-center transition duration-300">
      {/* Verse Text */}
      <p className="text-2xl md:text-3xl font-semibold mb-6 leading-relaxed text-pink-700 dark:text-yellow-300">
        “{verse.text}”
      </p>

      {/* Reference */}
      <p className="text-md mb-4 font-medium italic text-purple-600 dark:text-purple-300">
        — {verse.book} {verse.chapter}:{verse.verse}
      </p>

      {/* Topics */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {verse.topic.map((t) => (
          <span
            key={t}
            className="bg-pink-100 dark:bg-pink-700/40 text-pink-800 dark:text-pink-200 px-3 py-1 rounded-full text-xs font-semibold"
          >
            #{t}
          </span>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-6 py-3 rounded-full text-sm shadow-lg transition-transform hover:scale-105"
      >
        🎲 Show Another Verse
      </button>
    </div>
  );
};

{/* Read Aloud Button */}
<button
  onClick={() => {
    const utterance = new SpeechSynthesisUtterance(verse.text);
    utterance.voice = speechSynthesis.getVoices().find(v => v.lang.includes("en"));
    speechSynthesis.speak(utterance);
  }}
  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm shadow-md transition-transform hover:scale-105"
>
  🔊 Read Aloud
</button>


export default VerseCard;
