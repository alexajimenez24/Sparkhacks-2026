import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PromptBox from "./components/promptBox";
import OutputBox from "./components/outputBox";
import useLlama from "./hooks/useLlama";

export default function App() {
  const { loading, output, generate } = useLlama();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <PromptBox onSubmit={generate} loading={loading} />
      <OutputBox loading={loading} output={output} />
    </div>
  );
}