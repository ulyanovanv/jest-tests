<template>
  <div class="input-box">
    <span class="input-box_symbol">{{ currentCurrencySymbol() }}</span>
    <input class="input-box_input" id="valueNum" type="text" v-model="currentValue" />

    <select class="input-box_dropdown" v-model="currentCurrency">
      <option v-for="(el, index) in Object.keys(currencySymbol)" :key="index">{{ el }}</option>
    </select>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "input-box",

  data() {
    return {
      currencySymbol: {
        'EUR': '€',
        'USD': '$',
        'GBP': '£'
      }
    }
  },

  props: {
    inputbox: String
  },

  computed: {
    ...mapGetters({
      rates: "rates/getRates",
      currency_1: 'rates/getCurrency_1',
      currency_2: 'rates/getCurrency_2',
      value_1: 'rates/getValue_1',
      value_2: 'rates/getValue_2',
    }),

    currentCurrency: {
      get: function() {
        return this.inputbox == 1 ? this.currency_1 : this.currency_2
      },
      set: function(value) {
        this.changeOfCurrency({
          inputBox: this.inputbox,
          value: value
        })
      }
    },

    currentValue: {
      get: function() {
        return this.inputbox == 1 ? this.value_1 : this.value_2
      },
      set: function(value) {
        this.changeOfValue({
          inputBox: this.inputbox,
          value: value
        })
      }
    }
  },

  methods: {
    ...mapActions({
      changeOfCurrency: 'rates/changeOfCurrency',
      changeOfValue: 'rates/changeOfValue'
    }),

    currentCurrencySymbol() {
      return this.currencySymbol[this.currentCurrency];
    }
  }
}
</script>
