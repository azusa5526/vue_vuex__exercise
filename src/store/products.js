import axios from 'axios';

export default {
  // 預設 state 屬於模組的"區域"變數
  // 預設 action, mutations, getters 屬於"全域"變數(可能與其他模組命名衝突)
  // namespaced: true, 可將action, mutations, getters設定為模組的"區域"變數
  namespaced: true,
  state: {
    products: [],
    categories: [],
  },

  // 放置非同步行為，但不直接操作資料狀態(context, payload)，直接操作會導致Vuex無法追蹤狀態
  actions: {
    getProducts(context) {
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`;
      // 讓模組知道commit的對象是位在global的loading
      context.commit('LOADING', true, { root: true });
      axios.get(url).then((response) => {
        context.commit('PRODUCTS', response.data.products);
        context.commit('CATEGORIES', response.data.products);
        console.log('取得產品列表:', response);
        context.commit('LOADING', false, { root: true });
      });
    },
  },

  // 操作資料狀態，宣告常用常數，不要放置非同步行為(ajax, timeout...)，避免state與mutation資料延時不一致導致除錯困難
  mutations: {
    PRODUCTS(state, payload) {
      state.products = payload;
    },

    CATEGORIES(state, payload) {
      const categories = new Set();
      payload.forEach((item) => {
        categories.add(item.category);
      });
      state.categories = Array.from(categories);
    },
  },

  getters: {
    products(state) {
      return state.products;
    },

    categories(state) {
      return state.categories;
    },
  },
};
