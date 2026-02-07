"use client"
import Link from 'next/link';
import { MouseEvent } from 'react';
import { useState } from 'react';
import FloatingChat from "@/components/chat/FloatingChat";

//import * as icons from "@/assets/homepage/core-features";

type Props = {
  href?: string;
  onClick?: (e: MouseEvent) => void;
  label?: string;
};

export default function FloatingButton({ href, onClick, label = 'Chatbot',}: Props) {
    const [open, setOpen] = useState(false);

  const handleClick = (e: MouseEvent) => {
    // call any provided handler
    onClick?.(e);
    // only toggle the local floating panel when there is no href (i.e. not navigating)
    if (href) return;
    setOpen((prev) => !prev);
  };

  const content = (
    <button
      onClick={handleClick}
      aria-label={label}
      className="inline-flex items-center justify-center w-15 h-15 sm:w-16 sm:h-16 rounded-full shadow-lg text-white bg-primary-700 hover:bg-primary-600 focus:outline-none focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-700 transition"
      style={{ position: 'relative' }}
    >
      {/* image from public/images/icon.svg */}
      <img src="/images/icon.svg" alt={label} className="w-6 h-6 sm:w-8 sm:h-8" />
    </button>
  );
  return (
    <div
      className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-[1000] pointer-events-auto"
      style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)' }}
    >
      {open && (
        <div
          className="absolute bottom-20 right-0 w-80 sm:w-96 p-6 sm:p-8 bg-white text-slate-900 shadow-xl rounded-lg border dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 max-h-[70vh] overflow-auto"
        >
          <FloatingChat />
        </div>
      )}
      

      {href ? <Link href={href}>{content}</Link> : content}
    </div>
  );
}