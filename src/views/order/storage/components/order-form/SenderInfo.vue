<template>
  <el-card>
    <div slot="header">发件人信息</div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="发件人" prop="baseSenderId">
          <el-select
            v-model="form.baseSenderId"
            placeholder="请选择发件人"
            filterable
            style="width:100%"
            @change="onSenderChange"
          >
            <el-option
              v-for="v in baseSenderList"
              :key="v.id"
              :label="v.name"
              :value="v.id"
            />
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      form: {
        baseSenderId: null,
        sender: null
      }
    };
  },
  computed: {
    ...mapGetters("storageOrder", ["createData"]),
    baseSenderList() {
      const { baseSenderList } = this.createData || {};
      return baseSenderList || [];
    }
  },
  watch: {
    form: {
      handler(n) {
        this.$emit("change", n);
      },
      deep: true
    }
  },
  methods: {
    init(data) {
      Object.keys(this.form).forEach(k => {
        this.form[k] = data[k];
      });
    },
    onSenderChange(val) {
      let curr = this.baseSenderList.find(v => v.id === val);
      if (!curr) return;
      this.form.sender = curr.name;
    }
  }
};
</script>
