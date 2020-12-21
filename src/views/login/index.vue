<template>
  <div class="login-wrap">
    <div class="login-bg">
      <video autoplay loop muted>
        <source src="@/assets/video/Ipad.mp4" type="video/mp4" />
      </video>
    </div>
    <div class="ms-login">
      <div class="ms-title">海速通</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="userName">
          <el-input
            prefix-icon="el-icon-user"
            v-model.trim="param.userName"
            :disabled="loading"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            prefix-icon="el-icon-lock"
            placeholder="请输入密码"
            v-model.trim="param.password"
            :disabled="loading"
            @keyup.enter.native="submitForm()"
          />
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm()" :loading="loading">
            登录
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
const isDev = process.env.NODE_ENV == "development";
export default {
  data() {
    return {
      loading: false,
      param: {
        userName: "",
        password: ""
      },
      data: {},
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  created() {
    localStorage.removeItem("user");
    const userName = localStorage.getItem("userName");
    const password = localStorage.getItem("password");
    this.param.userName = userName || isDev ? "admin" : "";
    this.param.password = password || isDev ? "a123456" : "";
  },
  methods: {
    submitForm() {
      this.$refs.login.validate(async valid => {
        this.$message.closeAll();
        if (!valid) {
          this.$message.error("请输入账号和密码");
          return;
        }
        try {
          this.loading = true;
          await this.$store.dispatch("user/login", this.param);
          this.$message.success("登录成功");
          const accessRoutes = await this.$store.dispatch(
            "permission/generateRoutes",
            ["admin"]
          );
          // dynamically add accessible routes
          this.$router.addRoutes(accessRoutes);
          const { query } = this.$router.currentRoute;
          if (query && query.redirect) {
            let redirect = query.redirect.replace("/login?redirect=");
            this.$router.push(unescape(redirect));
          } else {
            this.$router.push("/");
          }
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  /* background-image: url(~@/assets/img/login-bg.jpg); */
  background-repeat: no-repeat;
  background-size: cover;
}
.login-bg {
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-image: none;
}
.login-bg video {
  margin: auto;
  position: absolute;
  z-index: -1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  visibility: visible;
  width: 100vw;
  height: 100vh;
  background-image: url(~@/assets/login-bg.jpg);
  object-fit: fill;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #91c42a;
  border-bottom: 1px solid #e5f7fe;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.4);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
