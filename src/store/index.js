import Vue from 'vue';
import Vuex from 'vuex';
import productsModules from './products';
import cartModules from './cart';

Vue.use(Vuex);

export default new Vuex.Store({
  // 使用嚴謹模式
  strict: true,
  state: {
    isLoading: false,
  },

  // 放置非同步行為，但不直接操作資料狀態(context, payload)，直接操作會導致Vuex無法追蹤狀態
  actions: {
    updateLoading(context, status) {
      context.commit('LOADING', status);
    },
  },

  // 操作資料狀態，宣告常用常數，不要放置非同步行為(ajax, timeout...)，避免state與mutation資料延時不一致導致除錯困難
  mutations: {
    LOADING(state, status) {
      state.isLoading = status;
    },
  },

  getters: {
    isLoading(state) {
      return state.isLoading;
    },
  },

  modules: {
    productsModules,
    cartModules,
  },
});
