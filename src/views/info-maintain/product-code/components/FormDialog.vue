<template>
  <el-dialog
    :title="(editing ? '编辑' : '添加') + '商品编码'"
    :visible.sync="visible"
    :before-close="close"
    width="600px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="form" :rules="rules">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="商品" prop="name">
            <el-input v-model.trim="form.name" placeholder="请输入商品" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品编码" prop="code">
            <el-input v-model.trim="form.code" placeholder="请输入商品编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计量单位" prop="unitCode">
            <el-select
              filterable
              style="width:100%"
              v-model="form.unitCode"
              placeholder="请选择计量单位"
            >
              <el-option
                v-for="v in unitList"
                :key="v.value"
                :label="v.name"
                :value="v.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品规格" prop="desc">
            <el-input v-model.trim="form.desc" placeholder="请输入商品规格" />
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
import { productCode as api } from "@/api/info-maintain";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      visible: false,

      form: {
        id: null,
        name: null,
        code: null,
        unitCode: null,
        desc: null
      },
      rules: {
        name: [{ required: true, message: "请输入商品" }],
        unitCode: [{ required: true, message: "请选择计量单位" }],
        code: [
          { required: true, message: "请输入商品编码" }
          // {
          //   message: '商品编码已存在',
          //   validator: async (rule, value, cb) => {
          //     try {
          //       const { dispatch } = this.props;
          //       const { isEdit } = this.state;
          //       const params = { code: value.trim() };
          //       if (isEdit) params.id = this.detail.id;
          //       await dispatch({
          //         type: 'baseCommodityCode/checkCode',
          //         payload: params,
          //       });
          //       cb();
          //     } catch (e) {
          //       const { status } = e.response;
          //       if (status === 400) {
          //         cb(e.message || '商品编码已经存在');
          //       } else {
          //         cb(e.message || '系统异常');
          //       }
          //     }
          //   },
          // },
        ]
      },
      editing: false
    };
  },
  computed: {
    ...mapGetters("unit", { unitList: "listAll" })
  },
  mounted() {
    this.$store.dispatch("unit/listAll");
  },
  methods: {
    async show(editing = false, data) {
      this.editing = editing;
      this.visible = true;
      if (!editing) return;
      Object.keys(this.form).forEach(key => {
        this.form[key] = data[key];
      });
    },
    close() {
      this.visible = false;
      this.detail = {};
      this.form = this.$resetFields(this.form);
      this.$refs.form.resetFields();
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
