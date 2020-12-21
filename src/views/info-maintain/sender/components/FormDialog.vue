<template>
  <el-dialog
    :title="(editing ? '编辑' : '添加') + '发件人'"
    :visible.sync="visible"
    :before-close="close"
    width="750px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="发件人" prop="name">
            <el-input
              v-model.trim="form.name"
              placeholder="请输入发件人"
              @input="onNameChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="英文发件人" prop="englishName">
            <el-input
              v-model="form.englishName"
              placeholder="请输入英文发件人"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发件人国别" prop="stateCode">
            <el-select
              filterable
              disabled
              style="width:100%"
              v-model="form.stateCode"
              placeholder="请选择发件人国别"
              @change="onStateChange"
            >
              <el-option
                v-for="v in stateList"
                :key="v.value"
                :label="`${v.name} (${v.code})`"
                :value="v.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发件人地址" prop="areas">
            <el-cascader
              style="width:100%"
              v-model="form.areas"
              placeholder="请输入省、市、县/区"
              :options="areaList"
              :props="areaProps"
              filterable
              ref="area"
              @change="onAreaChange"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="详细地址" prop="fullAddress">
            <el-input v-model="form.fullAddress" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="英文发件人地址" prop="englishFullAddress">
            <el-input
              v-model="form.englishFullAddress"
              placeholder="请输入英文发件人地址"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发件人城市" prop="city">
            <el-input
              disabled
              v-model="form.city"
              placeholder="从发件人“地址”获取"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="英文发件人城市" prop="englishCity">
            <el-input
              v-model="form.englishCity"
              placeholder="请输入英文发件人城市"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="英文经停城市" prop="englishStopCity">
            <el-input
              v-model="form.englishStopCity"
              placeholder="请输入英文经停城市"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发件人电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入发件人电话" />
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
import { sender as api } from "@/api/info-maintain";
import { chinaArea } from "@/constants";
import pinyin from "pinyin";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      visible: false,
      areaList: chinaArea,
      areaProps: {
        value: "id",
        label: "name"
      },
      form: {
        id: null,
        // 发件人
        name: null,
        // 英文发件人
        englishName: null,
        // 发件人国别
        state: "中国 (142)",
        stateCode: "142",
        // 发件人地址
        province: null,
        city: null,
        area: null,
        areas: [],
        addressIds: null,
        // 详细地址
        fullAddress: null,
        // 英文发件人地址
        englishFullAddress: null,
        // englishCity
        englishCity: null,
        // 发件人城市
        englishStopCity: null,
        // 发件人电话
        phone: null
      },
      rules: {
        name: [{ required: true, message: "请输入发件人" }],
        englishName: [{ pattern: /\w+$/, message: "英文发件人格式错误" }],
        stateCode: [{ required: true, message: "请选择发件人国别" }],
        areas: [{ required: true, message: "省、市、县/区不能为空" }],
        fullAddress: [{ required: true, message: "详细地址是不能为空" }],
        city: [{ required: true, message: "发件人城市是不能为空" }],
        englishFullAddress: [
          { pattern: /\w+$/, message: "英文发件人地址格式错误" }
        ],
        englishCity: [{ pattern: /\w+$/, message: "英文发件人城市格式错误" }],
        englishStopCity: [
          { pattern: /\w+$/, message: "英文发件人城市格式错误" }
        ],
        phone: [
          { required: true, message: "请输入发件人电话" },
          { pattern: /^[0-9\-/|]+$/gi, message: "发件人电话格式错误" }
        ]
      },
      editing: false
    };
  },
  computed: {
    ...mapGetters("state", { stateList: "listAll" })
  },
  mounted() {
    this.$store.dispatch("state/listAll");
  },
  methods: {
    async show(editing = false, data) {
      this.editing = editing;
      this.visible = true;
      if (!editing) return;
      Object.keys(this.form).forEach(key => {
        this.form[key] = data[key];
      });
      const { addressIds } = data;
      this.form.areas = addressIds.split(",").map(v => v * 1);
    },
    close() {
      this.visible = false;
      this.detail = {};
      this.form = this.$resetFields(this.form);
      this.form.state = "中国 (142)";
      this.form.stateCode = "142";
      this.$refs.form.resetFields();
    },
    onNameChange(v) {
      const englishName = pinyin(v || "", {
        style: pinyin.STYLE_NORMAL
      });
      this.form.englishName = englishName.join("");
    },
    onStateChange(v) {
      let curr = this.stateList.find(item => item.code === v);
      if (!curr) return;
      this.form.state = `${curr.name} (${curr.code})`;
    },
    onAreaChange(vals) {
      let areaNodes = this.$refs.area.getCheckedNodes(true);
      let [province, city, area] = areaNodes[0].pathNodes;
      this.form.province = province.label;
      this.form.city = city.label;
      this.form.area = area.label;
      this.form.addressIds = vals.join(",");
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        try {
          const { editing, form } = this;
          this.loading = true;
          await (editing ? api.update : api.create)(form);
          this.close();
          this.$message.closeAll();
          this.$message.success((editing ? "保存" : "添加") + "成功！");
          this.$emit("refresh");
        } finally {
          this.loading = false;
        }
      });
    }
  }
};
</script>
