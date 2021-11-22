import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from 'index.js';

const BASE_URL = 'https://restcountries.com/v3.1/name';

const handleError = response => {
  if (!response.ok) {
    Notiflix.Notify.failure('Oops, there is no country with that name');
    refs.countryInfo.innerHTML = ' ';
    refs.countryList.innerHTML = ' ';
    throw new Error(response.status);
  } else {
    return response.json();
  }
};

export default class RestCountriesAPI {
  constructor() {
    this.searchName = '';
    this.countryGetInfo = '';
  }

  fetchCountries(name) {
    console.log(name);

    return fetch(`${BASE_URL}/${name}?fields=name,capital,population,flags,languages`)
      .then(handleError)
      .then(data => {
        console.log(data);
        this.countryGetInfo = data;
        return this.countryGetInfo;
      })
      .catch(error => {
        console.log(error, 'Not found');
      });
  }

  get name() {
    return this.searchName;
  }

  set name(newName) {
    this.searchName = newName;
  }
}
