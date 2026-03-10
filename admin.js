document.addEventListener('DOMContentLoaded', () => {
    
    // Elements
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    const loginForm = document.getElementById('login-form');
    const ratesForm = document.getElementById('rates-form');
    const loginError = document.getElementById('login-error');
    const saveMsg = document.getElementById('save-msg');
    const logoutBtn = document.getElementById('logout-btn');
    const ratesTbody = document.getElementById('rates-tbody');

    // Crops List
    const crops = [
        { id: 'soybean', name_en: 'Soybean', name_mr: 'सोयाबीन' },
        { id: 'cotton', name_en: 'Cotton', name_mr: 'कापूस' },
        { id: 'tur', name_en: 'Tur', name_mr: 'तूर' },
        { id: 'moong', name_en: 'Moong', name_mr: 'मूग' },
        { id: 'wheat', name_en: 'Wheat', name_mr: 'गहू' },
        { id: 'jowar', name_en: 'Jowar', name_mr: 'ज्वारी' },
        { id: 'chana', name_en: 'Chana', name_mr: 'हरभरा' },
        { id: 'maize', name_en: 'Maize', name_mr: 'मका' }
    ];

    // Check Login State
    if (sessionStorage.getItem('admin_logged_in') === 'true') {
        showDashboard();
    }

    // Login Form Submit
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const mobile = document.getElementById('mobile').value;
        const password = document.getElementById('password').value;

        if (mobile === '9545235650' && password === 'bashinde') {
            sessionStorage.setItem('admin_logged_in', 'true');
            showDashboard();
        } else {
            loginError.textContent = "Invalid mobile number or password.";
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('admin_logged_in');
        loginContainer.classList.remove('hidden');
        dashboardContainer.classList.add('hidden');
        loginForm.reset();
        loginError.textContent = "";
    });

    // Show Dashboard and Render Table Form
    function showDashboard() {
        loginContainer.classList.add('hidden');
        dashboardContainer.classList.remove('hidden');
        renderRatesForm();
    }

    // Render Rates Input Table
    function renderRatesForm() {
        // Get existing data to pre-fill
        let savedRates = {};
        try {
            savedRates = JSON.parse(localStorage.getItem('mtc_crop_rates')) || {};
        } catch(e) {}

        ratesTbody.innerHTML = '';

        crops.forEach(crop => {
            const tr = document.createElement('tr');
            
            const savedKiman = savedRates[crop.id] ? savedRates[crop.id].kiman : '';
            const savedKamal = savedRates[crop.id] ? savedRates[crop.id].kamal : '';
            const savedSarasari = savedRates[crop.id] ? savedRates[crop.id].sarasari : '0.00';

            tr.innerHTML = `
                <td>
                    <div class="crop-name-label">${crop.name_en} <br><span class="marathi-sm">${crop.name_mr}</span></div>
                </td>
                <td>
                    <input type="number" step="0.01" min="0" class="rate-input" data-crop="${crop.id}" data-type="kiman" value="${savedKiman}" placeholder="0.00" required>
                </td>
                <td>
                    <input type="number" step="0.01" min="0" class="rate-input" data-crop="${crop.id}" data-type="kamal" value="${savedKamal}" placeholder="0.00" required>
                </td>
                <td>
                    <div class="calc-sarasari" id="sarasari-${crop.id}">₹ ${savedSarasari}</div>
                </td>
            `;
            ratesTbody.appendChild(tr);
        });

        // Add auto calculation listeners
        const inputs = document.querySelectorAll('.rate-input');
        inputs.forEach(input => {
            input.addEventListener('input', updateSarasari);
        });
    }

    // Calculate Sarasari (Average) dynamically
    function updateSarasari(e) {
        const cropId = e.target.dataset.crop;
        const kimanInput = document.querySelector(`input[data-crop="${cropId}"][data-type="kiman"]`);
        const kamalInput = document.querySelector(`input[data-crop="${cropId}"][data-type="kamal"]`);
        const sarasariDiv = document.getElementById(`sarasari-${cropId}`);

        const kiman = parseFloat(kimanInput.value) || 0;
        const kamal = parseFloat(kamalInput.value) || 0;

        if (kiman > 0 && kamal > 0) {
            const sarasari = ((kiman + kamal) / 2).toFixed(2);
            sarasariDiv.textContent = `₹ ${sarasari}`;
        } else {
            sarasariDiv.textContent = `₹ 0.00`;
        }
    }

    // Save Rates Form
    ratesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const finalRates = {};
        
        crops.forEach(crop => {
            const kimanInput = document.querySelector(`input[data-crop="${crop.id}"][data-type="kiman"]`).value;
            const kamalInput = document.querySelector(`input[data-crop="${crop.id}"][data-type="kamal"]`).value;
            
            const kiman = parseFloat(kimanInput) || 0;
            const kamal = parseFloat(kamalInput) || 0;
            const sarasari = ((kiman + kamal) / 2).toFixed(2);

            finalRates[crop.id] = {
                kiman: kiman,
                kamal: kamal,
                sarasari: sarasari
            };
        });

        // Save to LocalStorage
        localStorage.setItem('mtc_crop_rates', JSON.stringify(finalRates));
        localStorage.setItem('mtc_rates_last_updated', new Date().toISOString());

        saveMsg.textContent = "Rates saved successfully! They are now live on the website.";
        setTimeout(() => {
            saveMsg.textContent = "";
        }, 3000);
    });
});
