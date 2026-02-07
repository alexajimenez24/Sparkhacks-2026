import { useState } from "react";
import { sendPromptToLlama } from "../services/apiService";
export default function useLlama() {
    const [loading, setLoading] = useState(false);
    const [output, setOutput] = useState("");
    const [error, setError] = useState(null);
    const generate = async (prompt) => {
        try {
            setLoading(true);
            setError(null);
            setOutput("");

            const result = await sendPromptToLlama(prompt);
            setOutput(result);
        } catch (err) {
            setError(err.message);
            setOutput("❌ Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };
    return {
        loading,
        output,
        error,
        generate,
    };
}