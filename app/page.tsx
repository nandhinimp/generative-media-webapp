import PromptForm from "@/components/PromptForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      
      <div className="max-w-5xl mx-auto">
        
        <h1 className="text-5xl font-bold text-center mt-16">
          Generative Media Web App
        </h1>

        <p className="text-zinc-400 text-center mt-4">
          Generate AI-powered images from prompts.
        </p>

        <PromptForm />

      </div>

    </main>
  );
}