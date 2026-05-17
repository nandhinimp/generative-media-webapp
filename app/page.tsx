import PromptForm from "@/components/PromptForm";

export default function Home() {
  return (
    <main className="min-h-screen text-white py-4 sm:py-6">
      <div className="container-xl w-full">
        <section className="max-w-5xl mx-auto text-center pt-4 md:pt-6">
          <h1 className="text-5xl md:text-6xl leading-tight font-extrabold gradient-text">
            Create cinematic AI imagery —
            <span className="block text-4xl md:text-5xl font-normal mt-2 text-zinc-300">fast, elegant, and precise</span>
          </h1>

          <p className="mt-6 text-zinc-400 text-lg max-w-2xl mx-auto">
            Generate high-fidelity visuals with refined controls. Designed for creators who demand a premium, minimal interface that stays out of the way.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a className="btn-gradient text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:scale-[1.02] transition-transform" href="#">
              Get Started — Generate
            </a>
            <a className="px-4 py-3 rounded-xl border border-white/6 text-sm muted" href="#">
              Learn more
            </a>
          </div>
        </section>

        <section className="mt-10">
          <PromptForm />
        </section>
      </div>
    </main>
  );
}