import Vue from 'vue'
import Vuex from 'vuex'
import { _userCenter } from '@/api'
import countryList from '@/utils/countryList'

const context = require.context('./modules', false, /\.js$/)
const modules = context.keys()
  .reduce((acc, key) => ({
    ...acc,
    [key.replace(/(\.\/|\.js)/g, '')]: context(key).default
  }), {})

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    keepAlives: ['homePage'],
    pagination: {
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50, 100]
    },
    editableTabs: [{
      title: '首页',
      id: '/homePage',
      keepAlive: 'homePage'
    }],
    currentTab: '/homePage',
    menuList: [],
    stationList: [],
    currencyList: [],
    chainList: [],
    countryList: countryList
  },
  mutations: {
    ADD_KEEP_ALIVES: (state, keepAlive) => {
      if (!state.keepAlives.includes(keepAlive)) {
        state.keepAlives.push(keepAlive)
      }
    },
    REMOVE_KEEP_ALIVES: (state, index) => {
      if (index === -1) return
      state.keepAlives.splice(index, 1)
    },
    CLEAR_KEEP_ALIVES: (state) => {
      state.keepAlives = []
    },
    ADD_EDITABLETABS: (state, option) => {
      let keepAlives = state.editableTabs.map(item => item.keepAlive)
      let index = keepAlives.findIndex(name => name === option.name)
      if (index > -1) {
        state.editableTabs.splice(index, 1, {
          title: option.title,
          id: option.path,
          keepAlive: option.name
        })
      } else {
        state.editableTabs.push({
          title: option.title,
          id: option.path,
          keepAlive: option.name
        })
      }
    },
    CLEAR_EDITABLETABS: (state) => {
      state.editableTabs = []
    },
    UPDATE_EDITABLETABS: (state, tabs) => {
      state.editableTabs = tabs
    },
    DE_CURRENT_EDITABLETABS: (state, index) => {
      state.editableTabs.splice(index, 1)
    },
    DE_RIGHT_EDITABLETABS: (state, index) => {
      state.editableTabs.splice(index + 1)
    },
    DE_LEFT_EDITABLETABS: (state, { index, homePage }) => {
      state.editableTabs = [homePage].concat(state.editableTabs.splice(index))
    },
    SET_CURRENT_TAB: (state, tab) => {
      state.currentTab = tab
    },
    ADD_STATION_LIST: (state, list) => {
      state.stationList = list
    },
    ADD_COUNTRY_LIST: (state, list) => {
      state.countryList = list
    },
    ADD_CURRENCY_LIST: (state, list) => {
      state.currencyList = list
    },
    ADD_CHAIN_LIST: (state, list) => {
      state.chainList = list
    }
  },
  actions: {
    async FETCH_COUNTRY_LIST ({ commit }, params) {
      _userCenter.countryList().then((res) => {
        commit('ADD_COUNTRY_LIST', res)
      }, (res) => {
        commit('ADD_COUNTRY_LIST', [])
      })
    }
  },
  modules
})
