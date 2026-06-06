import { toPng } from "html-to-image";

export async function exportNodeToPng(node: HTMLElement, filename = "postcard.png"): Promise<void> {
  const dataUrl = await toPng(node, { cacheBust: true, pixelRatio: 2 });
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}
