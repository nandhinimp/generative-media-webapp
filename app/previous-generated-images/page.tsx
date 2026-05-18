import GenerationLibrary from "@/components/GenerationLibrary";

export default function PreviousGeneratedImagesPage() {
  return (
    <main className="min-h-screen text-white py-6 sm:py-8">
      <GenerationLibrary
        mode="all"
        title="Previous Generated Images"
        description="Browse the full generation history stored in your workspace."
      />
    </main>
  );
}
