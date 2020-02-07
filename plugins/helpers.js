const { roundValueTwoSigns, convertedCurrencyValue } = require('./utilities.js');

export default ({ app }, inject) => {
  inject('roundValueTwoSigns', (number) => roundValueTwoSigns(number))
  inject('convertedCurrencyValue', (currencyRates, currency1, currency2, value1) => convertedCurrencyValue(currencyRates, currency1, currency2, value1));
}
