document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu on clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Implement sticky navbar background and shadow
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // Language Switcher Logic
    const btnMr = document.getElementById('btn-mr');
    const btnEn = document.getElementById('btn-en');
    const htmlTag = document.documentElement;
    
    btnMr.addEventListener('click', () => {
        htmlTag.lang = 'mr';
        btnMr.classList.add('active');
        btnEn.classList.remove('active');
    });

    btnEn.addEventListener('click', () => {
        htmlTag.lang = 'en';
        btnEn.classList.add('active');
        btnMr.classList.remove('active');
    });

    // Load and Render Today's Rates
    function loadTodayRates() {
        const displayBody = document.getElementById('display-rates-tbody');
        if (!displayBody) return; // Not on the page containing the table

        const cropsList = [
            { id: 'soybean', name_en: 'Soybean', name_mr: 'सोयाबीन' },
            { id: 'cotton', name_en: 'Cotton', name_mr: 'कापूस' },
            { id: 'tur', name_en: 'Tur', name_mr: 'तूर' },
            { id: 'moong', name_en: 'Moong', name_mr: 'मूग' },
            { id: 'wheat', name_en: 'Wheat', name_mr: 'गहू' },
            { id: 'jowar', name_en: 'Jowar', name_mr: 'ज्वारी' },
            { id: 'chana', name_en: 'Chana', name_mr: 'हरभरा' },
            { id: 'maize', name_en: 'Maize', name_mr: 'मका' }
        ];

        let savedRates = {};
        try {
            savedRates = JSON.parse(localStorage.getItem('mtc_crop_rates')) || {};
        } catch(e) {}

        displayBody.innerHTML = ''; // Clear loading text

        cropsList.forEach(crop => {
            const cropData = savedRates[crop.id] || { kiman: '-', kamal: '-', sarasari: '-' };
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <strong><span class="en">${crop.name_en}</span><span class="mr">${crop.name_mr}</span></strong>
                </td>
                <td>₹ ${cropData.kiman}</td>
                <td>₹ ${cropData.kamal}</td>
                <td style="font-weight:600; color:var(--primary-green);">₹ ${cropData.sarasari}</td>
            `;
            displayBody.appendChild(tr);
        });
    }

    loadTodayRates();
});
