import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import InputBox from '../../components/InputBox.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('InputBox', () => {
  let getters, store

  getters = {
    'rates/getRates': () => {},
    'rates/getCurrency_1': () => 'EUR',
    'rates/getCurrency_2': () => 'USD',

    'rates/getValue_1': () => 1,
    'rates/getValue_2': () => 1.11
  }

  store = new Vuex.Store({
    getters
  })

  test('is a Vue instance', () => {
    const wrapper = shallowMount(InputBox, { store, localVue })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('should render content correctly', () => {
    const wrapper = shallowMount(InputBox, { store, localVue })
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  // how to access store.getter method
  test('getter rates/getCurrency_1 has to return "EUR" value', () => {
    expect(getters['rates/getCurrency_1']()).toBe('EUR')
  })

  test('test computed value currentCurrency', () => {
    const commit = jest.fn();
    const wrapper = shallowMount(InputBox, { store, localVue })
    wrapper.setData({ currency_1: "EUR", currency_2: "USD" });
    wrapper.setProps({ inputbox: 1 });
    expect(wrapper.vm.currentCurrency).toBe("EUR")
    //how to use computed set() hier?
  })
})
