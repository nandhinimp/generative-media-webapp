import GenerationLibrary from "@/components/GenerationLibrary";

export default function FavoritesPage() {
  return (
    <main className="min-h-screen text-white py-6 sm:py-8">
      <GenerationLibrary
        mode="favorites"
        title="Favorites"
        description="Images you marked as favorites are collected here for quick access."
      />
    </main>
  );
}
