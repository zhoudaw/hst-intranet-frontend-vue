<template>
  <div>
    <el-card v-loading="planCLoading">
      <div slot="header">C类价格配置</div>
      <el-tabs
        v-model="activePlanC"
        type="card"
        addable
        @tab-remove="onTabRemove"
        @tab-add="onTabAdd"
      >
        <el-tab-pane
          v-for="v in planCList"
          :key="v.planCode"
          :label="v.name"
          :name="v.planCode"
          :closable="!v.planCode.includes('default')"
        >
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <plan-c-list
                v-if="activePlanC === v.planCode"
                :data="v"
                @upload-success="getPlanCList"
              />
            </keep-alive>
          </transition>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-card class="mt1" v-loading="planBConfigLoading">
      <div slot="header">B类价格配置</div>
      <h5 class="mt1 mb1">基础价格配置</h5>
      <el-table
        :data="planBConfig.list || []"
        style="width: 100%"
        max-height="600"
      >
        <el-table-column prop="configCode" label="编号" min-width="100" />
        <el-table-column prop="type" label="类型" min-width="100" />
        <el-table-column prop="subType" label="子类型" min-width="100" />
        <el-table-column prop="price" label="价格" min-width="100" />
        <el-table-column prop="desc" label="备注" min-width="100" />
        <el-table-column
          prop="type"
          label="操作"
          width="60"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tooltip content="编辑" placement="top">
              <el-button
                type="text"
                icon="el-icon-edit"
                @click="showBPriceDialog(row)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <plan-b-list :config-list="planBConfig.list || []" />
    </el-card>
    <add-plan-c-dialog ref="planCDialog" @refresh="getPlanCList" />
    <b-price-form-dialog ref="bPriceCDialog" @refresh="getPlanBConfigAll" />
  </div>
</template>
<script>
import RouteLeave from "@/mixin/RouteLeave";
import api from "@/api/sell-product";
import PlanCList from "./components/PlanCList";
import PlanBList from "./components/PlanBList";
import AddPlanCDialog from "./components/AddPlanCDialog";
import BPriceFormDialog from "./components/BPriceFormDialog";
export default {
  name: "SellProductSetting",
  mixins: [RouteLeave],
  components: {
    PlanCList,
    PlanBList,
    AddPlanCDialog,
    BPriceFormDialog
  },
  data() {
    return {
      planCLoading: false,
      planCList: [],
      activePlanC: "",
      planBConfigLoading: false,
      planBConfig: { list: [], count: 0 }
    };
  },
  created() {
    this.getPlanCList();
    this.getPlanBConfigAll();
  },
  methods: {
    async getPlanCList() {
      try {
        this.planCLoading = true;
        const { productCode } = this.$route.params;
        const { data } = await api.planList(productCode);
        let planCList = data || [];
        this.planCList = planCList;
        if (!planCList.length) return;
        this.activePlanC = planCList[0].planCode;
      } finally {
        this.planCLoading = false;
      }
    },
    async onTabRemove(name) {
      let confirm = await this.$confirm("确定删除该配置？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => {});
      if (!confirm) return;
      const curr = this.planCList.find(v => v.planCode === name);
      await api.planRemove(curr.id);
      this.$message.closeAll();
      this.$message.success("删除成功!");
      this.getPlanCList();
    },
    onTabAdd() {
      this.$refs.planCDialog.show();
    },
    async getPlanBConfigAll() {
      try {
        this.planBConfigLoading = true;
        const { productCode } = this.$route.params;
        const { data } = await api.planBConfigAll(productCode);
        this.planBConfig = data || {};
      } finally {
        this.planBConfigLoading = false;
      }
    },
    showBPriceDialog(row) {
      this.$refs.bPriceCDialog.show(row);
    }
  }
};
</script>
