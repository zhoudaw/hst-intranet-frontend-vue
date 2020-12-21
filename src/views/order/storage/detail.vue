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
            v-if="isSplitMerge"
            @click="drawer = true"
          >
            拆/并单记录
          </el-button>
          <el-button
            type="primary"
            size="small"
            v-if="splitCount === 0 || mergeCount === 0"
            @click="
              $router.push({
                name: 'OrderStorageUpdate',
                params: { id: baseOrder.id }
              })
            "
          >
            编辑订单
          </el-button>
          <el-button
            type="primary"
            size="small"
            v-if="splitCount === 0"
            @click="
              $router.push({
                name: 'OrderStorageSplitFirst',
                params: { id: baseOrder.id }
              })
            "
          >
            拆单
          </el-button>
          <el-button type="danger" plain size="small" @click="remove">
            删除订单
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
            <el-form-item label="头程物流公司:">
              {{ baseOrder.logisticsName || "-" }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="头程物流单号:">
              {{ baseOrder.logisticsNo || "-" }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="头程快递公司:">
              {{ baseOrder.expressCompany || "-" }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="头程快递单号:">
              {{ baseOrder.expressNo || "-" }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
            <el-form-item label="客户自送:">
              {{ baseOrder.customerAutoWayAble ? "是" : "否" }}
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
        <el-tabs value="log">
          <el-tab-pane label="操作日志" name="log">
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
          </el-tab-pane>
          <el-tab-pane label="宅配信息" name="info">
            <el-timeline v-if="homeDeliveryTrackList.length" class="pt1 pl1">
              <el-timeline-item
                v-for="v in homeDeliveryTrackList"
                :key="v.id"
                :timestamp="v.time"
              >
                {{ v.homeDeliveryNo }} - {{ v.content }}
              </el-timeline-item>
            </el-timeline>
            <span v-else>暂无宅配信息</span>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-card>
    <el-card class="mt1">
      <div slot="header">订单信息</div>
      <el-form label-position="left">
        <sender-info :data="baseOrder" />
        <receiver-info :data="baseOrder" />
        <box-item
          v-for="(v, i) in baseOrderBoxList"
          :key="v.id"
          :data="v"
          :index="i"
        />
        <number-info :data="baseOrder" />
        <other-info :data="baseOrder" />
        <customs-clearance-info :data="baseOrder" />
        <send-and-receive-info :data="baseOrder" />
        <shipper-info :data="baseOrder" />
        <freight-insurance-miscellaneous-info :data="baseOrder" />
      </el-form>
    </el-card>
    <el-drawer title="拆/并单记录" :visible.sync="drawer">
      <ul class="drawer-list" v-if="baseOrder.type === 'merge'">
        <h4>由以下订单并成本订单</h4>
        <empty v-if="!mergeFromIdList.length" />
        <li v-else v-for="v in mergeFromIdList" :key="v" @click="skipDetail(v)">
          {{ v }}
        </li>
      </ul>
      <ul class="drawer-list" v-if="baseOrder.type === 'split'">
        <h4>由以下订单拆成本订单</h4>
        <empty v-if="!splitFromIdList.length" />
        <li v-else v-for="v in splitFromIdList" :key="v" @click="skipDetail(v)">
          {{ v }}
        </li>
      </ul>
      <ul class="drawer-list" v-if="mergeCount > 0">
        <h4>本订单已并成以下订单</h4>
        <empty v-if="!mergeIdList.length" />
        <li v-else v-for="v in mergeIdList" :key="v" @click="skipDetail(v)">
          {{ v }}
        </li>
      </ul>
      <ul class="drawer-list" v-if="splitCount > 0">
        <h4>本订单已拆成以下订单</h4>
        <empty v-if="!splitIdList.length" />
        <li v-else v-for="v in splitIdList" :key="v" @click="skipDetail(v)">
          {{ v }}
        </li>
      </ul>
    </el-drawer>
    <preview-image ref="viewer" />
  </div>
</template>
<script>
import { storage as api } from "@/api/order";
import Statistic from "@/components/Statistic/index";
import { mapState } from "vuex";
import PreviewImage from "@/components/PreviewImage/index";

import {
  SenderInfo,
  ReceiverInfo,
  BoxItem,
  SendAndReceiveInfo,
  NumberInfo,
  OtherInfo,
  CustomsClearanceInfo,
  ShipperInfo,
  FreightInsuranceMiscellaneousInfo
} from "./components/detail";
import RouteLeave from "@/mixin/RouteLeave";

export default {
  name: "OrderStorageDetail",
  mixins: [RouteLeave],
  components: {
    Statistic,
    PreviewImage,
    SenderInfo,
    ReceiverInfo,
    BoxItem,
    SendAndReceiveInfo,
    NumberInfo,
    OtherInfo,
    CustomsClearanceInfo,
    ShipperInfo,
    FreightInsuranceMiscellaneousInfo
  },
  data() {
    return {
      loading: false,
      detail: {},
      drawer: false
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
    mergeCount() {
      const { mergeCount } = this.baseOrder;
      return mergeCount || 0;
    },
    splitCount() {
      const { splitCount } = this.baseOrder;
      return splitCount || 0;
    },
    mergeFromIdList() {
      const { mergeFromIdList } = this.detail || {};
      return mergeFromIdList || [];
    },
    splitFromIdList() {
      const { splitFromIdList } = this.detail || {};
      return splitFromIdList || [];
    },
    mergeIdList() {
      const { mergeIdList } = this.detail || {};
      return mergeIdList || [];
    },
    splitIdList() {
      const { splitIdList } = this.detail || {};
      return splitIdList || [];
    },
    isSplitMerge() {
      const { type } = this.baseOrder;
      return this.mergeCount > 0 || this.splitCount > 0 || type !== "original";
    },
    flowNodeList() {
      const { flowNodeList } = this.detail;
      return flowNodeList || [];
    },
    orderFlowLogList() {
      const { orderFlowLogList } = this.detail;
      return orderFlowLogList || [];
    },
    homeDeliveryTrackList() {
      const { homeDeliveryTrackList } = this.detail;
      return homeDeliveryTrackList || [];
    },
    baseOrderBoxList() {
      const { baseOrderBoxList } = this.baseOrder;
      return baseOrderBoxList || [];
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
      //   name: "OrderStorage"
      // });
      // this.$router.replace(routerJump.href);
    },
    skipDetail(id) {
      this.$router.push({
        name: "OrderStorageDetail",
        params: { id },
        query: { splitRecord: "splitRecord" }
      });
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
