import api from "@/api/bl";

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
      commit("SET_STATE", { target: "listAll", data: data || [] });
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
