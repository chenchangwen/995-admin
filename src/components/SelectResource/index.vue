<template>
    <div class="select-more-box">
        <el-input placeholder="搜索名称"></el-input>
        <div class="content">
            <el-checkbox-group v-model="selectedValue" @change="handleChange">
                <el-checkbox  v-for="(item , index) in items" :label="item.name + index"
                             :key="item.id"></el-checkbox>
            </el-checkbox-group>
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
            overflow: auto;
            margin-top: 22px;
        }
    }

    .el-checkbox {
        &:first-child {
            margin-right: 20px;
        }
    }

    .el-checkbox + .el-checkbox {
        margin-left: 0px;
        margin-right: 20px;
    }
</style>
