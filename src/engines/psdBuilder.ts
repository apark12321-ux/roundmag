import { writePsdBuffer, Psd, Layer } from "ag-psd";
import { createCanvas, loadImage } from "canvas";
import fs from "fs";
import path from "path";

export interface CanvasLayerData {
  type: "background" | "logo" | "text";
  name: string;
  imageSrc?: string;
  text?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize?: number;
  fontName?: string;
  postScriptName?: string;
  color?: string;
  opacity?: number;
}

/**
 * Utility to load an image source resiliently.
 * Can be a base64 data URI, a local uploads path, or a remote URL.
 */
async function loadImgResilient(src: string): Promise<any> {
  if (src.startsWith("data:image")) {
    const base64Data = src.split(",")[1];
    if (base64Data) {
      const buffer = Buffer.from(base64Data, "base64");
      return await loadImage(buffer);
    }
  }

  // Local static file resolution
  if (src.startsWith("/uploads/")) {
    const localPath = path.join(process.cwd(), "public", src);
    if (fs.existsSync(localPath)) {
      return await loadImage(localPath);
    }
    const alternativePath = path.join(process.cwd(), "data", src);
    if (fs.existsSync(alternativePath)) {
      return await loadImage(alternativePath);
    }
  }

  // Fallback to remote fetch/direct canvas load
  try {
    return await loadImage(src);
  } catch (error) {
    console.error("Failed to load image remote direct, trying buffer fetch:", src, error);
    // Remote url fetching buffer fallback
    try {
      const response = await fetch(src);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return await loadImage(buffer);
    } catch (fetchErr) {
      console.error("Buffer fetch failed too, creating fallback color swatch:", fetchErr);
      // Create empty fallback canvas image so compile doesn't crash
      const fallbackCanvas = createCanvas(400, 400);
      const ctx = fallbackCanvas.getContext("2d");
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 0, 400, 400);
      return fallbackCanvas;
    }
  }
}

/**
 * Robustly parses custom color formats into { r, g, b } objects for ag-psd
 */
function parseHexColor(hex?: string): { r: number; g: number; b: number } {
  if (!hex) return { r: 255, g: 255, b: 255 };
  
  if (hex.startsWith("rgb")) {
    const parts = hex.match(/\d+/g);
    if (parts && parts.length >= 3) {
      return {
        r: Math.min(255, Math.max(0, parseInt(parts[0], 10))),
        g: Math.min(255, Math.max(0, parseInt(parts[1], 10))),
        b: Math.min(255, Math.max(0, parseInt(parts[2], 10)))
      };
    }
  }

  const cleaned = hex.replace("#", "").trim();
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return { r: isNaN(r) ? 255 : r, g: isNaN(g) ? 255 : g, b: isNaN(b) ? 255 : b };
  }
  if (cleaned.length === 6 || cleaned.length === 8) {
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return { r: isNaN(r) ? 255 : r, g: isNaN(g) ? 255 : g, b: isNaN(b) ? 255 : b };
  }
  return { r: 255, g: 255, b: 255 };
}

export async function buildMagazinePsd(
  width: number,
  height: number,
  layersData: CanvasLayerData[],
  dualExportMode: "editable" | "rasterized" = "editable"
): Promise<Buffer> {
  const psd: any = {
    width,
    height,
    children: []
  };

  for (const data of layersData) {
    if (data.type === "background" || data.type === "logo") {
      if (!data.imageSrc) continue;
      
      const img = await loadImgResilient(data.imageSrc);
      
      // Determine canvas sizes. If we have explicit width/height in canvas data, scale it
      const targetW = data.width || img.width || width;
      const targetH = data.height || img.height || height;
      
      const layerCanvas = createCanvas(targetW, targetH);
      const ctx = layerCanvas.getContext("2d");
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const newLayer: any = {
        name: data.name,
        opacity: data.opacity ?? 1,
        left: data.x,
        top: data.y,
        right: data.x + targetW,
        bottom: data.y + targetH,
        canvas: layerCanvas as any
      };

      // Implement Strategy: Inject empty Layer Mask specifically for the Logo layer
      if (data.type === "logo") {
        const maskCanvas = createCanvas(targetW, targetH);
        const maskCtx = maskCanvas.getContext("2d");
        
        // Fill white: completely visible by default. 
        // Designers can paint with black to mask sections.
        maskCtx.fillStyle = "#ffffff";
        maskCtx.fillRect(0, 0, targetW, targetH);

        newLayer.mask = {
          left: 0,
          top: 0,
          right: targetW,
          bottom: targetH,
          canvas: maskCanvas as any,
        };
      }

      psd.children.push(newLayer);
    } else if (data.type === "text" && data.text) {
      const textW = Math.max(data.width || 600, 100);
      const textH = Math.max(data.height || 150, 50);
      const fontSize = data.fontSize ?? 48;
      const fontName = data.fontName ?? "Arial";
      
      const textCanvas = createCanvas(textW, textH);
      const ctx = textCanvas.getContext("2d");
      
      // Render text on canvas
      ctx.font = `bold ${fontSize}px "${fontName}"`;
      ctx.fillStyle = data.color ?? "#ffffff";
      ctx.textBaseline = "top";
      ctx.fillText(data.text, 0, 0);

      const layerName = `TXT_${data.text.substring(0, 12)}`;

      if (dualExportMode === "rasterized") {
        // Option B: Rasterize text layer completely to preserve font shape across all environments
        psd.children.push({
          name: `${layerName} (Rasterized)`,
          opacity: data.opacity ?? 1,
          left: data.x,
          top: data.y,
          right: data.x + textW,
          bottom: data.y + textH,
          canvas: textCanvas as any
        });
      } else {
        // Option A: Keep text layer editable mapped via PostScript font name lookup
        psd.children.push({
          name: layerName,
          opacity: data.opacity ?? 1,
          left: data.x,
          top: data.y,
          right: data.x + textW,
          bottom: data.y + textH,
          canvas: textCanvas as any,
          text: {
            text: data.text,
            transform: [1, 0, 0, 1, data.x, data.y],
            style: {
              font: { name: data.postScriptName ?? "ArialMT" },
              fontSize,
              fillColor: parseHexColor(data.color)
            }
          }
        });
      }
    }
  }

  return writePsdBuffer(psd);
}
