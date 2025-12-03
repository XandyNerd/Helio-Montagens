document.addEventListener('DOMContentLoaded', function () {

    // Elements
    const serviceRadios = document.querySelectorAll('input[name="servico"]');
    const outroServicoGroup = document.getElementById('outroServicoGroup');
    const tipoMovelSelect = document.getElementById('tipoMovel');
    const medidasGroup = document.getElementById('medidasGroup');
    const descMovelGroup = document.getElementById('descMovelGroup');
    const fotosGroup = document.getElementById('fotosGroup');
    const medidasLabel = document.querySelector('label[for="medidas"]');
    const fotoInput = document.getElementById('fotoMovel');
    const fileChosenSpan = document.getElementById('fileChosen');
    const btnGerarZap = document.getElementById('btnGerarZap');

    // 1. Service Type Logic
    serviceRadios.forEach(radio => {
        radio.addEventListener('change', function () {
            if (this.value === 'Outro') {
                outroServicoGroup.classList.remove('hidden');
            } else {
                outroServicoGroup.classList.add('hidden');
            }
        });
    });

    // 2. Furniture Type Logic
    tipoMovelSelect.addEventListener('change', function () {
        const selected = this.value;

        // Reset
        medidasGroup.classList.add('hidden');
        descMovelGroup.classList.add('hidden');
        fotosGroup.classList.add('hidden');

        // Logic
        if (['Guarda-Roupa', 'Rack'].includes(selected)) {
            medidasGroup.classList.remove('hidden');
            fotosGroup.classList.remove('hidden');
            medidasLabel.innerHTML = 'Medidas (Altura x Largura) <span class="text-muted">(ou envie foto)</span>';
        } else if (selected === 'Cozinha') {
            medidasGroup.classList.remove('hidden');
            fotosGroup.classList.remove('hidden');
            medidasLabel.innerHTML = 'Medidas (Obrigatório) <span class="text-danger">*</span>';
        } else if (selected === 'Outros') {
            descMovelGroup.classList.remove('hidden');
            fotosGroup.classList.remove('hidden');
        }
    });

    // 3. File Input UI
    fotoInput.addEventListener('change', function () {
        if (this.files && this.files.length > 0) {
            fileChosenSpan.textContent = `${this.files.length} foto(s) selecionada(s)`;
            fileChosenSpan.style.color = 'var(--primary-color)';
            fileChosenSpan.style.fontWeight = 'bold';
        } else {
            fileChosenSpan.textContent = 'Nenhuma foto selecionada';
            fileChosenSpan.style.color = '';
            fileChosenSpan.style.fontWeight = '';
        }
    });

    // 4. Submit Form to API
    btnGerarZap.addEventListener('click', async function () {
        // Validation
        const nome = document.getElementById('nome').value;
        const telefone = document.getElementById('telefone').value;
        const endereco = document.getElementById('endereco').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const servico = document.querySelector('input[name="servico"]:checked');
        const tipoMovel = tipoMovelSelect.value;

        if (!nome || !telefone || !endereco || !data || !hora || !servico || !tipoMovel) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Show Loading State
        const originalBtnText = btnGerarZap.innerHTML;
        btnGerarZap.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btnGerarZap.disabled = true;

        try {
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('telefone', telefone);
            formData.append('endereco', endereco);
            // formData.append('bairro', ''); // Opcional se quiser separar
            formData.append('data', data);
            formData.append('hora', hora);
            formData.append('servico', servico.value);
            formData.append('tipoMovel', tipoMovel);

            const outroDesc = document.getElementById('outroServicoDesc').value;
            if (outroDesc) formData.append('outroServicoDesc', outroDesc);

            const medidas = document.getElementById('medidas').value;
            if (medidas) formData.append('medidas', medidas);

            const descMovel = document.getElementById('descMovel').value;
            if (descMovel) formData.append('descMovel', descMovel);

            const obs = document.getElementById('observacoes').value;
            if (obs) formData.append('observacoes', obs);

            // Append Files
            if (fotoInput.files.length > 0) {
                for (let i = 0; i < fotoInput.files.length; i++) {
                    formData.append('fotos', fotoInput.files[i]);
                }
            }

            // Send to Backend
            const response = await fetch('/api/agendamento', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Redirect to WhatsApp
                window.open(result.whatsappUrl, '_blank');
                // Optional: Reset form or show success message
                // document.getElementById('checklistForm').reset();
            } else {
                alert('Erro ao enviar: ' + (result.error || 'Tente novamente.'));
            }

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro de conexão. Verifique se o servidor está rodando.');
        } finally {
            btnGerarZap.innerHTML = originalBtnText;
            btnGerarZap.disabled = false;
        }
    });
});
