export const state = () => ({
  rates: {},
  currency_1: 'EUR',
  currency_2: 'USD',
  value_1: 0,
  value_2: 0
})

export const getters = {
  getRates: (state) => {
    return state.rates
  },

  getCurrency_1: (state) => {
    return state.currency_1
  },

  getCurrency_2: (state) => {
    return state.currency_2
  },

  getValue_1: (state) => {
    return state.value_1
  },

  getValue_2: (state) => {
    return state.value_2
  }
}

export const mutations = {
  SET_RATES: (state, payload) => {
    state.rates = payload
  },

  SET_CHANGE_VALUE: (state, payload) => {
    if (payload.number !== 1 && payload.number !== 2) {
      return new Error('Not allowed value')
    }

    state[`value_${payload.number}`] = payload.value
  },

  SET_CHANGE_CURRENCY: (state, payload) => {
    if (payload.number !== 1 && payload.number !== 2) {
      return new Error('Not allowed value')
    }

    state[`currency_${payload.number}`] = payload.value
  },
}

export const actions = {
  async getRates({ commit, state }) {
    await this.$axios.get('https://api.exchangeratesapi.io/latest?symbols=USD,GBP')
      .then(res => {
        const { data } = res;
        const rates = Object.assign({}, data.rates, {'EUR': 1});

        commit('SET_RATES', rates)
        commit('SET_CHANGE_VALUE', {
          number: 1,
          value: this.$roundValueTwoSigns(rates[state.currency_1])
        })
        commit('SET_CHANGE_VALUE', {
          number: 2,
          value: this.$roundValueTwoSigns(rates[state.currency_2])
        })
      })
      .catch(error => { throw error });
  },

  switchCurrencies({ commit, getters }) {
    const firstCurrency = getters.getCurrency_1;
    commit('SET_CHANGE_CURRENCY', { number: 1, value: getters.getCurrency_2 })
    commit('SET_CHANGE_CURRENCY', { number: 2, value: firstCurrency })

    const firstValue = getters.getValue_1;
    commit('SET_CHANGE_VALUE', { number: 1, value: getters.getValue_2 })
    commit('SET_CHANGE_VALUE', { number: 2, value: firstValue })

    // this.changeOfCurrency(this.currency2, 2);
  },

  changeOfValue({ commit, getters }, data) {
    const { inputBox, value } = data;

    if (value === 0) {
      commit('SET_CHANGE_VALUE', { number: 1, value: 0 })
      commit('SET_CHANGE_VALUE', { number: 2, value: 0 })
    } else if (inputBox == 1) {
      commit('SET_CHANGE_VALUE', { number: 1, value: value })
      // console.log(this.$convertedCurrencyValue)
      // console.log(this.$convertedCurrencyValue(getters.getRates, getters.getCurrency_1, getters.getCurrency_2, getters.getValue_1))
      commit('SET_CHANGE_VALUE', {
        number: 2,
        value: this.$convertedCurrencyValue(getters.getRates, getters.getCurrency_1, getters.getCurrency_2, getters.getValue_1)
      })
    } else if (inputBox == 2) {
      commit('SET_CHANGE_VALUE', { number: 2, value: value })
      commit('SET_CHANGE_VALUE', {
        number: 1,
        value: this.$convertedCurrencyValue(getters.getRates, getters.getCurrency_2, getters.getCurrency_1, getters.getValue_2)
      })
    }
  },

  changeOfCurrency({ commit, getters }, data) {
    const { inputBox, value } = data;
    let secondValue;

    commit('SET_CHANGE_CURRENCY', {
      number: inputBox,
      value: value
    })

    if (inputBox == 1) {
      secondValue = this.$convertedCurrencyValue(getters.getRates, getters.getCurrency_1, getters.getCurrency_2, getters.getValue_1)
      commit('SET_CHANGE_VALUE', {
        number: 2,
        value: secondValue
      })
    } else if (inputBox == 2) {
      secondValue = this.$convertedCurrencyValue(getters.getRates, getters.getCurrency_2, getters.getCurrency_1, getters.getValue_2)
      commit('SET_CHANGE_VALUE', {
        number: 1,
        value: secondValue
      })
    }
  }
}
