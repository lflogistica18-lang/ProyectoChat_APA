document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('story-generator-form');
    const inputFotos = document.getElementById('fotos_viandas');
    const previewContainer = document.getElementById('preview-container');
    const dropZone = document.getElementById('drop-zone');
    
    // UI Elements
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');
    const btnIcon = document.getElementById('btn-icon');
    const btnSpinner = document.getElementById('btn-spinner');
    const successMsg = document.getElementById('success-msg');
    const errorMsg = document.getElementById('error-msg');
    
    // Vista Previa de Imágenes
    inputFotos.addEventListener('change', function(e) {
        previewContainer.innerHTML = '';
        const files = Array.from(e.target.files);
        
        if (files.length > 3) {
            alert('Por favor selecciona un máximo de 3 fotos para no saturar a la IA.');
            // Reset input
            this.value = '';
            previewContainer.classList.add('hidden');
            dropZone.classList.remove('hidden');
            return;
        }

        if (files.length > 0) {
            previewContainer.classList.remove('hidden');
            dropZone.classList.add('hidden'); // Ocultar zona de drop si hay archivos
            
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgDiv = document.createElement('div');
                    imgDiv.className = 'aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-sm relative group';
                    imgDiv.innerHTML = `
                        <img src="${e.target.result}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onclick="document.getElementById('fotos_viandas').click()">
                            <span class="text-white text-xs font-bold"><i class="fa-solid fa-pen"></i> Cambiar</span>
                        </div>
                    `;
                    previewContainer.appendChild(imgDiv);
                }
                reader.readAsDataURL(file);
            });
        } else {
            previewContainer.classList.add('hidden');
            dropZone.classList.remove('hidden');
        }
    });

    // Envío del Formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const files = inputFotos.files;
        if (files.length === 0) {
            alert('Por favor sube al menos 1 fotografía real de tu vianda para que la IA tenga contexto.');
            return;
        }

        const formData = new FormData();
        formData.append('promocion', document.getElementById('promocion').value);
        formData.append('contexto', document.getElementById('contexto').value);
        
        // Agregar archivos
        for (let i = 0; i < files.length; i++) {
            formData.append(`foto_${i+1}`, files[i]);
        }

        // Estado "Cargando"
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
        btnText.textContent = 'Enviando a la Inteligencia Artificial...';
        btnIcon.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
        errorMsg.classList.add('hidden');

        try {
            // Reemplazar con la URL de webhook de pruebas/producción de tu n8n
            const WEBHOOK_URL = 'https://n8n-prod-lucas.duckdns.org/webhook/generar-historias';
            
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                body: formData // Fetch construye automáticamente el multipart/form-data
            });

            if (response.ok) {
                form.classList.add('hidden');
                successMsg.classList.remove('hidden');
            } else {
                throw new Error('Error en la respuesta del Webhook');
            }
        } catch (error) {
            console.error('Error:', error);
            errorMsg.classList.remove('hidden');
            
            // Revertir UI
            submitBtn.disabled = false;
            submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
            btnText.textContent = 'Intentar nuevamente';
            btnIcon.classList.remove('hidden');
            btnSpinner.classList.add('hidden');
        }
    });
});
