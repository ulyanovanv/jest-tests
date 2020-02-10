import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import Switcher from '@/components/Switcher.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('Switcher', () => {
  let actions, store;

  actions = {
    'rates/switchCurrencies': jest.fn(),
  }
  store = new Vuex.Store({
    actions
  })

  test('is a Vue instance', () => {
    const wrapper = mount(Switcher)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  test('should render content correctly', () => {
    const wrapper = mount(Switcher)
    expect(wrapper.vm.$el).toMatchSnapshot()
  })

  test('dispatches "switchCurrencies" when click event on element "switcher" is triggered', () => {
    const wrapper = shallowMount(Switcher, { store, localVue })
    expect(wrapper.find('#switcher').is('div')).toBe(true)

    wrapper.find('#switcher').trigger('click')
    expect(actions['rates/switchCurrencies']).toHaveBeenCalled()
  })
})
