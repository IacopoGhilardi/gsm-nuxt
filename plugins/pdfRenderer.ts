import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/+esm`

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('renderPdf', async (pdfUrl: string, canvasId: string) => {
        console.log('Starting PDF render with URL:', pdfUrl);

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
            // Aggiungi timeout al caricamento
            const loadingTask = pdfjsLib.getDocument({
                url: pdfUrl,
                withCredentials: false,
                cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/cmaps/',
                cMapPacked: true,
            });

            // Imposta un timeout di 30 secondi
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Loading timeout')), 30000);
            });

            // Carica il PDF con timeout
            const pdf = await Promise.race([
                loadingTask.promise,
                timeoutPromise
            ]);

            console.log('PDF loaded successfully');

            // Ottieni la prima pagina
            const page = await pdf.getPage(1);
            
            // Calcola la scala in base alla larghezza del container
            const container = canvas.parentElement;
            const containerWidth = container?.clientWidth || window.innerWidth;
            const viewport = page.getViewport({ scale: 1.0 });
            const scale = containerWidth / viewport.width;
            
            // Applica la scala calcolata
            const scaledViewport = page.getViewport({ scale });
            
            // Imposta le dimensioni del canvas
            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;

            // Renderizza la pagina
            await page.render({
                canvasContext: context,
                viewport: scaledViewport
            }).promise;
            console.log('Page rendered');
        } catch (error) {
            console.error('Error rendering PDF:', error);
        }
    });
});