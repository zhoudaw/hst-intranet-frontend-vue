<template>
  <el-card>
    <el-row :gutter="10">
      <el-col
        class="grid"
        :sm="24"
        :md="12"
        :lg="8"
        v-for="v in routes"
        :key="v.name"
      >
        <router-link :to="{ name: v.name }">
          <el-card shadow="hover">
            <div class="grid-body">
              <h4 class="title">
                {{ v.title }}
              </h4>
              <div class="desc" v-if="v.desc">
                {{ v.desc }}
              </div>
            </div>
            <i class="el-icon-arrow-right" /> </el-card
        ></router-link>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import infoMaintainRoutes from "@/router/modules/info-maintain";
let routes = infoMaintainRoutes.children
  .filter(v => v.path !== "list")
  .map(v => ({ path: v.path, ...v.meta, name: v.name }));
export default {
  name: "InfoMaintain",
  data() {
    return {
      routes
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.grid {
  padding-bottom: 10px;
  .el-card {
    cursor: pointer;
    /deep/ &__body {
      display: flex;
      align-items: center;
      height: 100px;
    }
  }
  &-body {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-right: 5px;
    .title {
      font-size: 16px;
      margin: 0;
    }
    .desc {
      font-size: 14px;
      color: #bdc5d0;
      padding-top: 10px;
    }
  }
}
</style>
