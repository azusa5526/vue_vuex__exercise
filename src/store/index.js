import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  // 使用嚴謹模式
  strict: true,
  state: {
    isLoading: false,
    products: [],
    categories: [],
    cart: {
      carts: [],
    },
  },

  // 放置非同步行為，但不直接操作資料狀態(context, payload)，直接操作會導致Vuex無法追蹤狀態
  actions: {
    updateLoading(context, status) {
      context.commit('LOADING', status);
    },

    getProducts(context) {
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products/all`;
      context.commit('LOADING', true);
      axios.get(url).then((response) => {
        context.commit('PRODUCTS', response.data.products);
        context.commit('CATEGORIES', response.data.products);
        console.log('取得產品列表:', response);
        context.commit('LOADING', false);
      });
    },

    getCart(context) {
      context.commit('LOADING', true);
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      axios.get(url).then((response) => {
        if (response.data.data.carts) {
          context.commit('CART', response.data.data);
        }
        context.commit('LOADING', false);
        console.log('取得購物車', response.data.data);
      });
    },

    removeCart(context, id) {
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      context.commit('LOADING', true);
      axios.delete(url).then((response) => {
        context.commit('LOADING', false);
        context.dispatch('getCart');
        console.log('刪除購物車項目', response);
      });
    },

    addtoCart(context, { id, qty = 1 }) {
      console.log(context, id, qty);
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      context.commit('LOADING', true);
      const item = {
        product_id: id,
        qty,
      };
      axios.post(url, { data: item }).then((response) => {
        context.commit('LOADING', false);
        context.dispatch('getCart');
        console.log('加入購物車:', response);
      });
    },

  },

  // 操作資料狀態，宣告常用常數，不要放置非同步行為(ajax, timeout...)，避免state與mutation資料延時不一致導致除錯困難
  mutations: {
    LOADING(state, status) {
      state.isLoading = status;
    },

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

    CART(state, payload) {
      state.cart = payload;
    },
  },

  getters: {
    filterData() {
      const vm = this;
      if (vm.searchText) {
        return vm.products.filter((item) => {
          const data = item.title.toLowerCase().includes(vm.searchText.toLowerCase());
          return data;
        });
      }
      return this.products;
    },

    products(state) {
      return state.products;
    },

    categories(state) {
      return state.categories;
    },
  },

});
