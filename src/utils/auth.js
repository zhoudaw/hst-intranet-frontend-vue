export default {
  auth(url) {
    let { user } = JSON.parse(localStorage.getItem("user"));
    if (user.superAdmin) return true;
    for (let auth of user.authorityList) {
      if (auth.url === url) {
        return true;
      }
    }
    return false;
  },
  view(url) {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user.superAdmin) return true;
    for (let nav of user.navigation) {
      if (nav.url === url) {
        return true;
      }
    }
    return false;
  }
};
