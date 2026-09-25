// Client-only: convert a chosen image File to a compressed WebP Blob via canvas,
// downscaling to a sensible max dimension. Keeps uploads small and consistent.

export async function convertToWebp(
  file: File,
  maxDim = 1600,
  quality = 0.82,
): Promise<Blob> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });

  const image: HTMLImageElement = await new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not load the image"));
    el.src = dataUrl;
  });

  let { width, height } = image;
  if (width > maxDim || height > maxDim) {
    const scale = Math.min(maxDim / width, maxDim / height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser");
  ctx.drawImage(image, 0, 0, width, height);

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/webp", quality),
  );
  if (!blob) throw new Error("WebP conversion failed");
  return blob;
}
