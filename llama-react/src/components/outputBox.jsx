export default function OutputBox({ loading, output }) {
    return (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 h-48 overflow-auto text-black">
            {loading ? "⏳ Thinking..." : output || "Your result will appear here."}
        </div>
    );
}