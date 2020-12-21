<template>
  <el-dialog
    title="编辑申报人"
    :visible.sync="visible"
    :before-close="close"
    width="800px"
    top="5vh"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    center
  >
    <el-form ref="form" :model="{ declareUserList }" label-position="top">
      <el-row
        :gutter="10"
        v-for="(item, idx) in declareUserList"
        :key="item.key"
      >
        <el-col :span="2">
          <div style="line-height: 32px;text-align: right;">
            ({{ idx + 1 }})
          </div>
        </el-col>
        <el-col :span="6">
          <el-form-item
            label="申报人"
            :prop="'declareUserList.' + idx + '.name'"
          >
            <el-input v-model="item.name" placeholder="请输入申报人" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="申报人身份证(台湾身份证/暂住证)"
            :prop="'declareUserList.' + idx + '.idNum'"
            :rules="rules.idNum"
          >
            <el-input v-model="item.idNum" placeholder="请输入申报人身份证" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            label="代收款(NTD)"
            :prop="'declareUserList.' + idx + '.agencyFundNTD'"
          >
            <el-input
              v-model="item.agencyFundNTD"
              placeholder="请输入代收款(NTD)"
            />
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button
            @click="removeItem(idx)"
            type="danger"
            plain
            style="margin-top:32px"
            v-if="declareUserList.length > 1"
          >
            删 除
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary" @click="addItem">新增申报人</el-button>
    <div slot="footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { uuid } from "@/utils";
export default {
  data() {
    const validatorIdNum = (rule, value, callback) => {
      let idNumReg = /^[a-zA-Z][0-9]{9}$|^[a-zA-Z]{2}[0-9]{8}$|^[0-9]{8}$/;
      if (!value) {
        return callback();
      }
      if (!idNumReg.test(value)) {
        return callback("证件号格式错误");
      }
      const idNumList = this.declareUserList.filter(
        item => item.idNum === value
      );
      if (idNumList.length > 1) {
        return callback("申报人身份证重复");
      }
      callback();
    };
    return {
      visible: false,
      declareUserList: [],
      rules: {
        name: [{ required: true, message: "请输入申报人" }],
        idNum: [{ validator: validatorIdNum }]
      }
    };
  },
  mounted() {
    this.addItem();
  },
  methods: {
    async show(list) {
      this.visible = true;
      this.declareUserList = list;
    },
    close() {
      this.visible = false;
    },
    submit() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        const declareUserList = this.declareUserList
          .filter(v => v.name || v.idNum || v.agencyFundNTD)
          .map((v, i) => ({
            ...v,
            label: `${i + 1}、${v.name} - ${v.idNum} - ${v.agencyFundNTD}`
          }));
        this.$emit("submit", declareUserList);
        this.close();
      });
    },
    addItem() {
      this.declareUserList.push({
        name: null,
        idNum: null,
        agencyFundNTD: 0,
        key: uuid()
      });
    },
    removeItem(idx) {
      this.declareUserList.splice(idx, 1);
    }
  }
};
</script>
