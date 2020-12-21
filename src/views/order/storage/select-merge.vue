<template>
  <el-row :gutter="10">
    <el-col :sm="24" :md="18">
      <el-card body-style="display:flex;justify-content: center;">
        <el-transfer
          :titles="['订单列表', '待并单列表']"
          :data="list"
          :props="transferProps"
          @change="onTransferChange"
          v-model="mergeIdList"
          v-loading="loaddata"
          filterable
        >
          <el-tooltip
            slot-scope="{ option }"
            :content="option.goodsIdCode"
            placement="top"
          >
            <div class="transfer-item">
              <span>{{ option.label }}</span>
              <i
                v-if="option.disable"
                class="el-icon-warning-outline"
                style="color:red"
              />
            </div>
          </el-tooltip>
          <div slot="left-footer" class="transfer-footer">
            <el-button size="mini" :disabled="loaddata" @click="onLoadMore">
              加载更多
            </el-button>
          </div>
        </el-transfer>
      </el-card>
    </el-col>
    <el-col :sm="24" :md="6">
      <el-card>
        <div slot="header">待并单信息</div>
        <statistic title="总件数" :value="totalBoxQty" class="mb1" />
        <statistic title="内物总数" :value="totalGoodsQty" class="mb1" />
        <statistic
          title="总毛重"
          :value="totalWeight"
          class="mb1"
          :precision="2"
        />
        <statistic
          title="总净重"
          :value="totalNetWeight"
          class="mb1"
          :precision="2"
        />
        <statistic
          title="总金额"
          :value="totalPrice"
          class="mb1"
          :precision="2"
        />
        <div class="clearfix">
          <el-button
            type="primary"
            class="float-right"
            :disabled="!mergeIdList.length"
            @click="onConfirm"
          >
            确认并单
          </el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import debounce from "@/utils/debounce";
import { uniqBy } from "@/utils";
import { storage as api } from "@/api/order";
import Statistic from "@/components/Statistic/index";

export default {
  name: "OrderStorageSelectMeger",
  components: {
    Statistic
  },
  data() {
    return {
      query: {
        pageIndex: 1,
        pageSize: 20
      },
      list: [],
      loading: false,
      transferProps: {
        key: "id",
        disabled: "disable"
      },
      total: 0,
      mergeIdList: [],
      mergeList: [],
      respList: [],
      loaddata: false
    };
  },
  computed: {
    totalBoxQty() {
      const { mergeList } = this;
      return mergeList.reduce(
        (prev, curr) => prev + (curr.totalBoxQty || 0),
        0
      );
    },
    totalPrice() {
      const { mergeList } = this;
      return mergeList.reduce((prev, curr) => prev + (curr.totalPrice || 0), 0);
    },
    totalWeight() {
      const { mergeList } = this;
      return mergeList.reduce(
        (prev, curr) => prev + (curr.totalWeight || 0),
        0
      );
    },
    totalNetWeight() {
      const { mergeList } = this;
      return mergeList.reduce(
        (prev, curr) => prev + (curr.totalNetWeight || 0),
        0
      );
    },
    totalGoodsQty() {
      const { mergeList } = this;
      return mergeList.reduce(
        (prev, curr) => prev + (curr.totalGoodsQty || 0),
        0
      );
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList: debounce(async function() {
      try {
        this.loaddata = true;
        const query = { ...this.query };
        query.pageIndex--;
        const { data } = await api.mergeList(query);
        let list = (data || []).map(v => ({
          ...v,
          label: `${v.declareUser} - ${v.declareUserIdCard} - ${v.address}`
        }));
        let respList = this.respList.slice(0, query.pageIndex);
        this.respList = [...respList, list];
        this.list = uniqBy(
          this.respList.reduce((prev, curr) => [...prev, ...curr], []),
          "id"
        );
        let len = list.length;
        this.total += len > 0 ? this.list.length + 1 : 0;
      } finally {
        this.loaddata = false;
      }
    }, 300),
    onTransferChange(value, direction, movedKeys) {
      if (direction === "right") {
        let selectedList = this.list.filter(v => movedKeys.includes(v.id));
        this.mergeList = [...this.mergeList, ...selectedList];
      } else if (direction === "left") {
        const mergeList = this.mergeList;
        this.mergeList = mergeList.filter(v => !movedKeys.includes(v.id));
      }
    },
    async onLoadMore() {
      this.query.pageIndex++;
      this.loaddata = true;
      await this.getList();
    },
    async onConfirm() {
      let confirm = await this.$confirm("是否合并已选订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(() => false);
      if (!confirm) return;
      try {
        this.downloading = true;
        this.$message.closeAll();
        const { data } = await api.actionMerge({ idList: this.mergeIdList });
        this.$message.success("订单合并成功");
        this.$router.push({
          name: "OrderStorageMergeUpdate",
          params: { id: data.response }
        });
      } finally {
        this.downloading = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-transfer-panel {
  width: 300px;
  &__body {
    height: 490px;
  }
  &__list {
    height: 400px;
  }
  &__item {
    margin-right: 10px;
  }
}
.transfer-item {
  display: flex;
  align-items: center;
  & > span {
    flex: 1;
    white-space: nowrap;
    word-wrap: normal;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.transfer-footer {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
