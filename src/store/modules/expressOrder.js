import { express as api } from "@/api/order";

const state = {
  airData: {}
};

const getters = {};
Object.keys(state).forEach(key => {
  getters[key] = state => state[key];
});

const actions = {
  async getAirData({ commit }) {
    try {
      const { data } = await api.airData();
      commit("SET_STATE", { target: "airData", data: data || {} });
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
