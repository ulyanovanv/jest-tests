<template>
  <v-layout>
    <v-flex class="text-center">
      <section v-if="rates">
        <div class="currency-converter">
          <input-box inputbox="1"/>
          <switcher></switcher>
          <input-box inputbox="2"/>
        </div>
      </section>

      <section v-else>
        <p class="header error">Unfortunately, no currency rates are available at the moment. Try again later.</p>
      </section>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";

import InputBox from '@/components/InputBox.vue'
import Switcher from '@/components/Switcher.vue'

export default {
  name: 'Exchanger',
  components: {
    InputBox,
    Switcher
  },

  async asyncData({ store }) {
    await store.dispatch('rates/getRates')
  },

  computed: {
    ...mapGetters({
      rates: "rates/getRates"
    })

    // ratesObj() {
    //   return Object.entries(this.rates).length > 0
    // }
  }
}
</script>
