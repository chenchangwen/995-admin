<template>
    <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="$parent.$data.query.pagingQuery.pageNum" :page-sizes="[20,30,50]" :page-size="$parent.$data.query.pagingQuery.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="$parent.$data.total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'page',
        methods: {
            handleSizeChange(val) {
                this.$parent.query.pagingQuery.pageSize = val;
                this.$parent.getList()
            },
            handleCurrentChange(val) {
                this.$parent.query.pagingQuery.pageIndex = val;
                this.$parent.getList();
            }
        }
    }
</script>

<style scoped>

</style>


