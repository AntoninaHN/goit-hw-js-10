// import Notiflix from 'notiflix';
// import { refs } from 'index.js';

// const BASE_URL = 'https://restcountries.com/v3.1/name';

// const cleanEl = el => (el.innerHTML = '');
// const handleError = response => {
//   if (!response.ok) {
//     Notiflix.Notify.failure('Oops, there is no country with that name');
//     cleanEl(refs.countryInfo);
//     cleanEl(refs.countryList);
//     throw new Error(response.status);
//   } else {
//     return response.json();
//   }
// };
// export default class RestCountriesAPI {
//   constructor() {
//     this.searchName = '';
//     this.countryGetInfo = '';
//   }

//   fetchCountries(name) {
//     console.log(name);

//     return fetch(`${BASE_URL}/${name}?fields=name,capital,population,flags,languages`)
//       .then(handleError)
//       .then(data => {
//         console.log(data);
//         this.countryGetInfo = data;
//         return this.countryGetInfo;
//       })
//       .catch(error => {
//         console.log(error, 'Not found');
//       });
//   }

//   get name() {
//     return this.searchName;
//   }

//   set name(newName) {
//     this.searchName = newName;
//   }
// }

// export API;
const BASE_URL = 'https://restcountries.com/v3.1';

function fetchCountries(name, fields = ['name', 'capital', 'population', 'flags', 'languages']) {
  return fetch(`${BASE_URL}/name/${name}?fields=${fields.join(',')}`).then(response => {
    if (response.status === 404) {
      return Promise.reject(new Error());
    }
    return response.json();
  });
}

export default { fetchCountries };
