import axios from 'axios';

export default {
  namespaced: true,
  state: {
    cart: {
      carts: [],
    },
  },

  // 放置非同步行為，但不直接操作資料狀態(context, payload)，直接操作會導致Vuex無法追蹤狀態
  actions: {
    getCart(context) {
      context.commit('LOADING', true, { root: true });
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      axios.get(url).then((response) => {
        if (response.data.data.carts) {
          context.commit('CART', response.data.data);
        }
        context.commit('LOADING', false, { root: true });
        console.log('取得購物車', response.data.data);
      });
    },

    removeCart(context, id) {
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`;
      context.commit('LOADING', true, { root: true });
      axios.delete(url).then((response) => {
        context.commit('LOADING', false, { root: true });
        context.dispatch('getCart');
        console.log('刪除購物車項目', response);
      });
    },

    addtoCart(context, { id, qty }) {
      const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`;
      context.commit('LOADING', true, { root: true });
      const item = {
        product_id: id,
        qty,
      };
      axios.post(url, { data: item }).then((response) => {
        context.commit('LOADING', false, { root: true });
        context.dispatch('getCart');
        console.log('加入購物車:', response);
      });
    },
  },

  // 操作資料狀態，宣告常用常數，不要放置非同步行為(ajax, timeout...)，避免state與mutation資料延時不一致導致除錯困難
  mutations: {
    CART(state, payload) {
      state.cart = payload;
    },
  },

  getters: {
    cart(state) {
      return state.cart;
    },
  },
};
