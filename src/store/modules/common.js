import api from "@/api/common";

const state = {
  ossUploadParams: {
    expire: 0
  }
};

const getters = {};
Object.keys(state).forEach(key => {
  getters[key] = state => state[key];
});

const actions = {
  async getOssUploadParams({ commit }) {
    try {
      const { data } = await api.ossUploadParams();
      commit("SET_STATE", {
        target: "ossUploadParams",
        data: data || { expire: 0 }
      });
    } catch (e) {
      commit("SET_STATE", {
        target: "ossUploadParams",
        data: { expire: 0 }
      });
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
