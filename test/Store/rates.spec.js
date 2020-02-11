import { getters, mutations, actions } from '@/store/rates.js';
import axios from 'axios';
import Vue from 'vue';
import { roundValueTwoSigns, convertedCurrencyValue } from '@/plugins/utilities.js'
import { mount, createLocalVue, shallowMount, get} from '@vue/test-utils'
Vue.use(axios);
Vue.prototype.convertedCurrencyValue = convertedCurrencyValue;

jest.mock('axios');

describe("rates mutations", () => {
  let state;

  beforeEach(() => {
    state = {
      rates: {},
      currency_1: 'EUR',
      currency_2: 'USD',
      value_1: 0,
      value_2: 0
    }
  })

  it("set exchange rates", () => {
    const rates = {
      "EUR": 1,
      "USD": 1.11
    }

    mutations.SET_RATES(state, rates)
    expect(state.rates).toEqual({
      "EUR": 1,
      "USD": 1.11
    })
  })

  it("set exchange value for 2 converted currency", () => {
    const payload = {
      number: 2,
      value: 1.11
    }

    mutations.SET_CHANGE_VALUE(state, payload)
    expect(state.value_2).toBe(1.11)
  })

  it("set exchange currency for position 1 - from which currency we convert", () => {
    const payload = {
      number: 1,
      value: "EUR"
    }

    mutations.SET_CHANGE_CURRENCY(state, payload)
    expect(state.currency_1).toBe("EUR")
  })

  it("path to set currency invalid data with number = 3", () => {
    const payload = {
      number: 3,
      value: "EUR"
    }

    mutations.SET_CHANGE_CURRENCY(state, payload)
    expect(state.currency_3).toBeUndefined;
  })
})

describe('rates getters', () => {
  let state;

  beforeEach(() => {
    state = {
      rates: {
        "EUR": 1,
        "USD": 1.11
      },
      currency_1: 'USD',
      currency_2: 'EUR',
      value_1: 3.33,
      value_2: 3
    }
  })

  it('getRates returns array of exchange rates', () => {
    const rates = getters.getRates(state);
    expect(rates["USD"]).toBe(1.11);
  })

  it('getCurrency_1 returns USD', () => {
    const currency_1 = getters.getCurrency_1(state);
    expect(currency_1).toBe('USD');
  })

  it('getCurrency_2 returns EUR', () => {
    const currency_2 = getters.getCurrency_2(state);
    expect(currency_2).toBe('EUR');
  })

  it('getValue_1 returns 3.33', () => {
    const value_1 = getters.getValue_1(state);
    expect(value_1).toBe(3.33);
  })

  it('getValue_2 returns 3', () => {
    const value_2 = getters.getValue_2(state);
    expect(value_2).toBe(3);
  })
})

describe('rates actions', () => {
  let state;

  beforeEach(() => {
    state = {
      rates: {
        "EUR": 2,
        "USD": 2.22
      },
      currency_1: 'EUR',
      currency_2: 'USD',
      value_1: 2,
      value_2: 2.22
    }
  })

  it('switchCurrencies reassign the currencies and values instate and calculate the new value', () => {
    const commit = jest.fn()

    actions.switchCurrencies({ commit, getters })

    expect(commit).toHaveBeenCalledTimes(4)

    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_CURRENCY", { number: 1, value: getters.getCurrency_2 })
    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_CURRENCY", { number: 2, value: getters.getCurrency_1 })
    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_VALUE", { number: 1, value: getters.getValue_2 })
    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_VALUE", { number: 2, value: getters.getValue_1 })
  })

  it('changeOfValue return value_2=0 if value_1=0', () => {
    const commit = jest.fn()

    const payload = {
      inputBox: 1,
      value: 0
    }

    actions.changeOfValue({ commit, getters }, payload)

    expect(commit).toHaveBeenCalledTimes(2)
    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_VALUE", { number: 1, value: 0 })
    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_VALUE", { number: 2, value: 0 })
  })

  // TODO: how to mock injected function
  it('changeOfValue calculates value_2 if value_1 is changed', () => {
    const commit = jest.fn()
    const mock2 = jest.fn()
    // const mock = (currencyRates, currency1, currency2, value1) => convertedCurrencyValue(currencyRates, currency1, currency2, value1);
    // const mock = {
    //   get: jest.fn((url) => {
    //     if (url === '/something') {
    //       return Promise.resolve({
    //         data: 'data'
    //       });
    //     }
    //   }),
    // }

    const payload = {
      inputBox: '1',
      value: 20
    }
    const mockCallback = jest.fn(() => {return "44.40"});
    actions.$convertedCurrencyValue = mockCallback
    // The first argument of the second call to the function was 1

    actions.changeOfValue({ commit, getters }, payload)

    expect(mockCallback.mock.calls[0][3]).toBe(getters.getValue_1);
    expect(commit).toHaveBeenCalledTimes(2)
    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_VALUE", { number: 1, value: payload.value })

    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_VALUE", {
        number: 2,
        value: "44.40"
      })
  })

  it('getRates', async function() {
    const commit = jest.fn()

    actions.$axios = {
      get: () => {
        return new Promise((resolve, reject) => {
          resolve({
            data: {
              rates:{
                'EUR': 1,
                'USD': 1.11
              }
            }
          })
        })
    }}

    actions.$roundValueTwoSigns = () => {return 123}

    await actions.getRates({ commit, state })
      .then(() => {
        expect(commit).toHaveBeenCalledTimes(3)
        // expect(count).toBe(1)
        // expect(data).toEqual({ title: 'Mock with Jest' })
      })


    // expect(commit).toHaveBeenCalledTimes(2)
    // expect(commit).toHaveBeenCalledWith(
    //   "SET_CHANGE_VALUE", { number: 1, value: 0 })
    // expect(commit).toHaveBeenCalledWith(
    //   "SET_CHANGE_VALUE", { number: 2, value: 0 })
  })
})


