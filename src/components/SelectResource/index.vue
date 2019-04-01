<template>
    <div class="select-more-box">
        <el-input placeholder="搜索名称"></el-input>
        <div class="content">
            <span  v-for="(item , index) in items" >
                {{item.name}}
            </span>
        </div>
    </div>
</template>

<script>
    import resourceAPI from '../../api/resource';

    export default {
        name: 'selectResource',
        props: {
            value: {
                type: [Array],
                default: function () {
                    return []
                }
            }
        },
        data() {
            return {
                items: [],
                selectedValue: []
            }
        },
        methods: {
            queryResourcesAPI() {
                let that = this;
                let ids = [];
                if (that.value.length > 0) {
                    ids = that.value.map(function (item) {
                        return item.id;
                    });
                }
                resourceAPI.resources().then(function (response) {
                    that.items = response.data;
                    that.items.map(function (item) {
                        if (ids.length > 0) {
                            if (ids.indexOf(item.id) > -1) {
                                that.selectedValue.push(item);
                            }
                        }
                        return item;
                    });
                })
            },
            handleChange(value) {
                this.$emit('update:value', value)
            }
        },
        watch: {
            value(newValue, oldValue) {
                this.selectedValue = newValue;
            }
        },
        created() {
            this.queryResourcesAPI();
        }
    }
</script>

<style lang="scss" scoped>
    .select-more-box {
        width: 100%;
        .content {
            height: 200px;
            scroll: auto;
            overflow-x: hidden;
            margin-top: 22px;
            span{
                margin-right: 10px;
                padding: 5px 10px;
                background: #fff;
                border: 1px solid #dcdfe6;
                color: #606266;
                border-radius: 4px;
                font-size: 12px;
                display: inline-block;
                line-height: 1;
            }
        }
    }
</style>
