<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <div style="font-size:14px">
          订单号: {{ baseOrder.id || "-" }}
          <span class="mr1" />
          创建日期:{{ baseOrder.createTime || "-" }}
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
    <preview-image ref="viewer" />
  </div>
</template>
<script>
import RouteLeave from "@/mixin/RouteLeave";
import api from "@/api/logistics-mgmt";
import { mapState } from "vuex";
import Statistic from "@/components/Statistic/index";
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
export default {
  name: "LogisticsMgmtDetail",
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
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-form-item {
  margin-bottom: 0;
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
