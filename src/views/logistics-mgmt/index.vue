<template>
  <div>
    <el-card>
      <div>
        <el-input
          prefix-icon="el-icon-search"
          clearable
          v-model.trim="query.alikeName"
          style="width:250px"
          placeholder="搜索"
          class="mr1"
          @input="getList"
        />
        <el-button-group class="mr1">
          <el-button
            :disabled="isDisabledBatch('CHINA_DECLARATION_NORMAL')"
            @click="batchOperation('SHIPPING_STARTED', selectionIdList)"
          >
            批量装船
          </el-button>
          <el-button
            :disabled="isDisabledBatch('SHIPPING_STARTED')"
            @click="batchOperation('SHIPPING_ARRIVED', selectionIdList)"
          >
            批量到港
          </el-button>
          <el-button
            :disabled="isDisabledBatch('SHIPPING_ARRIVED')"
            @click="batchOperation('TW_CLEARANCE_NORMAL', selectionIdList)"
          >
            批量台湾清关
          </el-button>
          <el-button
            :disabled="isDisabledBatch('TW_CLEARANCE_NORMAL')"
            @click="batchOperation('HOME_DELIVERY', selectionIdList)"
          >
            批量宅配
          </el-button>
        </el-button-group>
        <el-button
          type="primary"
          :icon="'el-icon-arrow-' + (expandSearch ? 'up' : 'down')"
          @click="expandSearch = !expandSearch"
        >
          高级搜索
        </el-button>
      </div>
      <el-collapse-transition>
        <el-card v-show="expandSearch" class="mt1" shadow="never">
          <el-form ref="form" :model="query">
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item label="提单号" prop="aBillsOfLadingNo">
                  <el-input
                    v-model.trim="query.aBillsOfLadingNo"
                    placeholder="请输入提单号"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item label="订单号" prop="aBaseOrderId">
                  <el-input
                    v-model.trim="query.aBaseOrderId"
                    placeholder="请输入订单号"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item label="开航日期" prop="aStartSailDate">
                  <el-date-picker
                    v-model="query.aStartSailDate"
                    type="date"
                    placeholder="选择日期"
                    style="width:100%"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <el-form-item label="状态" prop="aStatus">
                  <el-select
                    v-model="query.aStatus"
                    placeholder="请选择状态"
                    style="width:100%"
                    filterable
                    clearable
                  >
                    <el-option
                      v-for="v in statusList"
                      :key="v.value"
                      :label="v.text"
                      :value="v.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <div class="clearfix">
              <div class="float-right">
                <el-button type="primary" @click="onSubmit" :loading="loading">
                  搜索
                </el-button>
                <el-button @click="onReset" :disabled="loading">重置</el-button>
                <el-button
                  type="text"
                  icon="el-icon-arrow-up"
                  @click="expandSearch = !expandSearch"
                >
                  收起
                </el-button>
              </div>
            </div>
          </el-form>
        </el-card>
      </el-collapse-transition>
    </el-card>
    <el-card class="mt1">
      <el-table
        :data="list"
        style="width: 100%"
        max-height="600"
        v-loading="loading"
        ref="table"
        row-key="baseOrderId"
        @selection-change="onSelectionChange"
      >
        <el-table-column type="selection" width="55" fixed align="center" />
        <el-table-column
          prop="billsOfLadingNo"
          label="提单号"
          min-width="200"
        />
        <el-table-column prop="baseOrderId" label="订单号" min-width="180" />
        <el-table-column
          prop="startSailDate"
          label="开航日期"
          min-width="120"
        />
        <el-table-column prop="statusName" label="状态" min-width="100" />
        <el-table-column
          prop="type"
          label="操作"
          min-width="200"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-button
              v-if="row.status === 'CHINA_DECLARATION_NORMAL'"
              size="small"
              @click="
                batchOperation(row.operatorType, [row.baseOrderId], false)
              "
            >
              装船
            </el-button>
            <el-button
              v-if="row.status === 'CHINA_DECLARATION_NORMAL'"
              size="small"
              @click="
                $router.push({
                  name: 'LogisticsMgmtWithholding',
                  params: { id: row.baseOrderId }
                })
              "
            >
              暂扣
            </el-button>

            <el-button v-if="row.statusName === '暂扣'" size="small">
              移至提单
            </el-button>
            <el-button
              v-if="row.status === 'SHIPPING_STARTED'"
              size="small"
              @click="
                batchOperation(row.operatorType, [row.baseOrderId], false)
              "
            >
              到港
            </el-button>
            <el-button
              v-if="row.status === 'SHIPPING_ARRIVED'"
              size="small"
              @click="
                batchOperation(row.operatorType, [row.baseOrderId], false)
              "
            >
              台湾清关放行
            </el-button>
            <el-button
              v-if="row.status === 'TW_CLEARANCE_NORMAL'"
              size="small"
              @click="
                batchOperation(row.operatorType, [row.baseOrderId], false)
              "
            >
              宅配
            </el-button>
            <el-button
              v-if="row.status === 'TW_CLEARANCE_NORMAL'"
              size="small"
              @click="
                batchOperation(
                  'TW_CLEARANCE_EXCEPTION',
                  [row.baseOrderId],
                  false
                )
              "
            >
              台湾清关暂扣
            </el-button>
            <el-button
              v-if="row.status === 'TW_CLEARANCE_EXCEPTION'"
              size="small"
              @click="
                batchOperation('TW_CLEARANCE_NORMAL', [row.baseOrderId], false)
              "
            >
              清关放行
            </el-button>
            <el-tooltip content="详情" placement="top">
              <el-button
                type="text"
                icon="el-icon-view"
                @click="
                  $router.push({
                    name: 'LogisticsMgmtDetail',
                    params: { id: row.baseOrderId }
                  })
                "
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-footer">
        <el-pagination
          layout="sizes,total,prev,pager,next,jumper"
          background
          :total="count"
          :page-sizes="[10, 30, 100, 200]"
          :page-size.sync="query.pageSize"
          :current-page.sync="query.pageIndex"
          @size-change="getList"
          @current-change="getList"
        />
      </div>
    </el-card>
    <change-status-dialog ref="dialog" @refresh="refresh" />
  </div>
