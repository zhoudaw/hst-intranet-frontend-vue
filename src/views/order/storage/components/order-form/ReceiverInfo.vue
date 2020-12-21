<template>
  <el-card>
    <div slot="header">收件人信息</div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="真实收件人" prop="realReceiver">
          <el-input
            v-model="form.realReceiver"
            placeholder="请输入真实收件人"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="收件人电话" prop="receiverPhone">
          <el-input
            v-model="form.receiverPhone"
            placeholder="请输入收件人电话"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="收件人地址" prop="receiverAreas">
          <el-cascader
            style="width:100%"
            v-model="form.receiverAreas"
            placeholder="请输入省、市、县/区"
            :options="areaList"
            :props="areaProps"
            filterable
            ref="area"
            @change="onAreaChange"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="详细地址" prop="receiverDetailAddress">
          <el-input
            v-model="form.receiverDetailAddress"
            placeholder="请输入详细地址"
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-form-item label="收件人城市" prop="receiverCity">
          <el-input
            v-model="form.receiverCity"
            placeholder="请输入收件人城市"
            disabled
          />
        </el-form-item>
      </el-col>
      <el-col :xs="24" :sm="12" :md="12">
        <el-form-item label="申报人-申报人身份证-代收款" prop="declareUserKey">
          <div style="display:flex">
            <el-select
              v-model="form.declareUserKey"
              placeholder="请输入申报人-申报人身份证-代收款(NTD)"
              filterable
              style="flex:1;"
              @change="onDeclareUserChange"
            >
              <el-option
                v-for="v in declareUserList"
                :key="v.key"
                :label="v.label"
                :value="v.key"
              />
            </el-select>
            <el-button class="ml1" type="primary" @click="onShowDeclareUser">
              编辑申报人
            </el-button>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <declare-user-dialog ref="dialog" @submit="declareUserSubmit" />
  </el-card>
</template>
<script>
import { mapGetters } from "vuex";
import { taiwanArea } from "@/constants";
import DeclareUserDialog from "./DeclareUserDialog";
import { uuid } from "@/utils";

export default {
  components: {
    DeclareUserDialog
  },
  data() {
    return {
      areaList: [taiwanArea],
      areaProps: {
        value: "id",
        label: "name"
      },
      form: {
        realReceiver: null,
        receiverPhone: null,
        receiverAreas: [],
        receiverAddressIds: null,
        receiverProvince: null,
        receiverCity: null,
        receiverArea: null,
        receiverDetailAddress: null,
        declareUserKey: null,
        declareUser: null,
        declareUserIdCard: null,
        declareUserListJson: null
      },
      declareUserList: []
    };
  },
  computed: {
    ...mapGetters("storageOrder", ["createData"]),
    baseCustomerList() {
      const { baseCustomerList } = this.createData || {};
      return baseCustomerList || [];
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
      this.form.receiverAreas = data.receiverAddressIds
        ? data.receiverAddressIds.split(",").map(v => v * 1)
        : [];
      let declareUserList = JSON.parse(data.declareUserListJson || "[]").map(
        (v, i) => {
          let key = uuid();
          if (v.idNum === data.declareUserIdCard) {
            this.form.declareUserKey = key;
          }
          return {
            ...v,
            key,
            label: `${i + 1}、${v.name} - ${v.idNum} - ${v.agencyFundNTD}`
          };
        }
      );
      this.declareUserList = declareUserList;
    },
    onAreaChange(vals) {
      this.form.receiverAddressIds = vals.join(",");
      let areaNodes = this.$refs.area.getCheckedNodes(true);
      let [province, city, area] = areaNodes[0].pathNodes;
      this.form.receiverProvince = province.label;
      this.form.receiverCity = city.label;
      this.form.receiverArea = area.label;
    },
    onShowDeclareUser() {
      this.$refs.dialog.show(this.declareUserList);
    },
    declareUserSubmit(list) {
      this.declareUserList = list;
      this.form.declareUserListJson = JSON.stringify(list);
      this.onDeclareUserChange(this.form.declareUserKey);
    },
    onDeclareUserChange(val) {
      let curr = this.declareUserList.find(v => v.key === val);
      if (!curr) {
        this.form.declareUserKey = null;
        this.form.declareUser = null;
        this.form.declareUserIdCard = null;
        return;
      }
      this.form.declareUser = curr.name;
      this.form.declareUserIdCard = curr.idNum;
    }
  }
};
</script>
