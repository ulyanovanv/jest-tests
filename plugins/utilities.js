module.exports = {
  roundValueTwoSigns: (number) => {
    return number.toFixed(2)
  },

  convertedCurrencyValue: (currencyRates, currency1, currency2, value1) => {
    let value2;
    console.log(currencyRates, currency1, currency2, value1)

    if (currency1 === currency2) {
      value2 = value1;
    } else if (currency1 !== 'EUR') {
      let result = value1 / currencyRates[currency1] * currencyRates[currency2];
      value2 = result.toFixed(2);
    } else {
      let secondValue = value1 * currencyRates[currency2];
      value2 = secondValue.toFixed(2);
    }

    console.log(value2)

    return value2;
  }
}
