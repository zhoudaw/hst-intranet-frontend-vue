<template>
  <div>
    <div class="mb1 clearfix">
      <el-button class="float-right" type="primary" @click="addItem">
        添加箱
      </el-button>
    </div>
    <el-card v-for="(box, idx) in baseOrderBoxList" :key="box.key" class="mb1">
      <div slot="header" class="clearfix">
        <span>箱{{ idx + 1 }}</span>
        <div class="float-right">
          <el-button
            type="danger"
            plain
            @click="removeItem(idx)"
            v-if="baseOrderBoxList.length > 1"
          >
            删除箱
          </el-button>
          <el-button @click="copyItem(box)">
            复制箱
          </el-button>
        </div>
      </div>
      <el-row :gutter="10">
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item
            label="长CM"
            :prop="'baseOrderBoxList.' + idx + '.boxLength'"
          >
            <el-input-number
              v-model="box.boxLength"
              controls-position="right"
              placeholder="请输入长CM"
              style="width:100%"
              :min="0"
              :precision="2"
            />
            <el-alert
              v-if="(box.boxLength || 0) > 180 && (box.boxWidth || 0) > 180"
              title="长和宽超过180CM需要正报"
              type="warning"
              show-icon
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item
            label="宽CM"
            :prop="'baseOrderBoxList.' + idx + '.boxWidth'"
          >
            <el-input-number
              v-model="box.boxWidth"
              controls-position="right"
              placeholder="请输入宽CM"
              style="width:100%"
              :min="0"
              :precision="2"
            />
            <el-alert
              v-if="(box.boxHeight || 0) > 180 && (box.boxWidth || 0) > 180"
              title="宽和高超过180CM需要正报"
              type="warning"
              show-icon
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item
            label="高CM"
            :prop="'baseOrderBoxList.' + idx + '.boxHeight'"
          >
            <el-input-number
              v-model="box.boxHeight"
              controls-position="right"
              placeholder="请输入高CM"
              style="width:100%"
              :min="0"
              :precision="2"
            />
            <el-alert
              v-if="(box.boxLength || 0) > 180 && (box.boxHeight || 0) > 180"
              title="长和高超过180CM需要正报"
              type="warning"
              show-icon
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="件数(按包装计算)" prop="boxQty">
            <el-input-number
              v-model="box.boxQty"
              controls-position="right"
              placeholder="请输入件数(按包装计算)"
              style="width:100%"
              :min="0"
              :precision="0"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24" />
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item
            label="总毛重KG(总件数)"
            :prop="'baseOrderBoxList.' + idx + '.grossWeight'"
          >
            <el-input-number
              v-model="box.grossWeight"
              controls-position="right"
              placeholder="请输入总毛重KG(总件数)"
              style="width:100%"
              :min="0"
              :precision="2"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item
            label="总净重KG(总件数)"
            :prop="'baseOrderBoxList.' + idx + '.netWeight'"
          >
            <el-input-number
              v-model="box.netWeight"
              controls-position="right"
              placeholder="请输入总净重KG(总件数)"
              style="width:100%"
              :min="0"
              :precision="2"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item
            label="内物总数量(总件数)"
            :prop="'baseOrderBoxList.' + idx + '.totalQty'"
          >
            <el-input-number
              v-model="box.totalQty"
              controls-position="right"
              placeholder="请输入内物总数量(总件数)"
              style="width:100%"
              :min="0"
              :precision="0"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-form-item label="唛头(外包装标识)" prop="expressNo">
            <el-input
              v-model="box.expressNo"
              placeholder="请输入唛头(外包装标识)"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-table
        :data="box.baseOrderGoodsList"
        style="width: 100%"
        max-height="500"
        ref="table"
        @row-dblclick="row => onRowDblclick(row, idx)"
        row-key="key"
      >
        <el-table-column label="操作" width="60" fixed align="center">
          <template slot-scope="{ $index }">
            <el-tooltip content="删除" placement="top">
              <el-button
                type="text"
                icon="el-icon-delete"
                @click.stop="onRemoveGoodsItem(box, $index)"
              />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="hsName" label="商品/物品名称" min-width="200" />
        <el-table-column prop="hsCode" label="商品编码" width="150" />
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
        <el-table-column prop="declarationQty" label="总申报数量" width="150" />
        <el-table-column prop="price" label="单价" min-width="100" />
        <el-table-column prop="brand" label="品牌" min-width="150" />
        <el-table-column
          prop="singleWeight"
          label="单品类重量KG"
          min-width="120"
        />
        <el-table-column prop="totalPrice" label="总价" min-width="100" />
      </el-table>
      <el-button
        icon="el-icon-plus"
        size="small"
        class="mt2"
        style="width:100%"
        @click="showGoodsDialog(false, idx)"
      >
        添加箱内商品
      </el-button>
    </el-card>
    <box-goods-dialog ref="dialog" @submit="addBoxGoods" />
  </div>
