<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'用户ID'"
                v-model="queryItem.userId.value">
      </el-input>
      <el-input @keyup.enter="handleFilter" style="width: 200px;" class="filter-item" :placeholder="'内容'"
                v-model="queryItem.content.value">
      </el-input>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">搜索
      </el-button>
    </div>
    <el-table :data="items" v-loading="itemLoading" element-loading-text="Loading" border fit highlight-current-row>
      <el-table-column align="center" label='消息ID' width="300">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='用户ID' width="150">
        <template slot-scope="scope">
          {{scope.row.userId}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='内容' width="150">
        <template slot-scope="scope">
          {{scope.row.content}}
        </template>
      </el-table-column>
      <el-table-column align="left" label='事件' width="200">
        <template slot-scope="scope">
          <p>主体:{{scope.row.eventSubject}}</p>
          <p>主体ID:{{scope.row.eventSubjectId}}</p>
          <p>主体描述:{{scope.row.eventSubjectSummary}}</p>
        </template>
      </el-table-column>
      <el-table-column align="left" label='来源' width="200">
        <template slot-scope="scope">
          <p>主体:{{scope.row.fromSubject}}</p>
          <p>主体ID:{{scope.row.fromSubjectId}}</p>
          <p>主体描述:{{scope.row.fromSubjectSummary}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center" label='创建时间' width="155">
        <template slot-scope="scope">
          {{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}')}}
        </template>
      </el-table-column>
    </el-table>
    <page></page>
  </div>
</template>

<script>
  let page = new pageInit(
    {
      data: {
        //查询对象
        queryItem: {
          userId: {
            key: 'userId',
            operation: '==',
            value: '',
            predicate: ";"
          },
          content: {
            key: 'content',
            operation: '==',
            value: '',
            predicate: ""
          }
        },
        idKey: 'id',
        apiPrefix: '/users/messages',
      },
      methods: {
        beforeOpenDialog(row) {

        },
        afterCloseDialog(row) {

        }
      }
    }
  );
  export default page;
</script>
