"use client";

import { useAuth } from "@/hooks/useAuth";

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
};

export default function AuthPrompt({ title, description, actionLabel = "Sign in with Google" }: Props) {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="rounded-3xl border border-white/8 bg-white/4 p-6 text-center shadow-2xl glass">
      <h2 className="text-xl font-semibold text-zinc-100">{title}</h2>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
      <button
        onClick={loginWithGoogle}
        className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-50 transition hover:bg-cyan-500/20"
      >
        {actionLabel}
      </button>
    </div>
  );
}