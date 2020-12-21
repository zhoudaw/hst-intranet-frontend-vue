<template>
  <el-card>
    <div slot="header">
      <el-input
        prefix-icon="el-icon-search"
        clearable
        v-model.trim="query.alikeName"
        style="width:250px"
        placeholder="搜索"
        class="mr1"
        @input="refresh"
      />
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      max-height="600"
      v-loading="loading"
      ref="table"
    >
      <el-table-column prop="billsOfLadingNo" label="提单号" min-width="200" />
      <el-table-column prop="shipmentCompany" label="船名" min-width="150" />
      <el-table-column prop="startSailDate" label="开航日期" width="100">
        <template slot-scope="{ row }">
          {{ row.startSailDate | formatDate }}
        </template>
      </el-table-column>
      <el-table-column prop="destination" label="目的地" min-width="150" />
      <el-table-column prop="totalBoxQty" label="总件数" min-width="100" />
      <el-table-column
        prop="totalGrossWeight"
        label="总毛重KG"
        min-width="100"
      />
      <el-table-column
        prop="totalVolumeByStere"
        label="总体积m³"
        min-width="100"
      />
      <el-table-column
        prop="type"
        label="模版编辑"
        min-width="300"
        fixed="right"
        align="center"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="skipPage('Declaration3010OutsideGeneration', row)"
          >
            外代报文
          </el-button>
          <el-button
            type="text"
            @click="skipPage('Declaration3010OutsideGeneration', row)"
          >
            台湾舱单预申报
          </el-button>
          <el-button
            type="text"
            @click="skipPage('Declaration3010OutsideGeneration', row)"
          >
            源陞配送
          </el-button>
          <el-button
            type="text"
            @click="skipPage('Declaration3010OutsideGeneration', row)"
          >
            携诚报文
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <el-pagination
        layout="total,prev,pager,next,jumper"
        background
        :total="count"
        :page-sizes="[10, 30, 100, 200]"
        :page-size.sync="query.pageSize"
        :current-page.sync="query.pageIndex"
      />
    </div>
  </el-card>
</template>

<script>
import debounce from "@/utils/debounce";
import api from "@/api/declaration/3010";
export default {
  name: "Declaration3010",
  data() {
    return {
      query: {
        alikeName: null,
        pageIndex: 1
        // pageSize: 30
      },
      loading: false,
      list: [],
      count: 0
    };
  },
  watch: {
    query: {
      handler() {
        this.getList();
      },
      deep: true
    }
  },
  created() {
    this.getList();
  },
  methods: {
    async refresh() {
      this.query.pageIndex = 1;
      await this.getList();
    },
    getList: debounce(async function() {
      try {
        this.loading = true;
        let query = { ...this.query };
        query.pageIndex--;
        const { data } = await api.list(query);
        this.list = (data.list || []).map(({ billsOfLading, id }) => ({
          ...(billsOfLading || {}),
          tzozId: id
        }));
        this.count = data.count;
      } finally {
        this.loading = false;
      }
    }, 300),
    skipPage(name, { tzozId, billsOfLadingNo }) {
      this.$router.push({
        name,
        params: { id: tzozId },
        query: { billsOfLadingNo }
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
