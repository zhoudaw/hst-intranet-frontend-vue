<template>
  <el-dialog
    title="订单主要信息确认"
    :visible.sync="visible"
    :before-close="close"
    width="80%"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
    destroy-on-close
  >
    <el-form
      ref="form"
      :model="{ list }"
      :show-message="true"
      v-loading="loading"
    >
      <el-table
        :data="list"
        style="width: 100%"
        max-height="80%"
        ref="table"
        border
      >
        <el-table-column type="expand">
          <template slot-scope="{ row, $index }">
            <el-table
              :data="row.goodsList"
              style="width: 100%"
              ref="table"
              border
            >
              <el-table-column prop="hsName" label="品名" min-width="100" />
              <el-table-column
                prop="declarationQty"
                label="数量"
                min-width="100"
              />

              <el-table-column prop="price" label="单价" min-width="100">
                <template slot-scope="{ row: goods, $index: goodsIndex }">
                  <el-form-item
                    :prop="
                      'list.' + $index + '.goodsList.' + goodsIndex + '.price'
                    "
                    :rules="[{ required: true, message: '请输入单价' }]"
                  >
                    <el-input-number
                      v-model="goods.price"
                      controls-position="right"
                      :min="0"
                    />
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="订单号" width="150" />
        <el-table-column
          prop="realReceiver"
          label="真实收件人"
          min-width="100"
        />
        <el-table-column
          prop="declareUserIdCard"
          label="申报人统编"
          width="150"
        />
        <el-table-column prop="declareUser" label="申报人名" min-width="100" />
        <el-table-column
          prop="receiverFullAddress"
          label="收件地址"
          min-width="150"
        />
        <el-table-column prop="agencyFundNTD" label="代收款" min-width="100" />
        <el-table-column prop="tariffPayName" label="关税付款人" width="200">
          <template slot-scope="{ row }">
            <el-select
              v-model="row.tariffPayId"
              placeholder="请选择关税付款人"
              @change="v => onTariffPayChange(v, row)"
            >
              <el-option
                v-for="v in tariffPayList"
                :key="v.value"
                :label="v.text"
                :value="v.value"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <transition name="el-fade-in-linear">
        <div v-if="greaterFiveThousandList.length">
          <span>总价超过五千：</span>
          <el-row :gutter="10">
            <el-col
              v-for="(v, i) in greaterFiveThousandList"
              :key="i"
              :lg="6"
              :md="12"
              :sm="24"
              style="color:red;fon-size:12px;"
            >
              {{ v.name }}：{{ v.money }}
            </el-col>
          </el-row>
        </div>
      </transition>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit" :loading="loading">
        确 定
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { storage as api } from "@/api/order";
export const tariffPayList = [
  { text: "收件人付", value: 1 },
  { text: "发件人付", value: 2 },
  { text: "海速通包税", value: 3 }
];
export default {
  data() {
    return {
      tariffPayList,
      visible: false,
      loading: false,
      list: [],
      greaterFiveThousandList: [],
      idList: []
    };
  },
  methods: {
    show(idList = []) {
      this.visible = true;
      this.idList = idList;
      this.getList(idList);
    },
    close() {
      this.idList = [];
      this.list = [];
      this.greaterFiveThousandList = [];
      this.visible = false;
    },
    async getList(idList) {
      try {
        this.loading = true;
        const { data } = await api.toBillsOfLadingList(idList);
        this.greaterFiveThousandList = data.greaterFiveThousandList || [];
        this.list = (data.list || []).map(v => {
          let currTariffPay = this.getTariffPay("text", v.tariffPayName) || {};
          return {
            ...v,
            tariffPayId: currTariffPay.value || null,
            goodsList: v.goodsList || []
          };
        });
      } finally {
        this.loading = false;
      }
    },
    getTariffPay(key, val) {
      return tariffPayList.find(v => v[key] === val);
    },
    onTariffPayChange(v, row) {
      let currTariffPay = this.getTariffPay("value", v) || {};
      row.tariffPayName = currTariffPay.text;
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          this.loading = true;

          let goodsList = this.list.reduce(
            (prev, curr) => [...prev, ...curr.goodsList],
            []
          );
          await api.updateVerifyToBillsOfLadingInfo({
            list: this.list,
            goodsUpdateFormList: goodsList
          });
          this.$message.closeAll();
          this.$message.success("修改成功");
          this.$emit("refresh", this.idList);
          this.close();
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-table__expanded-cell[class*="cell"] {
  padding: 10px;
}
/deep/ .el-form-item {
  margin-bottom: 0;
  &__error {
    position: relative;
  }
}
</style>
