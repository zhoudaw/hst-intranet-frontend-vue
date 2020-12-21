import { storage as api } from "@/api/order";
const state = {
  createData: {
    // baseCompletedWayList: [],
    // baseCurrencyList: [],
    // baseCustomerList: [],
    // baseCustomsList: [],
    // baseDeclarationCategoryList: []
  }
};

const getters = {};
Object.keys(state).forEach(key => {
  getters[key] = state => state[key];
});

const actions = {
  async createData({ commit }) {
    try {
      const { data } = await api.createData();
      commit("SET_STATE", { target: "createData", data: data || {} });
    } catch (e) {
      throw e;
    }
  }
};

const mutations = {
  SET_STATE(state, payload) {
    state[payload.target] = payload.data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
