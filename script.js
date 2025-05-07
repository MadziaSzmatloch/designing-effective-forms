let clickCount = 0;
const form = document.getElementById('form');
const countryInput = document.getElementById('country');
const countrySuggestions = document.getElementById('countrySuggestions');
const countryCodeSelect = document.getElementById('countryCode');
const clicksInfo = document.getElementById('click-count');
const vatUECheckbox = document.getElementById('vatUE');
const invoiceSection = document.getElementById('invoiceSection');
let countries = [];

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Błąd pobierania danych');
        const data = await response.json();
        countries = data.map(country => country.name.common).sort();
        populateSuggestions(countries);
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function populateSuggestions(suggestions) {
    countrySuggestions.innerHTML = suggestions.map(s => `<li class="list-group-item" data-value="${s}">${s}</li>`).join('');
    countrySuggestions.querySelectorAll('li').forEach(item => {
        item.addEventListener('click', () => {
            countryInput.value = item.dataset.value;
            countrySuggestions.style.display = 'none';
            getCountryCode(item.dataset.value);
        });
    });
}

countryInput.addEventListener('input', () => {
    const query = countryInput.value.toLowerCase();
    const filtered = countries.filter(c => c.toLowerCase().includes(query));
    countrySuggestions.style.display = query ? 'block' : 'none';
    populateSuggestions(filtered);
    if (countries.includes(countryInput.value)) {
        getCountryCode(countryInput.value);
    }
});

countryInput.addEventListener('focus', () => {
    if (countryInput.value) {
        const filtered = countries.filter(c => c.toLowerCase().includes(countryInput.value.toLowerCase()));
        countrySuggestions.style.display = 'block';
        populateSuggestions(filtered);
    }
});

document.addEventListener('click', (e) => {
    if (!countryInput.contains(e.target) && !countrySuggestions.contains(e.target)) {
        countrySuggestions.style.display = 'none';
    }
});

async function getCountryByIP() {
    try {
        const response = await fetch('https://get.geojs.io/v1/ip/geo.json');
        const data = await response.json();
        const country = data.country;
        countryInput.value = country;
        await getCountryCode(country);
    } catch (error) {
        console.error('Błąd pobierania danych z GeoJS:', error);
    }
}

async function getCountryCode(countryName) {
    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`);
        if (!response.ok) throw new Error('Błąd pobierania danych');
        const data = await response.json();
        const countryCode = data[0].idd.root + (data[0].idd.suffixes ? data[0].idd.suffixes[0] : '');
        const availableCodes = Array.from(countryCodeSelect.options).map(opt => opt.value);
        if (availableCodes.includes(countryCode)) {
            countryCodeSelect.value = countryCode;
        } else {
            countryCodeSelect.value = ''; // Reset if code not available
        }
    } catch (error) {
        console.error('Wystąpił błąd:', error);
        countryCodeSelect.value = ''; // Reset on error
    }
}

vatUECheckbox.addEventListener('change', () => {
    invoiceSection.classList.toggle('hidden', !vatUECheckbox.checked);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
    } else {
        const modal = new bootstrap.Modal(document.getElementById('form-feedback-modal'));
        modal.show();
    }
});

form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            form.querySelector('button[type="submit"]').click();
        }
    });
});

(() => {
    document.addEventListener('click', handleClick);
    fetchAndFillCountries();
    getCountryByIP();
})();