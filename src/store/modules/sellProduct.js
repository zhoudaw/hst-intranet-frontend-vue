import api from "@/api/sell-product";

const state = {
  listAll: []
};

const getters = {};
Object.keys(state).forEach(key => {
  getters[key] = state => state[key];
});

const actions = {
  async listAll({ commit }) {
    try {
      const { data } = await api.listAll();
      const { list } = data || {};
      commit("SET_STATE", { target: "listAll", data: list || [] });
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
