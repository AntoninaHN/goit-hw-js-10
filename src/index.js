import './css/styles.css';
import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import RestCountriesAPI from './components/fetchCountries';
import { debounce } from 'lodash';
export { refs };
import allCountries from './all-countries';
import country from './country';
import { parseWithoutProcessing } from 'handlebars';

const DEBOUNCE_DELAY = 300;
let name;
const cleanEl = el => (el.innerHTML = '');
const refs = {
  searchBox: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const restCountriesAPI = new RestCountriesAPI();

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY, { trailing: true }));

function onSearch(e) {
  e.preventDefault();

  name = e.path[0].value.trim().toLowerCase();
  cleanEl(refs.countryInfo);
  cleanEl(refs.countryList);

  if (name !== '') {
    restCountriesAPI.name = name;
    restCountriesAPI.fetchCountries(name).then(countryGetInfo => {
      renderCountryInfo(countryGetInfo);
    });
  }
}

function renderCountryInfo(countryGetInfo) {
  const elementObj = countryGetInfo.length;

  if (countryGetInfo.length > 1 && countryGetInfo.length <= 10) {
    cleanEl(refs.countryInfo);
    cleanEl(refs.countryList);
    refs.countryList.innerHTML = allCountries(countryGetInfo);
  } else if (countryGetInfo.length === 1) {
    cleanEl(refs.countryInfo);
    cleanEl(refs.countryList);
    refs.countryInfo.innerHTML = country(countryGetInfo);
  } else {
    Notiflix.Notify.info('Oops, too many matches found. Please enter a more specific name.');
    cleanEl(refs.countryInfo);
    cleanEl(refs.countryList);
  }
}
