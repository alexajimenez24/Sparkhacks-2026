import PromptBox from "./components/promptBox";
import OutputBox from "./components/outputBox";
import useLlama from "./hooks/useLlama";
import "./App.css";

export default function App() {
  const { loading, output, generate } = useLlama();

  return (
    <div className="min-h-screen industrial-bg text-gray-100 flex flex-col items-center px-4 py-10">
      
      {/* 🏭 Header */}
      <header className="w-full max-w-4xl mb-8">
        <div className="header-panel p-6 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-wide text-accent">
                Grainger Shopping Assistant
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Parts • Tools • Safety • Equipment Support
            </p>
          </div>
          <div className="status-indicator mt-4 md:mt-0">
            🟢 24/7 Customer Support Guaranteed
          </div>
        </div>
      </header>

      {/* 💬 Chat Panel */}
      <main className="chat-panel w-full max-w-4xl p-6 rounded-xl">
        <OutputBox loading={loading} output={output} />
        <PromptBox onSubmit={generate} loading={loading} />
      </main>

      {/* 🧾 Footer */}
      <footer className="mt-8 text-xs opacity-40 text-center">
        AI assistant for industrial product support and procurement help
      </footer>
    </div>
  );
}
