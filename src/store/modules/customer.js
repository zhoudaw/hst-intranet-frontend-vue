import api from "@/api/customer";

const state = {
  customerServiceList: [],
  salesmanList: []
};

const getters = {};
Object.keys(state).forEach(key => {
  getters[key] = state => state[key];
});

const actions = {
  async customerMngParam({ commit }) {
    try {
      const { data = {} } = await api.customerMngParam();
      commit("SET_STATE", {
        target: "customerServiceList",
        data: data.customerServiceList || []
      });
      commit("SET_STATE", {
        target: "salesmanList",
        data: data.salesmanList || []
      });
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
