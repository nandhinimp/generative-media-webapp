import PromptForm from "@/components/PromptForm";

export default async function Home({ searchParams }: { searchParams?: Promise<{ prompt?: string }> }) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return (
    <main className="min-h-screen text-white py-6 sm:py-8 pb-16 sm:pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-0 pb-6">
        <div className="rounded-3xl border border-white/8 bg-white/3 px-5 py-4 glass">
          <h1 className="text-2xl font-semibold text-zinc-100 sm:text-3xl">Generative Media Studio</h1>
          <p className="mt-1 text-sm text-zinc-400 sm:text-base">
            Create, tune, and review AI images from one clean workspace.
          </p>
        </div>
      </div>

      <PromptForm initialPrompt={resolvedSearchParams?.prompt} />
    </main>
  );
}