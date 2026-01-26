"use client";

import { useState } from "react";

export default function TestGoogleLogin() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/test/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `test${Date.now()}@google.com`,
          name: "Test User",
          image: "https://example.com/photo.jpg"
        })
      });
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6">Test Google Login Flow</h1>
        
        <button
          onClick={testGoogleLogin}
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold mb-6"
        >
          {loading ? "Testeando..." : "Simular Google Login"}
        </button>

        {response && (
          <div className="bg-white/10 border border-purple-500/30 rounded-lg p-6">
            <pre className="text-white whitespace-pre-wrap">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
