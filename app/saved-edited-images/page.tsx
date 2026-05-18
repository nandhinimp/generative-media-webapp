import SavedEditsLibrary from "@/components/SavedEditsLibrary";

export default function SavedEditedImagesPage() {
  return (
    <main className="min-h-screen py-6 text-white sm:py-8">
      <SavedEditsLibrary
        title="Saved Edits"
        description="Edited images are stored separately here, leaving the original generation history untouched."
      />
    </main>
  );
}