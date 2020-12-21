import api from "@/api/user";

const state = {
  authority: null
};

const getters = {
  authority: state => {
    if (state.authority) return state.authority;
    try {
      let authority = localStorage.getItem("authority");
      return JSON.parse(authority);
    } catch (e) {
      return {};
    }
  }
};

const actions = {
  async login({ commit }, form) {
    try {
      const { data } = await api.login(form);
      localStorage.setItem("authority", JSON.stringify(data.user || {}));
      commit("SET_STATE", { target: "authority", data: data.user || {} });
    } catch (e) {
      throw e;
    }
  },
  logout({ commit }) {
    localStorage.removeItem("authority");
    commit("SET_STATE", { target: "authority", data: null });
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