</template>
<script>
import { statusList } from "@/constants/logistics-mgmt";
import api from "@/api/logistics-mgmt";
import debounce from "@/utils/debounce";
import ChangeStatusDialog from "./components/ChangeStatusDialog";
export default {
  name: "LogisticsMgmtList",
  components: {
    ChangeStatusDialog
  },
  data() {
    return {
      statusList,
      expandSearch: false,
      list: [],
      count: 0,
      loading: false,
      selectionList: [],
      selectionIdList: [],
      opType: [],
      query: {
        pageIndex: 1,
        pageSize: 30,
        alikeName: null,
        aBillsOfLadingNo: null,
        aBaseOrderId: null,
        aStartSailDate: null,
        aStatus: null,
        advancedSearch: false
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    isDisabledBatch(type) {
      const { opType, count } = this;
      if (!count) return true;
      return !(opType.length === 1 && opType.includes(type));
    },
    isShowOpt(status, type) {
      return status === type;
    },
    async refresh() {
      this.query.pageIndex = 1;
      this.$refs.table.clearSelection();
      await this.getList();
    },
    getList: debounce(async function() {
      try {
        this.loading = true;
        let query = { ...this.query };
        query.pageIndex--;
        const { data } = await api.list(query);
        this.list = data.list;
        this.count = data.count;
      } finally {
        this.loading = false;
      }
    }, 300),
    onSubmit() {
      this.query.advancedSearch = true;
      this.refresh();
    },
    onReset() {
      this.$refs.form.resetFields();
      this.query.advancedSearch = false;
      this.refresh();
    },
    onSelectionChange(rows) {
      this.selectionIdList = rows.map(v => v.baseOrderId);
      this.selectionList = rows;
      this.opType = [...new Set(rows.map(item => item.status))];
    },
    batchOperation(type, idList, isBatch = true) {
      this.$refs.dialog.show(type, idList, isBatch);
    }
  }
};
</script>

<style lang="scss" scoped></style>
