import './css/styles.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import RestCountriesAPI from './components/fetchCountries';
import { debounce } from 'lodash';
export { refs };

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

let name;
const restCountriesAPI = new RestCountriesAPI();

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY, { trailing: true }));

function onSearch(e) {
  e.preventDefault();

  name = e.path[0].value.trim();
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';

  if (name !== '') {
    restCountriesAPI.name = name;
    restCountriesAPI.fetchCountries(name).then(countryGetInfo => {
      renderCountryInfo(countryGetInfo);
    });
  }
}

function renderCountryInfo(countryGetInfo) {
  const element = countryGetInfo;
  const { name, capital, population, flags, languages } = element[countryGetInfo];

  if (countryGetInfo.length > 1 && countryGetInfo.length <= 10) {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';

    return AddCountry(countryGetInfo);
  } else if (countryGetInfo.length === 1) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';

    return AddCountryInfo(countryGetInfo);
  } else if (countryGetInfo.length >= 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
  }

  function AddCountryInfo() {
    return refs.countryInfo.insertAdjacentHTML(
      'beforeend',
      `<div class="flag-country-block">
        <img
          class="flag"
          src="${flags.svg}"
          alt="flag"
          height="40"
          width="60"
        />
        <h1>${name.official}</h1>
      </div>
      <ul class="country-info-details">
        <li class="country-info-item">
          <h2>Capital:</h2>
          <span class="info-value">${capital}</span>
        </li>
        <li class="country-info-item">
          <h2>Population:</h2>
          <span class="info-value">${population}</span
          >
        </li>
        <li class="country-info-item">
          <h2>Languages:</h2>
          <span class="info-value">${Object.values(languages)}</span
          >
        </li>
      </ul>`,
    );
  }
  function AddCountry(countryGetInfo) {
    const countriesInfo = countryGetInfo
      .map(item => {
        return `<li class="country-list-item">
        <img
          class="flag-list"
          src="${item.flags.svg}"
          alt="flag"
          height="40"
          width="60"
          />
        <h2 class="list-item-h2">${item.name.official}</h2>
      </li>`;
      })
      .join('');

    refs.countryList.insertAdjacentHTML('beforeend', countriesInfo);
  }
}
