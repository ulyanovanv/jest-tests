<template>
  <div class="switcher" id="switcher" @click="switchCurrencies">
    <img src="@/assets/images/switch.svg" class="rotate"/>
  </div>
</template>

<script>
  import { mapActions } from "vuex";

  export default {
    name: "switcher",
    methods: {
      ...mapActions({
        switchCurrencies: 'rates/switchCurrencies'
      })
    }
  }
</script>
