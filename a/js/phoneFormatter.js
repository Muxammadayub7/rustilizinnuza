// 1. DAVLATLAR VA FORMATLAR
const countriesData = [
    { name: 'Uzbekistan', code: '+998', flag: '🇺🇿', iso: 'uz', ph: '88 888 88 88', g: [2, 3, 2, 2] },
    { name: 'Rossiya', code: '+7', flag: '🇷🇺', iso: 'ru', ph: '900 123 45 67', g: [3, 3, 2, 2] },
    { name: 'Turkiya', code: '+90', flag: '🇹🇷', iso: 'tr', ph: '5xx 123 45 67', g: [3, 3, 2, 2] },
    { name: 'AQSH', code: '+1', flag: '🇺🇸', iso: 'us', ph: '555 123 4567', g: [3, 4, 3] }
];

// 2. FORMATTER FUNKSIYASI
function initPhoneFormatter() {
    const phoneInput = document.getElementById('phone');
    const countryBtn = document.getElementById('selectedCountry');
    const flagEl = document.getElementById('selectedCountryFlag');
    const codeEl = document.getElementById('selectedCountryCodeText');
    const dropdown = document.getElementById('countryDropdown');
    const errorEl = document.getElementById('phoneError');

    let currentConfig = countriesData[0];

    // BAYROQ VA ISO NI YANGILASH (Tozalab yozish)
    function updateUI(country) {
        currentConfig = country;
        
        // innerHTML ishlatilganda '=' belgisi eski kontentni tozalab tashlaydi
        flagEl.innerHTML = `
            <span style="text-transform:lowercase; opacity: 0.8;">${country.iso}</span> 
            <svg style="margin-left:4px" width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 3L6 6L10.5 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span style="margin-left:8px">${country.flag}</span>`;

        codeEl.textContent = country.code;
        phoneInput.placeholder = country.ph;
        phoneInput.value = ''; 
        dropdown.style.display = 'none';
        if (errorEl) errorEl.style.display = 'none'; 
    }

    countryBtn.onclick = e => {
        e.stopPropagation();
        dropdown.innerHTML = countriesData.map(c => `
            <div class="country-option" onclick='window.selectCountry("${c.code}")'>
                <span>${c.flag} ${c.name}</span>
                <span>${c.code}</span>
            </div>
        `).join('');
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    };

    window.selectCountry = code => {
        const country = countriesData.find(c => c.code === code);
        updateUI(country);
    };

    phoneInput.oninput = e => {
        let val = e.target.value.replace(/\D/g, ''); // Faqat raqamlarni olish
        let formatted = '';
        let charIdx = 0;
        for (let i = 0; i < currentConfig.g.length && charIdx < val.length; i++) {
            formatted += (i > 0 ? ' ' : '') + val.substring(charIdx, charIdx + currentConfig.g[i]);
            charIdx += currentConfig.g[i];
        }
        e.target.value = formatted;
        if (errorEl) errorEl.style.display = 'none'; // Xatoni yashirish
    };

    document.addEventListener('click', () => (dropdown.style.display = 'none'));

    return {
        validate: () => {
            // FAQAT RAQAMLARNI SANAYMIZ (Probellarsiz)
            const digits = phoneInput.value.replace(/\D/g, '');
            const requiredLength = currentConfig.g.reduce((a, b) => a + b, 0);
            return digits.length === requiredLength;
        },
        getFullNumber: () => currentConfig.code + ' ' + phoneInput.value
    };
}

// 3. ASOSIY DOM LOGIKASI
document.addEventListener('DOMContentLoaded', () => {
    const formatter = initPhoneFormatter();
    const modal = document.getElementById('registrationModal');
    const openBtns = document.querySelectorAll('#open, .open-modal-btn');
    const closeBtn = document.getElementById('closeModalBtn');
    const form = document.getElementById('registrationForm');

    // Apps Script URL ni shu yerga qo'y
    const SCRIPT_URL = 'SENING_WEB_APP_URL_MANA_SHU_YERGA';

    openBtns.forEach(btn => {
        btn.onclick = e => {
            e.preventDefault();
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        };
    });

    const hide = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
    if (closeBtn) closeBtn.onclick = hide;

    form.onsubmit = async e => {
        e.preventDefault();
        const nameVal = document.getElementById('name').value.trim();
        const submitBtn = document.getElementById('submitBtn');

        const isNameValid = !!nameVal;
        const isPhoneValid = formatter.validate();

        document.getElementById('nameError').style.display = isNameValid ? 'none' : 'block';
        document.getElementById('phoneError').style.display = isPhoneValid ? 'none' : 'block';

        if (isNameValid && isPhoneValid) {
            try {
                submitBtn.disabled = true;
                submitBtn.innerText = 'YUBORILMOQDA...';

                const formData = new FormData();
                formData.append('Ism', nameVal);
                formData.append('Telefon raqam', formatter.getFullNumber());
                formData.append("Royhatdan o'tgan vaqti", new Date().toLocaleString());

                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors',
                });

                // SAHIFAGA YO'NALTIRISH (Redirect)
                window.location.href = 'thankYou.html'; 
                
                form.reset();
            } catch (error) {
                console.error('Xato:', error);
                alert('Xatolik yuz berdi!');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = 'DAVOM ETISH';
            }
        }
    };
});