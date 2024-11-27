import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/+esm`

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('renderPdf', async (pdfUrl: string, canvasId: string) => {
      const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
      if (!canvas) {
        console.error('Canvas not found');
        return;
      }
      const context = canvas.getContext('2d');
      if (!context) {
        console.error('2D context not found');
        return;
      }
  
      try {
        console.log('Loading PDF:', pdfUrl);
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        loadingTask.onProgress = (progressData: any) => {
          console.log('Loading progress:', progressData);
        };
        const pdf = await loadingTask.promise;
        console.log('PDF loaded');
        const page = await pdf.getPage(1);
        console.log('Page retrieved');
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
  
        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await page.render(renderContext).promise;
        console.log('Page rendered');
      } catch (error) {
        console.error('Error rendering PDF:', error);
      }
    });
  });