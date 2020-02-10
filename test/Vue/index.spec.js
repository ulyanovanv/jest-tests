import { mount, createLocalVue, shallowMount} from '@vue/test-utils'
import index from '@/pages/index.vue'
import Vue from 'vue';
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import NuxtLink from '../../.nuxt/components/nuxt-link.client.js';

/*
https://github.com/vuetifyjs/vuetify/issues/4964
Currently not possible to use createLocalVue together with Vuetify
createLocalVue together with Vuetify creates multiple Vue instances
Solution: use Vue instead of createLocalVue
*/

// const localVue = createLocalVue()

describe('index', () => {
  Vue.use(Vuetify)
  Vue.use(Vuex)
  Vue.component('nuxt-link', NuxtLink)

  let getters, store

  beforeEach(() => {
    getters = {
      rates: () => {},
      currency_1: () => 'EUR',
      currency_2: () => 'USD',

      value_1: () => 1,
      value_2: () => 1.11
    }

    store = new Vuex.Store({
      modules: {
        getters
      }
    })
  })

  test('is a Vue instance', () => {
    // const wrapper = shallowMount(index, { store, localVue, stubs: ['nuxt-link'] })
    const wrapper = shallowMount(index, { store, Vue })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('should render content correctly', () => {
    const wrapper = shallowMount(index, { store, Vue })
    expect(wrapper.vm.$el).toMatchSnapshot()
  })
})
