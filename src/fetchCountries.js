export default function fetchCountries(name) {
const fields = 'fields=name,capital,population,flags,languages';

return fetch(`https://restcountries.com/v3.1/name/${name}?${fields}`)
.then(responce => {
    if (!responce.ok) {
        throw new Error('responce.status');
    }
    return responce.json();
});
}