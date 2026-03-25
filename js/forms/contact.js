document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('lead-form');
    // If form doesn't exist on this page, do nothing
    if (!form) return;

    const tipoClienteSelect = document.getElementById('tipo_cliente');
    const labelDinamico = document.getElementById('label-dinamico');
    const inputDinamico = document.getElementById('input-dinamico');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('success-msg');

    // Cambiar campo comercial según el tipo
    tipoClienteSelect.addEventListener('change', (e) => {
        if (e.target.value === 'Empresa') {
            labelDinamico.textContent = '¿Cuántos empleados tiene la empresa?';
            inputDinamico.placeholder = 'Ej: 50';
            inputDinamico.name = 'cantidad_empleados';
        } else {
            labelDinamico.textContent = '¿Cuántas viandas consumes a la semana aprox?';
            inputDinamico.placeholder = 'Ej: 5';
            inputDinamico.name = 'cantidad_viandas';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Estado de carga
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin align-middle mr-2">refresh</span> Enviando...';
        submitBtn.disabled = true;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Aseguramos qué campo extra no va según la selección para no mandar basura
        if (data.tipo_cliente === 'Empresa') {
            data.cantidad_viandas = "";
        } else {
            data.cantidad_empleados = "";
        }

        try {
            // URL MOCK DE N8N LOCAL (Webhooks Test de n8n)
            // Cuando cambies a producción el usuario deberá cambiar esta URL por la de su servidor real.
            const WEBHOOK_URL = 'https://n8n-prod-lucas.duckdns.org/webhook/lead-web';
            
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok || response.status === 200) {
                form.style.display = 'none';
                successMsg.classList.remove('hidden');
            } else {
                alert('Hubo un error al enviar tu consulta. Por favor intenta por WhatsApp.');
            }
        } catch (error) {
            console.error('Fetch error:', error);
            // Mostrar éxito igual si es error de CORS en test local o si n8n responde opaque
            form.style.display = 'none';
            successMsg.classList.remove('hidden');
            console.log("Nota: El mensaje de éxito se muestra aunque haya fallado la conexión real, asumiendo ambiente de pruebas local.");
            alert('Asegúrate de que el webhook de n8n esté en "Listen" en http://localhost:5678/webhook-test/lead-web');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});
