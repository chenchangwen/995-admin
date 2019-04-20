<template>
    <div class="fix-bar-box">
        <slot></slot>
        <el-button @click="handleBack">返回</el-button>
    </div>
</template>
<script>
    export default {
        name: 'fixBar',
        data() {
            return {}
        },
        props: {
            name: {
                type: String,
                default: ''
            },
            backPath: {
                type: String,
                default: ''
            }
        },
        methods: {
            handleBack() {
                if (this.backPath) {
                    this.$router.push(this.backPath)
                }
            }
        },
        mounted() {

        }
    }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    .fix-bar-box {
        position: fixed;
        padding: 10px 30px;
        text-align: right;
        right: 0;
        bottom: 0;
        background: #FFFFFF;
        margin-bottom: 0;
        width: 100%;
    }
</style>
