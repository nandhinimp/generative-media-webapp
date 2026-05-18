export async function downloadImage(url: string, filename?: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to download image');
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = filename || 'image.jpg';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}
