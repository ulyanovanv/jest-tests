import { mount, createLocalVue, shallowMount} from '@vue/test-utils'
import converter from '@/pages/converter.vue'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import Vue from 'vue';

const localVue = createLocalVue()
Vue.use(Vuex)
Vue.use(Vuetify)

describe('converter', () => {
  let getters, store

  beforeEach(() => {
    getters = {
      'rates/getRates': () => {
        return {
          'EUR': 1,
          'USD': 1.11
        }
      },
      'rates/getCurrency_1': () => 'EUR',
      'rates/getCurrency_2': () => 'USD',

      'rates/getValue_1': () => 1,
      'rates/getValue_2': () => 1.11
    }

    store = new Vuex.Store({
      getters
    })
  })

  test('is a Vue instance', () => {
    const wrapper = mount(converter, { store, Vue })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('Snapshot: should render content correctly', () => {
    const wrapper = mount(converter, {
      store,
      Vue
    })

    expect(getters['rates/getRates']()['EUR']).toEqual(1)
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  test("Should return exchanger interface, if rates are passed", () => {
    const wrapper = mount(converter, {
      store,
      Vue
    })

    expect(wrapper.contains('.currency-converter')).toBe(true)
  })

  test("Should return error text, if rates are empty object", () => {
    store = new Vuex.Store({
      getters: {
        ...getters,
        'rates/getRates': () => {
          return {}
        }
      }
    })

    const wrapper = mount(converter, {
      store,
      Vue
    })

    console.log(getters['rates/getRates']())

    expect(wrapper.contains('.error')).toBe(true)
  })
})
