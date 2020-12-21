<template>
  <el-dialog
    :title="(editing ? '编辑' : '添加') + '箱内商品'"
    :visible.sync="visible"
    :before-close="close"
    width="850px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules" label-position="top">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="商品/物品名称">
            <el-autocomplete
              v-model="form.hsName"
              :fetch-suggestions="onGoodsSearch"
              placeholder="请输入商品/物品名称"
              @select="onGoodsSelect"
              style="width:100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品规格/型号" prop="specifications">
            <el-select
              v-model="form.specifications"
              placeholder="请选择商品规格/型号"
              @change="onSpecChange"
              filterable
            >
              <el-option
                v-for="v in specList"
                :label="v.value"
                :value="v.id"
                :key="v.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="商品编码" prop="hsCode">
            <el-input
              v-model.trim="form.hsCode"
              placeholder="根据“商品/物品”获得"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申报计量单位" prop="declarationUnitCode">
            <el-select
              v-model="form.declarationUnitCode"
              placeholder="请选择申报计量单位"
              filterable
              @change="onUnitChange"
            >
              <el-option
                v-for="v in baseUnitList"
                :label="v.name"
                :value="v.code"
                :key="v.code"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="总申报数量" prop="declarationQty">
            <el-input-number
              v-model="form.declarationQty"
              controls-position="right"
              placeholder="请输入总申报数量"
              style="width:100%"
              :min="0"
              :precision="0"
              @change="sumTotalPrice"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单价" prop="price">
            <el-input-number
              v-model="form.price"
              controls-position="right"
              placeholder="请输入单价"
              style="width:100%"
              :min="0"
              :precision="2"
              @change="sumTotalPrice"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="单品类重量KG" prop="singleWeight">
            <el-input-number
              v-model="form.singleWeight"
              controls-position="right"
              placeholder="单品类重量KG"
              style="width:100%"
              disabled
              :min="0"
              :precision="2"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="品牌" prop="brand">
            <el-input v-model.trim="form.brand" placeholder="请输入品牌" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="总价" prop="totalPrice">
            <el-input-number
              v-model="form.totalPrice"
              controls-position="right"
              placeholder="总价"
              style="width:100%"
              disabled
              :min="0"
              :precision="2"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import debounce from "@/utils/debounce";
import { storage as api } from "@/api/order";
import { mapGetters } from "vuex";
import { uuid } from "@/utils";
export default {
  data() {
    return {
      visible: false,
      editing: false,
      specList: [],
      form: {
        key: null,
        boxIdx: 0,
        hsName: null,
        specifications: null,
        hsCode: null,
        declarationUnitCode: null,
        declarationUnit: null,
        declarationQty: null,
        price: null,
        singleWeight: null,
        brand: null,
        totalPrice: null
      },
      rules: {
        // hsName: [{ required: true, message: "请输入商品/物品名称" }],
        // // englishGoodsName: [{ pattern: /\w+$/, message: '英文商品名称格式错误' }],
        // hsCode: [{ required: true, message: "请输入商品编码" }],
        // declarationUnitCode: [
        //   { required: true, message: "请选择申报计量单位" }
        // ],
        // specifications: [{ required: true, message: "请输入商品规格/型号" }],
        // firstStatutoryQty: [
        //   { required: true, message: "请输入第一(法定)数量" }
        // ],
        // firstStatutoryUnitCode: [
        //   { required: true, message: "请选择第一(法定)计量单位" }
        // ],
        // declarationQty: [{ required: true, message: "请输入申报数量" }],
        // price: [{ required: true, message: "请输入单价" }],
        totalPrice: [
          // { required: true, message: '总价不能为空' },
          { type: "number", min: 0.01, message: "总价必须大于0" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters("storageOrder", ["createData"]),
    baseProductCodeList() {
      const { baseProductCodeList } = this.createData || {};
      return (baseProductCodeList || []).map(v => ({ ...v, value: v.name }));
    },
    baseUnitList() {
      const { baseUnitList } = this.createData || {};
      return baseUnitList || [];
    }
  },
  methods: {
    show(editing = false, idx, row) {
      this.form.boxIdx = idx;
      this.visible = true;
      this.editing = editing;
      if (!editing) return;
      this.form = { ...row, boxIdx: idx };
    },
    close() {
      this.visible = false;
      this.form = this.$resetFields(this.form);
      this.$refs.form.resetFields();
    },
    submit: debounce(async function() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        let form = { ...this.form };
        if (!this.editing) {
          form.key = uuid();
        }
        this.$emit("submit", this.editing, form);
        this.close();
      });
    }, 300),
    onGoodsSearch: debounce(async function(val, cb) {
      if (!val) {
        return cb(this.baseProductCodeList);
      }
      const searchResult = this.baseProductCodeList.filter(item =>
        (item.name || "").includes(val)
      );
      cb(searchResult);
      await this.getHscodeByName(val);
    }, 300),
    getHscodeByName: debounce(async function(val) {
      const { data } = await api.hscodeByName({ name: val });
      let specList = data.specList || [];
      let codeList = data.codeList || [];
      this.specList = specList.map((v, i) => ({ ...v, code: codeList[i] }));
    }, 300),
    onGoodsSelect({ name }) {
      this.getHscodeByName(name);
    },
    onSpecChange(v) {
      const { specList } = this;
      this.form.hsCode = specList[v].code;
    },
    onUnitChange(val) {
      let curr = this.baseUnitList.find(v => v.code === val);
      if (!curr) return;
      this.form.declarationUnit = curr.name;
    },
    sumTotalPrice() {
      const { declarationQty, price } = this.form;
      const totalPrice = (declarationQty * 1 || 0) * (price * 1 || 0);
      this.form.totalPrice = totalPrice;
    }
  }
};
</script>
