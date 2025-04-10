let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');
let countryChoices;
const vatUECheckbox = document.getElementById('vatUE');
const vatNumberInput = document.getElementById('vatNumber');
const invoiceSection = document.getElementById('invoiceSection');

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

/* async function fetchAndFillCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}  */

    async function fetchAndFillCountries() {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            if (!response.ok) throw new Error('Błąd pobierania danych');
            const data = await response.json();
            const countries = data.map(c => c.name.common).sort();
    
            countryInput.innerHTML = `<option value="">Wybierz kraj</option>` + countries.map(country =>
                `<option value="${country}">${country}</option>`).join('');
    
            countryChoices = new Choices(countryInput, {
                searchEnabled: true,
                shouldSort: true,
                itemSelectText: '',
                placeholderValue: 'Wybierz kraj',
            });
        } catch (error) {
            console.error('Wystąpił błąd:', error);
        }
    }
    

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const country = data.country;
            countryInput.value = country;
            getCountryCode(country);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        return response.json();
    })
    .then(data => {        
        const countryCode = data[0].idd.root + data[0].idd.suffixes.join("")
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
console.log(result)

    document.getElementById('invoiceData').value = result.trim();
}



(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);

    myForm.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            myForm.requestSubmit();
        }
    });
    
    
    fetchAndFillCountryCodes();
    fetchAndFillCountries().then(() => getCountryByIP());

    countryInput.addEventListener('change', () => {
        const selectedCountry = countryInput.value;
        getCountryCode(selectedCountry);
    });

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
})()
