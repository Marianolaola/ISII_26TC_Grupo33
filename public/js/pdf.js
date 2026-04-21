// --- LÓGICA DEL PDF ---
    
export function descargarComprobantePDF(idElemento)
{
    const elemento = document.getElementById(idElemento);
    
    if (!elemento) {
        console.error("No se encontró el elemento para el PDF");
        return;
    }

    // Configuramos cómo queremos que salga el PDF
    setTimeout(() => {
        const opciones = {
            margin:       1,
            filename:     'comprobante_extraccion.pdf',
            image:         { type: 'jpeg', quality: 0.98 },
            html2canvas:   { scale: 2, scrollY: 0},
            jsPDF:         { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
    
        // Usamos la librería (que ya debe estar cargada en el HTML)
        html2pdf().set(opciones).from(elemento).save();
    }, 100);
}