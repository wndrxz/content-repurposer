"use client";
import { useState } from "react";

const PLATFORMS = [
  {
    id: "twitter",
    icon: "𝕏",
    label: "Twitter / X",
    color: "bg-black border-gray-600",
  },
  {
    id: "linkedin",
    icon: "in",
    label: "LinkedIn",
    color: "bg-blue-900 border-blue-500",
  },
  {
    id: "instagram",
    icon: "📷",
    label: "Instagram",
    color: "bg-pink-900 border-pink-500",
  },
  {
    id: "tiktok",
    icon: "🎵",
    label: "TikTok",
    color: "bg-gray-900 border-gray-500",
  },
  {
    id: "email",
    icon: "📧",
    label: "Email",
    color: "bg-green-900 border-green-500",
  },
];

export default function Home() {
  const [content, setContent] = useState("");
  const [platforms, setPlatforms] = useState([
    "twitter",
    "linkedin",
    "instagram",
  ]);
  const [language, setLanguage] = useState("english");
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const togglePlatform = (id: string) => {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const generate = async () => {
    if (!content.trim()) {
      setError("Paste your content first!");
      return;
    }
    if (platforms.length === 0) {
      setError("Select at least one platform!");
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/repurpose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, platforms, language }),
      });
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data.data);
    } catch {
      setError("Server error. Try again.");
    }
    setLoading(false);
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Language toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLanguage("english")}
            className={`px-3 py-1 rounded-l-lg text-sm cursor-pointer ${language === "english" ? "bg-blue-600" : "bg-[#111118] text-gray-500"}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("russian")}
            className={`px-3 py-1 rounded-r-lg text-sm cursor-pointer ${language === "russian" ? "bg-blue-600" : "bg-[#111118] text-gray-500"}`}
          >
            RU
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🔄 Content Repurposer</h1>
          <p className="text-gray-400">
            Paste article → Get posts for every platform
          </p>
        </div>

        {/* Input */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5 mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm text-gray-400">📝 Your content:</label>
            <span className="text-xs text-gray-600">{wordCount} words</span>
          </div>
          <textarea
            className="w-full p-3 bg-[#0a0a0f] border border-[#222] rounded-xl text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none resize-none text-sm leading-relaxed"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article, blog post, newsletter, or any long-form content here..."
          />
        </div>

        {/* Platforms */}
        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5 mb-4">
          <label className="text-sm text-gray-400 block mb-3">
            🎯 Target platforms:
          </label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => togglePlatform(p.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all border ${
                  platforms.includes(p.id)
                    ? `${p.color} text-white`
                    : "bg-[#0a0a0f] border-[#222] text-gray-600"
                }`}
              >
                {p.icon} {p.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-xl text-red-400 text-sm mb-4">
            ❌ {error}
          </div>
        )}

        {/* Generate button */}
        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 rounded-xl font-bold text-lg cursor-pointer disabled:cursor-not-allowed transition-all"
        >
          {loading
            ? "⏳ Generating..."
            : `✨ Generate for ${platforms.length} platform${platforms.length > 1 ? "s" : ""}`}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-8 space-y-4">
            <h2 className="text-2xl font-bold">📱 Your content:</h2>

            {/* Twitter */}
            {result.twitter && Array.isArray(result.twitter) && (
              <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg">𝕏</span>
                  <span className="font-bold">Twitter / X</span>
                  <span className="text-xs text-gray-500">
                    ({(result.twitter as string[]).length} tweets)
                  </span>
                </div>
                <div className="space-y-3">
                  {(result.twitter as string[]).map(
                    (tweet: string, i: number) => (
                      <div key={i} className="bg-[#0a0a0f] rounded-xl p-3">
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-sm leading-relaxed flex-1">
                            {tweet}
                          </p>
                          <button
                            onClick={() => copyText(tweet, `tw-${i}`)}
                            className="px-2 py-1 text-xs bg-[#1a1a2e] rounded-lg cursor-pointer hover:bg-[#222] flex-shrink-0"
                          >
                            {copied === `tw-${i}` ? "✅" : "📋"}
                          </button>
                        </div>
                        <div className="text-xs text-gray-600 mt-2">
                          {tweet.length}/280
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* LinkedIn */}
            {result.linkedin && (
              <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-700 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                      in
                    </span>
                    <span className="font-bold">LinkedIn</span>
                  </div>
                  <button
                    onClick={() => copyText(result.linkedin as string, "li")}
                    className="px-3 py-1 text-xs bg-[#1a1a2e] rounded-lg cursor-pointer hover:bg-[#222]"
                  >
                    {copied === "li" ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                  {result.linkedin as string}
                </p>
              </div>
            )}

            {/* Instagram */}
            {result.instagram && (
              <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📷</span>
                    <span className="font-bold">Instagram</span>
                  </div>
                  <button
                    onClick={() => copyText(result.instagram as string, "ig")}
                    className="px-3 py-1 text-xs bg-[#1a1a2e] rounded-lg cursor-pointer hover:bg-[#222]"
                  >
                    {copied === "ig" ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                  {result.instagram as string}
                </p>
              </div>
            )}

            {/* TikTok */}
            {result.tiktok && (
              <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎵</span>
                    <span className="font-bold">TikTok Script</span>
                  </div>
                  <button
                    onClick={() => copyText(result.tiktok as string, "tt")}
                    className="px-3 py-1 text-xs bg-[#1a1a2e] rounded-lg cursor-pointer hover:bg-[#222]"
                  >
                    {copied === "tt" ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                  {result.tiktok as string}
                </p>
              </div>
            )}

            {/* Email */}
            {result.email && typeof result.email === "object" && (
              <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📧</span>
                    <span className="font-bold">Email Newsletter</span>
                  </div>
                  <button
                    onClick={() =>
                      copyText(
                        `Subject: ${(result.email as { subject: string; body: string }).subject}\n\n${(result.email as { subject: string; body: string }).body}`,
                        "em",
                      )
                    }
                    className="px-3 py-1 text-xs bg-[#1a1a2e] rounded-lg cursor-pointer hover:bg-[#222]"
                  >
                    {copied === "em" ? "✅ Copied!" : "📋 Copy"}
                  </button>
                </div>
                <div className="bg-[#0a0a0f] rounded-xl p-3 mb-2">
                  <span className="text-xs text-gray-500">Subject: </span>
                  <span className="text-sm font-semibold">
                    {
                      (result.email as { subject: string; body: string })
                        .subject
                    }
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
                  {(result.email as { subject: string; body: string }).body}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
