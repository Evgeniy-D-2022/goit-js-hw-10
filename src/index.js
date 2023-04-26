import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.getElementById('search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
    const countryName = evt.target.value.trim();

    if (!countryName) {
        evt.target.value = '';
        clearFields(refs.countryList);
        clearFields(refs.countryInfo);
        return;
    }
    fetchCountries(countryName)
    .then(data => {
        if(data.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }
        else {
            countryMarkup(data);
        }
    })
    .catch(err => {
        if(err.message === '404')
        console.log(err); {
            Notiflix.Notify.failure('Oops, there is no country with that name');
        }
        
    });
}

function countryMarkup(data) {
    if (data.length === 1) {
        const markupInfo = data.reduce(
            (markupInfo, countryName) => markupInfo + createMarkupCountryInfo(countryName), '');
        clearFields(refs.countryList);
        refs.countryInfo.innerHTML = markupInfo;
    } else {
        const markupList = data.reduce(
            (markupInfo, countryName) => markupInfo + createMarkupCountryList(countryName), '');
        clearFields(refs.countryInfo);
        refs.countryList.innerHTML = markupList;
    }
}

function clearFields(el) {
    return el.innerHTML = '';
}

function createMarkupCountryList({ flags, name }) {
    return `<li>
    <img src =${flags.svg} alt ='flags of ${name.official}' width = 50/>
    <p>${name.official}</p>
    </li>`;
}

function createMarkupCountryInfo({ name, capital, population, flags, languages }) {
   return `<img src =${flags.svg} alt ='flags of ${name.official}' width = 80/>
   <p>${name.official}</p>
   <ul>
   <li>Capital: ${capital}</li>
   <li>Population: ${population}</li>
   <li>Languages: ${Object.values(languages)}</li>
    </ul>` 
}

