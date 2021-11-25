// import './css/styles.css';
// import Notiflix from 'notiflix';
// import RestCountriesAPI from './components/fetchCountries';
// import { debounce } from 'lodash';
// export { refs };
// import allCountries from './all-countries';
// import country from './country';
// //import { parseWithoutProcessing } from 'handlebars';

// const DEBOUNCE_DELAY = 300;
// let name;
// const cleanEl = el => (el.innerHTML = '');

// const refs = {
//   searchBox: document.querySelector('input#search-box'),
//   countryList: document.querySelector('.country-list'),
//   countryInfo: document.querySelector('.country-info'),
// };

// const restCountriesAPI = new RestCountriesAPI();

// refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY, { trailing: true }));

// function onSearch(e) {
//   //e.preventDefault();

//   name = e.path[0].value.trim().toLowerCase();
//   cleanEl(refs.countryInfo);
//   cleanEl(refs.countryList);

//   if (name !== '') {
//     restCountriesAPI.name = name;
//     restCountriesAPI.fetchCountries(name).then(countryGetInfo => {
//       console.log(countryGetInfo);
//       renderCountryInfo(countryGetInfo);
//     });
//   }
// }

// function renderCountryInfo(countryGetInfo) {
//   const elementObj = countryGetInfo.length;
//   console.log(elementObj);
//   console.log(countryGetInfo);
//   if (elementObj > 1 && elementObj <= 10) {
//     cleanEl(refs.countryInfo);
//     cleanEl(refs.countryList);

//     refs.countryList.innerHTML = allCountries(countryGetInfo);
//   } else if (elementObj === 1) {
//     cleanEl(refs.countryInfo);
//     cleanEl(refs.countryList);

//     refs.countryInfo.innerHTML = country(countryGetInfo);
//   } else {
//     Notiflix.Notify.info('Oops, too many matches found. Please enter a more specific name.');
//     cleanEl(refs.countryInfo);
//     cleanEl(refs.countryList);
//   }
// }

import './css/styles.css';
import debounce from 'lodash/debounce';
import Notiflix from 'notiflix';
import API from './components/fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const renderDropdown = (wrapper, object) => {
  object.forEach(element => {
    wrapper.insertAdjacentHTML(
      'beforeend',
      `<li><img src="${element.flags.svg}" width="20"> ${element.name.official}</li>`,
    );
  });
};

const renderInfoBox = (wrapper, object) => {
  if (object.length === 1) {
    clearInnerHtml(countryList);
    const langList = Object.values(object[0].languages);
    wrapper.insertAdjacentHTML(
      'beforeend',
      `<h2><img src="${object[0].flags.svg}" width="40"> ${object[0].name.official}</h2>
        <dl>
            <dt>Capital</dt>
            <dd>${object[0].capital}</dd>
            <dt>Population</dt>
            <dd>${object[0].population}</dd>
            <dt>Languages</dt>
            <dd>${langList.join(', ')}</dd>
        </dl>`,
    );
  }
};

const clearInnerHtml = wrapper => {
  wrapper.innerHTML = '';
};

const searchInputHandler = e => {
  const enteredText = e.target.value;
  const sanitiedText = enteredText.trim();

  // clear previous result
  clearInnerHtml(countryList);
  clearInnerHtml(countryInfo);

  // Если пользователь полностью очищает поле поиска, то HTTP-запрос не выполняется,
  // а разметка списка стран или информации о стране пропадает.
  if (enteredText.length === 0) {
    return;
  }

  const resultObject = API.fetchCountries(sanitiedText)
    .then(result => {
      if (result.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }

      if (result.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        return;
      }

      renderDropdown(countryList, result);
      renderInfoBox(countryInfo, result);
    })
    .catch(error => {
      console.log(error);
    });
};

searchInput.addEventListener('input', debounce(searchInputHandler, DEBOUNCE_DELAY));
