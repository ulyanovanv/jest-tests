import { getters, mutations, actions } from '@/store/rates.js';
import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
Vue.use(axios);
// Vue.prototype.convertedCurrencyValue = convertedCurrencyValue;
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
  let store;

  beforeEach(() => {
    state = {
      rates: {
        "EUR": 1,
        "USD": 1.11
      },
      currency_1: 'EUR',
      currency_2: 'USD',
      value_1: 2,
      value_2: 2.22
    }

    store = new Vuex.Store({
      state,
      getters,
      mutations,
      actions
    })
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

    // expect(commit).toHaveBeenCalledWith(
    //   "SET_CHANGE_CURRENCY", { number: 1, value: 'USD' })
    // expect(commit).toHaveBeenCalledWith(
    //   "SET_CHANGE_CURRENCY", { number: 2, value: 'EUR' })
    // expect(commit).toHaveBeenCalledWith(
    //   "SET_CHANGE_VALUE", { number: 1, value: 2.22 })
    // expect(commit).toHaveBeenCalledWith(
    //   "SET_CHANGE_VALUE", { number: 2, value: 2 })
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

  it('changeOfValue calculates value_2 if value_1 is changed', () => {
    const commit = jest.fn()
    const payload = {
      inputBox: '1',
      value: 20
    }

    const mockCallback = jest.fn(() => {return "44.40"});
    actions.$convertedCurrencyValue = mockCallback;

    actions.changeOfValue({ commit, getters }, payload)

    expect(actions.$convertedCurrencyValue.mock.calls.length).toBe(1);
    expect(commit).toHaveBeenCalledTimes(2)
    expect(actions.$convertedCurrencyValue.mock.calls[0][0]).toBe(getters.getRates); //I do not like it, we compare function with function
    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_VALUE", { number: 1, value: payload.value })
    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_VALUE", {
        number: 2,
        value: "44.40"
      })
  })

  it('changeOfValue calculates value_1 if value_2 is changed', () => {
    const commit = jest.fn()
    const payload = {
      inputBox: '2',
      value: 20
    }

    const mockCallback = jest.fn(() => {return "18.02"});
    actions.$convertedCurrencyValue = mockCallback;

    actions.changeOfValue({ commit, getters }, payload)

    expect(actions.$convertedCurrencyValue.mock.calls.length).toBe(1);
    expect(commit).toHaveBeenCalledTimes(2)
    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_VALUE", { number: 2, value: payload.value })
    expect(commit).toHaveBeenCalledWith(
      "SET_CHANGE_VALUE", {
        number: 1,
        value: "18.02"
      })
  })

  it('getRates', async function() {
    const commit = jest.fn()

    actions.$axios = {
      get: () => {
        return new Promise((resolve, reject) => {
          try {
            resolve({
              data: {
                rates:{
                  'EUR': 1,
                  'USD': 1.11
                }
              }
            })
          } catch(e) {
            reject(e.message)
          }
        })
    }}

    actions.$roundValueTwoSigns = (val) => {return val.toFixed(2)}

    await actions.getRates({ commit, state })
      .then(() => {
        expect(actions.$axios.get()).resolves.toEqual({
          data: {
            rates:{
              'EUR': 1,
              'USD': 1.11
            }
          }
        })
        expect(commit).toHaveBeenCalledTimes(3)
      })
  })
})


