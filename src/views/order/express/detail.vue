<template>
  <div v-loading="loading">
    <!-- 基本信息 -->
    <el-card>
      <div slot="header" class="header">
        <div style="flex:1;font-size:14px">
          订单号: {{ baseOrder.id || "-" }}
          <span class="mr1" />
          创建日期:{{ baseOrder.createTime || "-" }}
        </div>
        <div>
          <el-button
            type="primary"
            size="small"
            @click="
              $router.push({
                name: 'OrderExpressUpdate',
                params: { id: baseOrder.id }
              })
            "
          >
            编辑
          </el-button>
          <el-button type="danger" plain size="small" @click="remove">
            删除
          </el-button>
        </div>
      </div>
      <el-form label-position="left">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="客户名称:">
              {{ baseOrder.baseCustomerName || "-" }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="电商订单号:">
              {{ baseOrder.firstOrderNo || "-" }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="头程快递单号:">
              {{ baseOrder.expressNo || "-" }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="总金额:">
              <statistic :value="baseOrder.totalPrice" :precision="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 状态 -->
    <el-card class="mt1">
      <div slot="header">
        订单进度
        <span class="masked">{{ baseOrder.statusName }}</span>
      </div>
      <el-steps
        v-if="flowNodeList.length"
        :active="status"
        align-center
        finish-status="success"
        :direction="device === 'mobile' ? 'vertical' : 'horizontal'"
        class="mb1"
      >
        <el-step v-for="v in flowNodeList" :key="v.id" :title="v.name">
          <el-button
            slot="description"
            size="small"
            :disabled="!v.attachment"
            @click="showAttachment(v)"
          >
            附件
          </el-button>
        </el-step>
      </el-steps>
      <el-card shadow="never">
        <div slot="header">操作日志</div>
        <el-timeline v-if="orderFlowLogList.length" class="pt1 pl1">
          <el-timeline-item
            v-for="v in orderFlowLogList"
            :key="v.id"
            :timestamp="v.createTime"
          >
            {{ v.content }} - 操作者:{{ v.createBy }}
          </el-timeline-item>
        </el-timeline>
        <span v-else>暂无操作信息</span>
      </el-card>
    </el-card>
    <el-card class="mt1">
      <div slot="header">订单信息</div>
      <el-form label-position="left">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="币制:">
              {{ baseOrder.currencyCode || "-" }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="长CM:">
              {{ baseOrderBox.boxLength || 0 }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="宽CM:">
              {{ baseOrderBox.boxWidth || 0 }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="高CM:">
              {{ baseOrderBox.boxHeight || 0 }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="包号:">
              {{ baseOrder.packageNo || "-" }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="运输方式:">
              {{ baseOrder.transportMode || "-" }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="目的国(地区):">
              {{ baseOrder.destinationState || "-" }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="运抵国(地区):">
              {{ baseOrder.arriveState || "-" }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        :data="baseOrderBox.baseOrderGoodsList || []"
        style="width: 100%"
        class="mt1"
        max-height="600"
        ref="table"
      >
        <el-table-column prop="hsName" label="商品/物品名称" min-width="150" />
        <el-table-column
          prop="englishGoodsName"
          label="英文名称"
          min-width="150"
        />
        <el-table-column prop="hsCode" label="商品编码" width="120" />
        <el-table-column
          prop="declarationUnit"
          label="申报计量单位"
          width="100"
        />
        <el-table-column
          prop="specifications"
          label="商品规格/型号"
          min-width="150"
        />
        <el-table-column prop="declarationQty" label="数量" min-width="100" />
        <el-table-column prop="singleWeight" label="毛重KG" min-width="100" />
        <el-table-column prop="price" label="单价" min-width="100" />
        <el-table-column prop="totalPrice" label="总价" min-width="100" />
      </el-table>
    </el-card>
    <preview-image ref="viewer" />
  </div>
</template>
<script>
import { express as api } from "@/api/order";
import Statistic from "@/components/Statistic/index";
import PreviewImage from "@/components/PreviewImage/index";
import { mapState } from "vuex";
import RouteLeave from "@/mixin/RouteLeave";
export default {
  name: "OrderExpressDetail",
  mixins: [RouteLeave],
  components: {
    Statistic,
    PreviewImage
  },
  data() {
    return {
      loading: false,
      detail: {}
    };
  },
  computed: {
    ...mapState({
      device: state => state.app.device
    }),
    baseOrder() {
      const { baseOrder } = this.detail || {};
      return baseOrder || {};
    },
    baseOrderBoxList() {
      const { baseOrderBoxList } = this.baseOrder;
      return baseOrderBoxList || [];
    },
    baseOrderBox() {
      return this.baseOrderBoxList[0] || {};
    },
    flowNodeList() {
      const { flowNodeList } = this.detail;
      return flowNodeList || [];
    },
    orderFlowLogList() {
      const { orderFlowLogList } = this.detail;
      return orderFlowLogList || [];
    },
    status() {
      return this.flowNodeList.filter(v => v.status === "FINISH").length;
    }
  },
  created() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      try {
        this.loading = true;
        const { id } = this.$route.params;
        const { data } = await api.detail(id);
        this.detail = data || {};
      } finally {
        this.loading = false;
      }
    },
    showAttachment({ attachment }) {
      let attachmentList = attachment.attachmentList || [];
      this.$refs.viewer.show(attachmentList);
    },
    async remove() {
      let confirm = await this.$confirm(
        "订单将不可恢复，您是否删除？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(() => false);
      if (!confirm) return;
      const { id } = this.$route.params;
      await api.remove(id);
      this.$message.closeAll();
      this.$message.success("删除成功!");
      this.$router.go(-1);
      // let routerJump = this.$router.resolve({
      //   name: "OrderExpress"
      // });
      // this.$router.replace(routerJump.href);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item {
  margin-bottom: 0;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
ul.drawer-list {
  list-style: none;
  padding: 0 20px;
  h4 {
    margin: 10px 0;
  }
  li {
    color: #1890ff;
    cursor: pointer;
    margin-bottom: 6px;
    font-size: 14px;
  }
}
.masked {
  display: inline-block;
  margin-top: 0;
  margin-bottom: auto;
  color: transparent;
  font-weight: 600;
  font-size: 22px;

  /* 渐变背景 */
  background-image: -webkit-linear-gradient(
    left,
    #3498db,
    #f47920 10%,
    #d71345 20%,
    #f7acbc 30%,
    #ffd400 40%,
    #3498db 50%,
    #f47920 60%,
    #d71345 70%,
    #f7acbc 80%,
    #ffd400 90%,
    #3498db
  );

  /* 背景剪裁为文字，只将文字显示为背景 */
  background-size: 200% 100%;

  /* 文字填充色为透明 */
  -webkit-text-fill-color: transparent;
  background-clip: text;

  /* 背景图片向水平方向扩大一倍，这样background-position才有移动与变化的空间 */

  /* 动画 */
  animation: masked-animation 3s infinite linear;
}

@keyframes masked-animation {
  0% {
    /* background-position 属性设置背景图像的起始位置。 */
    background-position: 0 0;
  }

  100% {
    background-position: -100% 0;
  }
}
</style>
