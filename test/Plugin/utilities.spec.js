import utilities from '../../plugins/utilities.js'

let {roundValueTwoSigns, convertedCurrencyValue} = utilities;

describe('helpers', () => {
  test('roundValueTwoSigns 1.2345 to be 1.23', () => {
    expect(roundValueTwoSigns(1.2345)).toEqual((1.23).toString());
  })

  test('convertedCurrencyValue should return for 2 Euro 2.22 Dollar', () => {
    const rates = {
      'EUR': 1,
      'USD' : 1.11
    }

    expect(convertedCurrencyValue(rates, 'EUR', 'USD', 2)).toEqual('2.22');
  })
})

