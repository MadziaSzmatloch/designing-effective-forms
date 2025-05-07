let clickCount = 0;
const myForm = document.getElementById('form');
const countryInput = document.getElementById('country');
const countrySuggestions = document.getElementById('countrySuggestions');
const clicksInfo = document.getElementById('click-count');
const vatUECheckbox = document.getElementById('vatUE');
const vatNumberInput = document.getElementById('vatNumber');
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
        countries = data.map(c => c.name.common).sort();
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

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Błąd pobierania danych');
            return response.json();
        })
        .then(data => {
            const countryCode = data[0].idd.root + (data[0].idd.suffixes ? data[0].idd.suffixes[0] : '');
            const codeSelect = document.getElementById('countryCode');
            for (let i = 0; i < codeSelect.options.length; i++) {
                if (codeSelect.options[i].value === countryCode) {
                    codeSelect.selectedIndex = i;
                    break;
                }
            }
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
}

async function fetchAndFillCountryCodes() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Błąd pobierania kodów');
        const data = await response.json();
        const countryCodes = data
            .filter(c => c.idd?.root && c.idd?.suffixes?.length)
            .map(c => {
                const code = c.idd.root + c.idd.suffixes[0];
                const name = c.name.common;
                return { name, code };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
        const codeSelect = document.getElementById('countryCode');
        codeSelect.innerHTML = `<option selected>Wybierz...</option>` + countryCodes
            .map(({ name, code }) => `<option value="${code}">${code} (${name})</option>`)
            .join('');
    } catch (error) {
        console.error('Błąd pobierania kodów kierunkowych:', error);
    }
}

function updateInvoiceData() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const street = document.getElementById('street').value.trim();
    const city = document.getElementById('city').value.trim();
    const zipCode = document.getElementById('zipCode').value.trim();
    const country = document.getElementById('country').value.trim();
    const phonePrefix = document.getElementById('countryCode').value.trim();
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const vat = document.getElementById('vatNumber').value.trim();
    const fullPhone = phonePrefix && phoneNumber ? `${phonePrefix} ${phoneNumber}` : phoneNumber;
    const result = `${firstName} ${lastName}
${street}
${zipCode} ${city}
${country}
Tel: ${fullPhone}
VAT: ${vat}`;
    console.log(result);
    document.getElementById('invoiceData').value = result.trim();
}

(() => {
    document.addEventListener('click', handleClick);
    fetchAndFillCountryCodes();
    fetchAndFillCountries().then(() => getCountryByIP());
    vatNumberInput.addEventListener('change', () => {
        updateInvoiceData();
    });
    vatUECheckbox.addEventListener('change', () => {
        if (vatUECheckbox.checked) {
            invoiceSection.removeAttribute('hidden');
            updateInvoiceData();
        } else {
            invoiceSection.setAttribute('hidden', 'true');
        }
    });
    myForm.querySelectorAll('input:not([type="checkbox"]), select').forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                myForm.querySelector('button[type="submit"]').click();
            }
        });
    });
})();