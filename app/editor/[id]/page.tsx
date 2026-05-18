import ImageEditorStudio from "@/components/editor/ImageEditorStudio";

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen text-white py-6 sm:py-8">
      <ImageEditorStudio imageId={id} />
    </main>
  );
}
