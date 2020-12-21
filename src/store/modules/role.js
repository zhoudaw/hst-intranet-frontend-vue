import api from "@/api/role";

const state = {
  listAll: [],
  permissionTreeList: []
};

const getters = {};
Object.keys(state).forEach(key => {
  getters[key] = state => state[key];
});

const actions = {
  async listAll({ commit }) {
    try {
      const { data } = await api.listAll();
      commit("SET_STATE", { target: "listAll", data: data.list || [] });
    } catch (e) {
      throw e;
    }
  },
  async permissionTreeList({ dispatch }) {
    try {
      const { data } = await api.permissionTreeList();
      dispatch("setPermissionTreeNewId", data.list || []);
    } catch (e) {
      throw e;
    }
  },
  setPermissionTreeNewId({ commit, dispatch }, list) {
    list.forEach(item => {
      item.show = false;
      item.flag = false;
      if (item.type === "nav") {
        item.flag = true;
        item.newId = "nav" + item.id;
      }
      if (item.type === "auth") {
        item.newId = "auth" + item.id;
      }
      if (item.childList) {
        dispatch("setPermissionTreeNewId", item.childList);
      }
    });
    commit("SET_STATE", { target: "permissionTreeList", data: list });
  }
};

const mutations = {
  SET_STATE(state, payload) {
    state[payload.target] = payload.data;
  },
  SET_PERMISSION_TREE(state, data) {
    const setNewId = list => {
      list.forEach(item => {
        item = {
          ...item,
          show: false,
          flag: false,
          newId: null
        };
        if (item.type === "nav") {
          item.flag = true;
          item.newId = `nav${item.id}`;
        }
        if (item.type === "auth") item.newId = `auth${item.id}`;
        if (item.childList) setNewId(item.childList);
      });
    };
    setNewId(data);
    state.permissionTreeList = data;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
