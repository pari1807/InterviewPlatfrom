export async function convertPdfToImage(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    if (typeof window !== "undefined" && !window.pdfjsLib) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
        script.onload = () => {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
          resolve();
        };
        script.onerror = () => reject(new Error("Failed to load PDF.js client helper."));
        document.head.appendChild(script);
      });
    }

    const pdfjsLib = window.pdfjsLib;
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get canvas 2D rendering context.");
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const imgFile = new File([blob], `${file.name.replace(/\.pdf$/i, "")}.png`, { type: "image/png" });
          resolve({ file: imgFile });
        } else {
          resolve({ file: null });
        }
      }, "image/png");
    });
  } catch (err) {
    console.error("PDF to Image conversion error:", err);
    return { file: null };
  }
}
