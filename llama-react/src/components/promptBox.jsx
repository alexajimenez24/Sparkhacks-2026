import { useState } from "react";

export default function PromptBox({ onSubmit, loading }) {
    const [prompt, setPrompt] = useState("");

    const handleClick = () => {
        if (!prompt.trim()) return;
        onSubmit(prompt);
    };

    return (
        <div>
            <textarea
                className="w-full p-3 border rounded-lg"
                placeholder="Ask Grain.AI anything..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />

            <button
                disabled={loading}
                onClick={handleClick}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
                {loading ? "Generating..." : "Generate"}
            </button>
        </div>
    );
}