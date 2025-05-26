import { useEffect, useState, useRef } from "react";

interface Verse {
  id: number;
  text: string;
  book: string;
  chapter: number;
  verse: number;
  topic: string[];
  ageGroup: string;
}

function App() {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [filtered, setFiltered] = useState<Verse[]>([]);
  const [randomVerse, setRandomVerse] = useState<Verse | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [ageGroup, setAgeGroup] = useState("preteens");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [memoryMode, setMemoryMode] = useState(false);
  const [dailyVerse, setDailyVerse] = useState<Verse | null>(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const loadVerses = async () => {
      const res = await fetch("/api/verses.json");
      const data: Verse[] = await res.json();
      setVerses(data);
      getDailyVerse(data);
    };
    loadVerses();
  }, []);

  useEffect(() => {
    let result = verses;
    if (ageGroup) {
      result = result.filter((v) => v.ageGroup === ageGroup);
    }
    if (selectedTopic) {
      result = result.filter((v) => v.topic.includes(selectedTopic));
    }
    if (selectedBook) {
      result = result.filter((v) => v.book === selectedBook);
    }
    setFiltered(result);
    getRandom(result);
  }, [ageGroup, selectedTopic, selectedBook, verses]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const getRandom = (pool: Verse[] = filtered) => {
    if (pool.length > 0) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setRandomVerse(pool[randomIndex]);
    }
  };

  const getDailyVerse = (pool: Verse[]) => {
    if (pool.length === 0) return;
    const seed = new Date().getDate();
    const index = seed % pool.length;
    setDailyVerse(pool[index]);
  };

  const readAloud = () => {
    if (randomVerse && synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(randomVerse.text);
      synthRef.current.speak(utterance);
    }
  };

  const toggleFavorite = () => {
    if (!randomVerse) return;
    setFavorites((prev) =>
      prev.includes(randomVerse.id)
        ? prev.filter((id) => id !== randomVerse.id)
        : [...prev, randomVerse.id]
    );
  };

  const getTopics = () => [...new Set(verses.flatMap((v) => v.topic))];
  const getBooks = () => [...new Set(verses.map((v) => v.book))];

  return (
    <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-rose-100 via-sky-100 to-lime-100 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 text-gray-800 dark:text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-center w-full">
          🌱 VerseSprout
        </h1>
        <button
          onClick={toggleTheme}
          className="ml-auto bg-white/30 dark:bg-black/30 text-sm px-4 py-2 rounded-full shadow hover:scale-105 transition"
        >
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <select
          value={ageGroup}
          onChange={(e) => setAgeGroup(e.target.value)}
          className="p-3 rounded bg-white dark:bg-slate-800 text-gray-800 dark:text-white shadow-md"
        >
          <option value="elementary">🧒 Elementary</option>
          <option value="preteens">🧑 Pre-teens</option>
        </select>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="p-3 rounded bg-white dark:bg-slate-800 text-gray-800 dark:text-white shadow-md"
        >
          <option value="">📖 Filter by Topic</option>
          {getTopics().map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
        <select
          value={selectedBook}
          onChange={(e) => setSelectedBook(e.target.value)}
          className="p-3 rounded bg-white dark:bg-slate-800 text-gray-800 dark:text-white shadow-md"
        >
          <option value="">📘 Filter by Book</option>
          {getBooks().map((book) => (
            <option key={book} value={book}>{book}</option>
          ))}
        </select>
        <button
          onClick={() => getRandom()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow font-semibold"
        >
          🔀 Show Me a Verse!
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 text-center p-6 rounded-2xl shadow-2xl max-w-2xl mx-auto text-2xl sm:text-3xl font-semibold leading-relaxed">
        {randomVerse ? (
          <>
            “{memoryMode ? "______" : randomVerse.text}”
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-300">
              {randomVerse.book} {randomVerse.chapter}:{randomVerse.verse}
            </p>
          </>
        ) : (
          "Loading verse..."
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-4 mt-6">
        <button
          onClick={readAloud}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow-md"
        >
          🔊 Read Aloud
        </button>
        <button
          onClick={() => getRandom()}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2 rounded-full shadow-md"
        >
          🔁 New Verse
        </button>
        <button
          onClick={toggleFavorite}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full shadow-md"
        >
          {randomVerse && favorites.includes(randomVerse.id) ? "❤️ Unsave" : "🤍 Save"}
        </button>
        <button
          onClick={() => setMemoryMode(!memoryMode)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full shadow-md"
        >
          🧠 {memoryMode ? "Exit Memory Mode" : "Memory Mode"}
        </button>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-bold mb-2">📆 Today's Verse</h2>
        {dailyVerse ? (
          <p className="italic">“{dailyVerse.text}” — {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse}</p>
        ) : (
          <p>Loading daily verse...</p>
        )}
      </div>
    </div>
  );
}

export default App;
