<template>
    <div class="pagination-container">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="$parent.$data.query.page + 1" :page-sizes="[10,20,30,50]"
                       :page-size="$parent.$data.query.size"
                       layout="total, sizes, prev, pager, next, jumper" :total="$parent.$data.total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: 'page',
        methods: {
            handleSizeChange(val) {
                this.$parent.query.size = val;
                this.$parent._getList()
            },
            handleCurrentChange(val) {
                if (val > 0) {
                    val = val - 1;
                }
                this.$parent.query.page = val;
                this.$parent._getList();
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>

</style>