</template>
<script>
import { uuid } from "@/utils";
import BoxGoodsDialog from "./BoxGoodsDialog";
export default {
  components: {
    BoxGoodsDialog
  },
  data() {
    return {
      baseOrderBoxList: []
    };
  },
  watch: {
    baseOrderBoxList: {
      handler(n) {
        this.$emit("change", { baseOrderBoxList: n });
      },
      deep: true
    }
  },
  mounted() {
    this.addItem();
  },
  methods: {
    init(data) {
      let baseOrderBoxList = (data.baseOrderBoxList || []).map(box => {
        return {
          ...box,
          key: uuid(),
          baseOrderGoodsList: (box.baseOrderGoodsList || []).map(goods => ({
            ...goods,
            key: uuid()
          }))
        };
      });
      this.baseOrderBoxList = baseOrderBoxList;
    },
    addItem() {
      this.baseOrderBoxList.push({
        // 包装种类
        kindOfPackage: null,
        kindOfPackageCode: null,
        // 长CM
        boxLength: null,
        // 宽CM
        boxWidth: null,
        // 高CM
        boxHeight: null,
        // 件数(按包装计算)
        boxQty: null,
        // 总毛重KG(总件数)
        grossWeight: null,
        // 总净重
        netWeight: null,
        // 件数
        totalQty: null,
        // 是否木质包装
        woodPackage: null,
        // 是否旧物品
        oldGoods: null,
        // 是否低温运输
        lowTemperature: null,
        // 唛头(外包装标识)
        expressNo: null,
        // 商品list
        baseOrderGoodsList: [],
        key: uuid()
      });
    },
    removeItem(idx) {
      this.baseOrderBoxList.splice(idx, 1);
    },
    copyItem(box) {
      this.$prompt("数量", "复制箱", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputValidator: v => {
          if (!v) {
            return "请输入数量";
          }
          if (!/^[0-9]\d*$/.test(v)) {
            return "数量格式不正确";
          }
          if (v * 1 <= 0) {
            return "数量必须大于0";
          }
        }
      })
        .then(({ value }) => {
          let boxQty = value * 1;
          for (let idx = 0; idx < boxQty; idx++) {
            this.baseOrderBoxList.push({
              ...box,
              key: uuid(),
              baseOrderGoodsList: box.baseOrderGoodsList.map(goods => ({
                ...goods,
                key: uuid()
              }))
            });
          }
        })
        .catch(() => {});
    },
    onRemoveGoodsItem(box, idx) {
      box.baseOrderGoodsList.splice(idx, 1);
    },
    showGoodsDialog(editing = false, boxIdx, row = {}) {
      this.$refs.dialog.show(editing, boxIdx, row);
    },
    addBoxGoods(editing, { boxIdx, ...form }) {
      let box = this.baseOrderBoxList[boxIdx];
      if (!editing) {
        box.baseOrderGoodsList.push(form);
        return;
      }
      let idx = box.baseOrderGoodsList.findIndex(v => v.key === form.key);
      this.$set(box.baseOrderGoodsList, idx, form);
    },
    onRowDblclick(row, boxIdx) {
      this.showGoodsDialog(true, boxIdx, row);
    }
  }
};
</script>
